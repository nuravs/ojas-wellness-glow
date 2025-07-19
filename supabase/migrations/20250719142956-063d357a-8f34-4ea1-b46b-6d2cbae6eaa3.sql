
-- Fix the get_user_profile function to return a flat object instead of nested JSON
CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  role text,
  date_of_birth date,
  phone text,
  emergency_contact text,
  consent_given boolean,
  linked_user_id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    up.full_name,
    up.role,
    up.date_of_birth,
    up.phone,
    up.emergency_contact,
    up.consent_given,
    up.linked_user_id,
    up.created_at,
    up.updated_at
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
END;
$function$;

-- Fix the update_user_profile function to return a flat object as well
CREATE OR REPLACE FUNCTION public.update_user_profile(profile_user_id uuid, profile_updates jsonb)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  role text,
  date_of_birth date,
  phone text,
  emergency_contact text,
  consent_given boolean,
  linked_user_id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Return the updated profile as a flat table row
  RETURN QUERY
  SELECT 
    up.user_id,
    up.full_name,
    up.role,
    up.date_of_birth,
    up.phone,
    up.emergency_contact,
    up.consent_given,
    up.linked_user_id,
    up.created_at,
    up.updated_at
  FROM staging.user_profiles up
  WHERE up.user_id = profile_user_id;
END;
$function$;
