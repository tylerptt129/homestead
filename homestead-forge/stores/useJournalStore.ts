import { create } from 'zustand';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'homestead_journal';

function persistEntries(entries: JournalEntry[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Storage full or unavailable - silently fail
    }
  }
}

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;

  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setEntries: (entries: JournalEntry[]) => void;
  getEntriesByModule: (moduleId: string) => JournalEntry[];
  getEntriesByTag: (tag: string) => JournalEntry[];
  loadFromStorage: () => void;
}

export const useJournalStore = create<JournalState>()((set, get) => ({
  entries: [],
  isLoading: false,

  addEntry: (entry: JournalEntry) =>
    set((state) => {
      const newEntries = [...state.entries, entry];
      persistEntries(newEntries);
      return { entries: newEntries };
    }),

  updateEntry: (id: string, updates: Partial<JournalEntry>) =>
    set((state) => {
      const newEntries = state.entries.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      );
      persistEntries(newEntries);
      return { entries: newEntries };
    }),

  deleteEntry: (id: string) =>
    set((state) => {
      const newEntries = state.entries.filter((e) => e.id !== id);
      persistEntries(newEntries);
      return { entries: newEntries };
    }),

  setEntries: (entries: JournalEntry[]) => {
    set({ entries });
    persistEntries(entries);
  },

  getEntriesByModule: (moduleId: string) => {
    return get().entries.filter((e) => e.moduleId === moduleId);
  },

  getEntriesByTag: (tag: string) => {
    return get().entries.filter((e) => e.tags.includes(tag));
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          set({ entries: JSON.parse(stored) });
        }
      } catch {
        // Corrupted data - start fresh
      }
    }
  },
}));
