import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from '../theme';
import {
  fontFamilies,
  spacing,
} from '../theme/tokens';
import { Text } from '../atoms/Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'locked';

export interface Step {
  /** Unique identifier for the step */
  id: string;
  /** Step title */
  title: string;
  /** Optional subtitle / duration estimate */
  subtitle?: string;
  /** Step status */
  status: StepStatus;
}

export interface StepTrackerProps {
  /** Array of steps to render */
  steps: Step[];
  /** Called when a step is pressed (only complete and current steps are tappable) */
  onStepPress?: (step: Step) => void;
  /** Optional lock icon element for locked steps */
  lockIcon?: React.ReactNode;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Marker Constants ───────────────────────────────────────────────────────

const MARKER_SIZE = 24;
const MARKER_RADIUS = MARKER_SIZE / 2;
const INNER_RADIUS = 5;
const LINE_WIDTH = 2;
const PULSE_OUTER_RADIUS = MARKER_RADIUS + 4;

// ─── Pulsing Dot (for "current" step) ──────────────────────────────────────

function PulsingDot({ color }: { color: string }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={styles.markerWrapper}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: color,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <Svg width={MARKER_SIZE} height={MARKER_SIZE}>
        <Circle
          cx={MARKER_RADIUS}
          cy={MARKER_RADIUS}
          r={INNER_RADIUS + 2}
          fill={color}
        />
      </Svg>
    </View>
  );
}

// ─── Static Markers ─────────────────────────────────────────────────────────

function CompletedMarker({ color }: { color: string }) {
  return (
    <View style={styles.markerWrapper}>
      <Svg width={MARKER_SIZE} height={MARKER_SIZE}>
        <Circle
          cx={MARKER_RADIUS}
          cy={MARKER_RADIUS}
          r={MARKER_RADIUS - 1}
          fill={color}
        />
        {/* Checkmark rendered as two lines */}
        <Line
          x1={7}
          y1={12}
          x2={10.5}
          y2={15.5}
          stroke="#1C1A17"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Line
          x1={10.5}
          y1={15.5}
          x2={17}
          y2={8.5}
          stroke="#1C1A17"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

function UpcomingMarker({ borderColor }: { borderColor: string }) {
  return (
    <View style={styles.markerWrapper}>
      <Svg width={MARKER_SIZE} height={MARKER_SIZE}>
        <Circle
          cx={MARKER_RADIUS}
          cy={MARKER_RADIUS}
          r={MARKER_RADIUS - 2}
          stroke={borderColor}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}

function LockedMarker({
  borderColor,
  lockIcon,
}: {
  borderColor: string;
  lockIcon?: React.ReactNode;
}) {
  return (
    <View style={styles.markerWrapper}>
      <Svg width={MARKER_SIZE} height={MARKER_SIZE}>
        <Circle
          cx={MARKER_RADIUS}
          cy={MARKER_RADIUS}
          r={MARKER_RADIUS - 2}
          stroke={borderColor}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="none"
        />
      </Svg>
      {lockIcon && (
        <View style={styles.lockOverlay}>{lockIcon}</View>
      )}
    </View>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function StepTracker({
  steps,
  onStepPress,
  lockIcon,
  style,
}: StepTrackerProps) {
  const { colors } = useTheme();

  const renderMarker = (status: StepStatus) => {
    switch (status) {
      case 'complete':
        return <CompletedMarker color={colors.accent} />;
      case 'current':
        return <PulsingDot color={colors.primary} />;
      case 'upcoming':
        return <UpcomingMarker borderColor={colors.border} />;
      case 'locked':
        return <LockedMarker borderColor={colors.border} lockIcon={lockIcon} />;
    }
  };

  const isTappable = (status: StepStatus) =>
    status === 'complete' || status === 'current';

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const tappable = isTappable(step.status) && !!onStepPress;

        return (
          <View key={step.id} style={styles.row}>
            {/* Marker column */}
            <View style={styles.markerColumn}>
              {renderMarker(step.status)}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        step.status === 'complete'
                          ? colors.accent
                          : colors.border,
                    },
                  ]}
                />
              )}
            </View>

            {/* Text column */}
            <View
              style={[
                styles.textColumn,
                !isLast && styles.textColumnWithConnector,
              ]}
              accessible={tappable}
              accessibilityRole={tappable ? 'button' : 'text'}
              // Using onStartShouldSetResponder as a lightweight tap handler
              // to avoid nesting Pressable inside ScrollView issues
              onStartShouldSetResponder={() => tappable}
              onResponderRelease={() => {
                if (tappable) onStepPress!(step);
              }}
            >
              <Text
                variant="body"
                style={{
                  fontFamily: fontFamilies.bodyMedium,
                  color:
                    step.status === 'locked'
                      ? colors.textMuted
                      : colors.text,
                }}
                numberOfLines={1}
              >
                {step.title}
              </Text>
              {step.subtitle && (
                <Text variant="caption" muted numberOfLines={1}>
                  {step.subtitle}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  markerColumn: {
    width: MARKER_SIZE + spacing.base,
    alignItems: 'center',
  },
  markerWrapper: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: PULSE_OUTER_RADIUS * 2,
    height: PULSE_OUTER_RADIUS * 2,
    borderRadius: PULSE_OUTER_RADIUS,
    borderWidth: 2,
  },
  lockOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: LINE_WIDTH,
    flex: 1,
    minHeight: 24,
  },
  textColumn: {
    flex: 1,
    paddingTop: 1,
    paddingBottom: spacing.sm,
  },
  textColumnWithConnector: {
    paddingBottom: spacing.lg,
  },
});
