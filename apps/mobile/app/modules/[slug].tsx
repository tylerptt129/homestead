import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  DollarSign,
  Lock,
  Loader2,
  SkipForward,
  Sprout,
  Droplets,
  Cookie,
  Rabbit,
  Zap,
  Hammer,
  Wrench,
  Leaf,
  ShieldCheck,
  Landmark,
  Fence,
  Wheat,
} from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import { ProgressBar } from '@homestead/ui/molecules/ProgressBar';
import type { Module, Step, StepStatus } from '@homestead/core/types';
import { formatCurrency } from '@homestead/core/utils/calculations';

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const MODULE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  'water-systems': Droplets,
  'garden-planning': Sprout,
  'food-preservation': Cookie,
  'livestock': Rabbit,
  'energy-power': Zap,
  'shelter-structures': Hammer,
  'tools-equipment': Wrench,
  'soil-composting': Leaf,
  'security-safety': ShieldCheck,
  'finances-legal': Landmark,
  'fencing-boundaries': Fence,
  'food-forest': Wheat,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#5B8C5A',
  intermediate: '#D4A437',
  advanced: '#C75D3A',
};

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const PLACEHOLDER_MODULES: Record<string, Module & { completedSteps: number; totalSteps: number; progressPercent: number }> = {
  'water-systems': {
    id: '1', slug: 'water-systems', title: 'Water Systems',
    description: 'Plan, install, and maintain water collection, storage, and distribution systems for your entire homestead. From rain barrels to well pumps, this module covers everything you need for a reliable water supply.',
    icon_name: 'Droplets', display_order: 1, color: '#4A90D9',
    estimated_hours: 40, difficulty: 'intermediate', created_at: '',
    completedSteps: 3, totalSteps: 10, progressPercent: 30,
  },
};

interface PlaceholderStep extends Step {
  status: StepStatus;
  locked: boolean;
}

const PLACEHOLDER_STEPS: PlaceholderStep[] = [
  { id: 's1', module_id: '1', title: 'Assess Water Needs', description: 'Calculate daily water needs for household, garden, and livestock.', detailed_guide: '', tips: [], estimated_cost_low: 0, estimated_cost_high: 50, estimated_time: '2-3 hours', display_order: 1, depends_on: [], tags: ['planning'], season_relevance: ['spring', 'fall'], resources: {}, created_at: '', status: 'completed', locked: false },
  { id: 's2', module_id: '1', title: 'Test Water Quality', description: 'Get water tested for pH, hardness, bacteria, and contaminants.', detailed_guide: '', tips: [], estimated_cost_low: 30, estimated_cost_high: 150, estimated_time: '1-2 hours + lab wait', display_order: 2, depends_on: [], tags: ['testing'], season_relevance: ['spring'], resources: {}, created_at: '', status: 'completed', locked: false },
  { id: 's3', module_id: '1', title: 'Install Rain Collection Barrels', description: 'Set up rain barrels at downspout locations with overflow management.', detailed_guide: '', tips: [], estimated_cost_low: 80, estimated_cost_high: 300, estimated_time: '4-6 hours', display_order: 3, depends_on: ['s1'], tags: ['installation'], season_relevance: ['spring', 'summer'], resources: {}, created_at: '', status: 'in_progress', locked: false },
  { id: 's4', module_id: '1', title: 'Build Gravity-Fed Distribution', description: 'Design and install gravity-fed pipes from storage to garden beds.', detailed_guide: '', tips: [], estimated_cost_low: 150, estimated_cost_high: 500, estimated_time: '8-12 hours', display_order: 4, depends_on: ['s3'], tags: ['installation'], season_relevance: ['spring', 'summer'], resources: {}, created_at: '', status: 'not_started', locked: false },
  { id: 's5', module_id: '1', title: 'Install Drip Irrigation', description: 'Set up drip lines for efficient watering of garden beds and orchard trees.', detailed_guide: '', tips: [], estimated_cost_low: 100, estimated_cost_high: 400, estimated_time: '6-8 hours', display_order: 5, depends_on: ['s4'], tags: ['installation'], season_relevance: ['spring'], resources: {}, created_at: '', status: 'not_started', locked: true },
  { id: 's6', module_id: '1', title: 'Set Up Well Pump System', description: 'Install or upgrade well pump with pressure tank and filtration.', detailed_guide: '', tips: [], estimated_cost_low: 500, estimated_cost_high: 3000, estimated_time: '1-2 days', display_order: 6, depends_on: ['s2'], tags: ['installation', 'major'], season_relevance: ['spring', 'fall'], resources: {}, created_at: '', status: 'completed', locked: false },
  { id: 's7', module_id: '1', title: 'Install Water Filtration', description: 'Add whole-house or point-of-use filtration based on water quality tests.', detailed_guide: '', tips: [], estimated_cost_low: 200, estimated_cost_high: 800, estimated_time: '4-6 hours', display_order: 7, depends_on: ['s6'], tags: ['installation'], season_relevance: ['spring', 'fall'], resources: {}, created_at: '', status: 'not_started', locked: false },
  { id: 's8', module_id: '1', title: 'Build Greywater System', description: 'Route greywater from sinks and showers to landscape irrigation.', detailed_guide: '', tips: [], estimated_cost_low: 200, estimated_cost_high: 600, estimated_time: '1-2 days', display_order: 8, depends_on: ['s4'], tags: ['installation'], season_relevance: ['spring', 'summer'], resources: {}, created_at: '', status: 'not_started', locked: true },
  { id: 's9', module_id: '1', title: 'Set Up Water Monitoring', description: 'Install flow meters and set up usage tracking.', detailed_guide: '', tips: [], estimated_cost_low: 50, estimated_cost_high: 200, estimated_time: '2-3 hours', display_order: 9, depends_on: ['s3', 's6'], tags: ['monitoring'], season_relevance: ['spring'], resources: {}, created_at: '', status: 'not_started', locked: true },
  { id: 's10', module_id: '1', title: 'Create Maintenance Schedule', description: 'Document all systems and create seasonal maintenance checklists.', detailed_guide: '', tips: [], estimated_cost_low: 0, estimated_cost_high: 0, estimated_time: '1-2 hours', display_order: 10, depends_on: [], tags: ['planning'], season_relevance: ['spring', 'fall'], resources: {}, created_at: '', status: 'not_started', locked: false },
];

// ---------------------------------------------------------------------------
// Status icon helper
// ---------------------------------------------------------------------------

function StepStatusIcon({ status, locked, color }: { status: StepStatus; locked: boolean; color: string }) {
  const { colors } = useTheme();

  if (locked) {
    return <Lock size={18} color={colors.textMuted} strokeWidth={1.5} />;
  }

  switch (status) {
    case 'completed':
      return <CheckCircle2 size={18} color={colors.accent} strokeWidth={2} />;
    case 'in_progress':
      return <Loader2 size={18} color={colors.primary} strokeWidth={2} />;
    case 'skipped':
      return <SkipForward size={18} color={colors.textMuted} strokeWidth={1.5} />;
    default:
      return <Circle size={18} color={colors.border} strokeWidth={1.5} />;
  }
}

// ---------------------------------------------------------------------------
// Module Detail Screen
// ---------------------------------------------------------------------------

export default function ModuleDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const moduleData = PLACEHOLDER_MODULES[slug ?? 'water-systems'] ?? PLACEHOLDER_MODULES['water-systems'];
  const steps = PLACEHOLDER_STEPS;
  const IconComponent = MODULE_ICON_MAP[slug ?? 'water-systems'] ?? Sprout;

  const totalEstimateLow = useMemo(
    () => steps.reduce((sum, s) => sum + s.estimated_cost_low, 0),
    [steps],
  );
  const totalEstimateHigh = useMemo(
    () => steps.reduce((sum, s) => sum + s.estimated_cost_high, 0),
    [steps],
  );

  const handleStepPress = useCallback(
    (stepId: string, locked: boolean) => {
      if (locked) return;
      router.push(`/modules/${slug}/steps/${stepId}`);
    },
    [router, slug],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section ────────────────────────────── */}
        <View style={[styles.hero, { backgroundColor: colors.card }]}>
          <View style={[styles.heroIcon, { backgroundColor: moduleData.color + '20' }]}>
            <IconComponent size={40} color={moduleData.color} strokeWidth={1.5} />
          </View>
          <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold, marginTop: spacing.md }}>
            {moduleData.title}
          </Text>
          <Text variant="body" muted style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            {moduleData.description}
          </Text>

          {/* Meta badges row */}
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[moduleData.difficulty] + '20' }]}>
              <Text
                variant="caption"
                style={{ color: DIFFICULTY_COLORS[moduleData.difficulty], fontFamily: fontFamilies.bodySemiBold }}
              >
                {moduleData.difficulty.charAt(0).toUpperCase() + moduleData.difficulty.slice(1)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
              <Clock size={12} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="caption" muted style={{ marginLeft: 4 }}>
                ~{moduleData.estimated_hours}h
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
              <DollarSign size={12} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="caption" muted style={{ marginLeft: 4 }}>
                {formatCurrency(totalEstimateLow)} - {formatCurrency(totalEstimateHigh)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Progress Bar ────────────────────────────── */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="body" style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold }}>
              Progress
            </Text>
            <Text variant="body" style={{ color: colors.primary, fontFamily: fontFamilies.monoMedium }}>
              {moduleData.completedSteps}/{moduleData.totalSteps} steps
            </Text>
          </View>
          <ProgressBar percentage={moduleData.progressPercent} height={10} />
        </View>

        {/* ── Step Tracker (Vertical Trail) ───────────── */}
        <View style={styles.stepsSection}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.base }}
          >
            Steps
          </Text>

          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isLocked = step.locked;
            const isActive = step.status === 'in_progress';

            return (
              <Pressable
                key={step.id}
                style={styles.stepRow}
                onPress={() => handleStepPress(step.id, isLocked)}
                disabled={isLocked}
                accessibilityRole="button"
                accessibilityLabel={`Step ${index + 1}: ${step.title}${isLocked ? ', locked' : ''}`}
                accessibilityState={{ disabled: isLocked }}
              >
                {/* Timeline rail */}
                <View style={styles.timeline}>
                  <StepStatusIcon status={step.status} locked={isLocked} color={colors.primary} />
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor:
                            step.status === 'completed' ? colors.accent + '40' : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Step content */}
                <View
                  style={[
                    styles.stepContent,
                    {
                      backgroundColor: isActive ? colors.primary + '10' : colors.card,
                      borderColor: isActive ? colors.primary + '30' : 'transparent',
                      borderWidth: isActive ? 1 : 0,
                      opacity: isLocked ? 0.5 : 1,
                    },
                  ]}
                >
                  <View style={styles.stepHeader}>
                    <Text
                      variant="body"
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.bodySemiBold,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {step.title}
                    </Text>
                    {!isLocked && (
                      <ChevronRight size={16} color={colors.textMuted} strokeWidth={1.5} />
                    )}
                  </View>
                  <Text variant="bodySmall" muted numberOfLines={2} style={{ marginTop: 2 }}>
                    {step.description}
                  </Text>
                  <View style={styles.stepMeta}>
                    <Text variant="caption" muted style={{ fontFamily: fontFamilies.mono }}>
                      {step.estimated_time}
                    </Text>
                    {(step.estimated_cost_low > 0 || step.estimated_cost_high > 0) && (
                      <Text variant="caption" muted style={{ fontFamily: fontFamilies.mono, marginLeft: spacing.md }}>
                        {formatCurrency(step.estimated_cost_low)} - {formatCurrency(step.estimated_cost_high)}
                      </Text>
                    )}
                  </View>
                  {isLocked && step.depends_on.length > 0 && (
                    <View style={[styles.lockNotice, { backgroundColor: colors.surfaceAlt }]}>
                      <Lock size={12} color={colors.textMuted} strokeWidth={1.5} />
                      <Text variant="caption" muted style={{ marginLeft: spacing.xs }}>
                        Requires prerequisite steps
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
  hero: {
    padding: spacing.xl,
    paddingTop: spacing.base,
    marginHorizontal: spacing.base,
    borderRadius: radii.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
  progressSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepsSection: {
    paddingHorizontal: spacing.base,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  timeline: {
    width: 32,
    alignItems: 'center',
    paddingTop: spacing.base,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: spacing.xs,
    marginBottom: -spacing.xs,
  },
  stepContent: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.md,
    marginLeft: spacing.sm,
    ...shadows.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepMeta: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  lockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
});
