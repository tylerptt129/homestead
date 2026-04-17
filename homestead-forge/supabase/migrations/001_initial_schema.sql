-- Homestead Forge - Initial Schema
-- Run against Supabase Postgres

-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  homestead_name TEXT,
  location_state TEXT,
  acreage NUMERIC,
  climate_zone TEXT,
  grid_status TEXT DEFAULT 'on_grid' CHECK (grid_status IN ('on_grid', 'off_grid', 'hybrid')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homestead Modules (the big categories)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INT NOT NULL,
  color TEXT,
  estimated_hours NUMERIC,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Steps within each module
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  detailed_guide TEXT,
  tips TEXT[],
  estimated_cost_low NUMERIC,
  estimated_cost_high NUMERIC,
  estimated_time TEXT,
  display_order INT NOT NULL,
  depends_on UUID[],
  tags TEXT[],
  season_relevance TEXT[],
  resources JSONB DEFAULT '{"links":[],"books":[],"videos":[]}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress on steps
CREATE TABLE user_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  photos TEXT[],
  actual_cost NUMERIC,
  custom_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

-- User journal entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id),
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'tough', 'rough')),
  weather JSONB,
  photos TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget tracking
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id),
  step_id UUID REFERENCES steps(id),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT CHECK (category IN ('materials', 'tools', 'labor', 'permits', 'equipment')),
  vendor TEXT,
  receipt_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seasonal calendar / reminders
CREATE TABLE seasonal_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  month INT CHECK (month BETWEEN 1 AND 12),
  recurring BOOLEAN DEFAULT true,
  completed_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own data
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own progress" ON user_step_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own journal" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own budget" ON budget_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tasks" ON seasonal_tasks FOR ALL USING (auth.uid() = user_id);

-- Modules and steps are public read
CREATE POLICY "Public read modules" ON modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read steps" ON steps FOR SELECT TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX idx_steps_module_id ON steps(module_id);
CREATE INDEX idx_user_progress_user_id ON user_step_progress(user_id);
CREATE INDEX idx_user_progress_step_id ON user_step_progress(step_id);
CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_budget_user_id ON budget_items(user_id);
CREATE INDEX idx_seasonal_user_id ON seasonal_tasks(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_step_progress_updated_at BEFORE UPDATE ON user_step_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
