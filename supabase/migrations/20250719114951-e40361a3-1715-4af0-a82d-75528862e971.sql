
-- Fix the get_user_vitals function to remove the non-existent updated_at column
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
  SELECT json_agg(
    json_build_object(
      'id', v.id,
      'user_id', v.user_id,
      'vital_type', v.vital_type,
      'values', v.values,
      'measured_at', v.measured_at,
      'out_of_range', v.out_of_range,
      'notes', v.notes,
      'created_at', v.created_at
    )
  )
  INTO result
  FROM staging.vitals v
  WHERE v.user_id = vitals_user_id
  ORDER BY v.measured_at DESC;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;
