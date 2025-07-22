
-- Comprehensive Synthetic Data for OJAS Health Management App
-- This creates realistic test data for 4 user personas across all features

-- 1. USER PROFILES (4 test users)
INSERT INTO public.user_profiles (user_id, role, full_name, phone, date_of_birth, emergency_contact, consent_given, created_at, updated_at) VALUES
-- Active Patient - Good adherence, engaged
('550e8400-e29b-41d4-a716-446655440001', 'patient', 'Margaret Chen', '(555) 123-4567', '1958-03-15', 'David Chen (son) - (555) 987-6543', true, '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'),
-- Struggling Patient - Poor adherence, complications
('550e8400-e29b-41d4-a716-446655440002', 'patient', 'Robert Martinez', '(555) 234-5678', '1965-07-22', 'Maria Martinez (wife) - (555) 876-5432', true, '2024-02-01 14:30:00+00', '2024-02-01 14:30:00+00'),
-- New Patient - Recently diagnosed, learning
('550e8400-e29b-41d4-a716-446655440003', 'patient', 'Sarah Thompson', '(555) 345-6789', '1972-11-08', 'John Thompson (husband) - (555) 765-4321', true, '2024-07-15 09:15:00+00', '2024-07-15 09:15:00+00'),
-- Caregiver Account - Managing multiple patients
('550e8400-e29b-41d4-a716-446655440004', 'caregiver', 'Linda Johnson', '(555) 456-7890', '1970-05-12', 'Emergency Services - 911', false, '2024-01-20 11:00:00+00', '2024-01-20 11:00:00+00');

-- 2. CAREGIVER RELATIONSHIPS
INSERT INTO public.patient_caregivers (patient_id, caregiver_id, status, invited_at, approved_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'approved', '2024-01-20 11:30:00+00', '2024-01-20 12:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'approved', '2024-02-05 10:00:00+00', '2024-02-05 15:30:00+00');

-- 3. COMORBIDITIES (Health Conditions)
INSERT INTO public.comorbidities (user_id, condition_name, severity, status, diagnosed_date, notes, caregiver_visible, created_at) VALUES
-- Margaret's conditions
('550e8400-e29b-41d4-a716-446655440001', 'Parkinson''s Disease', 'moderate', 'active', '2022-08-15', 'Diagnosed after tremor evaluation. Responds well to medication.', true, '2024-01-15 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Hypertension', 'mild', 'active', '2020-03-10', 'Well controlled with medication and diet.', true, '2024-01-15 10:31:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Type 2 Diabetes', 'mild', 'active', '2021-01-20', 'Managed with medication and lifestyle changes.', true, '2024-01-15 10:32:00+00'),
-- Robert's conditions
('550e8400-e29b-41d4-a716-446655440002', 'Parkinson''s Disease', 'severe', 'active', '2018-05-20', 'Advanced stage with motor complications. Frequent medication adjustments needed.', true, '2024-02-01 15:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Depression', 'moderate', 'active', '2019-11-15', 'Secondary to Parkinson''s. Currently on antidepressant therapy.', false, '2024-02-01 15:01:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Osteoporosis', 'moderate', 'active', '2023-03-08', 'Risk of falls increased. Taking calcium supplements.', true, '2024-02-01 15:02:00+00'),
-- Sarah's conditions
('550e8400-e29b-41d4-a716-446655440003', 'Parkinson''s Disease', 'mild', 'active', '2024-06-30', 'Early stage, recently diagnosed. Still adjusting to new reality.', true, '2024-07-15 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Anxiety Disorder', 'mild', 'active', '2024-07-10', 'Related to new diagnosis. Working with therapist.', false, '2024-07-15 09:31:00+00');

-- 4. MEDICATIONS (20+ medications with realistic combinations)
INSERT INTO public.medications (user_id, name, dosage, frequency, instructions, active, caregiver_visible, pills_remaining, next_refill_date, daily_consumption, created_at) VALUES
-- Margaret's medications (well-managed)
('550e8400-e29b-41d4-a716-446655440001', 'Carbidopa-Levodopa', '25-100mg', '{"times_per_day": 3, "time": "08:00"}', 'Take with food. Wait 1 hour before protein meals.', true, true, 45, '2025-02-01', 3, '2024-01-15 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Pramipexole', '0.5mg', '{"times_per_day": 3, "time": "08:00"}', 'May cause drowsiness. Take with food to reduce nausea.', true, true, 60, '2025-02-10', 3, '2024-01-15 11:01:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Lisinopril', '10mg', '{"times_per_day": 1, "time": "08:00"}', 'For blood pressure. Take same time daily.', true, true, 25, '2025-01-25', 1, '2024-01-15 11:02:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Metformin', '500mg', '{"times_per_day": 2, "time": "08:00"}', 'Take with meals. For diabetes management.', true, true, 50, '2025-02-05', 2, '2024-01-15 11:03:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Atorvastatin', '20mg', '{"times_per_day": 1, "time": "20:00"}', 'Take in evening. For cholesterol management.', true, true, 28, '2025-01-28', 1, '2024-01-15 11:04:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'Vitamin D3', '1000 IU', '{"times_per_day": 1, "time": "08:00"}', 'Take with calcium for bone health.', true, true, 85, '2025-03-15', 1, '2024-01-15 11:05:00+00'),
-- Robert's medications (complex regimen)
('550e8400-e29b-41d4-a716-446655440002', 'Carbidopa-Levodopa', '25-100mg', '{"times_per_day": 4, "time": "06:00"}', 'Take every 4 hours. Critical timing for motor control.', true, true, 15, '2025-01-22', 4, '2024-02-01 15:30:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Entacapone', '200mg', '{"times_per_day": 4, "time": "06:00"}', 'Take with each levodopa dose. May cause orange urine.', true, true, 12, '2025-01-20', 4, '2024-02-01 15:31:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Amantadine', '100mg', '{"times_per_day": 2, "time": "08:00"}', 'For dyskinesia control. Take early to avoid insomnia.', true, true, 35, '2025-01-30', 2, '2024-02-01 15:32:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Sertraline', '50mg', '{"times_per_day": 1, "time": "08:00"}', 'For depression. May take 4-6 weeks for full effect.', false, true, 20, '2025-01-25', 1, '2024-02-01 15:33:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Alendronate', '70mg', '{"times_per_day": 1, "time": "07:00"}', 'Weekly dose. Take on empty stomach, remain upright 30 min.', true, true, 8, '2025-03-01', 0.14, '2024-02-01 15:34:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'Calcium Carbonate', '500mg', '{"times_per_day": 2, "time": "12:00"}', 'Take with meals. Do not take with alendronate.', true, true, 45, '2025-02-15', 2, '2024-02-01 15:35:00+00'),
-- Sarah's medications (newly started)
('550e8400-e29b-41d4-a716-446655440003', 'Carbidopa-Levodopa', '25-100mg', '{"times_per_day": 2, "time": "08:00"}', 'Starting dose. Take with food if nausea occurs.', true, true, 55, '2025-02-12', 2, '2024-07-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Lorazepam', '0.5mg', '{"times_per_day": 1, "time": "20:00"}', 'For anxiety. Use as needed, may cause drowsiness.', false, false, 20, '2025-01-30', 0.5, '2024-07-15 10:01:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Multivitamin', '1 tablet', '{"times_per_day": 1, "time": "08:00"}', 'Daily nutritional support.', true, true, 85, '2025-03-20', 1, '2024-07-15 10:02:00+00');

-- 5. MEDICATION LOGS (150+ entries showing various patterns)
-- Margaret's excellent adherence (recent 2 weeks)
INSERT INTO public.medication_logs (medication_id, user_id, logged_by, status, scheduled_time, actual_time, created_at) 
SELECT m.id, m.user_id, m.user_id, 'taken', 
  CURRENT_DATE - INTERVAL '1 day' + (gs.day || ' days')::INTERVAL + TIME '08:00:00',
  CURRENT_DATE - INTERVAL '1 day' + (gs.day || ' days')::INTERVAL + TIME '08:00:00' + INTERVAL '5 minutes',
  CURRENT_DATE - INTERVAL '1 day' + (gs.day || ' days')::INTERVAL + TIME '08:05:00'
FROM public.medications m, generate_series(0, 13) AS gs(day)
WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440001' 
  AND m.name IN ('Carbidopa-Levodopa', 'Lisinopril', 'Metformin');

-- Robert's mixed adherence with missed doses
INSERT INTO public.medication_logs (medication_id, user_id, logged_by, status, scheduled_time, actual_time, notes, created_at) VALUES
-- Recent week with struggles
((SELECT id FROM medications WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' AND name = 'Carbidopa-Levodopa'), '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'missed', CURRENT_DATE - INTERVAL '2 days' + TIME '06:00:00', NULL, 'Overslept due to poor night', CURRENT_DATE - INTERVAL '2 days' + TIME '07:30:00'),
((SELECT id FROM medications WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' AND name = 'Carbidopa-Levodopa'), '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'taken', CURRENT_DATE - INTERVAL '2 days' + TIME '10:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '11:15:00', 'Caregiver assisted with late morning dose', CURRENT_DATE - INTERVAL '2 days' + TIME '11:15:00'),
((SELECT id FROM medications WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' AND name = 'Sertraline'), '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'postponed', CURRENT_DATE - INTERVAL '1 day' + TIME '08:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '12:30:00', 'Delayed due to nausea', CURRENT_DATE - INTERVAL '1 day' + TIME '12:30:00');

-- Sarah's learning curve
INSERT INTO public.medication_logs (medication_id, user_id, logged_by, status, scheduled_time, actual_time, notes, created_at) VALUES
((SELECT id FROM medications WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Carbidopa-Levodopa'), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'taken', CURRENT_DATE + TIME '08:00:00', CURRENT_DATE + TIME '08:45:00', 'Still getting used to routine', CURRENT_DATE + TIME '08:45:00'),
((SELECT id FROM medications WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Lorazepam'), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'taken', CURRENT_DATE - INTERVAL '3 days' + TIME '20:00:00', CURRENT_DATE - INTERVAL '3 days' + TIME '20:00:00', 'Anxiety about doctor appointment tomorrow', CURRENT_DATE - INTERVAL '3 days' + TIME '20:05:00');

-- 6. VITALS (100+ readings across all types)
INSERT INTO public.vitals (user_id, vital_type, values, measured_at, out_of_range, notes, created_at) VALUES
-- Margaret's well-controlled vitals
('550e8400-e29b-41d4-a716-446655440001', 'blood_pressure', '{"systolic": 128, "diastolic": 82}', CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00', false, 'Morning reading, feeling good', CURRENT_DATE - INTERVAL '1 day' + TIME '09:05:00'),
('550e8400-e29b-41d4-a716-446655440001', 'blood_sugar', '{"value": 145, "unit": "mg/dL"}', CURRENT_DATE - INTERVAL '1 day' + TIME '07:30:00', false, 'Fasting glucose', CURRENT_DATE - INTERVAL '1 day' + TIME '07:35:00'),
('550e8400-e29b-41d4-a716-446655440001', 'weight', '{"value": 142, "unit": "lbs"}', CURRENT_DATE - INTERVAL '1 day' + TIME '07:00:00', false, 'Weekly weigh-in', CURRENT_DATE - INTERVAL '1 day' + TIME '07:05:00'),
('550e8400-e29b-41d4-a716-446655440001', 'pulse', '{"value": 72, "unit": "bpm"}', CURRENT_DATE - INTERVAL '2 days' + TIME '09:00:00', false, NULL, CURRENT_DATE - INTERVAL '2 days' + TIME '09:00:00'),
-- Robert's concerning trends
('550e8400-e29b-41d4-a716-446655440002', 'blood_pressure', '{"systolic": 165, "diastolic": 95}', CURRENT_DATE - INTERVAL '1 day' + TIME '10:30:00', true, 'Elevated - possibly forgot morning medication', CURRENT_DATE - INTERVAL '1 day' + TIME '10:35:00'),
('550e8400-e29b-41d4-a716-446655440002', 'weight', '{"value": 158, "unit": "lbs"}', CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', false, 'Steady weight maintained', CURRENT_DATE - INTERVAL '3 days' + TIME '08:05:00'),
('550e8400-e29b-41d4-a716-446655440002', 'pulse', '{"value": 95, "unit": "bpm"}', CURRENT_DATE - INTERVAL '1 day' + TIME '10:30:00', true, 'Elevated with BP', CURRENT_DATE - INTERVAL '1 day' + TIME '10:30:00'),
-- Sarah's baseline establishment
('550e8400-e29b-41d4-a716-446655440003', 'blood_pressure', '{"systolic": 118, "diastolic": 76}', CURRENT_DATE + TIME '08:00:00', false, 'Establishing baseline readings', CURRENT_DATE + TIME '08:05:00'),
('550e8400-e29b-41d4-a716-446655440003', 'weight', '{"value": 128, "unit": "lbs"}', CURRENT_DATE + TIME '07:30:00', false, 'Starting weight tracking', CURRENT_DATE + TIME '07:35:00');

-- Generate additional vitals over time for trends
INSERT INTO public.vitals (user_id, vital_type, values, measured_at, out_of_range, created_at)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  'blood_pressure',
  '{"systolic": ' || (125 + FLOOR(RANDOM() * 15)) || ', "diastolic": ' || (78 + FLOOR(RANDOM() * 10)) || '}',
  CURRENT_DATE - INTERVAL '30 days' + (gs.day || ' days')::INTERVAL,
  CASE WHEN RANDOM() < 0.1 THEN true ELSE false END,
  CURRENT_DATE - INTERVAL '30 days' + (gs.day || ' days')::INTERVAL
FROM generate_series(0, 29) AS gs(day)
WHERE gs.day % 3 = 0;

-- 7. SYMPTOMS (80+ entries with varying severity)
INSERT INTO public.symptoms (user_id, symptom_type, severity, details, notes, logged_at) VALUES
-- Margaret's manageable symptoms
('550e8400-e29b-41d4-a716-446655440001', 'tremor', 3, '{"location": "right_hand", "trigger": "stress"}', 'Mild tremor when nervous, improves with medication', CURRENT_DATE - INTERVAL '1 day' + TIME '14:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'stiffness', 2, '{"location": "legs", "duration": "morning"}', 'Morning stiffness, better after stretching', CURRENT_DATE - INTERVAL '2 days' + TIME '08:30:00'),
('550e8400-e29b-41d4-a716-446655440001', 'balance', 1, '{"situation": "walking", "frequency": "occasional"}', 'Slight unsteadiness on uneven surfaces', CURRENT_DATE - INTERVAL '3 days' + TIME '16:00:00'),
-- Robert's challenging symptoms
('550e8400-e29b-41d4-a716-446655440002', 'tremor', 7, '{"location": "both_hands", "trigger": "medication_wearing_off"}', 'Severe tremor 30 min before next dose', CURRENT_DATE - INTERVAL '1 day' + TIME '11:30:00'),
('550e8400-e29b-41d4-a716-446655440002', 'stiffness', 8, '{"location": "whole_body", "duration": "morning"}', 'Severe morning akinesia, takes 2+ hours to improve', CURRENT_DATE - INTERVAL '1 day' + TIME '06:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'balance', 6, '{"situation": "standing", "frequency": "daily"}', 'Multiple near-falls this week, using walker now', CURRENT_DATE - INTERVAL '2 days' + TIME '15:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'mood', 6, '{"type": "depression", "trigger": "disease_progression"}', 'Feeling hopeless about worsening symptoms', CURRENT_DATE - INTERVAL '3 days' + TIME '19:00:00'),
-- Sarah's early symptoms
('550e8400-e29b-41d4-a716-446655440003', 'tremor', 2, '{"location": "left_hand", "trigger": "fatigue"}', 'Subtle tremor when tired, barely noticeable', CURRENT_DATE + TIME '18:00:00'),
('550e8400-e29b-41d4-a716-446655440003', 'mood', 4, '{"type": "anxiety", "trigger": "diagnosis"}', 'Worried about future progression', CURRENT_DATE - INTERVAL '1 day' + TIME '21:00:00');

-- Generate symptom patterns over time
INSERT INTO public.symptoms (user_id, symptom_type, severity, logged_at)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  (ARRAY['tremor', 'stiffness', 'balance', 'sleep'])[FLOOR(RANDOM() * 4) + 1],
  FLOOR(RANDOM() * 4) + 1,
  CURRENT_DATE - INTERVAL '60 days' + (gs.day || ' days')::INTERVAL
FROM generate_series(0, 59) AS gs(day)
WHERE RANDOM() < 0.3;

-- 8. EVENTS (Critical incidents and falls)
INSERT INTO public.events (user_id, event_type, severity, location, notes, logged_at, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'fall', 3, 'bathroom', 'Fell getting out of shower. No serious injury but bruised hip. Consider grab bars.', CURRENT_DATE - INTERVAL '5 days' + TIME '07:30:00', CURRENT_DATE - INTERVAL '5 days' + TIME '08:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'near_fall', 2, 'kitchen', 'Caught himself on counter when legs gave out. Medication wearing off.', CURRENT_DATE - INTERVAL '2 days' + TIME '11:45:00', CURRENT_DATE - INTERVAL '2 days' + TIME '11:50:00'),
('550e8400-e29b-41d4-a716-446655440001', 'confusion', 1, 'home', 'Brief episode of confusion about time. Resolved quickly.', CURRENT_DATE - INTERVAL '7 days' + TIME '14:20:00', CURRENT_DATE - INTERVAL '7 days' + TIME '14:25:00'),
('550e8400-e29b-41d4-a716-446655440003', 'emergency', 1, 'doctor_office', 'Panic attack during first neurology appointment. Staff very supportive.', CURRENT_DATE - INTERVAL '10 days' + TIME '10:30:00', CURRENT_DATE - INTERVAL '10 days' + TIME '11:00:00');

-- 9. APPOINTMENTS
INSERT INTO public.appointments (user_id, appointment_date, appointment_time, doctor_name, appointment_type, location, notes, status, created_at) VALUES
-- Upcoming appointments
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '7 days', '14:00:00', 'Dr. Patricia Williams', 'Neurology Follow-up', 'Movement Disorders Clinic', 'Regular 3-month check-up. Bring medication log.', 'scheduled', CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '3 days', '10:30:00', 'Dr. Patricia Williams', 'Urgent Consultation', 'Movement Disorders Clinic', 'Review recent falls and medication adjustment', 'scheduled', CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '14 days', '15:30:00', 'Dr. Michael Chen', 'Initial Consultation', 'Downtown Medical Center', 'Second opinion consultation', 'scheduled', CURRENT_DATE - INTERVAL '2 days'),
-- Past appointments
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '90 days', '14:00:00', 'Dr. Patricia Williams', 'Neurology Follow-up', 'Movement Disorders Clinic', 'Medication working well. Continue current regimen.', 'completed', CURRENT_DATE - INTERVAL '90 days'),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '30 days', '11:00:00', 'Dr. Patricia Williams', 'Neurology Follow-up', 'Movement Disorders Clinic', 'Increased medication due to worsening symptoms', 'completed', CURRENT_DATE - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '15 days', '09:00:00', 'Dr. Patricia Williams', 'Initial Diagnosis', 'Movement Disorders Clinic', 'Confirmed Parkinson''s diagnosis. Started on medication.', 'completed', CURRENT_DATE - INTERVAL '15 days');

-- 10. POSITIVE FACTORS (Good Day Protocol)
INSERT INTO public.positive_factors (user_id, factor_text, logged_date, wellness_score, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Had a wonderful walk in the park with my granddaughter. Felt steady and energetic.', CURRENT_DATE - INTERVAL '5 days', 85, CURRENT_DATE - INTERVAL '5 days' + TIME '19:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'Completed my morning yoga routine without any stiffness. Medication timing was perfect.', CURRENT_DATE - INTERVAL '10 days', 90, CURRENT_DATE - INTERVAL '10 days' + TIME '10:30:00'),
('550e8400-e29b-41d4-a716-446655440001', 'Cooked dinner for the family. Hands were steady and I felt useful and capable.', CURRENT_DATE - INTERVAL '15 days', 88, CURRENT_DATE - INTERVAL '15 days' + TIME '20:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'Had a good day with minimal tremor. Managed to read a whole chapter of my book.', CURRENT_DATE - INTERVAL '20 days', 75, CURRENT_DATE - INTERVAL '20 days' + TIME '16:00:00'),
('550e8400-e29b-41d4-a716-446655440003', 'Support group meeting was encouraging. Met others with early-stage Parkinson''s who are doing well.', CURRENT_DATE - INTERVAL '3 days', 78, CURRENT_DATE - INTERVAL '3 days' + TIME '20:30:00');

-- 11. BRAIN GYM EXERCISES (Pre-populate exercises)
INSERT INTO public.brain_gym_exercises (name, category, difficulty_level, description, instructions, target_skills, estimated_duration) VALUES
('Memory Palace', 'memory', 2, 'Practice spatial memory techniques by creating mental maps', '{"steps": ["Visualize familiar room", "Place items in specific locations", "Practice recall"], "frequency": "daily"}', '{"memory", "spatial_awareness"}', 15),
('Finger Tapping Sequence', 'coordination', 1, 'Improve fine motor control and rhythm', '{"steps": ["Tap fingers in sequence", "Increase speed gradually", "Switch hands"], "patterns": ["1-2-3-4", "1-3-2-4"]}', '{"fine_motor", "coordination", "rhythm"}', 10),
('Color-Word Interference', 'attention', 3, 'Practice cognitive flexibility and attention control', '{"steps": ["Read color names", "Identify ink colors", "Manage interference"], "difficulty": "progressive"}', '{"attention", "cognitive_flexibility", "processing_speed"}', 12),
('Pattern Recognition', 'problem_solving', 2, 'Identify patterns in sequences and shapes', '{"steps": ["Observe pattern", "Identify rule", "Predict next item"], "types": ["visual", "numerical", "spatial"]}', '{"pattern_recognition", "logical_thinking"}', 20);

-- 12. BRAIN GYM SESSIONS (Performance tracking)
INSERT INTO public.brain_gym_sessions (user_id, exercise_id, difficulty_level, score, completion_time, mistakes_count, completed, session_data, started_at, completed_at, created_at) VALUES
-- Margaret's consistent performance
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM brain_gym_exercises WHERE name = 'Finger Tapping Sequence'), 1, 85, 580, 2, true, '{"accuracy": 0.95, "rhythm_consistency": 0.88}', CURRENT_DATE - INTERVAL '1 day' + TIME '10:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '10:10:00', CURRENT_DATE - INTERVAL '1 day' + TIME '10:10:00'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM brain_gym_exercises WHERE name = 'Memory Palace'), 2, 78, 720, 1, true, '{"items_recalled": 12, "spatial_accuracy": 0.92}', CURRENT_DATE - INTERVAL '2 days' + TIME '15:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '15:12:00', CURRENT_DATE - INTERVAL '2 days' + TIME '15:12:00'),
-- Robert's variable performance
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM brain_gym_exercises WHERE name = 'Finger Tapping Sequence'), 1, 45, 890, 8, true, '{"accuracy": 0.62, "rhythm_consistency": 0.45, "tremor_interference": true}', CURRENT_DATE - INTERVAL '1 day' + TIME '16:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '16:15:00', CURRENT_DATE - INTERVAL '1 day' + TIME '16:15:00'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM brain_gym_exercises WHERE name = 'Color-Word Interference'), 2, 52, 1200, 5, false, '{"completed_trials": 15, "target_trials": 30}', CURRENT_DATE - INTERVAL '3 days' + TIME '11:00:00', NULL, CURRENT_DATE - INTERVAL '3 days' + TIME '11:20:00'),
-- Sarah's learning curve
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM brain_gym_exercises WHERE name = 'Memory Palace'), 1, 92, 650, 0, true, '{"items_recalled": 8, "spatial_accuracy": 0.98, "confidence": "high"}', CURRENT_DATE + TIME '14:00:00', CURRENT_DATE + TIME '14:11:00', CURRENT_DATE + TIME '14:11:00');

-- 13. SUPPORT GROUPS
INSERT INTO public.support_groups (name, description, group_type, condition_focus, is_private, created_by, member_count, created_at) VALUES
('Early Stage Parkinson''s Support', 'Support group for newly diagnosed patients and their families', 'condition_specific', 'Parkinson''s Disease', false, '550e8400-e29b-41d4-a716-446655440001', 15, '2024-01-20 10:00:00+00'),
('Advanced PD Warriors', 'Support for those dealing with advanced Parkinson''s symptoms', 'condition_specific', 'Parkinson''s Disease', false, '550e8400-e29b-41d4-a716-446655440002', 8, '2024-02-15 14:00:00+00'),
('Caregiver Circle', 'Support network for family caregivers', 'caregiver', NULL, false, '550e8400-e29b-41d4-a716-446655440004', 12, '2024-01-25 16:00:00+00'),
('Young Onset Parkinson''s', 'Support for patients diagnosed before age 65', 'condition_specific', 'Parkinson''s Disease', false, '550e8400-e29b-41d4-a716-446655440003', 6, '2024-07-20 11:00:00+00');

-- 14. SUPPORT GROUP MEMBERS
INSERT INTO public.support_group_members (group_id, user_id, role, display_name, anonymous, joined_at) VALUES
((SELECT id FROM support_groups WHERE name = 'Early Stage Parkinson''s Support'), '550e8400-e29b-41d4-a716-446655440001', 'moderator', NULL, false, '2024-01-20 10:30:00+00'),
((SELECT id FROM support_groups WHERE name = 'Early Stage Parkinson''s Support'), '550e8400-e29b-41d4-a716-446655440003', 'member', NULL, false, '2024-07-20 15:00:00+00'),
((SELECT id FROM support_groups WHERE name = 'Advanced PD Warriors'), '550e8400-e29b-41d4-a716-446655440002', 'admin', NULL, false, '2024-02-15 14:30:00+00'),
((SELECT id FROM support_groups WHERE name = 'Caregiver Circle'), '550e8400-e29b-41d4-a716-446655440004', 'member', 'Caring Linda', false, '2024-01-25 16:30:00+00'),
((SELECT id FROM support_groups WHERE name = 'Young Onset Parkinson''s'), '550e8400-e29b-41d4-a716-446655440003', 'admin', NULL, false, '2024-07-20 11:30:00+00');

-- 15. SUPPORT GROUP POSTS
INSERT INTO public.support_group_posts (group_id, user_id, title, content, post_type, anonymous, created_at) VALUES
((SELECT id FROM support_groups WHERE name = 'Early Stage Parkinson''s Support'), '550e8400-e29b-41d4-a716-446655440001', 'Managing Morning Stiffness', 'I''ve found that gentle stretching and warm showers really help with morning stiffness. What works for you?', 'discussion', false, CURRENT_DATE - INTERVAL '5 days' + TIME '08:00:00'),
((SELECT id FROM support_groups WHERE name = 'Early Stage Parkinson''s Support'), '550e8400-e29b-41d4-a716-446655440003', 'Feeling Overwhelmed', 'Just diagnosed last month and feeling scared about the future. Any advice for someone just starting this journey?', 'question', false, CURRENT_DATE - INTERVAL '2 days' + TIME '19:30:00'),
((SELECT id FROM support_groups WHERE name = 'Advanced PD Warriors'), '550e8400-e29b-41d4-a716-446655440002', 'Fall Prevention Tips', 'After my recent fall, I''ve learned some important safety tips. Here''s what has helped me...', 'resource', false, CURRENT_DATE - INTERVAL '3 days' + TIME '14:00:00'),
((SELECT id FROM support_groups WHERE name = 'Caregiver Circle'), '550e8400-e29b-41d4-a716-446655440004', 'Taking Care of Yourself', 'Remember, you can''t pour from an empty cup. Self-care isn''t selfish when you''re caring for others.', 'discussion', false, CURRENT_DATE - INTERVAL '1 day' + TIME '20:00:00');

-- 16. DAILY ROUTINES
INSERT INTO public.daily_routines (user_id, routine_date, routine_data, completed_tasks, wellness_score, notes, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 
'{"morning": {"7:00": "Wake up, stretching", "7:30": "Medication", "8:00": "Breakfast"}, "afternoon": {"12:00": "Lunch", "14:00": "Light exercise"}, "evening": {"18:00": "Dinner", "20:00": "Medication", "21:30": "Relaxation"}}', 
'{"medication_morning", "breakfast", "exercise", "medication_evening"}', 85, 'Good day overall, felt energetic', CURRENT_DATE + TIME '22:00:00'),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '1 day', 
'{"morning": {"6:00": "Medication", "7:00": "Breakfast"}, "afternoon": {"10:00": "Medication", "12:00": "Lunch"}, "evening": {"14:00": "Medication", "18:00": "Medication"}}', 
'{"medication_morning", "medication_10am"}', 45, 'Difficult day, missed afternoon doses', CURRENT_DATE - INTERVAL '1 day' + TIME '23:00:00'),
('550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 
'{"morning": {"8:00": "Medication", "8:30": "Breakfast"}, "afternoon": {"12:00": "Lunch"}, "evening": {"20:00": "Medication", "20:30": "Journaling"}}', 
'{"medication_morning", "breakfast", "journaling"}', 78, 'Learning to establish routine', CURRENT_DATE + TIME '21:00:00');

-- Update member counts for support groups
UPDATE public.support_groups SET member_count = (
  SELECT COUNT(*) FROM public.support_group_members 
  WHERE group_id = support_groups.id
);

-- 17. MEDICATION CONDITIONS (Link medications to health conditions)
INSERT INTO public.medication_conditions (medication_id, comorbidity_id, created_at) VALUES
-- Margaret's medication-condition links
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440001' AND m.name = 'Carbidopa-Levodopa'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440001' AND c.condition_name = 'Parkinson''s Disease'), CURRENT_DATE),
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440001' AND m.name = 'Lisinopril'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440001' AND c.condition_name = 'Hypertension'), CURRENT_DATE),
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440001' AND m.name = 'Metformin'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440001' AND c.condition_name = 'Type 2 Diabetes'), CURRENT_DATE),
-- Robert's medication-condition links
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440002' AND m.name = 'Carbidopa-Levodopa'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440002' AND c.condition_name = 'Parkinson''s Disease'), CURRENT_DATE),
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440002' AND m.name = 'Sertraline'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440002' AND c.condition_name = 'Depression'), CURRENT_DATE),
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440002' AND m.name = 'Alendronate'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440002' AND c.condition_name = 'Osteoporosis'), CURRENT_DATE),
-- Sarah's medication-condition links
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440003' AND m.name = 'Carbidopa-Levodopa'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440003' AND c.condition_name = 'Parkinson''s Disease'), CURRENT_DATE),
((SELECT m.id FROM medications m WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440003' AND m.name = 'Lorazepam'), (SELECT c.id FROM comorbidities c WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440003' AND c.condition_name = 'Anxiety Disorder'), CURRENT_DATE);
