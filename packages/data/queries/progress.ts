// ---------------------------------------------------------------------------
// User Progress Queries – Homestead Forge
// ---------------------------------------------------------------------------
import { supabase } from '../supabase/client';
import type { UserStepProgress, StepStatus } from '@homestead/core/types';

/**
 * Fetch all step-progress rows for a given user.
 */
export async function fetchUserProgress(userId: string): Promise<UserStepProgress[]> {
  const { data, error } = await supabase
    .from('user_step_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`fetchUserProgress("${userId}") failed: ${error.message}`);
  }

  return (data ?? []) as UserStepProgress[];
}

/**
 * Fetch progress rows for a specific user + module combination.
 * Joins through the `steps` table to resolve `module_id`.
 */
export async function fetchProgressForModule(
  userId: string,
  moduleId: string,
): Promise<UserStepProgress[]> {
  const { data, error } = await supabase
    .from('user_step_progress')
    .select('*, steps!inner(module_id)')
    .eq('user_id', userId)
    .eq('steps.module_id', moduleId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(
      `fetchProgressForModule("${userId}", "${moduleId}") failed: ${error.message}`,
    );
  }

  // Strip the joined `steps` key before returning so the shape matches
  // UserStepProgress exactly.
  return ((data ?? []) as (UserStepProgress & { steps?: unknown })[]).map(
    ({ steps: _steps, ...rest }) => rest as UserStepProgress,
  );
}

/**
 * Insert or update a step-progress record.
 *
 * The upsert is keyed on `(user_id, step_id)` – Supabase uses the table's
 * unique constraint to decide between INSERT and UPDATE.
 */
export async function upsertStepProgress(
  progress: Partial<UserStepProgress> & { user_id: string; step_id: string },
): Promise<UserStepProgress> {
  const { data, error } = await supabase
    .from('user_step_progress')
    .upsert(
      {
        ...progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,step_id' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(`upsertStepProgress failed: ${error.message}`);
  }

  return data as UserStepProgress;
}

/**
 * Convenience helper – update only the `status` (and associated timestamps)
 * for a given user + step pair.
 */
export async function updateStepStatus(
  userId: string,
  stepId: string,
  status: StepStatus,
): Promise<void> {
  const now = new Date().toISOString();

  const updates: Partial<UserStepProgress> & { user_id: string; step_id: string } = {
    user_id: userId,
    step_id: stepId,
    status,
    updated_at: now,
  };

  if (status === 'in_progress') {
    updates.started_at = now;
  } else if (status === 'completed') {
    updates.completed_at = now;
  }

  await upsertStepProgress(updates);
}
