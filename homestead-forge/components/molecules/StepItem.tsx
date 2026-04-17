import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Animated } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Icon } from '../atoms';
import type { StepStatus } from '../../types';

interface Step {
  title: string;
  description: string;
  estimatedTime: string;
  estimatedCostLow: number;
  estimatedCostHigh: number;
  tips: string[];
}

interface StepItemProps {
  step: Step;
  status: StepStatus;
  stepNumber: number;
  onPress: () => void;
  onToggleStatus?: (newStatus: StepStatus) => void;
  locked?: boolean;
  isLast?: boolean;
  actualCost?: number;
}

export default function StepItem({
  step, status, stepNumber, onPress, onToggleStatus,
  locked = false, isLast = false, actualCost,
}: StepItemProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const statusColors: Record<StepStatus, string> = {
    not_started: theme.colors.textMuted,
    in_progress: theme.colors.primary,
    completed: theme.colors.accent,
    skipped: theme.colors.textMuted,
  };

  const circleColor = statusColors[status];
  const isActive = status === 'in_progress';
  const isDone = status === 'completed';
  const isSkipped = status === 'skipped';

  const handleCheckPress = () => {
    if (locked || !onToggleStatus) return;
    if (status === 'not_started') onToggleStatus('in_progress');
    else if (status === 'in_progress') onToggleStatus('completed');
    else if (status === 'completed') onToggleStatus('in_progress');
    else if (status === 'skipped') onToggleStatus('in_progress');
  };

  const costStr = step.estimatedCostLow === 0 && step.estimatedCostHigh === 0
    ? 'Free' : `$${step.estimatedCostLow} - $${step.estimatedCostHigh}`;

  return (
    <View style={[styles.container, locked && styles.locked]}>
      <View style={styles.leftColumn}>
        <Pressable onPress={handleCheckPress} style={[styles.circle, {
          borderColor: circleColor,
          backgroundColor: isDone ? circleColor : isActive ? circleColor + '20' : 'transparent',
        }]}>
          {isDone ? (
            <Icon name="Check" size={14} color={theme.colors.base} />
          ) : isSkipped ? (
            <Icon name="X" size={12} color={circleColor} />
          ) : (
            <Text variant="caption" style={{ color: isActive ? circleColor : theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>
              {stepNumber}
            </Text>
          )}
        </Pressable>
        {!isLast && (
          <View style={[styles.trailLine, { backgroundColor: isDone ? theme.colors.accent + '40' : theme.colors.border }]} />
        )}
      </View>

      <View style={[styles.middle, { paddingBottom: isLast ? 0 : 12 }]}>
        <Pressable onPress={() => !locked && setExpanded(!expanded)} style={[styles.titleCard, {
          backgroundColor: isActive ? theme.colors.primary + '10' : theme.colors.card,
          borderColor: isActive ? theme.colors.primary + '30' : isDone ? theme.colors.accent + '30' : theme.colors.border,
        }]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text variant="body" style={{
                fontWeight: '600',
                color: locked ? theme.colors.textMuted : theme.colors.text,
                textDecorationLine: isDone ? 'line-through' : 'none',
              }}>{step.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Icon name="Clock" size={12} color={theme.colors.textMuted} />
                  <Text variant="caption" style={{ fontSize: 11, fontFamily: f }}>{step.estimatedTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="DollarSign" size={12} color={theme.colors.textMuted} />
                  <Text variant="caption" style={{ fontSize: 11, fontFamily: f }}>{actualCost ? `$${actualCost} spent` : costStr}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rightIcons}>
              {locked ? (
                <Icon name="Lock" size={16} color={theme.colors.textMuted} />
              ) : (
                <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} color={theme.colors.textMuted} />
              )}
            </View>
          </View>

          {expanded && !locked && (
            <View style={styles.expandedContent}>
              <Text variant="caption" style={[styles.description, { color: theme.colors.textMuted }]}>{step.description}</Text>
              {step.tips.length > 0 && (
                <View style={styles.quickTip}>
                  <Icon name="Lightbulb" size={14} color={theme.colors.warning} />
                  <Text variant="caption" style={{ flex: 1, fontFamily: fa, fontSize: 14, color: theme.colors.text }}>{step.tips[0]}</Text>
                </View>
              )}
              <View style={styles.actionRow}>
                <Pressable onPress={onPress} style={[styles.detailBtn, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name="FileText" size={14} color={theme.colors.primary} />
                  <Text variant="caption" style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 12 }}>Full Guide</Text>
                </Pressable>
                {status === 'not_started' && onToggleStatus && (
                  <Pressable onPress={() => onToggleStatus('in_progress')} style={[styles.detailBtn, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Icon name="Play" size={14} color={theme.colors.primary} />
                    <Text variant="caption" style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 12 }}>Start</Text>
                  </Pressable>
                )}
                {status === 'in_progress' && onToggleStatus && (
                  <Pressable onPress={() => onToggleStatus('completed')} style={[styles.detailBtn, { backgroundColor: theme.colors.accent + '15' }]}>
                    <Icon name="Check" size={14} color={theme.colors.accent} />
                    <Text variant="caption" style={{ color: theme.colors.accent, fontWeight: '600', fontSize: 12 }}>Complete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start' },
  locked: { opacity: 0.5 },
  leftColumn: { alignItems: 'center', width: 36, marginRight: 12 },
  circle: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  trailLine: { width: 2, flex: 1, minHeight: 16, marginTop: 4 },
  middle: { flex: 1 },
  titleCard: { borderRadius: 12, borderWidth: 1, padding: 12, overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleContent: { flex: 1 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rightIcons: { paddingLeft: 8, alignItems: 'center', gap: 8 },
  expandedContent: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  description: { lineHeight: 20, marginBottom: 8 },
  quickTip: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(255,200,0,0.06)', marginBottom: 10 },
  actionRow: { flexDirection: 'row', gap: 8 },
  detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
});
