// ---------------------------------------------------------------------------
// Homestead Forge - Module Progress Hook
// ---------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import type { Step, StepStatus, UserStepProgress } from '../types';
import { useModuleStore } from '../stores/moduleStore';
import { useProgressStore } from '../stores/progressStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepWithLock extends Step {
  /** Whether this step is blocked by incomplete dependencies. */
  isLocked: boolean;
  /** IDs of steps that must be completed before this one. */
  blockedBy: string[];
  /** The user's progress record for this step (if any). */
  progress: UserStepProgress | null;
}

export interface UseModuleProgressReturn {
  /** Steps enriched with lock status and progress. */
  steps: StepWithLock[];
  /** Number of completed (or skipped) steps. */
  completedCount: number;
  /** Total number of steps in the module. */
  totalCount: number;
  /** 0-100 progress percentage. */
  progressPercent: number;
  /** The next step the user should work on (first non-completed, non-locked step). */
  nextStep: StepWithLock | null;
  /** Convenience function to update a step's status. */
  updateStep: (stepId: string, status: StepStatus) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useModuleProgress(
  moduleId: string,
  userId: string,
): UseModuleProgressReturn {
  const currentSteps = useModuleStore((s) => s.currentSteps);
  const stepProgress = useProgressStore((s) => s.stepProgress);
  const updateStepStatus = useProgressStore((s) => s.updateStepStatus);

  // Filter to only steps belonging to this module.
  const moduleSteps = useMemo(
    () =>
      currentSteps
        .filter((s) => s.module_id === moduleId)
        .sort((a, b) => a.display_order - b.display_order),
    [currentSteps, moduleId],
  );

  // Build a set of completed step IDs for fast dependency checking.
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const step of moduleSteps) {
      const p = stepProgress.get(step.id);
      if (p && (p.status === 'completed' || p.status === 'skipped')) {
        ids.add(step.id);
      }
    }
    return ids;
  }, [moduleSteps, stepProgress]);

  // Enrich each step with lock info and progress.
  const steps: StepWithLock[] = useMemo(() => {
    return moduleSteps.map((step) => {
      const blockedBy = step.depends_on.filter((depId) => !completedIds.has(depId));
      return {
        ...step,
        isLocked: blockedBy.length > 0,
        blockedBy,
        progress: stepProgress.get(step.id) ?? null,
      };
    });
  }, [moduleSteps, completedIds, stepProgress]);

  // Counts
  const completedCount = completedIds.size;
  const totalCount = moduleSteps.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Next actionable step: first that is not completed/skipped and not locked.
  const nextStep = useMemo(() => {
    return (
      steps.find((s) => {
        const status = s.progress?.status ?? 'not_started';
        return status !== 'completed' && status !== 'skipped' && !s.isLocked;
      }) ?? null
    );
  }, [steps]);

  // Convenience updater.
  const updateStep = useCallback(
    async (stepId: string, status: StepStatus) => {
      await updateStepStatus(userId, stepId, status);
    },
    [userId, updateStepStatus],
  );

  return {
    steps,
    completedCount,
    totalCount,
    progressPercent,
    nextStep,
    updateStep,
  };
}
