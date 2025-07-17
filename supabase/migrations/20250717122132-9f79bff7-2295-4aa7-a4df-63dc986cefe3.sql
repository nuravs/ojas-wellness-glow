-- Create brain_gym_exercises table for cognitive exercises
CREATE TABLE public.brain_gym_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'memory', 'attention', 'coordination', 'problem_solving'
  difficulty_level INTEGER NOT NULL DEFAULT 1, -- 1-5 scale
  description TEXT NOT NULL,
  instructions JSONB NOT NULL,
  target_skills TEXT[] NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brain_gym_sessions table for tracking user performance
CREATE TABLE public.brain_gym_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL REFERENCES brain_gym_exercises(id),
  difficulty_level INTEGER NOT NULL,
  score INTEGER,
  completion_time INTEGER, -- in seconds
  mistakes_count INTEGER DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  session_data JSONB, -- store exercise-specific data
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_groups table
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL, -- 'condition_specific', 'general', 'caregiver'
  condition_focus TEXT, -- for condition-specific groups
  is_private BOOLEAN NOT NULL DEFAULT false,
  moderated BOOLEAN NOT NULL DEFAULT true,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_group_members table
CREATE TABLE public.support_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'member', 'moderator', 'admin'
  display_name TEXT, -- optional anonymous display name
  anonymous BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create support_group_posts table
CREATE TABLE public.support_group_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'discussion', -- 'discussion', 'question', 'resource', 'announcement'
  anonymous BOOLEAN NOT NULL DEFAULT false,
  moderated BOOLEAN NOT NULL DEFAULT false,
  pinned BOOLEAN NOT NULL DEFAULT false,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_routines table
CREATE TABLE public.daily_routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  routine_date DATE NOT NULL DEFAULT CURRENT_DATE,
  routine_data JSONB NOT NULL, -- structured routine with time slots
  completed_tasks TEXT[] DEFAULT '{}',
  wellness_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, routine_date)
);

-- Enable Row Level Security
ALTER TABLE public.brain_gym_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_gym_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_routines ENABLE ROW LEVEL SECURITY;