// ---------------------------------------------------------------------------
// Homestead Forge - App Store (global settings, onboarding, connectivity)
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type { AppSettings, OnboardingData, SyncStatus, ThemeMode } from '../types';
import { DEFAULT_APP_SETTINGS } from '../utils/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppState {
  /** User-scoped application settings. */
  settings: AppSettings;
  /** Whether the user has completed onboarding. */
  onboardingComplete: boolean;
  /** Data gathered during onboarding (persisted until profile is created). */
  onboardingData: OnboardingData | null;
  /** Whether the device is currently connected to the internet. */
  isOnline: boolean;
  /** Current sync lifecycle status. */
  syncStatus: SyncStatus;
  /** Number of pending offline operations. */
  pendingSyncCount: number;
}

interface AppActions {
  /** Merge partial settings into the current settings object. */
  updateSettings: (partial: Partial<AppSettings>) => void;
  /** Set the theme specifically (convenience wrapper). */
  setTheme: (theme: ThemeMode) => void;
  /** Mark onboarding as complete and persist the gathered data. */
  completeOnboarding: (data: OnboardingData) => void;
  /** Update the online/offline flag (typically called from NetInfo listener). */
  setOnlineStatus: (online: boolean) => void;
  /** Update the sync status. */
  setSyncStatus: (status: SyncStatus) => void;
  /** Set the number of pending sync operations. */
  setPendingSyncCount: (count: number) => void;
  /** Reset the store to its initial state (e.g. on sign-out). */
  reset: () => void;
}

export type AppStore = AppState & AppActions;

// ---------------------------------------------------------------------------
// Initial state (extracted so reset() can reuse it)
// ---------------------------------------------------------------------------

const initialState: AppState = {
  settings: { ...DEFAULT_APP_SETTINGS },
  onboardingComplete: false,
  onboardingData: null,
  isOnline: true,
  syncStatus: 'idle',
  pendingSyncCount: 0,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  setTheme: (theme) =>
    set((state) => ({
      settings: { ...state.settings, theme },
    })),

  completeOnboarding: (data) =>
    set({
      onboardingComplete: true,
      onboardingData: data,
    }),

  setOnlineStatus: (online) => set({ isOnline: online }),

  setSyncStatus: (status) => set({ syncStatus: status }),

  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),

  reset: () => set({ ...initialState }),
}));
