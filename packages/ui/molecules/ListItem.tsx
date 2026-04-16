import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { fontFamilies, radii, spacing, durations } from '../theme/tokens';
import { Text } from '../atoms/Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ListItemProps {
  /** Left icon element (e.g. <Icon icon={Home} />) */
  iconLeft?: React.ReactNode;
  /** Primary title text */
  title: string;
  /** Secondary description text */
  subtitle?: string;
  /** Right accessory element (chevron, switch, badge, etc.) */
  accessoryRight?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ListItem({
  iconLeft,
  title,
  subtitle,
  accessoryRight,
  onPress,
  disabled = false,
  style,
}: ListItemProps) {
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

  const content = (
    <View style={styles.inner}>
      {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
      <View style={styles.textContainer}>
        <Text
          variant="body"
          style={{ fontFamily: fontFamilies.bodyMedium, color: colors.text }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" muted numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {accessoryRight && (
        <View style={styles.accessory}>{accessoryRight}</View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface, transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        <Pressable
          onPress={disabled ? undefined : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={({ pressed }) => [
            styles.pressable,
            pressed && { backgroundColor: colors.surfaceAlt },
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        style,
      ]}
    >
      <View style={styles.pressable}>{content}</View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  pressable: {
    borderRadius: radii.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    minHeight: 56,
  },
  iconLeft: {
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  accessory: {
    marginLeft: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
