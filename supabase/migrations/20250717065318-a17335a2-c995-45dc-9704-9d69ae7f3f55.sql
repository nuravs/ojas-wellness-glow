-- Add refill tracking columns to medications table
ALTER TABLE public.medications 
ADD COLUMN next_refill_date DATE,
ADD COLUMN pills_remaining INTEGER,
ADD COLUMN daily_consumption DECIMAL DEFAULT 1.0;