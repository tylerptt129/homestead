import { useState, useEffect, useRef, useCallback } from 'react';

const AUTOSAVE_INTERVAL = 3000;

export function useAutosave<T>(
  key: string,
  data: T,
  saveFn: (data: T) => Promise<void>,
  enabled: boolean = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSavedRef = useRef<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Save to localStorage immediately on every change
  useEffect(() => {
    if (!enabled) return;
    const serialized = JSON.stringify(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`local_${key}`, serialized);
    }
  }, [data, key, enabled]);

  // Debounced save to remote
  useEffect(() => {
    if (!enabled) return;
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveFn(data);
        lastSavedRef.current = serialized;
        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        // Data is still safe in localStorage
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, key, saveFn, enabled]);

  // Restore from localStorage
  const restore = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;
    const local = localStorage.getItem(`local_${key}`);
    return local ? JSON.parse(local) : null;
  }, [key]);

  return { restore, saveStatus };
}
