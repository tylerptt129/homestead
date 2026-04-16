// ---------------------------------------------------------------------------
// Homestead Forge - Progress Store
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type { StepStatus, UserStepProgress } from '../types';

/**
 * Placeholder Supabase client (same pattern as authStore).
 */
const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: string) =>
        Promise.resolve({ data: [] as unknown[], error: null as unknown }),
    }),
    upsert: (_row: unknown) =>
      Promise.resolve({ data: null as unknown, error: null as unknown }),
    update: (_row: unknown) => ({
      eq: (_col: string, _val: string) =>
        Promise.resolve({ data: null as unknown, error: null as unknown }),
    }),
    insert: (_row: unknown) =>
      Promise.resolve({ data: null as unknown, error: null as unknown }),
  }),
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProgressState {
  /** Map of stepId -> UserStepProgress for quick lookups. */
  stepProgress: Map<string, UserStepProgress>;
  /** True while fetching or saving. */
  isLoading: boolean;
  /** Last error message. */
  error: string | null;
}

interface ProgressActions {
  /** Load all progress records for a given user. */
  fetchProgressForUser: (userId: string) => Promise<void>;
  /** Update the status of a step (creates or upserts the record). */
  updateStepStatus: (
    userId: string,
    stepId: string,
    status: StepStatus,
  ) => Promise<void>;
  /** Save notes on a specific step progress record. */
  saveNotes: (userId: string, stepId: string, notes: string) => Promise<void>;
  /** Add a photo URL to a step progress record. */
  addPhoto: (userId: string, stepId: string, photoUrl: string) => Promise<void>;
  /** Log actual cost for a step. */
  logCost: (userId: string, stepId: string, cost: number) => Promise<void>;
  /** Return progress entries for steps belonging to a given module. */
  getProgressForModule: (stepIds: string[]) => UserStepProgress[];
  /** Compute overall progress stats across all tracked steps. */
  getOverallProgress: () => {
    total: number;
    completed: number;
    inProgress: number;
    skipped: number;
    notStarted: number;
    percent: number;
  };
  /** Clear the error. */
  clearError: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nowISO(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function blankProgress(userId: string, stepId: string): UserStepProgress {
  return {
    id: generateId(),
    user_id: userId,
    step_id: stepId,
    status: 'not_started',
    started_at: null,
    completed_at: null,
    notes: '',
    photos: [],
    actual_cost: null,
    custom_data: {},
    updated_at: nowISO(),
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProgressStore = create<ProgressStore>()((set, get) => ({
  // -- State -----------------------------------------------------------------
  stepProgress: new Map(),
  isLoading: false,
  error: null,

  // -- Actions ---------------------------------------------------------------

  fetchProgressForUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_step_progress')
        .select()
        .eq('user_id', userId);
      if (error) throw error;

      const records = (data ?? []) as UserStepProgress[];
      const map = new Map<string, UserStepProgress>();
      for (const r of records) {
        map.set(r.step_id, r);
      }
      set({ stepProgress: map, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load progress.';
      set({ isLoading: false, error: message });
    }
  },

  updateStepStatus: async (userId: string, stepId: string, status: StepStatus) => {
    const { stepProgress } = get();
    const existing = stepProgress.get(stepId) ?? blankProgress(userId, stepId);

    const now = nowISO();
    const updated: UserStepProgress = {
      ...existing,
      status,
      started_at:
        status === 'in_progress' && !existing.started_at ? now : existing.started_at,
      completed_at: status === 'completed' ? now : existing.completed_at,
      updated_at: now,
    };

    // Optimistic update
    const next = new Map(stepProgress);
    next.set(stepId, updated);
    set({ stepProgress: next });

    try {
      const { error } = await supabase.from('user_step_progress').upsert({
        id: updated.id,
        user_id: userId,
        step_id: stepId,
        status: updated.status,
        started_at: updated.started_at,
        completed_at: updated.completed_at,
        notes: updated.notes,
        photos: updated.photos,
        actual_cost: updated.actual_cost,
        custom_data: updated.custom_data,
        updated_at: updated.updated_at,
      });
      if (error) throw error;
    } catch (err: unknown) {
      // Revert optimistic update
      const reverted = new Map(get().stepProgress);
      if (existing.status === 'not_started' && !stepProgress.has(stepId)) {
        reverted.delete(stepId);
      } else {
        reverted.set(stepId, existing);
      }
      set({
        stepProgress: reverted,
        error: err instanceof Error ? err.message : 'Failed to update step status.',
      });
    }
  },

  saveNotes: async (userId: string, stepId: string, notes: string) => {
    const { stepProgress } = get();
    const existing = stepProgress.get(stepId) ?? blankProgress(userId, stepId);
    const updated: UserStepProgress = {
      ...existing,
      notes,
      updated_at: nowISO(),
    };

    const next = new Map(stepProgress);
    next.set(stepId, updated);
    set({ stepProgress: next });

    try {
      const { error } = await supabase.from('user_step_progress').upsert({
        id: updated.id,
        user_id: userId,
        step_id: stepId,
        notes: updated.notes,
        updated_at: updated.updated_at,
      });
      if (error) throw error;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to save notes.',
      });
    }
  },

  addPhoto: async (userId: string, stepId: string, photoUrl: string) => {
    const { stepProgress } = get();
    const existing = stepProgress.get(stepId) ?? blankProgress(userId, stepId);
    const updated: UserStepProgress = {
      ...existing,
      photos: [...existing.photos, photoUrl],
      updated_at: nowISO(),
    };

    const next = new Map(stepProgress);
    next.set(stepId, updated);
    set({ stepProgress: next });

    try {
      const { error } = await supabase.from('user_step_progress').upsert({
        id: updated.id,
        user_id: userId,
        step_id: stepId,
        photos: updated.photos,
        updated_at: updated.updated_at,
      });
      if (error) throw error;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to add photo.',
      });
    }
  },

  logCost: async (userId: string, stepId: string, cost: number) => {
    const { stepProgress } = get();
    const existing = stepProgress.get(stepId) ?? blankProgress(userId, stepId);
    const updated: UserStepProgress = {
      ...existing,
      actual_cost: cost,
      updated_at: nowISO(),
    };

    const next = new Map(stepProgress);
    next.set(stepId, updated);
    set({ stepProgress: next });

    try {
      const { error } = await supabase.from('user_step_progress').upsert({
        id: updated.id,
        user_id: userId,
        step_id: stepId,
        actual_cost: updated.actual_cost,
        updated_at: updated.updated_at,
      });
      if (error) throw error;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to log cost.',
      });
    }
  },

  getProgressForModule: (stepIds: string[]) => {
    const { stepProgress } = get();
    const results: UserStepProgress[] = [];
    for (const id of stepIds) {
      const p = stepProgress.get(id);
      if (p) results.push(p);
    }
    return results;
  },

  getOverallProgress: () => {
    const { stepProgress } = get();
    let completed = 0;
    let inProgress = 0;
    let skipped = 0;
    let notStarted = 0;

    for (const [, p] of stepProgress) {
      switch (p.status) {
        case 'completed':
          completed++;
          break;
        case 'in_progress':
          inProgress++;
          break;
        case 'skipped':
          skipped++;
          break;
        case 'not_started':
          notStarted++;
          break;
      }
    }

    const total = stepProgress.size;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, inProgress, skipped, notStarted, percent };
  },

  clearError: () => set({ error: null }),
}));
