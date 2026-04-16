// ---------------------------------------------------------------------------
// Homestead Forge - Journal Store
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type { JournalEntry, Mood, WeatherData } from '../types';

/**
 * Placeholder Supabase client.
 */
const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: string) => ({
        order: (_col2: string, _opts?: { ascending: boolean }) =>
          Promise.resolve({ data: [] as unknown[], error: null as unknown }),
        eq: (_col2: string, _val2: string) => ({
          order: (_col3: string, _opts2?: { ascending: boolean }) =>
            Promise.resolve({ data: [] as unknown[], error: null as unknown }),
        }),
      }),
      order: (_col2: string, _opts?: { ascending: boolean }) =>
        Promise.resolve({ data: [] as unknown[], error: null as unknown }),
    }),
    insert: (_row: unknown) => ({
      select: (_cols?: string) => ({
        single: () =>
          Promise.resolve({ data: null as unknown, error: null as unknown }),
      }),
    }),
    update: (_row: unknown) => ({
      eq: (_col: string, _val: string) => ({
        select: (_cols?: string) => ({
          single: () =>
            Promise.resolve({ data: null as unknown, error: null as unknown }),
        }),
      }),
    }),
    delete: () => ({
      eq: (_col: string, _val: string) =>
        Promise.resolve({ data: null as unknown, error: null as unknown }),
    }),
  }),
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JournalState {
  /** All loaded journal entries (most recent first). */
  entries: JournalEntry[];
  /** Currently selected / editing entry. */
  currentEntry: JournalEntry | null;
  /** Filtered subset (computed, not persisted). */
  filteredEntries: JournalEntry[];
  /** True while any async op is in progress. */
  isLoading: boolean;
  /** Last error message. */
  error: string | null;
}

interface CreateEntryInput {
  userId: string;
  moduleId?: string | null;
  title: string;
  content: string;
  mood: Mood;
  weather?: WeatherData;
  photos?: string[];
  tags?: string[];
}

interface UpdateEntryInput {
  title?: string;
  content?: string;
  mood?: Mood;
  weather?: WeatherData;
  photos?: string[];
  tags?: string[];
}

interface JournalActions {
  /** Fetch all journal entries for a user. */
  fetchEntries: (userId: string) => Promise<void>;
  /** Create a new journal entry. */
  createEntry: (input: CreateEntryInput) => Promise<JournalEntry | null>;
  /** Update an existing journal entry. */
  updateEntry: (entryId: string, input: UpdateEntryInput) => Promise<void>;
  /** Delete a journal entry by id. */
  deleteEntry: (entryId: string) => Promise<void>;
  /** Filter entries by module id (pass null to clear filter). */
  filterByModule: (moduleId: string | null) => void;
  /** Filter entries by tag. */
  filterByTag: (tag: string) => void;
  /** Set the currently selected entry. */
  setCurrentEntry: (entry: JournalEntry | null) => void;
  /** Clear the error. */
  clearError: () => void;
}

export type JournalStore = JournalState & JournalActions;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useJournalStore = create<JournalStore>()((set, get) => ({
  // -- State -----------------------------------------------------------------
  entries: [],
  currentEntry: null,
  filteredEntries: [],
  isLoading: false,
  error: null,

  // -- Actions ---------------------------------------------------------------

  fetchEntries: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const entries = (data ?? []) as JournalEntry[];
      set({ entries, filteredEntries: entries, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch journal entries.';
      set({ isLoading: false, error: message });
    }
  },

  createEntry: async (input: CreateEntryInput) => {
    set({ isLoading: true, error: null });
    try {
      const now = nowISO();
      const newEntry: JournalEntry = {
        id: generateId(),
        user_id: input.userId,
        module_id: input.moduleId ?? null,
        title: input.title,
        content: input.content,
        mood: input.mood,
        weather: input.weather ?? {},
        photos: input.photos ?? [],
        tags: input.tags ?? [],
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(newEntry)
        .select()
        .single();
      if (error) throw error;

      const saved = (data as JournalEntry) ?? newEntry;
      const entries = [saved, ...get().entries];
      set({ entries, filteredEntries: entries, isLoading: false });
      return saved;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create journal entry.';
      set({ isLoading: false, error: message });
      return null;
    }
  },

  updateEntry: async (entryId: string, input: UpdateEntryInput) => {
    set({ isLoading: true, error: null });
    try {
      const updates = { ...input, updated_at: nowISO() };
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();
      if (error) throw error;

      const updatedEntry = data as JournalEntry | null;
      const entries = get().entries.map((e) =>
        e.id === entryId ? updatedEntry ?? { ...e, ...updates } : e,
      );
      set({
        entries,
        filteredEntries: entries,
        currentEntry:
          get().currentEntry?.id === entryId
            ? updatedEntry ?? { ...get().currentEntry!, ...updates }
            : get().currentEntry,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update journal entry.';
      set({ isLoading: false, error: message });
    }
  },

  deleteEntry: async (entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;

      const entries = get().entries.filter((e) => e.id !== entryId);
      set({
        entries,
        filteredEntries: entries,
        currentEntry:
          get().currentEntry?.id === entryId ? null : get().currentEntry,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete journal entry.';
      set({ isLoading: false, error: message });
    }
  },

  filterByModule: (moduleId: string | null) => {
    const { entries } = get();
    if (!moduleId) {
      set({ filteredEntries: entries });
      return;
    }
    set({ filteredEntries: entries.filter((e) => e.module_id === moduleId) });
  },

  filterByTag: (tag: string) => {
    const { entries } = get();
    const lower = tag.toLowerCase();
    set({
      filteredEntries: entries.filter((e) =>
        e.tags.some((t) => t.toLowerCase() === lower),
      ),
    });
  },

  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  clearError: () => set({ error: null }),
}));
