
-- Create RPC functions for patient-caregiver operations

-- Function to get patient-caregiver relationships for a user
CREATE OR REPLACE FUNCTION public.get_patient_caregiver_relationships(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
      'created_at', pc.created_at,
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
  FROM public.patient_caregivers pc
  LEFT JOIN public.user_profiles p ON p.user_id = pc.patient_id
  LEFT JOIN public.user_profiles c ON c.user_id = pc.caregiver_id
  WHERE pc.patient_id = get_patient_caregiver_relationships.user_id 
     OR pc.caregiver_id = get_patient_caregiver_relationships.user_id;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Function to create a caregiver request
CREATE OR REPLACE FUNCTION public.create_caregiver_request(
  patient_user_id UUID,
  caregiver_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id UUID;
BEGIN
  -- Check if request already exists
  IF EXISTS (
    SELECT 1 FROM public.patient_caregivers 
    WHERE patient_id = patient_user_id AND caregiver_id = caregiver_user_id
  ) THEN
    RAISE EXCEPTION 'Request already exists between this patient and caregiver';
  END IF;
  
  -- Insert new request
  INSERT INTO public.patient_caregivers (patient_id, caregiver_id, status)
  VALUES (patient_user_id, caregiver_user_id, 'pending')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;

-- Function to update caregiver request status
CREATE OR REPLACE FUNCTION public.update_caregiver_request_status(
  request_id UUID,
  new_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate status
  IF new_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status. Must be approved or rejected';
  END IF;
  
  -- Update the request
  UPDATE public.patient_caregivers 
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
