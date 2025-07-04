
-- Drop the problematic policy first
DROP POLICY IF EXISTS "Caregivers can view linked patient profiles" ON public.user_profiles;

-- Create a security definer function to check caregiver access without recursion
CREATE OR REPLACE FUNCTION public.can_caregiver_view_patient(patient_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles caregiver
    WHERE caregiver.user_id = auth.uid() 
    AND caregiver.role = 'caregiver' 
    AND caregiver.linked_user_id = patient_user_id
  ) AND EXISTS (
    SELECT 1 FROM public.user_profiles patient
    WHERE patient.user_id = patient_user_id
    AND patient.consent_given = true
  );
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Caregivers can view linked patient profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (public.can_caregiver_view_patient(user_id));
