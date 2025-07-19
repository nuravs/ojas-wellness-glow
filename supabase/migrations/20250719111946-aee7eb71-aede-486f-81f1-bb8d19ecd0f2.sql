
-- Create the get_user_profile function in public schema
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

-- Create the update_user_profile function in public schema
CREATE OR REPLACE FUNCTION public.update_user_profile(
  profile_user_id UUID,
  profile_updates JSONB
)
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

-- Create the get_user_medications function in public schema
CREATE OR REPLACE FUNCTION public.get_user_medications(medication_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(m))
  INTO result
  FROM staging.medications m
  WHERE m.user_id = medication_user_id
  AND m.active = true
  ORDER BY m.created_at DESC;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Create the log_medication function in public schema
CREATE OR REPLACE FUNCTION public.log_medication(
  med_id UUID,
  med_user_id UUID,
  log_status TEXT,
  log_time TIMESTAMPTZ
)
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

-- Create the update_medication_visibility function in public schema
CREATE OR REPLACE FUNCTION public.update_medication_visibility(
  med_id UUID,
  med_user_id UUID,
  is_visible BOOLEAN
)
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
