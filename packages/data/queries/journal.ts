// ---------------------------------------------------------------------------
// Journal Entry Queries – Homestead Forge
// ---------------------------------------------------------------------------
import { supabase } from '../supabase/client';
import type { JournalEntry } from '@homestead/core/types';

/**
 * Fetch journal entries for a user with optional filters and pagination.
 */
export async function fetchJournalEntries(
  userId: string,
  opts: { moduleId?: string; limit?: number; offset?: number } = {},
): Promise<JournalEntry[]> {
  const { moduleId, limit = 50, offset = 0 } = opts;

  let query = supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`fetchJournalEntries("${userId}") failed: ${error.message}`);
  }

  return (data ?? []) as JournalEntry[];
}

/**
 * Fetch a single journal entry by its primary key.
 * Returns `null` when no matching row exists.
 */
export async function fetchJournalEntry(entryId: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .maybeSingle();

  if (error) {
    throw new Error(`fetchJournalEntry("${entryId}") failed: ${error.message}`);
  }

  return (data as JournalEntry) ?? null;
}

/**
 * Create a new journal entry. The `id`, `created_at`, and `updated_at`
 * fields are generated server-side.
 */
export async function createJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select('*')
    .single();

  if (error) {
    throw new Error(`createJournalEntry failed: ${error.message}`);
  }

  return data as JournalEntry;
}

/**
 * Partially update an existing journal entry. Returns the full updated row.
 */
export async function updateJournalEntry(
  entryId: string,
  updates: Partial<JournalEntry>,
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', entryId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`updateJournalEntry("${entryId}") failed: ${error.message}`);
  }

  return data as JournalEntry;
}

/**
 * Permanently delete a journal entry by its primary key.
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    throw new Error(`deleteJournalEntry("${entryId}") failed: ${error.message}`);
  }
}
