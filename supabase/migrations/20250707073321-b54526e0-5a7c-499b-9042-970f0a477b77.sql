
-- PHASE 2: Create core health data tables
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency JSONB, -- e.g., {"times": ["8:00", "20:00"]}
  instructions TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_time TIMESTAMPTZ,
  actual_time TIMESTAMPTZ,
  status TEXT CHECK (status IN ('taken', 'missed', 'postponed')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptom_type TEXT NOT NULL, -- 'tremor', 'stiffness', etc.
  severity INTEGER CHECK (severity >= 0 AND severity <= 10),
  details JSONB, -- for quick options like "resting", "action"
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- PHASE 3: Enable Row Level Security on all tables
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medications
CREATE POLICY "Users can view own medications" 
  ON public.medications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications" 
  ON public.medications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications" 
  ON public.medications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Caregivers can view linked patient medications with consent
CREATE POLICY "Caregivers can view linked patient medications" 
  ON public.medications 
  FOR SELECT 
  USING (public.can_caregiver_view_patient(user_id));

-- Create RLS policies for medication logs
CREATE POLICY "Users can view own med logs" 
  ON public.medication_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own med logs" 
  ON public.medication_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own med logs" 
  ON public.medication_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view linked patient med logs" 
  ON public.medication_logs 
  FOR SELECT 
  USING (public.can_caregiver_view_patient(user_id));

-- Create RLS policies for symptoms
CREATE POLICY "Users can view own symptoms" 
  ON public.symptoms 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptoms" 
  ON public.symptoms 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptoms" 
  ON public.symptoms 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptoms" 
  ON public.symptoms 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view linked patient symptoms" 
  ON public.symptoms 
  FOR SELECT 
  USING (public.can_caregiver_view_patient(user_id));

-- Create indexes for better performance
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_medications_active ON public.medications(active) WHERE active = true;
CREATE INDEX idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX idx_medication_logs_medication_id ON public.medication_logs(medication_id);
CREATE INDEX idx_medication_logs_scheduled_time ON public.medication_logs(scheduled_time);
CREATE INDEX idx_symptoms_user_id ON public.symptoms(user_id);
CREATE INDEX idx_symptoms_logged_at ON public.symptoms(logged_at);
CREATE INDEX idx_symptoms_type ON public.symptoms(symptom_type);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for medications table
CREATE TRIGGER update_medications_updated_at 
  BEFORE UPDATE ON public.medications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
