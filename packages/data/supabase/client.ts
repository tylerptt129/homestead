// ---------------------------------------------------------------------------
// Supabase Client Configuration – Homestead Forge
// ---------------------------------------------------------------------------
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Storage adapter interface – allows swapping AsyncStorage (mobile) for
// localStorage (web) without touching client code.
// ---------------------------------------------------------------------------
export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

// ---------------------------------------------------------------------------
// Default storage adapter – uses localStorage when available, otherwise an
// in-memory Map (useful for SSR / tests).
// ---------------------------------------------------------------------------
const memoryStore = new Map<string, string>();

const defaultStorage: StorageAdapter = {
  getItem(key: string) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      memoryStore.set(key, value);
    }
  },
  removeItem(key: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  },
};

// ---------------------------------------------------------------------------
// Resolve environment variables.
//
// 1. Standard process.env (Node / bundler).
// 2. Expo Constants (managed workflow) – imported lazily so we don't blow up
//    in non-Expo environments.
// ---------------------------------------------------------------------------
function resolveEnv(key: string): string | undefined {
  // process.env – available in Node, Vite, Next.js, etc.
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  // Expo Constants (lazy import so we don't hard-depend on expo-constants)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require('expo-constants').default;
    const expoExtra = Constants?.expoConfig?.extra ?? Constants?.manifest?.extra;
    if (expoExtra?.[key]) {
      return expoExtra[key] as string;
    }
  } catch {
    // expo-constants not available – that's fine.
  }

  return undefined;
}

const supabaseUrl = resolveEnv('SUPABASE_URL') ?? resolveEnv('EXPO_PUBLIC_SUPABASE_URL') ?? '';
const supabaseAnonKey =
  resolveEnv('SUPABASE_ANON_KEY') ?? resolveEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY') ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Homestead Forge] Missing SUPABASE_URL or SUPABASE_ANON_KEY – the Supabase client ' +
      'will not be able to connect. Set them via environment variables or Expo extra config.',
  );
}

// ---------------------------------------------------------------------------
// Create and export the typed Supabase client.
// ---------------------------------------------------------------------------

let _customStorage: StorageAdapter | undefined;

/**
 * Provide a custom storage adapter (e.g. AsyncStorage on React Native).
 * Must be called **before** the first import of `supabase` to take effect.
 */
export function setStorageAdapter(adapter: StorageAdapter): void {
  _customStorage = adapter;
}

function buildClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: typeof window !== 'undefined',
      storage: (_customStorage ?? defaultStorage) as any,
    },
  });
}

export const supabase: SupabaseClient = buildClient();
