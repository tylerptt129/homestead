import { create } from 'zustand';
import type { Profile } from '../types';

const PROFILE_STORAGE_KEY = 'homestead_profile';
const ONBOARDED_STORAGE_KEY = 'homestead_onboarded';

interface AuthState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;

  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  setOnboarded: (onboarded: boolean) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

function persistProfile(profile: Profile | null): void {
  if (typeof window !== 'undefined') {
    try {
      if (profile) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    } catch {
      // Storage unavailable - silently fail
    }
  }
}

function persistOnboarded(onboarded: boolean): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ONBOARDED_STORAGE_KEY, JSON.stringify(onboarded));
    } catch {
      // Storage unavailable - silently fail
    }
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  profile: null,
  isAuthenticated: false,
  isOnboarded: false,

  setProfile: (profile: Profile) => {
    persistProfile(profile);
    set({ profile, isAuthenticated: true });
  },

  updateProfile: (updates: Partial<Profile>) => {
    const current = get().profile;
    if (!current) return;

    const updated: Profile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    set({ profile: updated });
  },

  setOnboarded: (onboarded: boolean) => {
    persistOnboarded(onboarded);
    set({ isOnboarded: onboarded });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        localStorage.removeItem(ONBOARDED_STORAGE_KEY);
      } catch {
        // Storage unavailable - silently fail
      }
    }
    set({ profile: null, isAuthenticated: false, isOnboarded: false });
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        const storedOnboarded = localStorage.getItem(ONBOARDED_STORAGE_KEY);

        const profile = storedProfile ? JSON.parse(storedProfile) : null;
        const isOnboarded = storedOnboarded
          ? JSON.parse(storedOnboarded)
          : false;

        set({
          profile,
          isAuthenticated: profile !== null,
          isOnboarded,
        });
      } catch {
        // Corrupted data - start fresh
      }
    }
  },
}));
