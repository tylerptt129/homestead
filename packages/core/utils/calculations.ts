// ---------------------------------------------------------------------------
// Homestead Forge - Calculation Helpers
// ---------------------------------------------------------------------------

import type {
  BudgetCategory,
  BudgetItem,
  BudgetSummary,
  Module,
  Step,
  UserStepProgress,
} from '../types';
import { BUDGET_CATEGORIES } from './constants';

// ---- Module progress ------------------------------------------------------

/**
 * Calculate progress for a single module given its steps and user progress.
 */
export function calculateModuleProgress(
  steps: Step[],
  progressMap: Map<string, UserStepProgress>,
): { completedSteps: number; totalSteps: number; progressPercent: number } {
  const totalSteps = steps.length;
  if (totalSteps === 0) {
    return { completedSteps: 0, totalSteps: 0, progressPercent: 0 };
  }
  let completedSteps = 0;
  for (const step of steps) {
    const p = progressMap.get(step.id);
    if (p && (p.status === 'completed' || p.status === 'skipped')) {
      completedSteps++;
    }
  }
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  return { completedSteps, totalSteps, progressPercent };
}

// ---- Overall progress -----------------------------------------------------

/**
 * Calculate overall progress across all modules.
 */
export function calculateOverallProgress(
  modules: Array<{ completedSteps: number; totalSteps: number }>,
): { completedSteps: number; totalSteps: number; progressPercent: number } {
  let completedSteps = 0;
  let totalSteps = 0;
  for (const m of modules) {
    completedSteps += m.completedSteps;
    totalSteps += m.totalSteps;
  }
  const progressPercent =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  return { completedSteps, totalSteps, progressPercent };
}

// ---- Budget summary -------------------------------------------------------

/**
 * Compute aggregate budget summary from a list of budget items.
 */
export function calculateBudgetSummary(items: BudgetItem[]): BudgetSummary {
  let total = 0;
  const byModule: Record<string, number> = {};
  const byCategory = {} as Record<BudgetCategory, number>;

  // Initialise each category to zero
  for (const cat of BUDGET_CATEGORIES) {
    byCategory[cat] = 0;
  }

  for (const item of items) {
    total += item.amount;
    byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount;
    if (item.module_id) {
      byModule[item.module_id] = (byModule[item.module_id] ?? 0) + item.amount;
    }
  }

  return {
    total: roundCents(total),
    byModule: Object.fromEntries(
      Object.entries(byModule).map(([k, v]) => [k, roundCents(v)]),
    ),
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, roundCents(v)]),
    ) as Record<BudgetCategory, number>,
  };
}

// ---- Budget vs estimate comparison ----------------------------------------

export interface ModuleBudgetComparison {
  moduleId: string;
  moduleTitle: string;
  estimatedLow: number;
  estimatedHigh: number;
  actual: number;
  difference: number;
}

/**
 * Compare actual spend per module against estimated step costs.
 */
export function calculateModuleBudgetComparison(
  modules: Module[],
  stepsPerModule: Record<string, Step[]>,
  budgetItems: BudgetItem[],
): ModuleBudgetComparison[] {
  const actualByModule: Record<string, number> = {};
  for (const item of budgetItems) {
    if (item.module_id) {
      actualByModule[item.module_id] =
        (actualByModule[item.module_id] ?? 0) + item.amount;
    }
  }

  return modules.map((mod) => {
    const steps = stepsPerModule[mod.id] ?? [];
    let estimatedLow = 0;
    let estimatedHigh = 0;
    for (const s of steps) {
      estimatedLow += s.estimated_cost_low;
      estimatedHigh += s.estimated_cost_high;
    }
    const actual = roundCents(actualByModule[mod.id] ?? 0);
    const midEstimate = roundCents((estimatedLow + estimatedHigh) / 2);
    return {
      moduleId: mod.id,
      moduleTitle: mod.title,
      estimatedLow: roundCents(estimatedLow),
      estimatedHigh: roundCents(estimatedHigh),
      actual,
      difference: roundCents(actual - midEstimate),
    };
  });
}

// ---- Formatting -----------------------------------------------------------

/**
 * Format a number as USD currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string to a human-readable date.
 */
export function formatDate(
  isoDate: string,
  style: 'short' | 'medium' | 'long' = 'medium',
): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { month: 'numeric', day: 'numeric', year: '2-digit' }
      : style === 'long'
        ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// ---- Season helpers -------------------------------------------------------

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

/**
 * Return the Northern-hemisphere season for a 1-based month number.
 */
export function getSeasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

// ---- Climate zone lookup --------------------------------------------------

/**
 * Simple US-state-to-USDA-hardiness-zone mapping (median zone per state).
 * In production this would come from a geolocation API, but for offline use
 * we ship a static lookup.
 */
const STATE_ZONE_MAP: Record<string, string> = {
  AL: '8', AK: '4', AZ: '9', AR: '7', CA: '9', CO: '5', CT: '6',
  DE: '7', FL: '10', GA: '8', HI: '11', ID: '6', IL: '5', IN: '6',
  IA: '5', KS: '6', KY: '6', LA: '9', ME: '5', MD: '7', MA: '6',
  MI: '5', MN: '4', MS: '8', MO: '6', MT: '4', NE: '5', NV: '7',
  NH: '5', NJ: '7', NM: '7', NY: '6', NC: '7', ND: '4', OH: '6',
  OK: '7', OR: '8', PA: '6', RI: '6', SC: '8', SD: '4', TN: '7',
  TX: '8', UT: '6', VT: '4', VA: '7', WA: '8', WV: '6', WI: '4',
  WY: '4',
};

/**
 * Return a USDA hardiness zone string (e.g. "7") for a given US state
 * abbreviation. Returns "6" as fallback.
 */
export function getClimateZoneFromState(stateAbbreviation: string): string {
  return STATE_ZONE_MAP[stateAbbreviation.toUpperCase()] ?? '6';
}

// ---- Internal helpers -----------------------------------------------------

function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}
