-- Create vitals table for comprehensive health tracking
CREATE TABLE public.vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vital_type TEXT NOT NULL CHECK (vital_type IN ('blood_pressure', 'blood_sugar', 'pulse', 'weight', 'temperature', 'oxygen_saturation')),
  values JSONB NOT NULL,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  out_of_range BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own vitals" 
ON public.vitals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vitals" 
ON public.vitals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vitals" 
ON public.vitals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vitals" 
ON public.vitals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policy for caregivers to view linked patient vitals
CREATE POLICY "Caregivers can view linked patient vitals" 
ON public.vitals 
FOR SELECT 
USING (can_caregiver_view_patient(user_id));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_vitals_updated_at
BEFORE UPDATE ON public.vitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_vitals_user_id ON public.vitals(user_id);
CREATE INDEX idx_vitals_measured_at ON public.vitals(measured_at);
CREATE INDEX idx_vitals_type ON public.vitals(vital_type);