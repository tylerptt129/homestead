import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  spacing,
  durations,
} from '../theme/tokens';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button text */
  label: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Left icon element */
  iconLeft?: React.ReactNode;
  /** Right icon element */
  iconRight?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Press handler */
  onPress?: (event: GestureResponderEvent) => void;
  /** Additional container styles */
  style?: ViewStyle;
}

// ─── Size Config ────────────────────────────────────────────────────────────

const sizeConfig: Record<
  ButtonSize,
  { paddingV: number; paddingH: number; fontSize: number; lineHeight: number }
> = {
  sm: { paddingV: spacing.sm, paddingH: spacing.base, fontSize: fontSizes.bodySmall, lineHeight: lineHeights.bodySmall },
  md: { paddingV: spacing.md, paddingH: spacing.xl, fontSize: fontSizes.body, lineHeight: lineHeights.body },
  lg: { paddingV: spacing.base, paddingH: spacing['2xl'], fontSize: fontSizes.h3, lineHeight: lineHeights.h3 },
};

// ─── Component ──────────────────────────────────────────────────────────────

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  onPress,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  // Resolve variant styles
  const variantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: disabled ? colors.primaryMuted : colors.primary,
          },
          text: { color: '#1C1A17' }, // always dark text on gold
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: disabled ? colors.border : colors.primary,
          },
          text: { color: disabled ? colors.textMuted : colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: disabled ? colors.primaryMuted : colors.danger,
          },
          text: { color: '#FFFFFF' },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: disabled ? colors.textMuted : colors.primary },
        };
    }
  };

  const vs = variantStyles();
  const sc = sizeConfig[size];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.container,
          {
            paddingVertical: sc.paddingV,
            paddingHorizontal: sc.paddingH,
            opacity: disabled ? 0.6 : 1,
          },
          vs.container,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={vs.text.color as string}
            style={styles.loader}
          />
        ) : (
          <>
            {iconLeft && <>{iconLeft}</>}
            <Text
              variant="body"
              style={[
                {
                  fontFamily: fontFamilies.bodySemiBold,
                  fontSize: sc.fontSize,
                  lineHeight: sc.lineHeight,
                  color: vs.text.color,
                  marginLeft: iconLeft ? spacing.sm : 0,
                  marginRight: iconRight ? spacing.sm : 0,
                },
              ]}
            >
              {label}
            </Text>
            {iconRight && <>{iconRight}</>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    minHeight: 48,
  },
  loader: {
    marginHorizontal: spacing.sm,
  },
});
