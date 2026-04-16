import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  type TypographyVariant,
} from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TextProps extends RNTextProps {
  /** Typography variant */
  variant?: TypographyVariant;
  /** Override color with a raw string */
  color?: string;
  /** Center text */
  center?: boolean;
  /** Use muted text color */
  muted?: boolean;
}

// ─── Font Family Map ────────────────────────────────────────────────────────

const variantFontFamily: Record<TypographyVariant, string> = {
  display: fontFamilies.headerBold,
  h1: fontFamilies.headerBold,
  h2: fontFamilies.header,
  h3: fontFamilies.bodySemiBold,
  body: fontFamilies.body,
  bodySmall: fontFamilies.body,
  caption: fontFamilies.bodyMedium,
  mono: fontFamilies.mono,
  handwritten: fontFamilies.handwritten,
};

// ─── Component ──────────────────────────────────────────────────────────────

export function Text({
  variant = 'body',
  color,
  center,
  muted,
  style,
  ...rest
}: TextProps) {
  const { colors } = useTheme();

  const resolvedColor = color ?? (muted ? colors.textMuted : colors.text);

  const variantStyle: TextStyle = {
    fontFamily: variantFontFamily[variant],
    fontSize: fontSizes[variant],
    lineHeight: lineHeights[variant],
    color: resolvedColor,
    textAlign: center ? 'center' : undefined,
  };

  return <RNText style={[variantStyle, style]} {...rest} />;
}

// Optional: pre-built style helpers
export const textStyles = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
