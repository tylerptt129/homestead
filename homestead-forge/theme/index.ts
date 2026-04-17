import React, { createContext, useContext } from 'react';
import { colors, ColorScheme, ThemeMode } from './colors';
import { fonts, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius } from './spacing';

export { colors, fonts, fontSizes, fontWeights, lineHeights, spacing, borderRadius };
export type { ColorScheme, ThemeMode };

export interface Theme {
  colors: ColorScheme;
  fonts: typeof fonts;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  mode: ThemeMode;
}

export function getTheme(mode: ThemeMode): Theme {
  return {
    colors: colors[mode],
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    spacing,
    borderRadius,
    mode,
  };
}

const ThemeContext = createContext<{
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}>({
  theme: getTheme('dark'),
  mode: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export { ThemeContext };
