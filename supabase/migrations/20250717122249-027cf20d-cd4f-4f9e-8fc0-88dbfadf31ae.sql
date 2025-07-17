-- Insert initial brain gym exercises
INSERT INTO public.brain_gym_exercises (name, category, difficulty_level, description, instructions, target_skills, estimated_duration) VALUES 
(
  'Memory Sequence',
  'memory',
  1,
  'Remember and repeat a sequence of colors or numbers',
  '{"type": "sequence", "sequence_length": 4, "display_time": 2000, "colors": ["red", "blue", "green", "yellow"], "instructions": "Watch the sequence carefully, then repeat it in the same order."}'::jsonb,
  ARRAY['working_memory', 'visual_memory', 'attention'],
  5
),
(
  'Pattern Recognition',
  'attention',
  2,
  'Identify patterns in a grid of shapes and colors',
  '{"type": "pattern", "grid_size": "3x3", "shapes": ["circle", "square", "triangle"], "colors": ["red", "blue", "green"], "instructions": "Find the pattern in the grid and select the missing piece."}'::jsonb,
  ARRAY['pattern_recognition', 'visual_attention', 'logical_thinking'],
  7
),
(
  'Hand-Eye Coordination',
  'coordination',
  1,
  'Touch targets that appear on screen in correct sequence',
  '{"type": "coordination", "target_count": 8, "target_size": "large", "speed": "slow", "instructions": "Touch each target as it appears. Try to be quick and accurate."}'::jsonb,
  ARRAY['hand_eye_coordination', 'motor_skills', 'reaction_time'],
  5
),
(
  'Mental Math',
  'problem_solving',
  2,
  'Solve simple arithmetic problems under time pressure',
  '{"type": "math", "operation_types": ["addition", "subtraction"], "number_range": [1, 20], "time_limit": 10, "instructions": "Solve each math problem as quickly and accurately as possible."}'::jsonb,
  ARRAY['mental_arithmetic', 'processing_speed', 'concentration'],
  10
),
(
  'Word Memory',
  'memory',
  3,
  'Remember lists of words and identify which were shown',
  '{"type": "word_memory", "word_count": 8, "categories": ["animals", "foods", "colors"], "display_time": 3000, "instructions": "Study the list of words, then identify which words you saw from a larger list."}'::jsonb,
  ARRAY['verbal_memory', 'recognition', 'language_processing'],
  8
),
(
  'Dual N-Back',
  'attention',
  4,
  'Advanced working memory exercise tracking position and audio',
  '{"type": "dual_n_back", "n_level": 2, "grid_size": "3x3", "trial_count": 20, "instructions": "Remember both the position of squares and audio tones from N steps back."}'::jsonb,
  ARRAY['working_memory', 'divided_attention', 'cognitive_flexibility'],
  15
);