import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  color,
  showLabel = true,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const fillColor = color || theme.colors.primary;
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View
          style={
            [
              styles.ring,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                background: `conic-gradient(${fillColor} ${percent}%, ${theme.colors.border} ${percent}%)`,
              },
            ] as any
          }
        >
          <View
            style={[
              styles.inner,
              {
                width: size - strokeWidth * 2,
                height: size - strokeWidth * 2,
                borderRadius: (size - strokeWidth * 2) / 2,
                backgroundColor: theme.colors.card,
              },
            ]}
          >
            {showLabel && (
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.text,
                    fontSize: size * 0.22,
                  },
                ]}
              >
                {percent}%
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Native fallback - simple circle with percentage
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text,
                fontSize: size * 0.22,
              },
            ]}
          >
            {percent}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
