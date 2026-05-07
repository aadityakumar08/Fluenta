-- Fluenta Database Schema
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'B1' CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  fears JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress (XP, streaks, achievements)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_session_date DATE,
  freeze_tokens INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  persona_id TEXT NOT NULL,
  transcript JSONB DEFAULT '[]'::jsonb,
  duration INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Session feedback
CREATE TABLE IF NOT EXISTS public.session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  overall_score INTEGER,
  fluency_score INTEGER,
  confidence_score INTEGER,
  grammar_score INTEGER,
  vocab_level TEXT,
  hesitation_count INTEGER DEFAULT 0,
  filler_count INTEGER DEFAULT 0,
  filler_words JSONB DEFAULT '{}'::jsonb,
  grammar_fixes JSONB DEFAULT '[]'::jsonb,
  vocab_upgrades JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback" ON public.session_feedback FOR SELECT
  USING (session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid()));

-- Trigger: auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Learner'));
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_session_id ON public.session_feedback(session_id);
