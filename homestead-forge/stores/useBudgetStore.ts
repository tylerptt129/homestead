import { create } from 'zustand';
import type { BudgetItem } from '../types';

const STORAGE_KEY = 'homestead_budget';

function persistItems(items: BudgetItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable - silently fail
    }
  }
}

interface BudgetState {
  items: BudgetItem[];
  isLoading: boolean;

  addItem: (item: BudgetItem) => void;
  updateItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteItem: (id: string) => void;
  setItems: (items: BudgetItem[]) => void;
  getTotalSpent: () => number;
  getSpentByModule: (moduleId: string) => number;
  getSpentByCategory: (category: string) => number;
  getItemsByModule: (moduleId: string) => BudgetItem[];
  loadFromStorage: () => void;
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  items: [],
  isLoading: false,

  addItem: (item: BudgetItem) =>
    set((state) => {
      const newItems = [...state.items, item];
      persistItems(newItems);
      return { items: newItems };
    }),

  updateItem: (id: string, updates: Partial<BudgetItem>) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      persistItems(newItems);
      return { items: newItems };
    }),

  deleteItem: (id: string) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      persistItems(newItems);
      return { items: newItems };
    }),

  setItems: (items: BudgetItem[]) => {
    set({ items });
    persistItems(items);
  },

  getTotalSpent: () => {
    return get().items.reduce((sum, item) => sum + item.amount, 0);
  },

  getSpentByModule: (moduleId: string) => {
    return get()
      .items.filter((item) => item.moduleId === moduleId)
      .reduce((sum, item) => sum + item.amount, 0);
  },

  getSpentByCategory: (category: string) => {
    return get()
      .items.filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
  },

  getItemsByModule: (moduleId: string) => {
    return get().items.filter((item) => item.moduleId === moduleId);
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          set({ items: JSON.parse(stored) });
        }
      } catch {
        // Corrupted data - start fresh
      }
    }
  },
}));
