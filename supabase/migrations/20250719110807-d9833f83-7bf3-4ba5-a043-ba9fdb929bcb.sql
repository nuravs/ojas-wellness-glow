
-- Create the missing functions in the staging schema
CREATE OR REPLACE FUNCTION staging.get_patient_caregiver_relationships(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = staging
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', pc.id,
      'patient_id', pc.patient_id,
      'caregiver_id', pc.caregiver_id,
      'status', pc.status,
      'created_at', pc.invited_at,
      'approved_at', pc.approved_at,
      'patient_profile', json_build_object(
        'full_name', p.full_name,
        'user_id', p.user_id
      ),
      'caregiver_profile', json_build_object(
        'full_name', c.full_name,
        'user_id', c.user_id
      )
    )
  )
  INTO result
  FROM staging.patient_caregivers pc
  LEFT JOIN staging.user_profiles p ON p.user_id = pc.patient_id
  LEFT JOIN staging.user_profiles c ON c.user_id = pc.caregiver_id
  WHERE pc.patient_id = get_patient_caregiver_relationships.user_id 
     OR pc.caregiver_id = get_patient_caregiver_relationships.user_id;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Create caregiver request function in staging schema
CREATE OR REPLACE FUNCTION staging.create_caregiver_request(
  patient_user_id UUID,
  caregiver_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = staging
AS $$
DECLARE
  request_id UUID;
BEGIN
  -- Check if request already exists
  IF EXISTS (
    SELECT 1 FROM staging.patient_caregivers 
    WHERE patient_id = patient_user_id AND caregiver_id = caregiver_user_id
  ) THEN
    RAISE EXCEPTION 'Request already exists between this patient and caregiver';
  END IF;
  
  -- Insert new request
  INSERT INTO staging.patient_caregivers (patient_id, caregiver_id, status)
  VALUES (patient_user_id, caregiver_user_id, 'pending')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;

-- Create update caregiver request status function in staging schema
CREATE OR REPLACE FUNCTION staging.update_caregiver_request_status(
  request_id UUID,
  new_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = staging
AS $$
BEGIN
  -- Validate status
  IF new_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status. Must be approved or rejected';
  END IF;
  
  -- Update the request
  UPDATE staging.patient_caregivers 
  SET 
    status = new_status,
    approved_at = CASE WHEN new_status = 'approved' THEN now() ELSE NULL END
  WHERE id = request_id;
  
  -- Check if any rows were affected
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create the can_caregiver_view_patient function in staging schema
CREATE OR REPLACE FUNCTION staging.can_caregiver_view_patient(patient_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = staging
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM staging.patient_caregivers pc
    JOIN staging.user_profiles caregiver ON caregiver.user_id = pc.caregiver_id
    JOIN staging.user_profiles patient ON patient.user_id = pc.patient_id
    WHERE caregiver.user_id = auth.uid() 
    AND caregiver.role = 'caregiver' 
    AND pc.patient_id = patient_user_id
    AND pc.status = 'approved'
    AND patient.consent_given = true
  );
END;
$$;

-- Update RLS policies to use staging schema functions consistently
-- First drop existing policies that reference public schema functions

-- Update user_profiles policies
DROP POLICY IF EXISTS "Caregivers can view linked patient profiles" ON staging.user_profiles;
CREATE POLICY "Caregivers can view linked patient profiles" 
  ON staging.user_profiles 
  FOR SELECT 
  USING (staging.can_caregiver_view_patient(user_id));

-- Update symptoms policies  
DROP POLICY IF EXISTS "Caregivers can view linked patient symptoms" ON staging.symptoms;
CREATE POLICY "Caregivers can view linked patient symptoms" 
  ON staging.symptoms 
  FOR SELECT 
  USING (staging.can_caregiver_view_patient(user_id));

-- Update medication_conditions policies
DROP POLICY IF EXISTS "Caregivers can view linked patient medication conditions" ON staging.medication_conditions;
CREATE POLICY "Caregivers can view linked patient medication conditions" 
  ON staging.medication_conditions 
  FOR SELECT 
  USING ((EXISTS ( SELECT 1
   FROM staging.medications m
  WHERE ((m.id = medication_conditions.medication_id) AND staging.can_caregiver_view_patient(m.user_id) AND (m.caregiver_visible = true)))) OR (EXISTS ( SELECT 1
   FROM staging.comorbidities c
  WHERE ((c.id = medication_conditions.comorbidity_id) AND staging.can_caregiver_view_patient(c.user_id) AND (c.caregiver_visible = true)))));

-- Update medication_logs policies
DROP POLICY IF EXISTS "Caregivers can view linked patient med logs" ON staging.medication_logs;
CREATE POLICY "Caregivers can view linked patient med logs" 
  ON staging.medication_logs 
  FOR SELECT 
  USING (staging.can_caregiver_view_patient(user_id) AND (EXISTS ( SELECT 1
   FROM staging.medications m
  WHERE ((m.id = medication_logs.medication_id) AND (m.caregiver_visible = true)))));

-- Add any missing policies for other tables that need caregiver access
DROP POLICY IF EXISTS "Caregivers can log vitals for patients" ON staging.vitals;
CREATE POLICY "Caregivers can log vitals for patients" 
  ON staging.vitals 
  FOR INSERT 
  WITH CHECK (staging.can_caregiver_view_patient(user_id));

DROP POLICY IF EXISTS "Caregivers can view linked patient vitals" ON staging.vitals;  
CREATE POLICY "Caregivers can view linked patient vitals" 
  ON staging.vitals 
  FOR SELECT 
  USING (staging.can_caregiver_view_patient(user_id));
