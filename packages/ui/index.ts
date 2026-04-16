// ─── Theme ─────────────────────────────────────────────────────────────────
export {
  colors,
  darkColors,
  lightColors,
  fontFamilies,
  fontSizes,
  lineHeights,
  spacing,
  spacingScale,
  radii,
  shadows,
  durations,
} from './theme';

export type {
  ColorToken,
  ThemeColors,
  TypographyVariant,
  SpacingToken,
  RadiusToken,
  ShadowToken,
} from './theme';

export { ThemeProvider, useTheme } from './theme';
export type { ThemeMode, ThemeContextValue, ThemeProviderProps } from './theme';

// ─── Atoms ─────────────────────────────────────────────────────────────────
export { Text, textStyles } from './atoms/Text';
export type { TextProps } from './atoms/Text';

export { Button } from './atoms/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './atoms/Button';

export { Input } from './atoms/Input';
export type { InputProps } from './atoms/Input';

export { Icon } from './atoms/Icon';
export type { IconProps } from './atoms/Icon';

export { Spacer } from './atoms/Spacer';
export type { SpacerProps } from './atoms/Spacer';

export { Divider } from './atoms/Divider';
export type { DividerProps } from './atoms/Divider';

// ─── Molecules ─────────────────────────────────────────────────────────────
export { Card } from './molecules/Card';
export type { CardProps } from './molecules/Card';

export { ProgressRing } from './molecules/ProgressRing';
export type { ProgressRingProps } from './molecules/ProgressRing';

export { ListItem } from './molecules/ListItem';
export type { ListItemProps } from './molecules/ListItem';

export { ProgressBar } from './molecules/ProgressBar';
export type { ProgressBarProps } from './molecules/ProgressBar';

export { Toast } from './molecules/Toast';
export type { ToastProps, ToastVariant } from './molecules/Toast';

// ─── Organisms ─────────────────────────────────────────────────────────────
export { ModuleCard } from './organisms/ModuleCard';
export type { ModuleCardProps } from './organisms/ModuleCard';

export { StepTracker } from './organisms/StepTracker';
export type { StepTrackerProps, Step, StepStatus } from './organisms/StepTracker';

export { JournalEntryCard } from './organisms/JournalEntryCard';
export type { JournalEntryCardProps, JournalPhoto } from './organisms/JournalEntryCard';
