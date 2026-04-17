import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import Text from './Text';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const { theme } = useTheme();

  const variantStyles: Record<
    BadgeVariant,
    { container: ViewStyle; text: TextStyle }
  > = {
    default: {
      container: { backgroundColor: theme.colors.surfaceAlt },
      text: { color: theme.colors.text },
    },
    success: {
      container: { backgroundColor: theme.colors.accent },
      text: { color: '#FFFFFF' },
    },
    warning: {
      container: { backgroundColor: theme.colors.warning },
      text: { color: '#FFFFFF' },
    },
    danger: {
      container: { backgroundColor: theme.colors.danger },
      text: { color: '#FFFFFF' },
    },
    info: {
      container: { backgroundColor: theme.colors.primary },
      text: { color: theme.colors.base },
    },
  };

  const sizeStyles: Record<BadgeSize, { container: ViewStyle; fontSize: number }> = {
    sm: {
      container: {
        paddingHorizontal: 6,
        paddingVertical: 2,
      },
      fontSize: theme.fontSizes.xs,
    },
    md: {
      container: {
        paddingHorizontal: 10,
        paddingVertical: 4,
      },
      fontSize: theme.fontSizes.sm,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        currentVariant.container,
        currentSize.container,
      ]}
    >
      <Text
        variant="caption"
        style={[
          currentVariant.text,
          { fontSize: currentSize.fontSize, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
});
