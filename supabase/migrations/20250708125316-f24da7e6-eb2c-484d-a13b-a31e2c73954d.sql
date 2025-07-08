
-- Create enum for comorbidity severity levels
CREATE TYPE public.severity_level AS ENUM ('mild', 'moderate', 'severe');

-- Create enum for comorbidity status
CREATE TYPE public.comorbidity_status AS ENUM ('active', 'controlled', 'monitoring', 'inactive');

-- Create comorbidities table
CREATE TABLE public.comorbidities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  condition_name TEXT NOT NULL,
  severity severity_level DEFAULT 'mild',
  status comorbidity_status DEFAULT 'active',
  diagnosed_date DATE,
  notes TEXT,
  caregiver_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create medication_conditions linking table
CREATE TABLE public.medication_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID NOT NULL,
  comorbidity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(medication_id, comorbidity_id)
);

-- Add foreign key constraint for medication_conditions
ALTER TABLE public.medication_conditions
ADD CONSTRAINT fk_medication_conditions_medication
FOREIGN KEY (medication_id) REFERENCES public.medications(id) ON DELETE CASCADE;

ALTER TABLE public.medication_conditions
ADD CONSTRAINT fk_medication_conditions_comorbidity
FOREIGN KEY (comorbidity_id) REFERENCES public.comorbidities(id) ON DELETE CASCADE;

-- Create updated_at trigger for comorbidities
CREATE TRIGGER update_comorbidities_updated_at
  BEFORE UPDATE ON public.comorbidities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.comorbidities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_conditions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comorbidities table
-- Users can view their own comorbidities
CREATE POLICY "Users can view own comorbidities" 
  ON public.comorbidities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own comorbidities
CREATE POLICY "Users can insert own comorbidities" 
  ON public.comorbidities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comorbidities
CREATE POLICY "Users can update own comorbidities" 
  ON public.comorbidities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own comorbidities
CREATE POLICY "Users can delete own comorbidities" 
  ON public.comorbidities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Caregivers can view linked patient comorbidities (similar to medications)
CREATE POLICY "Caregivers can view linked patient comorbidities" 
  ON public.comorbidities 
  FOR SELECT 
  USING (can_caregiver_view_patient(user_id) AND caregiver_visible = true);

-- RLS Policies for medication_conditions linking table
-- Users can view medication-condition links for their own data
CREATE POLICY "Users can view own medication conditions" 
  ON public.medication_conditions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_conditions.medication_id 
      AND m.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.comorbidities c 
      WHERE c.id = medication_conditions.comorbidity_id 
      AND c.user_id = auth.uid()
    )
  );

-- Users can insert medication-condition links for their own data
CREATE POLICY "Users can insert own medication conditions" 
  ON public.medication_conditions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_conditions.medication_id 
      AND m.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.comorbidities c 
      WHERE c.id = medication_conditions.comorbidity_id 
      AND c.user_id = auth.uid()
    )
  );

-- Users can update medication-condition links for their own data
CREATE POLICY "Users can update own medication conditions" 
  ON public.medication_conditions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_conditions.medication_id 
      AND m.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.comorbidities c 
      WHERE c.id = medication_conditions.comorbidity_id 
      AND c.user_id = auth.uid()
    )
  );

-- Users can delete medication-condition links for their own data
CREATE POLICY "Users can delete own medication conditions" 
  ON public.medication_conditions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_conditions.medication_id 
      AND m.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.comorbidities c 
      WHERE c.id = medication_conditions.comorbidity_id 
      AND c.user_id = auth.uid()
    )
  );

-- Caregivers can view medication-condition links for linked patients
CREATE POLICY "Caregivers can view linked patient medication conditions" 
  ON public.medication_conditions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_conditions.medication_id 
      AND can_caregiver_view_patient(m.user_id)
      AND m.caregiver_visible = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.comorbidities c 
      WHERE c.id = medication_conditions.comorbidity_id 
      AND can_caregiver_view_patient(c.user_id)
      AND c.caregiver_visible = true
    )
  );
