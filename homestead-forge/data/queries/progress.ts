import { supabase } from '../supabase/client';
import type { UserStepProgress } from '../../types';

function mapProgress(row: Record<string, unknown>): UserStepProgress {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    stepId: row.step_id as string,
    status: row.status as UserStepProgress['status'],
    startedAt: row.started_at as string,
    completedAt: row.completed_at as string,
    notes: row.notes as string,
    photos: (row.photos as string[]) || [],
    actualCost: row.actual_cost as number,
    customData: (row.custom_data as Record<string, unknown>) || {},
    updatedAt: row.updated_at as string,
  };
}

function toSnakeCase(progress: Partial<UserStepProgress>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  if (progress.id !== undefined) mapped.id = progress.id;
  if (progress.userId !== undefined) mapped.user_id = progress.userId;
  if (progress.stepId !== undefined) mapped.step_id = progress.stepId;
  if (progress.status !== undefined) mapped.status = progress.status;
  if (progress.startedAt !== undefined) mapped.started_at = progress.startedAt;
  if (progress.completedAt !== undefined) mapped.completed_at = progress.completedAt;
  if (progress.notes !== undefined) mapped.notes = progress.notes;
  if (progress.photos !== undefined) mapped.photos = progress.photos;
  if (progress.actualCost !== undefined) mapped.actual_cost = progress.actualCost;
  if (progress.customData !== undefined) mapped.custom_data = progress.customData;
  if (progress.updatedAt !== undefined) mapped.updated_at = progress.updatedAt;
  return mapped;
}

export async function fetchUserProgress(userId: string): Promise<UserStepProgress[]> {
  const { data, error } = await supabase
    .from('user_step_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map(mapProgress);
}

export async function upsertStepProgress(
  progress: Partial<UserStepProgress>
): Promise<UserStepProgress> {
  const row = toSnakeCase(progress);

  const { data, error } = await supabase
    .from('user_step_progress')
    .upsert(row, { onConflict: 'user_id,step_id' })
    .select()
    .single();

  if (error) throw error;
  return mapProgress(data);
}
