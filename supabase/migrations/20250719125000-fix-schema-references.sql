
-- Fix schema references in database functions - they should reference public schema, not staging

-- Fix get_user_vitals function to use public schema
DROP FUNCTION IF EXISTS public.get_user_vitals(UUID);

CREATE OR REPLACE FUNCTION public.get_user_vitals(vitals_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Use a subquery with ORDER BY to avoid GROUP BY issues
  SELECT COALESCE(json_agg(vital_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
      'id', v.id,
      'user_id', v.user_id,
      'vital_type', v.vital_type,
      'values', v.values,
      'measured_at', v.measured_at,
      'out_of_range', v.out_of_range,
      'notes', v.notes,
      'created_at', v.created_at
    ) AS vital_data
    FROM public.vitals v
    WHERE v.user_id = vitals_user_id
    ORDER BY v.measured_at DESC
  ) AS ordered_vitals;
  
  RETURN result;
END;
$$;

-- Fix get_user_medications function to use public schema
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
  -- Use a subquery with ORDER BY to avoid GROUP BY issues
  SELECT COALESCE(json_agg(med_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
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
    ) AS med_data
    FROM public.medications m
    WHERE m.user_id = medication_user_id
    AND m.active = true
    ORDER BY m.created_at DESC
  ) AS ordered_meds;
  
  RETURN result;
END;
$$;

-- Fix get_user_symptoms function to use public schema
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
  -- Use a subquery with ORDER BY to avoid GROUP BY issues
  SELECT COALESCE(json_agg(symptom_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
      'id', s.id,
      'user_id', s.user_id,
      'symptom_type', s.symptom_type,
      'severity', s.severity,
      'details', s.details,
      'notes', s.notes,
      'logged_at', s.logged_at
    ) AS symptom_data
    FROM public.symptoms s
    WHERE s.user_id = symptoms_user_id
    ORDER BY s.logged_at DESC
  ) AS ordered_symptoms;
  
  RETURN result;
END;
$$;

-- Fix get_user_comorbidities function to use public schema
DROP FUNCTION IF EXISTS public.get_user_comorbidities(UUID);

CREATE OR REPLACE FUNCTION public.get_user_comorbidities(comorbidities_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Use a subquery with ORDER BY to avoid GROUP BY issues
  SELECT COALESCE(json_agg(comorbidity_data), '[]'::json)
  INTO result
  FROM (
    SELECT json_build_object(
      'id', c.id,
      'user_id', c.user_id,
      'condition_name', c.condition_name,
      'severity', c.severity,
      'status', c.status,
      'diagnosed_date', c.diagnosed_date,
      'notes', c.notes,
      'caregiver_visible', c.caregiver_visible,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) AS comorbidity_data
    FROM public.comorbidities c
    WHERE c.user_id = comorbidities_user_id
    ORDER BY c.created_at DESC
  ) AS ordered_comorbidities;
  
  RETURN result;
END;
$$;
