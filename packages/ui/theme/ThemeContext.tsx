import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextValue {
  /** The user-selected mode preference */
  mode: ThemeMode;
  /** The resolved scheme (never 'auto') */
  scheme: 'light' | 'dark';
  /** Current color tokens based on resolved scheme */
  colors: ThemeColors;
  /** Whether the resolved scheme is dark */
  isDark: boolean;
  /** Change the theme mode preference */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (resets auto) */
  toggle: () => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  /** Initial mode, defaults to 'auto' */
  initialMode?: ThemeMode;
  children: React.ReactNode;
}

export function ThemeProvider({
  initialMode = 'auto',
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? 'dark'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme ?? 'dark');
    });
    return () => subscription.remove();
  }, []);

  const scheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'auto') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return mode;
  }, [mode, systemScheme]);

  const themeColors = useMemo(
    () => (scheme === 'light' ? lightColors : darkColors),
    [scheme]
  );

  const toggle = useCallback(() => {
    setMode((prev) => {
      const resolved = prev === 'auto' ? (systemScheme === 'light' ? 'light' : 'dark') : prev;
      return resolved === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors: themeColors,
      isDark: scheme === 'dark',
      setMode,
      toggle,
    }),
    [mode, scheme, themeColors, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
