import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { radii, shadows, spacing } from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CardProps {
  /** Header slot (rendered above content) */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Footer slot (rendered below content) */
  footer?: React.ReactNode;
  /** Press handler - enables press animation when provided */
  onPress?: () => void;
  /** Disable press interaction */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Card({
  header,
  children,
  footer,
  onPress,
  disabled = false,
  style,
}: CardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim, onPress]);

  const handlePressOut = useCallback(() => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim, onPress]);

  const cardContent = (
    <>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  const containerStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    ...shadows.md,
  };

  if (onPress) {
    return (
      <Animated.View
        style={[
          containerStyle,
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        <Pressable
          onPress={disabled ? undefined : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={styles.pressable}
          accessibilityRole="button"
        >
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {cardContent}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pressable: {
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(74,66,56,0.5)',
  },
});
