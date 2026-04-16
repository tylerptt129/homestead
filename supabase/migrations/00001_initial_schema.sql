-- Homestead Forge: Initial Schema
-- Migration: 00001_initial_schema.sql

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- profiles ───────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name    text,
  homestead_name  text,
  location_state  text,
  acreage         numeric,
  climate_zone    text,
  grid_status     text not null default 'on_grid'
                    check (grid_status in ('on_grid', 'off_grid', 'hybrid')),
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is 'User profile with homestead details.';

-- modules ────────────────────────────────────────────────────────────────────
create table public.modules (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  title         text not null,
  description   text,
  icon_name     text,
  display_order integer not null default 0,
  color         text,
  estimated_hours numeric,
  difficulty    text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at    timestamptz not null default now()
);

comment on table public.modules is 'Homestead planning modules (reference data).';

-- steps ──────────────────────────────────────────────────────────────────────
create table public.steps (
  id                  uuid primary key default uuid_generate_v4(),
  module_id           uuid not null references public.modules on delete cascade,
  title               text not null,
  description         text,
  detailed_guide      text,
  tips                text[],
  estimated_cost_low  numeric,
  estimated_cost_high numeric,
  estimated_time      text,
  display_order       integer not null default 0,
  depends_on          uuid[],
  tags                text[],
  season_relevance    text[],
  resources           jsonb,
  created_at          timestamptz not null default now()
);

comment on table public.steps is 'Individual steps within a module.';

-- user_step_progress ─────────────────────────────────────────────────────────
create table public.user_step_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  step_id       uuid not null references public.steps on delete cascade,
  status        text not null default 'not_started'
                  check (status in ('not_started', 'in_progress', 'completed', 'skipped')),
  started_at    timestamptz,
  completed_at  timestamptz,
  notes         text,
  photos        text[],
  actual_cost   numeric,
  custom_data   jsonb,
  updated_at    timestamptz not null default now(),
  unique (user_id, step_id)
);

comment on table public.user_step_progress is 'Tracks each user''s progress through steps.';

-- journal_entries ────────────────────────────────────────────────────────────
create table public.journal_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  module_id   uuid references public.modules on delete set null,
  title       text not null,
  content     text,
  mood        text,
  weather     jsonb,
  photos      text[],
  tags        text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.journal_entries is 'Homestead journal for reflections, observations, and notes.';

-- budget_items ───────────────────────────────────────────────────────────────
create table public.budget_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  module_id   uuid references public.modules on delete set null,
  step_id     uuid references public.steps on delete set null,
  description text not null,
  amount      numeric not null,
  category    text,
  vendor      text,
  receipt_url text,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

comment on table public.budget_items is 'Budget line items tied to modules and steps.';

-- seasonal_tasks ─────────────────────────────────────────────────────────────
create table public.seasonal_tasks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  module_id       uuid references public.modules on delete set null,
  title           text not null,
  description     text,
  month           integer not null check (month between 1 and 12),
  recurring       boolean not null default true,
  completed_year  integer,
  created_at      timestamptz not null default now()
);

comment on table public.seasonal_tasks is 'Monthly recurring or one-time seasonal tasks.';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- modules / steps
create index idx_modules_display_order on public.modules (display_order);
create index idx_modules_slug          on public.modules (slug);
create index idx_steps_module_id       on public.steps (module_id, display_order);

-- user_step_progress
create index idx_progress_user_id      on public.user_step_progress (user_id);
create index idx_progress_step_id      on public.user_step_progress (step_id);
create index idx_progress_status       on public.user_step_progress (user_id, status);

-- journal_entries
create index idx_journal_user_id       on public.journal_entries (user_id, created_at desc);
create index idx_journal_module_id     on public.journal_entries (module_id);
create index idx_journal_tags          on public.journal_entries using gin (tags);

-- budget_items
create index idx_budget_user_id        on public.budget_items (user_id, date desc);
create index idx_budget_module_id      on public.budget_items (module_id);
create index idx_budget_category       on public.budget_items (user_id, category);

-- seasonal_tasks
create index idx_seasonal_user_month   on public.seasonal_tasks (user_id, month);
create index idx_seasonal_module_id    on public.seasonal_tasks (module_id);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.user_step_progress
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.journal_entries
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- profiles ───────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- modules (public read for authenticated users) ─────────────────────────────
alter table public.modules enable row level security;

create policy "Authenticated users can read modules"
  on public.modules for select
  to authenticated
  using (true);

-- steps (public read for authenticated users) ────────────────────────────────
alter table public.steps enable row level security;

create policy "Authenticated users can read steps"
  on public.steps for select
  to authenticated
  using (true);

-- user_step_progress ─────────────────────────────────────────────────────────
alter table public.user_step_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_step_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_step_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_step_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_step_progress for delete
  using (auth.uid() = user_id);

-- journal_entries ────────────────────────────────────────────────────────────
alter table public.journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- budget_items ───────────────────────────────────────────────────────────────
alter table public.budget_items enable row level security;

create policy "Users can view their own budget items"
  on public.budget_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budget items"
  on public.budget_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budget items"
  on public.budget_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own budget items"
  on public.budget_items for delete
  using (auth.uid() = user_id);

-- seasonal_tasks ─────────────────────────────────────────────────────────────
alter table public.seasonal_tasks enable row level security;

create policy "Users can view their own seasonal tasks"
  on public.seasonal_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own seasonal tasks"
  on public.seasonal_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own seasonal tasks"
  on public.seasonal_tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own seasonal tasks"
  on public.seasonal_tasks for delete
  using (auth.uid() = user_id);
