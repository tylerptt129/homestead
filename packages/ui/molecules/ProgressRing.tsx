import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme';
import { durations } from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProgressRingProps {
  /** Completion percentage (0-100) */
  percentage: number;
  /** Outer diameter of the ring in pixels (default 64) */
  size?: number;
  /** Stroke width of the ring (default 6) */
  strokeWidth?: number;
  /** Override the fill (progress) color */
  color?: string;
  /** Override the track (background) color */
  trackColor?: string;
  /** Whether to animate on mount / value change */
  animated?: boolean;
  /** Content rendered in the center of the ring */
  children?: React.ReactNode;
}

// We need an animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Component ──────────────────────────────────────────────────────────────

export function ProgressRing({
  percentage,
  size = 64,
  strokeWidth = 6,
  color,
  trackColor,
  animated = true,
  children,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Clamp percentage
  const clamped = Math.max(0, Math.min(100, percentage));

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clamped,
        duration: durations.slow * 2,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(clamped);
    }
  }, [clamped, animated, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });

  const resolvedColor = color ?? colors.primary;
  const resolvedTrackColor = trackColor ?? colors.border;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedTrackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {children && (
        <View style={[StyleSheet.absoluteFill, styles.childrenContainer]}>
          {children}
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  childrenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
