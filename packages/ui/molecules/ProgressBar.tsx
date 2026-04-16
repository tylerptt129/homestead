import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { radii, durations } from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  /** Completion percentage (0-100) */
  percentage: number;
  /** Height of the bar (default 8) */
  height?: number;
  /** Override the fill color */
  color?: string;
  /** Override the track color */
  trackColor?: string;
  /** Whether to show the golden shimmer animation (default true) */
  shimmer?: boolean;
  /** Whether to animate width changes */
  animated?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProgressBar({
  percentage,
  height = 8,
  color,
  trackColor,
  shimmer = true,
  animated = true,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const clamped = Math.max(0, Math.min(100, percentage));

  // Animate width
  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: clamped,
        duration: durations.slow * 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(clamped);
    }
  }, [clamped, animated, widthAnim]);

  // Shimmer loop
  useEffect(() => {
    if (!shimmer || clamped === 0) return;

    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => loop.stop();
  }, [shimmer, clamped, shimmerAnim]);

  const resolvedColor = color ?? colors.primary;
  const resolvedTrackColor = trackColor ?? colors.border;

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 200],
  });

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: resolvedTrackColor,
          borderRadius: height / 2,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: clamped,
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthPercent,
            backgroundColor: resolvedColor,
            borderRadius: height / 2,
            height,
          },
        ]}
      >
        {shimmer && clamped > 0 && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                height,
                borderRadius: height / 2,
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
