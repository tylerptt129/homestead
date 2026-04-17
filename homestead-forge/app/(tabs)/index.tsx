import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useModuleStore } from '../../stores/useModuleStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { useAuthStore } from '../../stores/useAuthStore';
import Icon from '../../components/atoms/Icon';
import Card from '../../components/atoms/Card';
import HomesteadMap from '../../components/organisms/HomesteadMap';

const SHORT_TITLES: Record<string, string> = {
  land: 'Land',
  water: 'Water',
  shelter: 'Shelter',
  power: 'Power',
  garden: 'Garden',
  orchard: 'Orchard',
  livestock: 'Livestock',
  preservation: 'Preserving',
  tools: 'Tools',
  security: 'Security',
  financial: 'Financial',
  community: 'Community',
};

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

  const zones = useMemo(() => {
    return modules.map(mod => {
      const modSteps = steps[mod.slug] || [];
      const completed = modSteps.filter(s => progress[s.id]?.status === 'completed').length;
      const total = modSteps.length;
      return {
        slug: mod.slug,
        title: mod.title,
        shortTitle: SHORT_TITLES[mod.slug] || mod.title,
        iconName: mod.iconName,
        color: mod.color,
        progress: total > 0 ? completed / total : 0,
        totalSteps: total,
        completedSteps: completed,
      };
    });
  }, [modules, steps, progress]);

  const lastActive = useMemo(() => {
    const allSteps = Object.values(steps).flat();
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
  }, [steps, progress, modules]);

  const month = new Date().getMonth() + 1;
  const tip = seasonalTips[month] || '';

  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });
  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
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

        {lastActive && (
          <View style={styles.section}>
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
                  <Text style={[styles.continueLabel, { color: theme.colors.primaryMuted, fontFamily: fa }]}>
                    Pick up where you left off...
                  </Text>
                  <Text style={[styles.continueStep, { color: theme.colors.text, fontFamily: f }]}>
                    {lastActive.step.title}
                  </Text>
                  <Text style={[styles.continueModule, { color: theme.colors.textMuted, fontFamily: f }]}>
                    {lastActive.module?.title}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={20} color={theme.colors.textMuted} />
              </View>
            </Card>
          </View>
        )}

        <HomesteadMap
          zones={zones}
          onZonePress={(slug) => router.push(`/modules/${slug}`)}
        />

        <View style={[styles.section, { marginTop: 28 }]}>
          <Card variant="default" style={{ backgroundColor: theme.colors.surfaceAlt }}>
            <View style={styles.tipRow}>
              <Icon name="Calendar" size={28} color={theme.colors.warning} />
              <View style={styles.tipContent}>
                <Text style={[styles.tipLabel, { color: theme.colors.textMuted, fontFamily: f }]}>
                  Seasonal Wisdom
                </Text>
                <Text style={[styles.tipText, { color: theme.colors.text, fontFamily: fa }]}>
                  {tip}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  header: { marginBottom: 24, marginTop: 16 },
  greeting: { fontSize: 14, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 4 },
  tagline: { fontSize: 18, fontStyle: 'italic' },
  section: { marginBottom: 20 },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  continueIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  continueInfo: { flex: 1 },
  continueLabel: { fontSize: 16, fontStyle: 'italic', marginBottom: 2 },
  continueModule: { fontSize: 12, marginTop: 2 },
  continueStep: { fontSize: 16, fontWeight: '500' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  tipContent: { flex: 1 },
  tipLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 18, lineHeight: 26 },
});
