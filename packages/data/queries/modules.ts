// ---------------------------------------------------------------------------
// Module Queries – Homestead Forge
// ---------------------------------------------------------------------------
import { supabase } from '../supabase/client';
import type { Module, Step } from '@homestead/core/types';

/**
 * Fetch every module, ordered by `display_order`.
 */
export async function fetchAllModules(): Promise<Module[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`fetchAllModules failed: ${error.message}`);
  }

  return (data ?? []) as Module[];
}

/**
 * Fetch a single module by its URL-friendly slug.
 * Returns `null` when no matching row exists.
 */
export async function fetchModuleBySlug(slug: string): Promise<Module | null> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`fetchModuleBySlug("${slug}") failed: ${error.message}`);
  }

  return (data as Module) ?? null;
}

/**
 * Fetch a module together with all its steps (ordered by `display_order`).
 * Throws when the module is not found.
 */
export async function fetchModuleWithSteps(
  slug: string,
): Promise<Module & { steps: Step[] }> {
  // Supabase supports embedded selects via foreign-key relationships.
  const { data, error } = await supabase
    .from('modules')
    .select('*, steps(*)')
    .eq('slug', slug)
    .order('display_order', { referencedTable: 'steps', ascending: true })
    .maybeSingle();

  if (error) {
    throw new Error(`fetchModuleWithSteps("${slug}") failed: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Module with slug "${slug}" not found.`);
  }

  return data as Module & { steps: Step[] };
}
