import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { spacing } from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DividerProps {
  /** Vertical margin above and below */
  verticalSpacing?: number;
  /** Custom color override */
  color?: string;
  /** Thickness of the line (default 1) */
  thickness?: number;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Divider({
  verticalSpacing = spacing.base,
  color,
  thickness = StyleSheet.hairlineWidth,
  style,
}: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          marginVertical: verticalSpacing,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.line,
          {
            backgroundColor: color ?? colors.border,
            height: thickness,
          },
        ]}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  line: {
    width: '100%',
  },
});
