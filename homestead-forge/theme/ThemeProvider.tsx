import React, { useState, useMemo, ReactNode } from 'react';
import { ThemeContext, getTheme, ThemeMode } from './index';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const value = useMemo(() => ({
    theme: getTheme(mode),
    mode,
    toggleTheme: () => setMode(m => m === 'dark' ? 'light' : 'dark'),
  }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
