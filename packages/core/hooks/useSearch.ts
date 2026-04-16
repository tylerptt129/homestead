// ---------------------------------------------------------------------------
// Homestead Forge - Global Search Hook
// ---------------------------------------------------------------------------
//
// Searches across modules, steps, journal entries, and budget items using a
// simple case-insensitive substring match.  All filtering is done client-side
// against data already loaded in Zustand stores.
// ---------------------------------------------------------------------------

import { useMemo, useState, useCallback } from 'react';
import type {
  BudgetItem,
  JournalEntry,
  Module,
  SearchResults,
  Step,
} from '../types';
import { useModuleStore } from '../stores/moduleStore';
import { useJournalStore } from '../stores/journalStore';
import { useBudgetStore } from '../stores/budgetStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseSearchReturn {
  /** Current query string. */
  query: string;
  /** Update the query string (triggers a re-filter). */
  setQuery: (q: string) => void;
  /** Filtered results across all entity types. */
  results: SearchResults;
  /** Total number of results across all categories. */
  totalResults: number;
  /** Whether any results exist. */
  hasResults: boolean;
  /** Clear the search query and results. */
  clear: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesQuery(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(query);
}

function searchModules(modules: Module[], query: string): Module[] {
  return modules.filter(
    (m) =>
      matchesQuery(m.title, query) ||
      matchesQuery(m.description, query) ||
      matchesQuery(m.slug, query),
  );
}

function searchSteps(steps: Step[], query: string): Step[] {
  return steps.filter(
    (s) =>
      matchesQuery(s.title, query) ||
      matchesQuery(s.description, query) ||
      matchesQuery(s.detailed_guide, query) ||
      s.tags.some((t) => matchesQuery(t, query)),
  );
}

function searchJournal(entries: JournalEntry[], query: string): JournalEntry[] {
  return entries.filter(
    (e) =>
      matchesQuery(e.title, query) ||
      matchesQuery(e.content, query) ||
      e.tags.some((t) => matchesQuery(t, query)),
  );
}

function searchBudget(items: BudgetItem[], query: string): BudgetItem[] {
  return items.filter(
    (b) =>
      matchesQuery(b.description, query) ||
      matchesQuery(b.vendor, query) ||
      matchesQuery(b.category, query),
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Provide an optional `allSteps` array if you want step-level search.
 * By default the hook only searches the steps currently loaded via the
 * module store's `currentSteps`.
 */
export function useSearch(allSteps?: Step[]): UseSearchReturn {
  const [query, setQueryRaw] = useState('');

  const modules = useModuleStore((s) => s.modules);
  const currentSteps = useModuleStore((s) => s.currentSteps);
  const journalEntries = useJournalStore((s) => s.entries);
  const budgetItems = useBudgetStore((s) => s.items);

  const stepsToSearch = allSteps ?? currentSteps;

  const results: SearchResults = useMemo(() => {
    if (query.length < 2) {
      return { modules: [], steps: [], journalEntries: [], budgetItems: [] };
    }
    const q = query.toLowerCase();
    return {
      modules: searchModules(modules, q),
      steps: searchSteps(stepsToSearch, q),
      journalEntries: searchJournal(journalEntries, q),
      budgetItems: searchBudget(budgetItems, q),
    };
  }, [query, modules, stepsToSearch, journalEntries, budgetItems]);

  const totalResults =
    results.modules.length +
    results.steps.length +
    results.journalEntries.length +
    results.budgetItems.length;

  const hasResults = totalResults > 0;

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q.trim());
  }, []);

  const clear = useCallback(() => {
    setQueryRaw('');
  }, []);

  return { query, setQuery, results, totalResults, hasResults, clear };
}
