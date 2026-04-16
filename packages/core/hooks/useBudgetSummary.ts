// ---------------------------------------------------------------------------
// Homestead Forge - Budget Summary Hook
// ---------------------------------------------------------------------------
//
// Returns computed budget summaries: total spent, breakdown by module and
// category, and budget-vs-estimate comparisons.
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import type {
  BudgetCategory,
  BudgetComparison,
  BudgetItem,
  BudgetSummary,
  Module,
  Step,
} from '../types';
import { useBudgetStore } from '../stores/budgetStore';
import {
  calculateBudgetSummary,
  calculateModuleBudgetComparison,
  formatCurrency,
} from '../utils/calculations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CategoryBreakdown {
  category: BudgetCategory;
  amount: number;
  formatted: string;
  percentage: number;
}

export interface ModuleBreakdown {
  moduleId: string;
  amount: number;
  formatted: string;
  percentage: number;
}

export interface UseBudgetSummaryReturn {
  /** Raw budget items. */
  items: BudgetItem[];
  /** Aggregate summary (total, byModule, byCategory). */
  summary: BudgetSummary;
  /** Total spent as a formatted currency string. */
  totalFormatted: string;
  /** Per-category breakdown with percentages. */
  categoryBreakdown: CategoryBreakdown[];
  /** Per-module breakdown with percentages. */
  moduleBreakdown: ModuleBreakdown[];
  /** Budget vs estimate comparison per module (requires modules & steps). */
  comparisons: BudgetComparison[];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBudgetSummary(
  modules?: Module[],
  stepsPerModule?: Record<string, Step[]>,
): UseBudgetSummaryReturn {
  const items = useBudgetStore((s) => s.items);

  const summary = useMemo(() => calculateBudgetSummary(items), [items]);

  const totalFormatted = useMemo(() => formatCurrency(summary.total), [summary.total]);

  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const cats = Object.entries(summary.byCategory) as [BudgetCategory, number][];
    return cats.map(([category, amount]) => ({
      category,
      amount,
      formatted: formatCurrency(amount),
      percentage: summary.total > 0 ? Math.round((amount / summary.total) * 100) : 0,
    }));
  }, [summary]);

  const moduleBreakdown: ModuleBreakdown[] = useMemo(() => {
    return Object.entries(summary.byModule).map(([moduleId, amount]) => ({
      moduleId,
      amount,
      formatted: formatCurrency(amount),
      percentage: summary.total > 0 ? Math.round((amount / summary.total) * 100) : 0,
    }));
  }, [summary]);

  const comparisons: BudgetComparison[] = useMemo(() => {
    if (!modules || !stepsPerModule) return [];
    return calculateModuleBudgetComparison(modules, stepsPerModule, items);
  }, [modules, stepsPerModule, items]);

  return {
    items,
    summary,
    totalFormatted,
    categoryBreakdown,
    moduleBreakdown,
    comparisons,
  };
}
