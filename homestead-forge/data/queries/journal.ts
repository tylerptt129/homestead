import { supabase } from '../supabase/client';
import type { JournalEntry } from '../../types';

function mapJournalEntry(row: Record<string, unknown>): JournalEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    moduleId: (row.module_id as string | null) ?? null,
    title: row.title as string,
    content: row.content as string,
    mood: row.mood as JournalEntry['mood'],
    weather: (row.weather as JournalEntry['weather']) ?? null,
    photos: (row.photos as string[]) || [],
    tags: (row.tags as string[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toSnakeCase(
  entry: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  if (entry.userId !== undefined) mapped.user_id = entry.userId;
  if (entry.moduleId !== undefined) mapped.module_id = entry.moduleId;
  if (entry.title !== undefined) mapped.title = entry.title;
  if (entry.content !== undefined) mapped.content = entry.content;
  if (entry.mood !== undefined) mapped.mood = entry.mood;
  if (entry.weather !== undefined) mapped.weather = entry.weather;
  if (entry.photos !== undefined) mapped.photos = entry.photos;
  if (entry.tags !== undefined) mapped.tags = entry.tags;
  return mapped;
}

export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapJournalEntry);
}

export async function createJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> {
  const row = toSnakeCase(entry);

  const { data, error } = await supabase
    .from('journal_entries')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return mapJournalEntry(data);
}

export async function updateJournalEntry(
  id: string,
  updates: Partial<JournalEntry>
): Promise<JournalEntry> {
  const row = toSnakeCase(updates);

  const { data, error } = await supabase
    .from('journal_entries')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapJournalEntry(data);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
