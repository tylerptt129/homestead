// ---------------------------------------------------------------------------
// Homestead Forge - Auth Store
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import type { Profile } from '../types';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
}

interface AuthState {
  /** Currently authenticated user profile (null when signed out). */
  user: Profile | null;
  /** Active session token data. */
  session: AuthSession | null;
  /** True while an auth operation is in flight. */
  isLoading: boolean;
  /** Convenience boolean derived from session presence. */
  isAuthenticated: boolean;
  /** Human-readable error from the last auth operation. */
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: Profile | null) => void;
  setSession: (session: AuthSession | null) => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

/**
 * Placeholder for the real Supabase client.
 * In production this is injected via a provider; here we define the shape so
 * store logic compiles and can be tested with mocks.
 */
const supabase = {
  auth: {
    signInWithPassword: async (_creds: { email: string; password: string }) => {
      return { data: null as unknown, error: null as unknown };
    },
    signUp: async (_creds: { email: string; password: string; options?: { data: Record<string, string> } }) => {
      return { data: null as unknown, error: null as unknown };
    },
    signOut: async () => {
      return { error: null as unknown };
    },
    getSession: async () => {
      return { data: { session: null as unknown }, error: null as unknown };
    },
  },
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: string) => ({
        single: async () => ({ data: null as unknown, error: null as unknown }),
      }),
    }),
  }),
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  // -- State ---------------------------------------------------------------
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // -- Actions -------------------------------------------------------------

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const session = data as { session: AuthSession; user: { id: string } } | null;
      if (!session?.session) throw new Error('No session returned.');

      set({
        session: session.session,
        isAuthenticated: true,
      });

      // Fetch full profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      set({ user: profile as Profile, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign-in failed.';
      set({ isLoading: false, error: message, isAuthenticated: false });
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;

      const session = data as { session: AuthSession; user: { id: string } } | null;
      if (session?.session) {
        set({
          session: session.session,
          isAuthenticated: true,
        });
      }
      set({ isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign-up failed.';
      set({ isLoading: false, error: message });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign-out failed.';
      set({ isLoading: false, error: message });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const session = data?.session as AuthSession | null;
      if (!session) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      set({ session, isAuthenticated: true });

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user_id)
        .single();

      if (profileError) throw profileError;
      set({ user: profile as Profile, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Session restore failed.';
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
        user: null,
        session: null,
      });
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) =>
    set({ session, isAuthenticated: session !== null }),
  clearError: () => set({ error: null }),
}));
