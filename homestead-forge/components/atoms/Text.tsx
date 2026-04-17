import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  Platform,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

type TextVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'mono'
  | 'accent';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

const webFonts: Record<TextVariant, string> = {
  display: '"Playfair Display", Georgia, serif',
  heading: '"Playfair Display", Georgia, serif',
  subheading: '"Source Sans 3", "Source Sans Pro", system-ui, sans-serif',
  body: '"Source Sans 3", "Source Sans Pro", system-ui, sans-serif',
  caption: '"Source Sans 3", "Source Sans Pro", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
  accent: '"Caveat", cursive',
};

const nativeFonts: Record<TextVariant, string> = {
  display: 'Playfair Display',
  heading: 'Playfair Display',
  subheading: 'Source Sans 3',
  body: 'Source Sans 3',
  caption: 'Source Sans 3',
  mono: 'JetBrains Mono',
  accent: 'Caveat',
};

export default function Text({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const { theme } = useTheme();

  const fontFamily = Platform.select({
    web: webFonts[variant],
    default: nativeFonts[variant],
  });

  const variantStyles: Record<TextVariant, TextStyle> = {
    display: {
      fontFamily,
      fontSize: theme.fontSizes['3xl'],
      fontWeight: theme.fontWeights.bold,
      lineHeight: theme.fontSizes['3xl'] * theme.lineHeights.tight,
      color: color || theme.colors.text,
    },
    heading: {
      fontFamily,
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontWeights.semibold,
      lineHeight: theme.fontSizes['2xl'] * theme.lineHeights.tight,
      color: color || theme.colors.text,
    },
    subheading: {
      fontFamily,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
      lineHeight: theme.fontSizes.lg * theme.lineHeights.normal,
      color: color || theme.colors.text,
    },
    body: {
      fontFamily,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.normal,
      lineHeight: theme.fontSizes.md * theme.lineHeights.normal,
      color: color || theme.colors.text,
    },
    caption: {
      fontFamily,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.normal,
      lineHeight: theme.fontSizes.sm * theme.lineHeights.normal,
      color: color || theme.colors.textMuted,
    },
    mono: {
      fontFamily,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.normal,
      lineHeight: theme.fontSizes.sm * theme.lineHeights.normal,
      color: color || theme.colors.text,
    },
    accent: {
      fontFamily,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.normal,
      lineHeight: theme.fontSizes.xl * theme.lineHeights.normal,
      color: color || theme.colors.text,
    },
  };

  return (
    <RNText
      style={[variantStyles[variant], align ? { textAlign: align } : undefined, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
