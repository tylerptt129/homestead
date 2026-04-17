import { create } from 'zustand';
import type { Module, Step } from '../types';

interface ModuleState {
  modules: Module[];
  steps: Record<string, Step[]>; // keyed by module slug
  isLoading: boolean;
  error: string | null;

  setModules: (modules: Module[]) => void;
  setSteps: (moduleSlug: string, steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getModuleBySlug: (slug: string) => Module | undefined;
  getStepsForModule: (slug: string) => Step[];
}

export const useModuleStore = create<ModuleState>()((set, get) => ({
  modules: [],
  steps: {},
  isLoading: false,
  error: null,

  setModules: (modules: Module[]) => set({ modules }),

  setSteps: (moduleSlug: string, steps: Step[]) =>
    set((state) => ({
      steps: { ...state.steps, [moduleSlug]: steps },
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  getModuleBySlug: (slug: string) => {
    return get().modules.find((m) => m.slug === slug);
  },

  getStepsForModule: (slug: string) => {
    return get().steps[slug] ?? [];
  },
}));
