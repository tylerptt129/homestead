import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  radii,
  shadows,
  spacing,
} from '../theme/tokens';
import { Text } from '../atoms/Text';
import { ProgressRing } from '../molecules/ProgressRing';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModuleCardProps {
  /** Module icon element (e.g. <Icon icon={Hammer} />) */
  icon: React.ReactNode;
  /** Module title */
  title: string;
  /** Short module description */
  description: string;
  /** Completion percentage (0-100) */
  completionPercent: number;
  /** Total number of steps */
  totalSteps: number;
  /** Number of completed steps */
  completedSteps: number;
  /** Press handler (navigates to module detail) */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ModuleCard({
  icon,
  title,
  description,
  completionPercent,
  totalSteps,
  completedSteps,
  onPress,
  disabled = false,
  style,
}: ModuleCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const clamped = Math.max(0, Math.min(100, completionPercent));

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          backgroundColor: colors.card,
          transform: [{ scale: scaleAnim }],
          ...shadows.md,
        },
        style,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || !onPress}
        style={[styles.pressable, { opacity: disabled ? 0.5 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${clamped}% complete, ${completedSteps} of ${totalSteps} steps`}
        accessibilityState={{ disabled }}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text
              variant="h3"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              variant="bodySmall"
              muted
              numberOfLines={2}
              style={styles.description}
            >
              {description}
            </Text>
          </View>
          <ProgressRing percentage={clamped} size={52} strokeWidth={5}>
            <Text
              variant="caption"
              style={{
                fontFamily: fontFamilies.monoMedium,
                color: colors.primary,
                fontSize: 11,
              }}
            >
              {Math.round(clamped)}%
            </Text>
          </ProgressRing>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text
            variant="caption"
            muted
            style={{ fontFamily: fontFamilies.mono }}
          >
            {completedSteps}/{totalSteps} steps
          </Text>
          {clamped === 100 && (
            <Text
              variant="caption"
              style={{ color: colors.accent, fontFamily: fontFamilies.bodyMedium }}
            >
              Complete
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  pressable: {
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
