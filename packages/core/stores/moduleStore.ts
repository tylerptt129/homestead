// ---------------------------------------------------------------------------
// Homestead Forge - Module Store
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type { Module, ModuleWithProgress, Step, UserStepProgress } from '../types';
import { calculateModuleProgress } from '../utils/calculations';

/**
 * Placeholder for the real Supabase client.
 * In production this is injected via a provider; here we define the shape so
 * store logic compiles and can be tested with mocks.
 */
const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      order: (_col: string, _opts?: { ascending: boolean }) =>
        ({
          eq: (_col2: string, _val: string) =>
            Promise.resolve({ data: [] as unknown[], error: null as unknown }),
          then: (resolve: (v: { data: unknown[]; error: unknown }) => void) =>
            resolve({ data: [], error: null }),
        }) as unknown as PromiseLike<{ data: unknown[]; error: unknown }> & {
          eq: (col: string, val: string) => Promise<{ data: unknown[]; error: unknown }>;
        },
      eq: (_col2: string, _val: string) => ({
        single: () =>
          Promise.resolve({ data: null as unknown, error: null as unknown }),
        order: (_col3: string, _opts2?: { ascending: boolean }) =>
          Promise.resolve({ data: [] as unknown[], error: null as unknown }),
      }),
    }),
  }),
};

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

interface ModuleState {
  /** All modules enriched with progress data. */
  modules: ModuleWithProgress[];
  /** Currently selected module detail (may include steps). */
  currentModule: Module | null;
  /** Steps for the currently selected module. */
  currentSteps: Step[];
  /** Currently selected step detail. */
  currentStep: Step | null;
  /** True while any fetch is in flight. */
  isLoading: boolean;
  /** Last error message. */
  error: string | null;
}

interface ModuleActions {
  /** Fetch all modules and compute per-module progress. */
  fetchModules: (
    userId: string,
    progressMap: Map<string, UserStepProgress>,
  ) => Promise<void>;
  /** Fetch a single module by its slug, including its steps. */
  fetchModuleBySlug: (slug: string) => Promise<void>;
  /** Fetch all steps for a given module id. */
  fetchStepsByModule: (moduleId: string) => Promise<Step[]>;
  /** Recompute progress for already-loaded modules (call after step updates). */
  computeProgress: (
    progressMap: Map<string, UserStepProgress>,
    stepsPerModule: Record<string, Step[]>,
  ) => void;
  /** Set the current step. */
  setCurrentStep: (step: Step | null) => void;
  /** Clear the error. */
  clearError: () => void;
}

export type ModuleStore = ModuleState & ModuleActions;

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useModuleStore = create<ModuleStore>()((set, get) => ({
  // -- State -----------------------------------------------------------------
  modules: [],
  currentModule: null,
  currentSteps: [],
  currentStep: null,
  isLoading: false,
  error: null,

  // -- Actions ---------------------------------------------------------------

  fetchModules: async (
    userId: string,
    progressMap: Map<string, UserStepProgress>,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const { data: rawModules, error: modError } = await (supabase
        .from('modules')
        .select()
        .order('display_order', { ascending: true }) as unknown as Promise<{
        data: Module[] | null;
        error: { message: string } | null;
      }>);
      if (modError) throw new Error(modError.message);

      const modules = rawModules ?? [];

      // For each module, fetch its steps so we can compute progress
      const enriched: ModuleWithProgress[] = await Promise.all(
        modules.map(async (mod) => {
          const steps = await get().fetchStepsByModule(mod.id);
          const progress = calculateModuleProgress(steps, progressMap);
          return { ...mod, ...progress };
        }),
      );

      set({ modules: enriched, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch modules.';
      set({ isLoading: false, error: message });
    }
  },

  fetchModuleBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('modules')
        .select()
        .eq('slug', slug)
        .single();
      if (error) throw error;

      const mod = data as Module;
      set({ currentModule: mod });

      // Also fetch steps for this module
      const steps = await get().fetchStepsByModule(mod.id);
      set({ currentSteps: steps, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch module.';
      set({ isLoading: false, error: message });
    }
  },

  fetchStepsByModule: async (moduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('steps')
        .select()
        .eq('module_id', moduleId)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Step[];
    } catch {
      return [];
    }
  },

  computeProgress: (
    progressMap: Map<string, UserStepProgress>,
    stepsPerModule: Record<string, Step[]>,
  ) => {
    const { modules } = get();
    const updated = modules.map((mod) => {
      const steps = stepsPerModule[mod.id] ?? [];
      const progress = calculateModuleProgress(steps, progressMap);
      return { ...mod, ...progress };
    });
    set({ modules: updated });
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  clearError: () => set({ error: null }),
}));
