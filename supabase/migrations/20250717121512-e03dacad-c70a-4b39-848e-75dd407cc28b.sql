-- Create positive_factors table for Good Day Protocol
CREATE TABLE public.positive_factors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  factor_text TEXT NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  wellness_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.positive_factors ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own positive factors" 
ON public.positive_factors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own positive factors" 
ON public.positive_factors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own positive factors" 
ON public.positive_factors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own positive factors" 
ON public.positive_factors 
FOR DELETE 
USING (auth.uid() = user_id);

-- Caregivers can view linked patient positive factors
CREATE POLICY "Caregivers can view linked patient positive factors" 
ON public.positive_factors 
FOR SELECT 
USING (can_caregiver_view_patient(user_id));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_positive_factors_updated_at
BEFORE UPDATE ON public.positive_factors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();