import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { fontFamilies, radii, shadows, spacing, durations } from '../theme/tokens';
import { Text } from '../atoms/Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** The message to display */
  message: string;
  /** Visual variant (default 'success') */
  variant?: ToastVariant;
  /** Whether the toast is currently visible */
  visible: boolean;
  /** Auto-dismiss duration in ms (default 2500, 0 to disable) */
  duration?: number;
  /** Called when the toast should hide */
  onDismiss?: () => void;
  /** Optional left icon element */
  icon?: React.ReactNode;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Toast({
  message,
  variant = 'success',
  visible,
  duration = 2500,
  onDismiss,
  icon,
  style,
}: ToastProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: durations.normal,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: durations.normal,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  }, [opacity, translateY, onDismiss]);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: durations.normal,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: durations.normal,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0) {
        dismissTimer.current = setTimeout(hide, duration);
      }
    } else {
      hide();
    }

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
    };
  }, [visible, duration, hide, opacity, translateY]);

  const accentColor = (() => {
    switch (variant) {
      case 'success':
        return colors.accent;
      case 'error':
        return colors.danger;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.primary;
    }
  })();

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: colors.surface,
          borderLeftColor: accentColor,
          ...shadows.md,
        },
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        variant="bodySmall"
        style={{
          fontFamily: fontFamilies.bodyMedium,
          color: colors.text,
          flex: 1,
        }}
        numberOfLines={2}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radii.md,
    borderLeftWidth: 4,
    zIndex: 9999,
  },
  icon: {
    marginRight: spacing.sm,
  },
});
