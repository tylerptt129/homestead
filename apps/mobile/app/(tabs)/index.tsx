import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Activity,
  BookOpen,
  ChevronRight,
  Flame,
  Layers,
  Wallet,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import { Card } from '@homestead/ui/molecules/Card';
import { ProgressRing } from '@homestead/ui/molecules/ProgressRing';
import { useModuleStore } from '@homestead/core/stores/moduleStore';
import {
  calculateOverallProgress,
  formatCurrency,
  formatDate,
  getSeasonForMonth,
} from '@homestead/core/utils/calculations';
import { MONTHS } from '@homestead/core/utils/constants';
import type { JournalEntry, BudgetItem, ModuleWithProgress, UserStepProgress } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Greeting helper
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// Seasonal alerts based on current month
// ---------------------------------------------------------------------------

interface SeasonalAlert {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

function getSeasonalAlerts(month: number): SeasonalAlert[] {
  const season = getSeasonForMonth(month);
  const alerts: Record<string, SeasonalAlert[]> = {
    spring: [
      { title: 'Start Seedlings Indoors', description: 'Begin tomatoes, peppers, and herbs 6-8 weeks before last frost.', icon: Flame },
      { title: 'Soil Testing Time', description: 'Test pH and nutrient levels before planting season begins.', icon: Layers },
      { title: 'Review Water Systems', description: 'Inspect irrigation lines and rain barrels after winter.', icon: Activity },
    ],
    summer: [
      { title: 'Preserve the Harvest', description: 'Can, dry, and freeze produce at peak ripeness.', icon: Flame },
      { title: 'Monitor Water Usage', description: 'Track water consumption and check for leaks in the heat.', icon: Activity },
      { title: 'Maintain Pastures', description: 'Rotate livestock to prevent overgrazing in dry conditions.', icon: Layers },
    ],
    fall: [
      { title: 'Prepare for Winter', description: 'Insulate pipes, stack firewood, and winterize structures.', icon: Flame },
      { title: 'Plant Cover Crops', description: 'Sow winter rye or clover to protect and enrich soil.', icon: Layers },
      { title: 'Budget Review', description: 'Review annual spending and plan next year\'s priorities.', icon: Wallet },
    ],
    winter: [
      { title: 'Plan Next Season', description: 'Order seeds, review crop rotation plans, and update modules.', icon: Layers },
      { title: 'Equipment Maintenance', description: 'Service tools and repair equipment during the off-season.', icon: Activity },
      { title: 'Update Your Journal', description: 'Document lessons learned and set goals for the new year.', icon: BookOpen },
    ],
  };
  return alerts[season] ?? alerts.winter;
}

// ---------------------------------------------------------------------------
// Placeholder data (in production, comes from Zustand stores)
// ---------------------------------------------------------------------------

const PLACEHOLDER_HOMESTEAD_NAME = 'Whispering Pines';

const PLACEHOLDER_MODULES: ModuleWithProgress[] = [
  { id: '1', slug: 'water-systems', title: 'Water Systems', description: '', icon_name: 'Droplets', display_order: 1, color: '#4A90D9', estimated_hours: 40, difficulty: 'intermediate', created_at: '', completedSteps: 3, totalSteps: 10, progressPercent: 30 },
  { id: '2', slug: 'garden-planning', title: 'Garden Planning', description: '', icon_name: 'Sprout', display_order: 2, color: '#5B8C5A', estimated_hours: 30, difficulty: 'beginner', created_at: '', completedSteps: 7, totalSteps: 12, progressPercent: 58 },
  { id: '3', slug: 'food-preservation', title: 'Food Preservation', description: '', icon_name: 'Cookie', display_order: 3, color: '#D4A437', estimated_hours: 20, difficulty: 'beginner', created_at: '', completedSteps: 0, totalSteps: 8, progressPercent: 0 },
  { id: '4', slug: 'livestock', title: 'Livestock', description: '', icon_name: 'Rabbit', display_order: 4, color: '#B07D56', estimated_hours: 50, difficulty: 'advanced', created_at: '', completedSteps: 2, totalSteps: 15, progressPercent: 13 },
];

const PLACEHOLDER_JOURNAL: JournalEntry[] = [
  { id: 'j1', user_id: 'u1', module_id: '2', title: 'First tomatoes of the season', content: 'Harvested early girls today. Beautiful color and great taste.', mood: 'great', weather: { temp: 78, conditions: 'Sunny' }, photos: [], tags: ['harvest', 'tomatoes'], created_at: '2026-04-14T10:30:00Z', updated_at: '2026-04-14T10:30:00Z' },
  { id: 'j2', user_id: 'u1', module_id: '1', title: 'Rain barrel overflow fix', content: 'Added a diverter to the main barrel. No more flooding near the coop.', mood: 'good', weather: { temp: 65, conditions: 'Overcast' }, photos: [], tags: ['water', 'maintenance'], created_at: '2026-04-12T14:20:00Z', updated_at: '2026-04-12T14:20:00Z' },
  { id: 'j3', user_id: 'u1', module_id: null, title: 'Fence line walk', content: 'Checked the perimeter. Found a weak spot on the north side that needs repair.', mood: 'neutral', weather: { temp: 55, conditions: 'Windy' }, photos: [], tags: ['maintenance', 'fencing'], created_at: '2026-04-10T08:15:00Z', updated_at: '2026-04-10T08:15:00Z' },
];

const PLACEHOLDER_BUDGET_TOTAL = 4825.50;

const PLACEHOLDER_LAST_STEP = {
  moduleTitle: 'Water Systems',
  moduleSlug: 'water-systems',
  stepTitle: 'Install Rain Collection Barrels',
  stepId: 's3',
  status: 'in_progress' as const,
};

// ---------------------------------------------------------------------------
// Mood emoji map
// ---------------------------------------------------------------------------

const MOOD_EMOJI: Record<string, string> = {
  great: '\u{1F929}',
  good: '\u{1F60A}',
  neutral: '\u{1F610}',
  tough: '\u{1F62B}',
  rough: '\u{1F622}',
};

// ---------------------------------------------------------------------------
// Dashboard Screen
// ---------------------------------------------------------------------------

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // In production, pull from stores:
  // const modules = useModuleStore((s) => s.modules);
  const modules = PLACEHOLDER_MODULES;
  const journalEntries = PLACEHOLDER_JOURNAL;
  const homesteadName = PLACEHOLDER_HOMESTEAD_NAME;
  const budgetTotal = PLACEHOLDER_BUDGET_TOTAL;
  const lastStep = PLACEHOLDER_LAST_STEP;

  const overall = useMemo(() => calculateOverallProgress(modules), [modules]);
  const activeModules = useMemo(
    () => modules.filter((m) => m.completedSteps > 0 && m.progressPercent < 100).length,
    [modules],
  );

  const currentMonth = new Date().getMonth() + 1;
  const monthName = MONTHS[currentMonth - 1];
  const seasonalAlerts = useMemo(() => getSeasonalAlerts(currentMonth), [currentMonth]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.header}>
          <Text variant="bodySmall" muted>
            {getGreeting()}
          </Text>
          <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
            Welcome to {homesteadName}
          </Text>
        </View>

        {/* ── Quick Stats ─────────────────────────────── */}
        <View style={styles.statsRow}>
          {/* Overall Progress */}
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <ProgressRing percentage={overall.progressPercent} size={56} strokeWidth={5}>
              <Text
                variant="caption"
                style={{ fontFamily: fontFamilies.monoMedium, color: colors.primary, fontSize: 11 }}
              >
                {overall.progressPercent}%
              </Text>
            </ProgressRing>
            <Text variant="caption" muted style={styles.statLabel}>
              Overall
            </Text>
          </View>

          {/* Active Modules */}
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={styles.statNumber}>
              <Text variant="h1" style={{ color: colors.primary, fontFamily: fontFamilies.monoMedium }}>
                {activeModules}
              </Text>
            </View>
            <Text variant="caption" muted style={styles.statLabel}>
              Active
            </Text>
          </View>

          {/* Budget Total */}
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={styles.statNumber}>
              <Text
                variant="body"
                style={{ color: colors.primary, fontFamily: fontFamilies.monoMedium, fontSize: 15 }}
                numberOfLines={1}
              >
                {formatCurrency(budgetTotal)}
              </Text>
            </View>
            <Text variant="caption" muted style={styles.statLabel}>
              Budget
            </Text>
          </View>
        </View>

        {/* ── Continue Where You Left Off ─────────────── */}
        <Card
          onPress={() =>
            router.push(`/modules/${lastStep.moduleSlug}/steps/${lastStep.stepId}`)
          }
          style={styles.continueCard}
        >
          <View style={styles.continueInner}>
            <View style={styles.continueText}>
              <Text variant="caption" muted style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
                Continue where you left off
              </Text>
              <Text variant="h3" style={{ color: colors.text, marginTop: 4 }} numberOfLines={1}>
                {lastStep.stepTitle}
              </Text>
              <Text variant="bodySmall" muted style={{ marginTop: 2 }}>
                {lastStep.moduleTitle}
              </Text>
            </View>
            <ChevronRight size={24} color={colors.primary} strokeWidth={1.5} />
          </View>
        </Card>

        {/* ── Seasonal Alerts ─────────────────────────── */}
        <View style={styles.section}>
          <Text variant="h2" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
            {monthName} Focus
          </Text>
          <Text variant="bodySmall" muted style={{ marginTop: 2, marginBottom: spacing.md }}>
            Seasonal tasks for your homestead
          </Text>
          {seasonalAlerts.map((alert, idx) => (
            <View
              key={idx}
              style={[styles.alertCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}
            >
              <View style={[styles.alertIconBox, { backgroundColor: colors.surfaceAlt }]}>
                <alert.icon size={20} color={colors.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.alertText}>
                <Text variant="body" style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold }}>
                  {alert.title}
                </Text>
                <Text variant="bodySmall" muted style={{ marginTop: 2 }}>
                  {alert.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Recent Journal ──────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h2" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
              Recent Journal
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/journal')}>
              <Text variant="bodySmall" style={{ color: colors.primary }}>
                View all
              </Text>
            </Pressable>
          </View>
          {journalEntries.map((entry) => (
            <Pressable
              key={entry.id}
              style={[styles.journalCard, { backgroundColor: colors.card }]}
              onPress={() => {
                // Navigate to journal detail (future)
              }}
            >
              <View style={styles.journalHeader}>
                <Text
                  variant="body"
                  style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, flex: 1 }}
                  numberOfLines={1}
                >
                  {entry.title}
                </Text>
                <Text variant="bodySmall" style={{ marginLeft: spacing.sm }}>
                  {MOOD_EMOJI[entry.mood] ?? ''}
                </Text>
              </View>
              <Text variant="bodySmall" muted numberOfLines={2} style={{ marginTop: 4 }}>
                {entry.content}
              </Text>
              <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
                {formatDate(entry.created_at, 'medium')}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: spacing['3xl'] }} />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.base,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  statNumber: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  continueCard: {
    marginBottom: spacing.xl,
  },
  continueInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueText: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  alertText: {
    flex: 1,
  },
  journalCard: {
    padding: spacing.base,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
