import { useMemo } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import type { Step } from '../types';

export function useModuleProgress(moduleSlug: string, steps: Step[]) {
  const progress = useProgressStore(state => state.progress);

  return useMemo(() => {
    const total = steps.length;
    const completed = steps.filter(s => progress[s.id]?.status === 'completed').length;
    const inProgress = steps.filter(s => progress[s.id]?.status === 'in_progress').length;
    const skipped = steps.filter(s => progress[s.id]?.status === 'skipped').length;

    return {
      total,
      completed,
      inProgress,
      skipped,
      notStarted: total - completed - inProgress - skipped,
      percentage: total > 0 ? completed / total : 0,
    };
  }, [steps, progress]);
}
