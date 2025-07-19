
-- Fix the get_user_profile function to return proper JSON format for JavaScript consumption
CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', up.user_id,
    'full_name', up.full_name,
    'role', up.role,
    'date_of_birth', up.date_of_birth,
    'phone', up.phone,
    'emergency_contact', up.emergency_contact,
    'consent_given', up.consent_given,
    'linked_user_id', up.linked_user_id,
    'created_at', up.created_at,
    'updated_at', up.updated_at
  )
  INTO result
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
  
  RETURN result;
END;
$function$;

-- Fix the update_user_profile function to return proper JSON format
CREATE OR REPLACE FUNCTION public.update_user_profile(profile_user_id uuid, profile_updates jsonb)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Return the updated profile as JSON
  SELECT json_build_object(
    'user_id', up.user_id,
    'full_name', up.full_name,
    'role', up.role,
    'date_of_birth', up.date_of_birth,
    'phone', up.phone,
    'emergency_contact', up.emergency_contact,
    'consent_given', up.consent_given,
    'linked_user_id', up.linked_user_id,
    'created_at', up.created_at,
    'updated_at', up.updated_at
  )
  INTO result
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
  
  RETURN result;
END;
$function$;
