import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Icon } from '../atoms';

type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

interface Step {
  title: string;
  description: string;
  estimatedTime: string;
}

interface StepItemProps {
  step: Step;
  status: StepStatus;
  stepNumber: number;
  onPress: () => void;
  locked?: boolean;
  isLast?: boolean;
}

export default function StepItem({
  step,
  status,
  stepNumber,
  onPress,
  locked = false,
  isLast = false,
}: StepItemProps) {
  const { theme } = useTheme();

  const statusColors: Record<StepStatus, string> = {
    not_started: theme.colors.textMuted,
    in_progress: theme.colors.primary,
    completed: theme.colors.accent,
    skipped: theme.colors.textMuted,
  };

  const statusIcons: Record<StepStatus, string> = {
    not_started: 'ChevronRight',
    in_progress: 'ArrowRight',
    completed: 'Check',
    skipped: 'X',
  };

  const circleColor = statusColors[status];
  const isFilled = status === 'in_progress' || status === 'completed';

  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      style={[styles.container, locked && styles.locked]}
    >
      {/* Left: Step number circle + trail line */}
      <View style={styles.leftColumn}>
        <View
          style={[
            styles.circle,
            {
              borderColor: circleColor,
              backgroundColor: isFilled ? circleColor : 'transparent',
            },
          ]}
        >
          <Text
            variant="caption"
            style={{
              color: isFilled ? theme.colors.base : circleColor,
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {stepNumber}
          </Text>
        </View>
        {!isLast && (
          <View
            style={[
              styles.trailLine,
              { backgroundColor: theme.colors.border },
            ]}
          />
        )}
      </View>

      {/* Middle: Title + description */}
      <View style={styles.middle}>
        <Text
          variant="body"
          style={{
            fontWeight: '600',
            color: locked ? theme.colors.textMuted : theme.colors.text,
          }}
        >
          {step.title}
        </Text>
        <Text variant="caption" numberOfLines={2} style={styles.description}>
          {step.description}
        </Text>
        <Text variant="caption" style={styles.time}>
          {step.estimatedTime}
        </Text>
      </View>

      {/* Right: Status icon */}
      <View style={styles.rightIcon}>
        {locked ? (
          <Icon name="Lock" size={18} color={theme.colors.textMuted} />
        ) : (
          <Icon
            name={statusIcons[status]}
            size={18}
            color={statusColors[status]}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  locked: {
    opacity: 0.5,
  },
  leftColumn: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 4,
  },
  middle: {
    flex: 1,
    paddingBottom: 12,
  },
  description: {
    marginTop: 2,
  },
  time: {
    marginTop: 4,
  },
  rightIcon: {
    paddingTop: 4,
    paddingLeft: 8,
  },
});
