
-- Fix get_user_medications function to remove GROUP BY issues
DROP FUNCTION IF EXISTS public.get_user_medications(UUID);

CREATE OR REPLACE FUNCTION public.get_user_medications(medication_user_id UUID)
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
      'id', m.id,
      'name', m.name,
      'dosage', m.dosage,
      'frequency', m.frequency,
      'instructions', m.instructions,
      'active', m.active,
      'user_id', m.user_id,
      'created_at', m.created_at,
      'updated_at', m.updated_at,
      'caregiver_visible', m.caregiver_visible,
      'pills_remaining', m.pills_remaining,
      'next_refill_date', m.next_refill_date,
      'daily_consumption', m.daily_consumption
    )
  )
  INTO result
  FROM staging.medications m
  WHERE m.user_id = medication_user_id
  AND m.active = true
  ORDER BY m.created_at DESC;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Fix get_user_symptoms function to remove GROUP BY issues
DROP FUNCTION IF EXISTS public.get_user_symptoms(UUID);

CREATE OR REPLACE FUNCTION public.get_user_symptoms(symptoms_user_id UUID)
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
      'id', s.id,
      'user_id', s.user_id,
      'symptom_type', s.symptom_type,
      'severity', s.severity,
      'details', s.details,
      'notes', s.notes,
      'logged_at', s.logged_at
    )
  )
  INTO result
  FROM staging.symptoms s
  WHERE s.user_id = symptoms_user_id
  ORDER BY s.logged_at DESC;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;
