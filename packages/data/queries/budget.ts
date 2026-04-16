// ---------------------------------------------------------------------------
// Budget Item Queries – Homestead Forge
// ---------------------------------------------------------------------------
import { supabase } from '../supabase/client';
import type { BudgetItem } from '@homestead/core/types';

/**
 * Fetch budget items for a user with optional filters.
 */
export async function fetchBudgetItems(
  userId: string,
  opts: { moduleId?: string; category?: string; limit?: number } = {},
): Promise<BudgetItem[]> {
  const { moduleId, category, limit = 100 } = opts;

  let query = supabase
    .from('budget_items')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`fetchBudgetItems("${userId}") failed: ${error.message}`);
  }

  return (data ?? []) as BudgetItem[];
}

/**
 * Create a new budget line-item. The `id` and `created_at` fields are
 * generated server-side.
 */
export async function createBudgetItem(
  item: Omit<BudgetItem, 'id' | 'created_at'>,
): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .insert(item)
    .select('*')
    .single();

  if (error) {
    throw new Error(`createBudgetItem failed: ${error.message}`);
  }

  return data as BudgetItem;
}

/**
 * Partially update an existing budget item. Returns the full updated row.
 */
export async function updateBudgetItem(
  itemId: string,
  updates: Partial<BudgetItem>,
): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .update(updates)
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`updateBudgetItem("${itemId}") failed: ${error.message}`);
  }

  return data as BudgetItem;
}

/**
 * Permanently delete a budget item by its primary key.
 */
export async function deleteBudgetItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    throw new Error(`deleteBudgetItem("${itemId}") failed: ${error.message}`);
  }
}

/**
 * Compute an aggregate budget summary for a user:
 * - `total`       – sum of all amounts
 * - `byModule`    – amount per module_id
 * - `byCategory`  – amount per category
 *
 * Supabase doesn't expose server-side GROUP BY via the REST API, so we fetch
 * all items and aggregate in-memory. For very large datasets consider a
 * Postgres function / RPC instead.
 */
export async function fetchBudgetSummary(
  userId: string,
): Promise<{ total: number; byModule: Record<string, number>; byCategory: Record<string, number> }> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('amount, module_id, category')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`fetchBudgetSummary("${userId}") failed: ${error.message}`);
  }

  const items = (data ?? []) as Pick<BudgetItem, 'amount' | 'module_id' | 'category'>[];

  let total = 0;
  const byModule: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const item of items) {
    total += item.amount;

    if (item.module_id) {
      byModule[item.module_id] = (byModule[item.module_id] ?? 0) + item.amount;
    }

    if (item.category) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount;
    }
  }

  return { total, byModule, byCategory };
}
