// ---------------------------------------------------------------------------
// Homestead Forge - Seasonal Tasks Hook
// ---------------------------------------------------------------------------
//
// Returns tasks relevant to the current month and the user's climate zone.
// Fetches from the seasonal_tasks table and filters locally.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SeasonalTask } from '../types';
import { getSeasonForMonth } from '../utils/calculations';
import { MONTHS } from '../utils/constants';

// ---------------------------------------------------------------------------
// Supabase stub
// ---------------------------------------------------------------------------

const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: string | number) => ({
        order: (_col2: string, _opts?: { ascending: boolean }) =>
          Promise.resolve({ data: [] as unknown[], error: null as unknown }),
        or: (_filter: string) => ({
          order: (_col3: string, _opts2?: { ascending: boolean }) =>
            Promise.resolve({ data: [] as unknown[], error: null as unknown }),
        }),
      }),
      or: (_filter: string) => ({
        order: (_col2: string, _opts?: { ascending: boolean }) =>
          Promise.resolve({ data: [] as unknown[], error: null as unknown }),
      }),
    }),
  }),
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseSeasonalTasksReturn {
  /** Tasks relevant to the current month. */
  currentMonthTasks: SeasonalTask[];
  /** Tasks for the upcoming month (lookahead). */
  nextMonthTasks: SeasonalTask[];
  /** All seasonal tasks for the user. */
  allTasks: SeasonalTask[];
  /** Name of the current month. */
  currentMonthName: string;
  /** Current season string. */
  currentSeason: string;
  /** Whether the data is loading. */
  isLoading: boolean;
  /** Last error. */
  error: string | null;
  /** Re-fetch tasks. */
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSeasonalTasks(
  userId: string,
  _climateZone?: string,
): UseSeasonalTasksReturn {
  const [allTasks, setAllTasks] = useState<SeasonalTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-based
  const currentYear = now.getFullYear();
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  const currentMonthName = MONTHS[currentMonth - 1];
  const currentSeason = getSeasonForMonth(currentMonth);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch tasks for the current user that are either for this month, next
      // month, or recurring.
      const { data, error: fetchErr } = await supabase
        .from('seasonal_tasks')
        .select()
        .eq('user_id', userId)
        .or(`month.eq.${currentMonth},month.eq.${nextMonth},recurring.eq.true`)
        .order('month', { ascending: true });

      if (fetchErr) throw fetchErr;
      setAllTasks((data ?? []) as SeasonalTask[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load seasonal tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentMonth, nextMonth]);

  useEffect(() => {
    if (userId) {
      void fetchTasks();
    }
  }, [userId, fetchTasks]);

  // Filter tasks for the current month.
  const currentMonthTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const isForThisMonth = t.month === currentMonth;
      const isRecurringAndNotDone =
        t.recurring && t.completed_year !== currentYear;
      const isNotDone = t.completed_year !== currentYear;
      return isForThisMonth && (t.recurring ? isRecurringAndNotDone : isNotDone);
    });
  }, [allTasks, currentMonth, currentYear]);

  // Tasks coming up next month.
  const nextMonthTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const isForNextMonth = t.month === nextMonth;
      const isNotDone = t.completed_year !== currentYear;
      return isForNextMonth && isNotDone;
    });
  }, [allTasks, nextMonth, currentYear]);

  return {
    currentMonthTasks,
    nextMonthTasks,
    allTasks,
    currentMonthName,
    currentSeason,
    isLoading,
    error,
    refresh: fetchTasks,
  };
}
