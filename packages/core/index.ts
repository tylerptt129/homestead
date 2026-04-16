// ---------------------------------------------------------------------------
// Homestead Forge - Core Package Index
// ---------------------------------------------------------------------------
//
// Re-exports every type, store, hook, and utility from the @homestead/core
// package so consumers can import from a single entry point:
//
//   import { useAuthStore, Profile, formatCurrency } from '@homestead/core';
//
// ---------------------------------------------------------------------------

// ---- Types ----------------------------------------------------------------
export type {
  Profile,
  Module,
  ResourceLink,
  Step,
  StepStatus,
  UserStepProgress,
  WeatherData,
  Mood,
  JournalEntry,
  BudgetCategory,
  BudgetItem,
  SeasonalTask,
  ModuleWithProgress,
  OnboardingData,
  ThemeMode,
  AppSettings,
  BudgetSummary,
  BudgetComparison,
  SearchResults,
  SyncQueueItem,
  SyncStatus,
} from './types';

// ---- Stores ---------------------------------------------------------------
export { useAuthStore } from './stores/authStore';
export type { AuthSession, AuthStore } from './stores/authStore';

export { useModuleStore } from './stores/moduleStore';
export type { ModuleStore } from './stores/moduleStore';

export { useProgressStore } from './stores/progressStore';
export type { ProgressStore } from './stores/progressStore';

export { useJournalStore } from './stores/journalStore';
export type { JournalStore } from './stores/journalStore';

export { useBudgetStore } from './stores/budgetStore';
export type { BudgetStore } from './stores/budgetStore';

export { useAppStore } from './stores/appStore';
export type { AppStore } from './stores/appStore';

// ---- Hooks ----------------------------------------------------------------
export { useAutosave } from './hooks/useAutosave';
export type { UseAutosaveOptions, UseAutosaveReturn } from './hooks/useAutosave';

export { useModuleProgress } from './hooks/useModuleProgress';
export type {
  StepWithLock,
  UseModuleProgressReturn,
} from './hooks/useModuleProgress';

export { useOfflineSync } from './hooks/useOfflineSync';
export type { UseOfflineSyncReturn } from './hooks/useOfflineSync';

export { useSeasonalTasks } from './hooks/useSeasonalTasks';
export type { UseSeasonalTasksReturn } from './hooks/useSeasonalTasks';

export { useBudgetSummary } from './hooks/useBudgetSummary';
export type {
  CategoryBreakdown,
  ModuleBreakdown,
  UseBudgetSummaryReturn,
} from './hooks/useBudgetSummary';

export { useSearch } from './hooks/useSearch';
export type { UseSearchReturn } from './hooks/useSearch';

// ---- Utils: calculations --------------------------------------------------
export {
  calculateModuleProgress,
  calculateOverallProgress,
  calculateBudgetSummary,
  calculateModuleBudgetComparison,
  formatCurrency,
  formatDate,
  getSeasonForMonth,
  getClimateZoneFromState,
} from './utils/calculations';
export type { ModuleBudgetComparison, Season } from './utils/calculations';

// ---- Utils: validators ----------------------------------------------------
export {
  validateEmail,
  validateHomesteadName,
  validateAcreage,
  validateBudgetAmount,
  validateRequired,
  validateAll,
} from './utils/validators';
export type { ValidationResult } from './utils/validators';

// ---- Utils: constants -----------------------------------------------------
export {
  US_STATES,
  CLIMATE_ZONES,
  MONTHS,
  MODULE_SLUGS,
  STEP_STATUSES,
  MOOD_OPTIONS,
  BUDGET_CATEGORIES,
  THEME_MODES,
  AUTOSAVE_DEBOUNCE_MS,
  MAX_PHOTOS_PER_ENTRY,
  MAX_NOTE_LENGTH,
  DEFAULT_APP_SETTINGS,
} from './utils/constants';
export type { USState, ClimateZone, MoodOption, ModuleSlug } from './utils/constants';
