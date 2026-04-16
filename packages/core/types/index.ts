// ---------------------------------------------------------------------------
// Homestead Forge - Core Data Model
// ---------------------------------------------------------------------------

/** A registered user's profile and homestead metadata. */
export interface Profile {
  id: string;
  display_name: string;
  homestead_name: string;
  location_state: string;
  acreage: number;
  climate_zone: string;
  grid_status: 'on_grid' | 'off_grid' | 'hybrid';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** A high-level area of work (e.g. "Water Systems", "Garden Planning"). */
export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  color: string;
  estimated_hours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

/** A hyperlink resource attached to a Step. */
export interface ResourceLink {
  url: string;
  label: string;
}

/** A single actionable step within a Module. */
export interface Step {
  id: string;
  module_id: string;
  title: string;
  description: string;
  detailed_guide: string;
  tips: string[];
  estimated_cost_low: number;
  estimated_cost_high: number;
  estimated_time: string;
  display_order: number;
  depends_on: string[];
  tags: string[];
  season_relevance: string[];
  resources: {
    links?: ResourceLink[];
    books?: string[];
    videos?: string[];
  };
  created_at: string;
}

/** Possible statuses a user's step can be in. */
export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

/** Tracks an individual user's progress on a single step. */
export interface UserStepProgress {
  id: string;
  user_id: string;
  step_id: string;
  status: StepStatus;
  started_at: string | null;
  completed_at: string | null;
  notes: string;
  photos: string[];
  actual_cost: number | null;
  custom_data: Record<string, unknown>;
  updated_at: string;
}

/** Weather snapshot attached to a journal entry. */
export interface WeatherData {
  temp?: number;
  conditions?: string;
  wind?: string;
}

/** Mood scale for journal entries. */
export type Mood = 'great' | 'good' | 'neutral' | 'tough' | 'rough';

/** A user's journal entry, optionally scoped to a module. */
export interface JournalEntry {
  id: string;
  user_id: string;
  module_id: string | null;
  title: string;
  content: string;
  mood: Mood;
  weather: WeatherData;
  photos: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

/** Allowed budget categories. */
export type BudgetCategory = 'materials' | 'tools' | 'labor' | 'permits' | 'equipment';

/** A single line item in the user's budget tracker. */
export interface BudgetItem {
  id: string;
  user_id: string;
  module_id: string | null;
  step_id: string | null;
  description: string;
  amount: number;
  category: BudgetCategory;
  vendor: string;
  receipt_url: string | null;
  date: string;
  created_at: string;
}

/** A seasonal / recurring task. */
export interface SeasonalTask {
  id: string;
  user_id: string;
  module_id: string | null;
  title: string;
  description: string;
  month: number;
  recurring: boolean;
  completed_year: number | null;
  created_at: string;
}

/** Module enriched with progress counts. */
export type ModuleWithProgress = Module & {
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
};

/** Data collected during user onboarding. */
export interface OnboardingData {
  homestead_name: string;
  location_state: string;
  acreage: number;
  grid_status: string;
  priority_modules: string[];
}

/** Theme preference. */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** Global application settings persisted per-user. */
export interface AppSettings {
  theme: ThemeMode;
  notifications: boolean;
  units: 'imperial' | 'metric';
}

// ---------------------------------------------------------------------------
// Derived / summary types used by hooks and stores
// ---------------------------------------------------------------------------

export interface BudgetSummary {
  total: number;
  byModule: Record<string, number>;
  byCategory: Record<BudgetCategory, number>;
}

export interface BudgetComparison {
  moduleId: string;
  moduleTitle: string;
  estimatedLow: number;
  estimatedHigh: number;
  actual: number;
  difference: number;
}

export interface SearchResults {
  modules: Module[];
  steps: Step[];
  journalEntries: JournalEntry[];
  budgetItems: BudgetItem[];
}

/** Represents a queued mutation that should be synced when back online. */
export interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  created_at: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'error';
