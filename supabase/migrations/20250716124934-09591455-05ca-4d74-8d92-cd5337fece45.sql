
-- Create vitals tracking table
CREATE TABLE public.vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vital_type TEXT NOT NULL CHECK (vital_type IN ('blood_pressure', 'blood_sugar', 'pulse', 'weight', 'temperature')),
  values JSONB NOT NULL, -- {"systolic": 120, "diastolic": 80} or {"value": 98, "unit": "mg/dL"}
  measured_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  out_of_range BOOLEAN DEFAULT false,
  logged_by UUID REFERENCES auth.users(id) NOT NULL,
  caregiver_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and create policies similar to comorbidities
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vitals" ON public.vitals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vitals" ON public.vitals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vitals" ON public.vitals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Caregivers can view linked patient vitals" ON public.vitals FOR SELECT USING (can_caregiver_view_patient(user_id) AND caregiver_visible = true);

-- Allow caregivers to log vitals for patients
CREATE POLICY "Caregivers can log vitals for patients" ON public.vitals FOR INSERT WITH CHECK (
  auth.uid() = logged_by AND (
    auth.uid() = user_id OR can_caregiver_view_patient(user_id)
  )
);

-- Create indexes for performance
CREATE INDEX idx_vitals_user_id ON public.vitals(user_id);
CREATE INDEX idx_vitals_measured_at ON public.vitals(measured_at);
CREATE INDEX idx_vitals_type ON public.vitals(vital_type);

-- Create a trigger to update the updated_at timestamp for comorbidities
CREATE TRIGGER update_comorbidities_updated_at
  BEFORE UPDATE ON public.comorbidities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
