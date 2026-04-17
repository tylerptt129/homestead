import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useModuleStore } from '../../stores/useModuleStore';
import { useProgressStore } from '../../stores/useProgressStore';
import ProgressRing from '../../components/atoms/ProgressRing';
import Badge from '../../components/atoms/Badge';
import Icon from '../../components/atoms/Icon';
import Card from '../../components/atoms/Card';
import StepItem from '../../components/molecules/StepItem';

export default function ModuleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const modules = useModuleStore(s => s.modules);
  const steps = useModuleStore(s => s.steps);
  const progress = useProgressStore(s => s.progress);

  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });

  const mod = useMemo(() => modules.find(m => m.slug === slug), [modules, slug]);
  const modSteps = useMemo(() => steps[slug || ''] || [], [steps, slug]);

  const stats = useMemo(() => {
    const total = modSteps.length;
    const completed = modSteps.filter(s => progress[s.id]?.status === 'completed').length;
    const inProg = modSteps.filter(s => progress[s.id]?.status === 'in_progress').length;
    return { total, completed, inProg, pct: total > 0 ? completed / total : 0 };
  }, [modSteps, progress]);

  const completedIds = useMemo(() => {
    const set = new Set<string>();
    modSteps.forEach(s => {
      if (progress[s.id]?.status === 'completed') set.add(s.id);
    });
    return set;
  }, [modSteps, progress]);

  if (!mod) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.base }]}>
        <Text style={{ color: theme.colors.text }}>Module not found</Text>
      </View>
    );
  }

  const estCostLow = modSteps.reduce((s, step) => s + step.estimatedCostLow, 0);
  const estCostHigh = modSteps.reduce((s, step) => s + step.estimatedCostHigh, 0);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        {/* Back button */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={20} color={theme.colors.primary} />
          <Text style={[styles.backText, { color: theme.colors.primary, fontFamily: f }]}>Back</Text>
        </Pressable>

        {/* Header */}
        <View style={[styles.header, { borderLeftColor: mod.color, borderLeftWidth: 4 }]}>
          <View style={styles.headerTop}>
            <View style={[styles.iconWrap, { backgroundColor: mod.color }]}>
              <Icon name={mod.iconName} size={28} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>{mod.title}</Text>
              <View style={styles.badges}>
                <Badge label={mod.difficulty} variant={mod.difficulty === 'beginner' ? 'success' : mod.difficulty === 'intermediate' ? 'warning' : 'danger'} />
                <Badge label={`~${mod.estimatedHours}hrs`} variant="info" />
              </View>
            </View>
          </View>
          <Text style={[styles.desc, { color: theme.colors.textMuted, fontFamily: f }]}>{mod.description}</Text>
        </View>

        {/* Progress card */}
        <Card variant="elevated" style={{ backgroundColor: theme.colors.card, marginBottom: 24 }}>
          <View style={styles.progressRow}>
            <ProgressRing progress={stats.pct} size={72} strokeWidth={5} color={mod.color} />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressTitle, { color: theme.colors.text, fontFamily: f }]}>
                {stats.completed} of {stats.total} steps completed
              </Text>
              {stats.inProg > 0 && (
                <Text style={[styles.progressSub, { color: theme.colors.primary, fontFamily: f }]}>
                  {stats.inProg} in progress
                </Text>
              )}
              <Text style={[styles.costRange, { color: theme.colors.textMuted, fontFamily: 'monospace' }]}>
                Est. ${estCostLow.toLocaleString()} - ${estCostHigh.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Steps list */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Steps</Text>
        <View style={styles.stepsList}>
          {modSteps.map((s, idx) => {
            const status = progress[s.id]?.status || 'not_started';
            const locked = s.dependsOn.length > 0 && !s.dependsOn.every(dep => completedIds.has(dep));
            return (
              <StepItem
                key={s.id}
                step={s}
                status={status}
                stepNumber={idx + 1}
                locked={locked}
                onPress={() => {
                  if (!locked) {
                    router.push(`/modules/${slug}/steps/${s.id}`);
                  }
                }}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: 8 },
  backText: { fontSize: 16, fontWeight: '500' },
  header: { paddingLeft: 16, marginBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  iconWrap: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  badges: { flexDirection: 'row', gap: 8 },
  desc: { fontSize: 16, lineHeight: 24 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  progressInfo: { flex: 1 },
  progressTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  progressSub: { fontSize: 14, marginBottom: 4 },
  costRange: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  stepsList: { gap: 0 },
});
