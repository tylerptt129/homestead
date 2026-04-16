// ---------------------------------------------------------------------------
// Step Queries – Homestead Forge
// ---------------------------------------------------------------------------
import { supabase } from '../supabase/client';
import type { Step } from '@homestead/core/types';

/**
 * Fetch all steps that belong to a module, ordered by `display_order`.
 */
export async function fetchStepsByModule(moduleId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('module_id', moduleId)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`fetchStepsByModule("${moduleId}") failed: ${error.message}`);
  }

  return (data ?? []) as Step[];
}

/**
 * Fetch a single step by its primary key.
 * Returns `null` when no matching row exists.
 */
export async function fetchStepById(stepId: string): Promise<Step | null> {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('id', stepId)
    .maybeSingle();

  if (error) {
    throw new Error(`fetchStepById("${stepId}") failed: ${error.message}`);
  }

  return (data as Step) ?? null;
}
