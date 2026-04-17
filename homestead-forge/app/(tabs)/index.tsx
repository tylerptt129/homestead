import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useModuleStore } from '../../stores/useModuleStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { useBudgetStore } from '../../stores/useBudgetStore';
import { useAuthStore } from '../../stores/useAuthStore';
import Icon from '../../components/atoms/Icon';
import ProgressRing from '../../components/atoms/ProgressRing';
import Card from '../../components/atoms/Card';
import ModuleCard from '../../components/molecules/ModuleCard';
import StatCard from '../../components/molecules/StatCard';

const seasonalTips: Record<number, string> = {
  1: 'January: Review last year\'s records and plan crop rotations. Order seeds early for the best selection.',
  2: 'February: Start seeds indoors under grow lights. Prune dormant fruit trees before buds swell.',
  3: 'March: Test and amend soil as it thaws. Begin hardening off indoor seedlings.',
  4: 'April: Direct sow cool-season crops. Set up irrigation lines before the growing rush.',
  5: 'May: Plant warm-season crops after last frost. Mulch beds deeply to conserve moisture.',
  6: 'June: First harvests begin! Stay on top of weeding and succession planting.',
  7: 'July: Water deeply and consistently. Begin preserving the summer abundance.',
  8: 'August: Plant fall garden crops. Start planning firewood and winter prep.',
  9: 'September: Harvest root crops and winter squash. Process and store the bounty.',
  10: 'October: Plant garlic and cover crops. Winterize irrigation and outdoor plumbing.',
  11: 'November: Final harvests. Clean and store tools. Reflect on the season.',
  12: 'December: Rest, plan, and dream. Review budgets and set goals for the new year.',
};

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const profile = useAuthStore(s => s.profile);
  const modules = useModuleStore(s => s.modules);
  const steps = useModuleStore(s => s.steps);
  const progress = useProgressStore(s => s.progress);
  const budgetItems = useBudgetStore(s => s.items);

  const allSteps = useMemo(() => {
    return Object.values(steps).flat();
  }, [steps]);

  const overallStats = useMemo(() => {
    const total = allSteps.length;
    const completed = allSteps.filter(s => progress[s.id]?.status === 'completed').length;
    const inProg = allSteps.filter(s => progress[s.id]?.status === 'in_progress').length;
    return { total, completed, inProg, percentage: total > 0 ? completed / total : 0 };
  }, [allSteps, progress]);

  const totalBudget = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  }, [budgetItems]);

  const lastActive = useMemo(() => {
    const inProgressSteps = allSteps
      .filter(s => progress[s.id]?.status === 'in_progress')
      .sort((a, b) => {
        const aTime = progress[a.id]?.updatedAt || '';
        const bTime = progress[b.id]?.updatedAt || '';
        return bTime.localeCompare(aTime);
      });
    if (inProgressSteps.length === 0) return null;
    const step = inProgressSteps[0];
    const mod = modules.find(m => m.id === step.moduleId);
    return { step, module: mod };
  }, [allSteps, progress, modules]);

  const month = new Date().getMonth() + 1;
  const tip = seasonalTips[month] || '';

  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });
  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.colors.textMuted, fontFamily: f }]}>
            Welcome to
          </Text>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>
            {profile?.homesteadName || 'Homestead Forge'}
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.primaryMuted, fontFamily: fa }]}>
            Plan your land. Build your life. Track every step.
          </Text>
        </View>

        {/* Overall Progress */}
        <Card variant="elevated" style={[styles.progressCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.progressRow}>
            <ProgressRing progress={overallStats.percentage} size={90} strokeWidth={6} />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressTitle, { color: theme.colors.text, fontFamily: fd }]}>
                Overall Progress
              </Text>
              <Text style={[styles.progressSub, { color: theme.colors.textMuted, fontFamily: f }]}>
                {overallStats.completed} of {overallStats.total} steps completed
              </Text>
              {overallStats.inProg > 0 && (
                <Text style={[styles.progressSub, { color: theme.colors.primary, fontFamily: f }]}>
                  {overallStats.inProg} in progress
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Modules" value={`${modules.length}`} icon="Grid3X3" />
          <StatCard label="Steps Done" value={`${overallStats.completed}`} icon="Check" />
          <StatCard label="Budget" value={`$${totalBudget.toLocaleString()}`} icon="DollarSign" />
        </View>

        {/* Continue Where You Left Off */}
        {lastActive && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>
              Continue Where You Left Off
            </Text>
            <Card
              variant="elevated"
              onPress={() => router.push(`/modules/${lastActive.module?.slug}`)}
              style={{ backgroundColor: theme.colors.card }}
            >
              <View style={styles.continueRow}>
                <View style={[styles.continueIcon, { backgroundColor: lastActive.module?.color || theme.colors.primary }]}>
                  <Icon name={lastActive.module?.iconName || 'ChevronRight'} size={24} color="#fff" />
                </View>
                <View style={styles.continueInfo}>
                  <Text style={[styles.continueModule, { color: theme.colors.textMuted, fontFamily: f }]}>
                    {lastActive.module?.title}
                  </Text>
                  <Text style={[styles.continueStep, { color: theme.colors.text, fontFamily: f }]}>
                    {lastActive.step.title}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={20} color={theme.colors.textMuted} />
              </View>
            </Card>
          </View>
        )}

        {/* Seasonal Tip */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>
            Seasonal Wisdom
          </Text>
          <Card variant="default" style={{ backgroundColor: theme.colors.surfaceAlt }}>
            <View style={styles.tipRow}>
              <Icon name="Calendar" size={28} color={theme.colors.warning} />
              <Text style={[styles.tipText, { color: theme.colors.text, fontFamily: fa, fontSize: 18, lineHeight: 26 }]}>
                {tip}
              </Text>
            </View>
          </Card>
        </View>

        {/* Module Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>
              Your Modules
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/modules')}>
              <Text style={[styles.viewAll, { color: theme.colors.primary, fontFamily: f }]}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.moduleGrid}>
            {modules.slice(0, 4).map((mod) => {
              const modSteps = steps[mod.slug] || [];
              const completed = modSteps.filter(s => progress[s.id]?.status === 'completed').length;
              const pct = modSteps.length > 0 ? completed / modSteps.length : 0;
              return (
                <View key={mod.id} style={styles.moduleGridItem}>
                  <ModuleCard
                    module={mod}
                    progress={pct}
                    onPress={() => router.push(`/modules/${mod.slug}`)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  header: { marginBottom: 24, marginTop: 16 },
  greeting: { fontSize: 14, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 4 },
  tagline: { fontSize: 18, fontStyle: 'italic' },
  progressCard: { marginBottom: 20, padding: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  progressInfo: { flex: 1 },
  progressTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  progressSub: { fontSize: 14, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  viewAll: { fontSize: 14, fontWeight: '500' },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  continueIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  continueInfo: { flex: 1 },
  continueModule: { fontSize: 12, marginBottom: 2 },
  continueStep: { fontSize: 16, fontWeight: '500' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  tipText: { flex: 1 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleGridItem: { width: '48%', minWidth: 280 },
});
