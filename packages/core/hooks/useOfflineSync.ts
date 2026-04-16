// ---------------------------------------------------------------------------
// Homestead Forge - Offline Sync Hook
// ---------------------------------------------------------------------------
//
// Manages the offline mutation queue.  Queued operations are persisted in
// MMKV / localStorage and processed sequentially when connectivity returns.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SyncQueueItem } from '../types';
import { useAppStore } from '../stores/appStore';

// ---------------------------------------------------------------------------
// Storage adapter (mirrors the one in useAutosave)
// ---------------------------------------------------------------------------

interface StorageAdapter {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

function createStorageAdapter(): StorageAdapter {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new () => {
        getString: (key: string) => string | undefined;
        set: (key: string, value: string) => void;
        delete: (key: string) => void;
      };
    };
    const instance = new MMKV();
    return {
      getString: (key) => instance.getString(key),
      set: (key, value) => instance.set(key, value),
      delete: (key) => instance.delete(key),
    };
  } catch {
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
          /* noop */
        }
      },
      delete: (key) => {
        try {
          globalThis.localStorage?.removeItem(key);
        } catch {
          /* noop */
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
// Queue helpers
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
  if (queue.length === 0) {
    storage.delete(QUEUE_KEY);
  } else {
    storage.set(QUEUE_KEY, JSON.stringify(queue));
  }
}

// ---------------------------------------------------------------------------
// Remote sync stub
// ---------------------------------------------------------------------------

/**
 * Placeholder for the Supabase mutation runner.  The app layer should replace
 * this with a function that routes the SyncQueueItem to the correct table and
 * operation (insert / update / delete).
 */
async function processQueueItem(item: SyncQueueItem): Promise<boolean> {
  void item;
  return true;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseOfflineSyncReturn {
  /** Whether the device is currently online. */
  isOnline: boolean;
  /** Number of operations waiting to be synced. */
  pendingCount: number;
  /** Manually trigger a sync attempt for all queued items. */
  forceSync: () => Promise<void>;
  /** Enqueue a mutation to be synced later. */
  enqueue: (item: Omit<SyncQueueItem, 'id' | 'created_at'>) => void;
}

export function useOfflineSync(): UseOfflineSyncReturn {
  const setOnlineStatus = useAppStore((s) => s.setOnlineStatus);
  const setSyncStatus = useAppStore((s) => s.setSyncStatus);
  const setPendingSyncCount = useAppStore((s) => s.setPendingSyncCount);

  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(() => loadQueue().length);
  const isSyncingRef = useRef(false);

  // Sync all queued items sequentially.
  const processQueue = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus('syncing');

    const queue = loadQueue();
    const remaining: SyncQueueItem[] = [];
    let hadError = false;

    for (const item of queue) {
      try {
        const ok = await processQueueItem(item);
        if (!ok) {
          remaining.push(item);
          hadError = true;
        }
      } catch {
        remaining.push(item);
        hadError = true;
      }
    }

    persistQueue(remaining);
    setPendingCount(remaining.length);
    setPendingSyncCount(remaining.length);
    setSyncStatus(hadError ? 'error' : 'idle');
    isSyncingRef.current = false;
  }, [setSyncStatus, setPendingSyncCount]);

  // Subscribe to connectivity.
  useEffect(() => {
    const unsubscribe = subscribeToConnectivity((online) => {
      setIsOnline(online);
      setOnlineStatus(online);

      if (online) {
        void processQueue();
      }
    });

    // On mount, refresh pending count.
    setPendingCount(loadQueue().length);

    return unsubscribe;
  }, [setOnlineStatus, processQueue]);

  // Public enqueue.
  const enqueue = useCallback(
    (item: Omit<SyncQueueItem, 'id' | 'created_at'>) => {
      const full: SyncQueueItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        created_at: new Date().toISOString(),
      };
      const queue = loadQueue();
      queue.push(full);
      persistQueue(queue);
      const count = queue.length;
      setPendingCount(count);
      setPendingSyncCount(count);
    },
    [setPendingSyncCount],
  );

  // Public force sync.
  const forceSync = useCallback(async () => {
    await processQueue();
  }, [processQueue]);

  return { isOnline, pendingCount, forceSync, enqueue };
}
