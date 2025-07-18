
-- Phase 1: Create patient_caregivers junction table for secure linking
CREATE TABLE public.patient_caregivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(patient_id, caregiver_id)
);

-- Enable RLS on patient_caregivers table
ALTER TABLE public.patient_caregivers ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_caregivers table
CREATE POLICY "Patients can view their own caregiver requests" 
  ON public.patient_caregivers 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Caregivers can view their own patient requests" 
  ON public.patient_caregivers 
  FOR SELECT 
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can create patient link requests" 
  ON public.patient_caregivers 
  FOR INSERT 
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Patients can update requests made to them" 
  ON public.patient_caregivers 
  FOR UPDATE 
  USING (auth.uid() = patient_id);

-- Create new secure function for checking caregiver-patient relationships
CREATE OR REPLACE FUNCTION public.can_caregiver_view_patient_v2(patient_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.patient_caregivers pc
    JOIN public.user_profiles caregiver ON caregiver.user_id = pc.caregiver_id
    JOIN public.user_profiles patient ON patient.user_id = pc.patient_id
    WHERE pc.caregiver_id = auth.uid() 
    AND pc.patient_id = patient_user_id
    AND pc.status = 'approved'
    AND caregiver.role = 'caregiver'
    AND patient.consent_given = true
  );
$$;

-- Phase 2: Create events table for critical incident logging
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('fall', 'near_fall', 'confusion_episode', 'emergency', 'medication_reaction', 'other')),
  notes TEXT,
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS policies for events table
CREATE POLICY "Users can view their own events" 
  ON public.events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" 
  ON public.events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
  ON public.events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
  ON public.events 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Approved caregivers can view patient events" 
  ON public.events 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

-- Add trigger for updated_at on events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_timestamp ON public.events(event_timestamp);
CREATE INDEX idx_events_type ON public.events(event_type);
CREATE INDEX idx_patient_caregivers_patient_id ON public.patient_caregivers(patient_id);
CREATE INDEX idx_patient_caregivers_caregiver_id ON public.patient_caregivers(caregiver_id);
CREATE INDEX idx_patient_caregivers_status ON public.patient_caregivers(status);

-- Phase 3: Add data integrity constraints
-- Add UNIQUE constraint to medications table to prevent duplicates
ALTER TABLE public.medications 
ADD CONSTRAINT unique_user_medication_dosage 
UNIQUE (user_id, name, dosage);

-- Add CHECK constraints to vitals table for data validation
ALTER TABLE public.vitals 
ADD CONSTRAINT check_positive_blood_pressure 
CHECK (
  vital_type != 'blood_pressure' OR 
  (
    (values->>'systolic')::numeric > 0 AND 
    (values->>'systolic')::numeric < 300 AND
    (values->>'diastolic')::numeric > 0 AND 
    (values->>'diastolic')::numeric < 200
  )
);

ALTER TABLE public.vitals 
ADD CONSTRAINT check_positive_pulse 
CHECK (
  vital_type != 'pulse' OR 
  (
    (values->>'value')::numeric > 0 AND 
    (values->>'value')::numeric < 300
  )
);

ALTER TABLE public.vitals 
ADD CONSTRAINT check_positive_blood_sugar 
CHECK (
  vital_type != 'blood_sugar' OR 
  (
    (values->>'value')::numeric > 0 AND 
    (values->>'value')::numeric < 1000
  )
);

ALTER TABLE public.vitals 
ADD CONSTRAINT check_positive_weight 
CHECK (
  vital_type != 'weight' OR 
  (
    (values->>'value')::numeric > 0 AND 
    (values->>'value')::numeric < 1000
  )
);

ALTER TABLE public.vitals 
ADD CONSTRAINT check_valid_temperature 
CHECK (
  vital_type != 'temperature' OR 
  (
    (values->>'value')::numeric > 90 AND 
    (values->>'value')::numeric < 115
  )
);

-- Phase 4: Remove linked_user_id column from user_profiles (after updating policies)
-- We'll do this after updating all the RLS policies to use the new function

-- Phase 5: Update all existing RLS policies to use the new secure function
-- Drop old policies that use can_caregiver_view_patient
DROP POLICY IF EXISTS "Caregivers can view linked patient profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Caregivers can view linked patient medications" ON public.medications;
DROP POLICY IF EXISTS "Caregivers can view linked patient med logs" ON public.medication_logs;
DROP POLICY IF EXISTS "Caregivers can view linked patient vitals" ON public.vitals;
DROP POLICY IF EXISTS "Caregivers can view linked patient comorbidities" ON public.comorbidities;
DROP POLICY IF EXISTS "Caregivers can view linked patient symptoms" ON public.symptoms;
DROP POLICY IF EXISTS "Caregivers can view linked patient appointments" ON public.appointments;
DROP POLICY IF EXISTS "Caregivers can view linked patient brain gym sessions" ON public.brain_gym_sessions;
DROP POLICY IF EXISTS "Caregivers can view linked patient daily routines" ON public.daily_routines;
DROP POLICY IF EXISTS "Caregivers can view linked patient positive factors" ON public.positive_factors;
DROP POLICY IF EXISTS "Caregivers can view linked patient medication conditions" ON public.medication_conditions;

-- Create new secure policies using can_caregiver_view_patient_v2
CREATE POLICY "Approved caregivers can view patient profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient medications" 
  ON public.medications 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id) AND caregiver_visible = true);

CREATE POLICY "Approved caregivers can view patient medication logs" 
  ON public.medication_logs 
  FOR SELECT 
  USING (
    can_caregiver_view_patient_v2(user_id) AND 
    EXISTS (
      SELECT 1 FROM public.medications m 
      WHERE m.id = medication_logs.medication_id AND m.caregiver_visible = true
    )
  );

CREATE POLICY "Approved caregivers can log medications for patients" 
  ON public.medication_logs 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = logged_by AND 
    (
      auth.uid() = user_id OR 
      can_caregiver_view_patient_v2(user_id)
    )
  );

CREATE POLICY "Approved caregivers can view patient vitals" 
  ON public.vitals 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can log vitals for patients" 
  ON public.vitals 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR can_caregiver_view_patient_v2(user_id)
  );

CREATE POLICY "Approved caregivers can view patient comorbidities" 
  ON public.comorbidities 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id) AND caregiver_visible = true);

CREATE POLICY "Approved caregivers can view patient symptoms" 
  ON public.symptoms 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient brain gym sessions" 
  ON public.brain_gym_sessions 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient daily routines" 
  ON public.daily_routines 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient positive factors" 
  ON public.positive_factors 
  FOR SELECT 
  USING (can_caregiver_view_patient_v2(user_id));

CREATE POLICY "Approved caregivers can view patient medication conditions" 
  ON public.medication_conditions 
  FOR SELECT 
  USING (
    (EXISTS ( SELECT 1
     FROM public.medications m
    WHERE ((m.id = medication_conditions.medication_id) AND can_caregiver_view_patient_v2(m.user_id) AND (m.caregiver_visible = true)))) OR 
    (EXISTS ( SELECT 1
     FROM public.comorbidities c
    WHERE ((c.id = medication_conditions.comorbidity_id) AND can_caregiver_view_patient_v2(c.user_id) AND (c.caregiver_visible = true))))
  );

-- Phase 6: Enhance user profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert into user_profiles with comprehensive error handling
  INSERT INTO public.user_profiles (user_id, role, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, 'User')
  );
  
  -- Log successful profile creation
  RAISE LOG 'Successfully created user profile for user_id: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Failed to create user profile for user_id: %. Error: %', NEW.id, SQLERRM;
    -- Re-raise the exception to ensure the user creation fails if profile creation fails
    RAISE;
END;
$$;

-- Phase 7: Create secure storage bucket and policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user_uploads', 'user_uploads', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS policies
CREATE POLICY "Users can upload their own files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'user_uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user_uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Approved caregivers can view patient files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'user_uploads' AND 
    can_caregiver_view_patient_v2(((storage.foldername(name))[1])::uuid)
  );

-- Phase 8: Clean up - Remove linked_user_id column from user_profiles
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS linked_user_id;

-- Drop the old function that's no longer needed
DROP FUNCTION IF EXISTS public.can_caregiver_view_patient(UUID);
