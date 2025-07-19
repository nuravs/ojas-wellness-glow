
-- Create missing database functions for medication conditions and logs
-- Fix all schema references to use staging consistently

-- Create function to get user medication conditions from staging
CREATE OR REPLACE FUNCTION public.get_user_medication_conditions(conditions_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT COALESCE(json_agg(condition_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
      'id', mc.id,
      'medication_id', mc.medication_id,
      'comorbidity_id', mc.comorbidity_id,
      'created_at', mc.created_at
    ) AS condition_data
    FROM staging.medication_conditions mc
    WHERE EXISTS (
      SELECT 1 FROM staging.medications m 
      WHERE m.id = mc.medication_id AND m.user_id = conditions_user_id
    )
    ORDER BY mc.created_at DESC
  ) AS ordered_conditions;
  
  RETURN result;
END;
$$;

-- Create function to get user medication logs from staging
CREATE OR REPLACE FUNCTION public.get_user_medication_logs(logs_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT COALESCE(json_agg(log_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
      'id', ml.id,
      'medication_id', ml.medication_id,
      'user_id', ml.user_id,
      'logged_by', ml.logged_by,
      'status', ml.status,
      'scheduled_time', ml.scheduled_time,
      'actual_time', ml.actual_time,
      'notes', ml.notes,
      'created_at', ml.created_at
    ) AS log_data
    FROM staging.medication_logs ml
    WHERE ml.user_id = logs_user_id
    ORDER BY ml.created_at DESC
  ) AS ordered_logs;
  
  RETURN result;
END;
$$;

-- Update get_user_profile function to use staging schema consistently
DROP FUNCTION IF EXISTS public.get_user_profile(UUID);

CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT row_to_json(up)
  INTO result
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
  
  RETURN result;
END;
$$;

-- Update the user profile update function to use staging schema
DROP FUNCTION IF EXISTS public.update_user_profile(UUID, JSONB);

CREATE OR REPLACE FUNCTION public.update_user_profile(profile_user_id UUID, profile_updates JSONB)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Update the user profile in staging schema
  UPDATE staging.user_profiles 
  SET 
    full_name = COALESCE(profile_updates->>'full_name', full_name),
    phone = COALESCE(profile_updates->>'phone', phone),
    emergency_contact = COALESCE(profile_updates->>'emergency_contact', emergency_contact),
    date_of_birth = COALESCE((profile_updates->>'date_of_birth')::date, date_of_birth),
    consent_given = COALESCE((profile_updates->>'consent_given')::boolean, consent_given),
    updated_at = now()
  WHERE user_id = profile_user_id;
  
  -- Return the updated profile
  SELECT row_to_json(up)
  INTO result
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
  
  RETURN result;
END;
$$;

-- Create caregiver access function for staging schema
CREATE OR REPLACE FUNCTION staging.can_caregiver_view_patient(patient_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staging.user_profiles caregiver
    WHERE caregiver.user_id = auth.uid() 
    AND caregiver.role = 'caregiver' 
    AND caregiver.linked_user_id = patient_user_id
  ) AND EXISTS (
    SELECT 1 FROM staging.user_profiles patient
    WHERE patient.user_id = patient_user_id
    AND patient.consent_given = true
  );
$$;

-- Update log_medication function to use staging schema
DROP FUNCTION IF EXISTS public.log_medication(UUID, UUID, TEXT, TIMESTAMP WITH TIME ZONE);

CREATE OR REPLACE FUNCTION public.log_medication(med_id UUID, med_user_id UUID, log_status TEXT, log_time TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO staging.medication_logs (
    medication_id,
    user_id,
    logged_by,
    status,
    actual_time
  ) VALUES (
    med_id,
    med_user_id,
    auth.uid(),
    log_status,
    log_time
  );
  
  RETURN true;
END;
$$;

-- Update medication visibility function to use staging schema
DROP FUNCTION IF EXISTS public.update_medication_visibility(UUID, UUID, BOOLEAN);

CREATE OR REPLACE FUNCTION public.update_medication_visibility(med_id UUID, med_user_id UUID, is_visible BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE staging.medications 
  SET caregiver_visible = is_visible,
      updated_at = now()
  WHERE id = med_id 
  AND user_id = med_user_id;
  
  RETURN FOUND;
END;
$$;
