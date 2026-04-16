/**
 * Homestead Forge Design Tokens
 * Mountain homestead aesthetic - dark mode default with light mode support
 */

// ─── Color Palette ──────────────────────────────────────────────────────────

export const colors = {
  // Dark mode (default)
  base: '#1C1A17', // charred timber
  surface: '#2A2520', // worn leather
  surfaceAlt: '#352F28', // aged pine
  card: '#3D362E', // bark brown
  primary: '#C8A96E', // wheat gold / firelight
  primaryMuted: '#9B8455', // dusty gold
  accent: '#5B8C5A', // mountain pine green
  accentAlt: '#7FB069', // spring meadow
  danger: '#C75D3A', // campfire ember
  warning: '#D4A437', // lantern amber
  text: '#E8E0D4', // parchment white
  textMuted: '#9C9284', // weathered stone
  border: '#4A4238', // fence post
  topo: 'rgba(200,169,110,0.06)', // topo line overlay

  // Light mode overrides
  baseLight: '#F5F0E8', // birch paper
  surfaceLight: '#FFFFFF', // clean linen
  textLight: '#2A2520', // dark leather

  // Derived light mode
  surfaceAltLight: '#EDE7DC',
  cardLight: '#FFFFFF',
  primaryMutedLight: '#8A7347',
  textMutedLight: '#6B6259',
  borderLight: '#D5CEC3',
  topoLight: 'rgba(200,169,110,0.08)',
} as const;

export type ColorToken = keyof typeof colors;

// ─── Dark & Light Theme Maps ────────────────────────────────────────────────

export interface ThemeColors {
  base: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  accentAlt: string;
  danger: string;
  warning: string;
  text: string;
  textMuted: string;
  border: string;
  topo: string;
}

export const darkColors: ThemeColors = {
  base: colors.base,
  surface: colors.surface,
  surfaceAlt: colors.surfaceAlt,
  card: colors.card,
  primary: colors.primary,
  primaryMuted: colors.primaryMuted,
  accent: colors.accent,
  accentAlt: colors.accentAlt,
  danger: colors.danger,
  warning: colors.warning,
  text: colors.text,
  textMuted: colors.textMuted,
  border: colors.border,
  topo: colors.topo,
};

export const lightColors: ThemeColors = {
  base: colors.baseLight,
  surface: colors.surfaceLight,
  surfaceAlt: colors.surfaceAltLight,
  card: colors.cardLight,
  primary: colors.primary,
  primaryMuted: colors.primaryMutedLight,
  accent: colors.accent,
  accentAlt: colors.accentAlt,
  danger: colors.danger,
  warning: colors.warning,
  text: colors.textLight,
  textMuted: colors.textMutedLight,
  border: colors.borderLight,
  topo: colors.topoLight,
};

// ─── Typography ─────────────────────────────────────────────────────────────

export const fontFamilies = {
  header: 'PlayfairDisplay',
  headerBold: 'PlayfairDisplay-Bold',
  headerItalic: 'PlayfairDisplay-Italic',
  body: 'SourceSans3',
  bodyMedium: 'SourceSans3-Medium',
  bodySemiBold: 'SourceSans3-SemiBold',
  bodyBold: 'SourceSans3-Bold',
  mono: 'JetBrainsMono',
  monoMedium: 'JetBrainsMono-Medium',
  handwritten: 'Caveat',
  handwrittenBold: 'Caveat-Bold',
} as const;

export const fontSizes = {
  display: 36,
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  mono: 14,
  handwritten: 18,
} as const;

export const lineHeights = {
  display: 44,
  h1: 36,
  h2: 32,
  h3: 28,
  body: 24,
  bodySmall: 20,
  caption: 16,
  mono: 20,
  handwritten: 24,
} as const;

export type TypographyVariant = keyof typeof fontSizes;

// ─── Spacing ────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

/** Spacing scale as an indexed array for numeric access */
export const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const;

export type SpacingToken = keyof typeof spacing;

// ─── Border Radius ──────────────────────────────────────────────────────────

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radii;

// ─── Shadows ────────────────────────────────────────────────────────────────

export const shadows = {
  sm: {
    shadowColor: '#1A1510',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1510',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A1510',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  warm: {
    shadowColor: '#C8A96E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  glow: {
    shadowColor: '#C8A96E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type ShadowToken = keyof typeof shadows;

// ─── Animation Durations ────────────────────────────────────────────────────

export const durations = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
