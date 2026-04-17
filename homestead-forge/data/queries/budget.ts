import { supabase } from '../supabase/client';
import type { BudgetItem } from '../../types';

function mapBudgetItem(row: Record<string, unknown>): BudgetItem {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    moduleId: row.module_id as string,
    stepId: row.step_id as string,
    description: row.description as string,
    amount: row.amount as number,
    category: row.category as BudgetItem['category'],
    vendor: row.vendor as string,
    receiptUrl: row.receipt_url as string,
    date: row.date as string,
    createdAt: row.created_at as string,
  };
}

function toSnakeCase(
  item: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  if (item.userId !== undefined) mapped.user_id = item.userId;
  if (item.moduleId !== undefined) mapped.module_id = item.moduleId;
  if (item.stepId !== undefined) mapped.step_id = item.stepId;
  if (item.description !== undefined) mapped.description = item.description;
  if (item.amount !== undefined) mapped.amount = item.amount;
  if (item.category !== undefined) mapped.category = item.category;
  if (item.vendor !== undefined) mapped.vendor = item.vendor;
  if (item.receiptUrl !== undefined) mapped.receipt_url = item.receiptUrl;
  if (item.date !== undefined) mapped.date = item.date;
  return mapped;
}

export async function fetchBudgetItems(userId: string): Promise<BudgetItem[]> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBudgetItem);
}

export async function createBudgetItem(
  item: Omit<BudgetItem, 'id' | 'createdAt'>
): Promise<BudgetItem> {
  const row = toSnakeCase(item);

  const { data, error } = await supabase
    .from('budget_items')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return mapBudgetItem(data);
}

export async function updateBudgetItem(
  id: string,
  updates: Partial<BudgetItem>
): Promise<BudgetItem> {
  const row = toSnakeCase(updates);

  const { data, error } = await supabase
    .from('budget_items')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapBudgetItem(data);
}

export async function deleteBudgetItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
