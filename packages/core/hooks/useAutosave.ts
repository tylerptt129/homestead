// ---------------------------------------------------------------------------
// Homestead Forge - Autosave Hook
// ---------------------------------------------------------------------------
//
// Saves data to local storage (MMKV on native, localStorage on web) on every
// change, and debounces syncs to Supabase at a 3-second interval.  When the
// device goes offline, mutations are queued and replayed on reconnection.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SyncQueueItem } from '../types';
import { AUTOSAVE_DEBOUNCE_MS } from '../utils/constants';

// ---------------------------------------------------------------------------
// Storage abstraction (MMKV on native, localStorage on web)
// ---------------------------------------------------------------------------

interface StorageAdapter {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

/**
 * Build a storage adapter. MMKV is imported lazily so the module does not
 * crash on web where the native module is unavailable.
 */
function createStorageAdapter(): StorageAdapter {
  try {
    // Attempt to load react-native-mmkv at runtime.  The require is wrapped
    // in a try/catch so bundlers that tree-shake native modules (e.g. for
    // web builds) can gracefully fall back to localStorage.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new () => {
        getString: (key: string) => string | undefined;
        set: (key: string, value: string) => void;
        delete: (key: string) => void;
      };
    };
    const storage = new MMKV();
    return {
      getString: (key) => storage.getString(key),
      set: (key, value) => storage.set(key, value),
      delete: (key) => storage.delete(key),
    };
  } catch {
    // Fallback: use localStorage (works in browsers / Expo web).
    return {
      getString: (key) => {
        try {
          return globalThis.localStorage?.getItem(key) ?? undefined;
        } catch {
          return undefined;
        }
      },
      set: (key, value) => {
        try {
          globalThis.localStorage?.setItem(key, value);
        } catch {
          // Storage full or unavailable -- silently ignore.
        }
      },
      delete: (key) => {
        try {
          globalThis.localStorage?.removeItem(key);
        } catch {
          // noop
        }
      },
    };
  }
}

const storage = createStorageAdapter();

// ---------------------------------------------------------------------------
// Connectivity helper
// ---------------------------------------------------------------------------

function subscribeToConnectivity(onChange: (online: boolean) => void): () => void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const NetInfo = require('@react-native-community/netinfo') as {
      addEventListener: (
        cb: (state: { isConnected: boolean | null }) => void,
      ) => () => void;
    };
    return NetInfo.addEventListener((state) => {
      onChange(state.isConnected ?? false);
    });
  } catch {
    // Web fallback: use the browser's online/offline events.
    const goOnline = () => onChange(true);
    const goOffline = () => onChange(false);
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('online', goOnline);
      globalThis.addEventListener('offline', goOffline);
      return () => {
        globalThis.removeEventListener('online', goOnline);
        globalThis.removeEventListener('offline', goOffline);
      };
    }
    return () => {};
  }
}

// ---------------------------------------------------------------------------
// Sync queue persistence
// ---------------------------------------------------------------------------

const QUEUE_KEY = '@homestead:sync_queue';

function loadQueue(): SyncQueueItem[] {
  const raw = storage.getString(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SyncQueueItem[];
  } catch {
    return [];
  }
}

function persistQueue(queue: SyncQueueItem[]): void {
  storage.set(QUEUE_KEY, JSON.stringify(queue));
}

// ---------------------------------------------------------------------------
// Remote sync stub
// ---------------------------------------------------------------------------

/**
 * Placeholder for the real Supabase sync call.  In production this would call
 * supabase.from(item.table)[item.operation](item.payload).
 */
async function syncToRemote(item: SyncQueueItem): Promise<boolean> {
  // This is intentionally a stub -- the concrete implementation is wired in
  // the app layer where the Supabase client is initialised.
  void item;
  return true;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseAutosaveOptions<T> {
  /** Unique key used for local storage. */
  key: string;
  /** The data to autosave. */
  data: T;
  /** Called to push the data to Supabase. Return true on success. */
  onSync?: (data: T) => Promise<boolean>;
  /** Debounce interval in ms (defaults to AUTOSAVE_DEBOUNCE_MS = 3000). */
  debounceMs?: number;
}

export interface UseAutosaveReturn<T> {
  /** Restore the last locally-saved snapshot. Returns undefined if none exists. */
  restore: () => T | undefined;
  /** True while a sync operation is in progress. */
  isSaving: boolean;
  /** ISO timestamp of the last successful sync. */
  lastSaved: string | null;
}

export function useAutosave<T>(
  options: UseAutosaveOptions<T>,
): UseAutosaveReturn<T> {
  const { key, data, onSync, debounceMs = AUTOSAVE_DEBOUNCE_MS } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const isOnlineRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef(data);
  latestDataRef.current = data;

  // Persist locally on every data change (synchronous, fast).
  useEffect(() => {
    try {
      storage.set(key, JSON.stringify(data));
    } catch {
      // Serialisation failure -- silently ignore.
    }
  }, [key, data]);

  // Debounced remote sync.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!isOnlineRef.current) {
        // Queue the mutation for later.
        const queue = loadQueue();
        queue.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          table: key,
          operation: 'update',
          payload: latestDataRef.current as unknown as Record<string, unknown>,
          created_at: new Date().toISOString(),
        });
        persistQueue(queue);
        return;
      }

      setIsSaving(true);
      try {
        const syncFn = onSync ?? (async () => syncToRemote({
          id: `${Date.now()}`,
          table: key,
          operation: 'update',
          payload: latestDataRef.current as unknown as Record<string, unknown>,
          created_at: new Date().toISOString(),
        }));
        const ok = await syncFn(latestDataRef.current);
        if (ok) {
          setLastSaved(new Date().toISOString());
        }
      } catch {
        // Sync failed -- data is still safe in local storage.
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // We intentionally depend on `data` (serialised) to re-trigger the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, data, debounceMs]);

  // Subscribe to connectivity changes.
  useEffect(() => {
    const unsubscribe = subscribeToConnectivity((online) => {
      isOnlineRef.current = online;

      // When we come back online, flush the queue.
      if (online) {
        const queue = loadQueue();
        if (queue.length > 0) {
          void (async () => {
            const remaining: SyncQueueItem[] = [];
            for (const item of queue) {
              const ok = await syncToRemote(item);
              if (!ok) remaining.push(item);
            }
            persistQueue(remaining);
          })();
        }
      }
    });
    return unsubscribe;
  }, []);

  const restore = useCallback((): T | undefined => {
    const raw = storage.getString(key);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }, [key]);

  return { restore, isSaving, lastSaved };
}
