
-- Add logged_by field to medication_logs table to track who logged the medication
ALTER TABLE public.medication_logs 
ADD COLUMN logged_by uuid REFERENCES auth.users(id);

-- Add caregiver_visible field to medications table for privacy control
ALTER TABLE public.medications 
ADD COLUMN caregiver_visible boolean DEFAULT true;

-- Update medication_logs to include logged_by in existing records (set to user_id for historical data)
UPDATE public.medication_logs 
SET logged_by = user_id 
WHERE logged_by IS NULL;

-- Make logged_by NOT NULL after updating existing records
ALTER TABLE public.medication_logs 
ALTER COLUMN logged_by SET NOT NULL;

-- Create new RLS policy for caregivers to insert medication logs for their linked patients
CREATE POLICY "Caregivers can log medications for linked patients" 
  ON public.medication_logs 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = logged_by AND 
    (
      auth.uid() = user_id OR 
      can_caregiver_view_patient(user_id)
    )
  );

-- Update existing medication_logs SELECT policy to consider caregiver_visible flag
DROP POLICY IF EXISTS "Caregivers can view linked patient med logs" ON public.medication_logs;
CREATE POLICY "Caregivers can view linked patient med logs" 
  ON public.medication_logs 
  FOR SELECT 
  USING (
    can_caregiver_view_patient(user_id) AND 
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_id AND m.caregiver_visible = true
    )
  );

-- Update medications SELECT policy for caregivers to respect caregiver_visible flag
DROP POLICY IF EXISTS "Caregivers can view linked patient medications" ON public.medications;
CREATE POLICY "Caregivers can view linked patient medications" 
  ON public.medications 
  FOR SELECT 
  USING (can_caregiver_view_patient(user_id) AND caregiver_visible = true);

-- Create index for better performance on new columns
CREATE INDEX idx_medication_logs_logged_by ON public.medication_logs(logged_by);
CREATE INDEX idx_medications_caregiver_visible ON public.medications(caregiver_visible) WHERE caregiver_visible = true;
