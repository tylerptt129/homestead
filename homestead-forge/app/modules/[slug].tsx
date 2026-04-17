import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useModuleStore } from '../../stores/useModuleStore';
import { useProgressStore } from '../../stores/useProgressStore';
import Badge from '../../components/atoms/Badge';
import Icon from '../../components/atoms/Icon';
import Card from '../../components/atoms/Card';
import StepItem from '../../components/molecules/StepItem';
import PhotoGallery from '../../components/molecules/PhotoGallery';
import LocationTip from '../../components/molecules/LocationTip';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ModuleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const modules = useModuleStore(s => s.modules);
  const steps = useModuleStore(s => s.steps);
  const progress = useProgressStore(s => s.progress);
  const updateStatus = useProgressStore(s => s.updateStepStatus);
  const addPhoto = useProgressStore(s => s.addStepPhoto);
  const removePhoto = useProgressStore(s => s.removeStepPhoto);
  const profile = useAuthStore(s => s.profile);

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const mod = useMemo(() => modules.find(m => m.slug === slug), [modules, slug]);
  const modSteps = useMemo(() => steps[slug || ''] || [], [steps, slug]);

  const stats = useMemo(() => {
    const total = modSteps.length;
    const completed = modSteps.filter(s => progress[s.id]?.status === 'completed').length;
    const inProg = modSteps.filter(s => progress[s.id]?.status === 'in_progress').length;
    const skipped = modSteps.filter(s => progress[s.id]?.status === 'skipped').length;
    return { total, completed, inProg, skipped, pct: total > 0 ? completed / total : 0 };
  }, [modSteps, progress]);

  const completedIds = useMemo(() => {
    const set = new Set<string>();
    modSteps.forEach(s => {
      if (progress[s.id]?.status === 'completed') set.add(s.id);
    });
    return set;
  }, [modSteps, progress]);

  // Collect all photos across all steps in this module
  const modulePhotos = useMemo(() => {
    const allPhotos: { stepId: string; uri: string }[] = [];
    modSteps.forEach(s => {
      const p = progress[s.id];
      if (p?.photos?.length) {
        p.photos.forEach(uri => allPhotos.push({ stepId: s.id, uri }));
      }
    });
    return allPhotos;
  }, [modSteps, progress]);

  // For the module gallery, add to first step by default
  const defaultStepId = modSteps[0]?.id || '';

  const costStats = useMemo(() => {
    const estLow = modSteps.reduce((s, step) => s + step.estimatedCostLow, 0);
    const estHigh = modSteps.reduce((s, step) => s + step.estimatedCostHigh, 0);
    const actual = modSteps.reduce((s, step) => {
      const p = progress[step.id];
      return s + (p?.actualCost || 0);
    }, 0);
    return { estLow, estHigh, actual };
  }, [modSteps, progress]);

  if (!mod) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.base }]}>
        <Text style={{ color: theme.colors.text }}>Module not found</Text>
      </View>
    );
  }

  const progressPct = Math.round(stats.pct * 100);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        {/* Back button */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={20} color={theme.colors.primary} />
          <Text style={[styles.backText, { color: theme.colors.primary, fontFamily: f }]}>Back</Text>
        </Pressable>

        {/* Module Header */}
        <View style={styles.header}>
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

          {/* Location-Aware Tips */}
          {profile && (profile.locationState || profile.climateZone) && (
            <LocationTip
              locationState={profile.locationState}
              climateZone={profile.climateZone}
              seasonRelevance={modSteps.flatMap(s => s.seasonRelevance).filter((v, i, a) => a.indexOf(v) === i)}
              tags={modSteps.flatMap(s => s.tags).filter((v, i, a) => a.indexOf(v) === i)}
            />
          )}
        </View>

        {/* Progress + Cost Summary */}
        <View style={styles.summaryRow}>
          {/* Progress card */}
          <Card variant="elevated" style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.progressCircle}>
              <View style={[styles.progressRingOuter, { borderColor: mod.color + '30' }]}>
                <Text style={[styles.progressPct, { color: mod.color, fontFamily: fd }]}>{progressPct}%</Text>
              </View>
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted, fontFamily: f }]}>
              {stats.completed}/{stats.total} done
            </Text>
            {stats.inProg > 0 && (
              <Text style={[styles.summaryMini, { color: theme.colors.primary }]}>
                {stats.inProg} active
              </Text>
            )}
          </Card>

          {/* Cost card */}
          <Card variant="elevated" style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="DollarSign" size={24} color={theme.colors.warning} />
            <Text style={[styles.costActual, { color: theme.colors.text, fontFamily: fd }]}>
              ${costStats.actual.toLocaleString()}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted, fontFamily: f }]}>
              spent so far
            </Text>
            <Text style={[styles.summaryMini, { color: theme.colors.textMuted }]}>
              Est. ${costStats.estLow.toLocaleString()} - ${costStats.estHigh.toLocaleString()}
            </Text>
          </Card>
        </View>

        {/* Checklist */}
        <View style={styles.checklistHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>
            Checklist
          </Text>
          <Text style={[styles.checklistSub, { color: theme.colors.primaryMuted, fontFamily: fa }]}>
            Tap circles to toggle, expand for details
          </Text>
        </View>

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
                isLast={idx === modSteps.length - 1}
                actualCost={progress[s.id]?.actualCost}
                onToggleStatus={(newStatus) => {
                  if (!locked) updateStatus(s.id, newStatus);
                }}
                onPress={() => {
                  if (!locked) {
                    router.push(`/modules/${slug}/steps/${s.id}`);
                  }
                }}
              />
            );
          })}
        </View>

        {/* Module Photos */}
        {(modulePhotos.length > 0 || modSteps.length > 0) && (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>
              Photos & Documents
            </Text>
            <PhotoGallery
              photos={modulePhotos.map(p => p.uri)}
              onAddPhoto={(uri) => addPhoto(defaultStepId, uri)}
              onRemovePhoto={(uri) => {
                // Find which step owns this photo and remove from that step
                const owner = modulePhotos.find(p => p.uri === uri);
                if (owner) removePhoto(owner.stepId, uri);
              }}
            />
          </View>
        )}
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
  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  iconWrap: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  badges: { flexDirection: 'row', gap: 8 },
  desc: { fontSize: 16, lineHeight: 24 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  summaryCard: { flex: 1, alignItems: 'center', padding: 16, gap: 6 },
  progressCircle: { marginBottom: 4 },
  progressRingOuter: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  progressPct: { fontSize: 18, fontWeight: '700' },
  costActual: { fontSize: 22, fontWeight: '700' },
  summaryLabel: { fontSize: 13 },
  summaryMini: { fontSize: 11 },
  checklistHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 4 },
  checklistSub: { fontSize: 16, fontStyle: 'italic' },
  stepsList: { gap: 4 },
});
