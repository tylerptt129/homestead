// ---------------------------------------------------------------------------
// Homestead Forge - Budget Store
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type {
  BudgetCategory,
  BudgetItem,
  BudgetSummary,
  BudgetComparison,
  Module,
  Step,
} from '../types';
import {
  calculateBudgetSummary,
  calculateModuleBudgetComparison,
} from '../utils/calculations';

/**
 * Placeholder Supabase client.
 */
const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: string) => ({
        order: (_col2: string, _opts?: { ascending: boolean }) =>
          Promise.resolve({ data: [] as unknown[], error: null as unknown }),
      }),
      order: (_col2: string, _opts?: { ascending: boolean }) =>
        Promise.resolve({ data: [] as unknown[], error: null as unknown }),
    }),
    insert: (_row: unknown) => ({
      select: (_cols?: string) => ({
        single: () =>
          Promise.resolve({ data: null as unknown, error: null as unknown }),
      }),
    }),
    update: (_row: unknown) => ({
      eq: (_col: string, _val: string) => ({
        select: (_cols?: string) => ({
          single: () =>
            Promise.resolve({ data: null as unknown, error: null as unknown }),
        }),
      }),
    }),
    delete: () => ({
      eq: (_col: string, _val: string) =>
        Promise.resolve({ data: null as unknown, error: null as unknown }),
    }),
  }),
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetState {
  /** All budget items for the current user. */
  items: BudgetItem[];
  /** Computed summary (total, byModule, byCategory). */
  summary: BudgetSummary;
  /** True while any async op is in progress. */
  isLoading: boolean;
  /** Last error. */
  error: string | null;
}

interface AddItemInput {
  userId: string;
  moduleId?: string | null;
  stepId?: string | null;
  description: string;
  amount: number;
  category: BudgetCategory;
  vendor?: string;
  receiptUrl?: string | null;
  date: string;
}

interface UpdateItemInput {
  description?: string;
  amount?: number;
  category?: BudgetCategory;
  vendor?: string;
  receiptUrl?: string | null;
  date?: string;
  moduleId?: string | null;
  stepId?: string | null;
}

interface BudgetActions {
  /** Fetch all budget items for a user. */
  fetchItems: (userId: string) => Promise<void>;
  /** Add a new budget item. */
  addItem: (input: AddItemInput) => Promise<BudgetItem | null>;
  /** Update an existing budget item. */
  updateItem: (itemId: string, input: UpdateItemInput) => Promise<void>;
  /** Delete a budget item. */
  deleteItem: (itemId: string) => Promise<void>;
  /** Recompute and return the budget summary from current items. */
  getSummary: () => BudgetSummary;
  /** Get budget vs estimate comparison per module. */
  getModuleBudgetComparison: (
    modules: Module[],
    stepsPerModule: Record<string, Step[]>,
  ) => BudgetComparison[];
  /** Clear the error. */
  clearError: () => void;
}

export type BudgetStore = BudgetState & BudgetActions;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

const EMPTY_SUMMARY: BudgetSummary = {
  total: 0,
  byModule: {},
  byCategory: {
    materials: 0,
    tools: 0,
    labor: 0,
    permits: 0,
    equipment: 0,
  },
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useBudgetStore = create<BudgetStore>()((set, get) => ({
  // -- State -----------------------------------------------------------------
  items: [],
  summary: { ...EMPTY_SUMMARY },
  isLoading: false,
  error: null,

  // -- Actions ---------------------------------------------------------------

  fetchItems: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select()
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;

      const items = (data ?? []) as BudgetItem[];
      const summary = calculateBudgetSummary(items);
      set({ items, summary, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch budget items.';
      set({ isLoading: false, error: message });
    }
  },

  addItem: async (input: AddItemInput) => {
    set({ isLoading: true, error: null });
    try {
      const newItem: BudgetItem = {
        id: generateId(),
        user_id: input.userId,
        module_id: input.moduleId ?? null,
        step_id: input.stepId ?? null,
        description: input.description,
        amount: input.amount,
        category: input.category,
        vendor: input.vendor ?? '',
        receipt_url: input.receiptUrl ?? null,
        date: input.date,
        created_at: nowISO(),
      };

      const { data, error } = await supabase
        .from('budget_items')
        .insert(newItem)
        .select()
        .single();
      if (error) throw error;

      const saved = (data as BudgetItem) ?? newItem;
      const items = [saved, ...get().items];
      const summary = calculateBudgetSummary(items);
      set({ items, summary, isLoading: false });
      return saved;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add budget item.';
      set({ isLoading: false, error: message });
      return null;
    }
  },

  updateItem: async (itemId: string, input: UpdateItemInput) => {
    set({ isLoading: true, error: null });
    try {
      const dbRow: Record<string, unknown> = {};
      if (input.description !== undefined) dbRow.description = input.description;
      if (input.amount !== undefined) dbRow.amount = input.amount;
      if (input.category !== undefined) dbRow.category = input.category;
      if (input.vendor !== undefined) dbRow.vendor = input.vendor;
      if (input.receiptUrl !== undefined) dbRow.receipt_url = input.receiptUrl;
      if (input.date !== undefined) dbRow.date = input.date;
      if (input.moduleId !== undefined) dbRow.module_id = input.moduleId;
      if (input.stepId !== undefined) dbRow.step_id = input.stepId;

      const { data, error } = await supabase
        .from('budget_items')
        .update(dbRow)
        .eq('id', itemId)
        .select()
        .single();
      if (error) throw error;

      const updatedItem = data as BudgetItem | null;
      const items = get().items.map((item) => {
        if (item.id !== itemId) return item;
        if (updatedItem) return updatedItem;
        // Fallback: merge locally
        return {
          ...item,
          ...(input.description !== undefined && { description: input.description }),
          ...(input.amount !== undefined && { amount: input.amount }),
          ...(input.category !== undefined && { category: input.category }),
          ...(input.vendor !== undefined && { vendor: input.vendor }),
          ...(input.receiptUrl !== undefined && { receipt_url: input.receiptUrl }),
          ...(input.date !== undefined && { date: input.date }),
          ...(input.moduleId !== undefined && { module_id: input.moduleId }),
          ...(input.stepId !== undefined && { step_id: input.stepId }),
        };
      });
      const summary = calculateBudgetSummary(items);
      set({ items, summary, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update budget item.';
      set({ isLoading: false, error: message });
    }
  },

  deleteItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;

      const items = get().items.filter((i) => i.id !== itemId);
      const summary = calculateBudgetSummary(items);
      set({ items, summary, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete budget item.';
      set({ isLoading: false, error: message });
    }
  },

  getSummary: () => {
    const { items } = get();
    return calculateBudgetSummary(items);
  },

  getModuleBudgetComparison: (
    modules: Module[],
    stepsPerModule: Record<string, Step[]>,
  ) => {
    const { items } = get();
    return calculateModuleBudgetComparison(modules, stepsPerModule, items);
  },

  clearError: () => set({ error: null }),
}));
