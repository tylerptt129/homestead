import { create } from 'zustand';
import type { Step, StepStatus, UserStepProgress } from '../types';

const STORAGE_KEY = 'homestead_progress';

interface ProgressState {
  progress: Record<string, UserStepProgress>; // keyed by stepId
  isLoading: boolean;

  setProgress: (stepId: string, progress: UserStepProgress) => void;
  updateStepStatus: (stepId: string, status: StepStatus) => void;
  updateStepNotes: (stepId: string, notes: string) => void;
  updateStepCost: (stepId: string, cost: number) => void;
  getProgressForStep: (stepId: string) => UserStepProgress | undefined;
  getProgressForModule: (
    moduleId: string,
    steps: Step[]
  ) => { completed: number; total: number; percentage: number };
  getOverallProgress: (
    allSteps: Step[]
  ) => { completed: number; total: number; percentage: number };
  loadFromStorage: () => void;
  hydrateProgress: (progress: Record<string, UserStepProgress>) => void;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createDefaultProgress(stepId: string): UserStepProgress {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    userId: '',
    stepId,
    status: 'not_started',
    startedAt: '',
    completedAt: '',
    notes: '',
    photos: [],
    actualCost: 0,
    customData: {},
    updatedAt: now,
  };
}

function persistProgress(progress: Record<string, UserStepProgress>): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage full or unavailable - silently fail
    }
  }
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  progress: {},
  isLoading: false,

  setProgress: (stepId: string, progress: UserStepProgress) =>
    set((state) => {
      const newProgress = { ...state.progress, [stepId]: progress };
      persistProgress(newProgress);
      return { progress: newProgress };
    }),

  updateStepStatus: (stepId: string, status: StepStatus) =>
    set((state) => {
      const now = new Date().toISOString();
      const existing = state.progress[stepId] || createDefaultProgress(stepId);
      const updated: UserStepProgress = {
        ...existing,
        status,
        updatedAt: now,
        ...(status === 'completed' ? { completedAt: now } : {}),
        ...(status === 'in_progress' && !existing.startedAt
          ? { startedAt: now }
          : {}),
      };

      const newProgress = { ...state.progress, [stepId]: updated };
      persistProgress(newProgress);
      return { progress: newProgress };
    }),

  updateStepNotes: (stepId: string, notes: string) =>
    set((state) => {
      const existing = state.progress[stepId] || createDefaultProgress(stepId);
      const updated: UserStepProgress = {
        ...existing,
        notes,
        updatedAt: new Date().toISOString(),
      };

      const newProgress = { ...state.progress, [stepId]: updated };
      persistProgress(newProgress);
      return { progress: newProgress };
    }),

  updateStepCost: (stepId: string, cost: number) =>
    set((state) => {
      const existing = state.progress[stepId] || createDefaultProgress(stepId);
      const updated: UserStepProgress = {
        ...existing,
        actualCost: cost,
        updatedAt: new Date().toISOString(),
      };

      const newProgress = { ...state.progress, [stepId]: updated };
      persistProgress(newProgress);
      return { progress: newProgress };
    }),

  getProgressForStep: (stepId: string) => {
    return get().progress[stepId];
  },

  getProgressForModule: (moduleId: string, steps: Step[]) => {
    const { progress } = get();
    const moduleSteps = steps.filter((s) => s.moduleId === moduleId);
    const total = moduleSteps.length;
    const completed = moduleSteps.filter(
      (s) => progress[s.id]?.status === 'completed'
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  },

  getOverallProgress: (allSteps: Step[]) => {
    const { progress } = get();
    const total = allSteps.length;
    const completed = allSteps.filter(
      (s) => progress[s.id]?.status === 'completed'
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          set({ progress: JSON.parse(stored) });
        }
      } catch {
        // Corrupted data - start fresh
      }
    }
  },

  hydrateProgress: (progress: Record<string, UserStepProgress>) => {
    set({ progress });
    persistProgress(progress);
  },
}));
