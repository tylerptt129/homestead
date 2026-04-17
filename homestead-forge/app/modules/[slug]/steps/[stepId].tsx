import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../../theme';
import { useModuleStore } from '../../../../stores/useModuleStore';
import { useProgressStore } from '../../../../stores/useProgressStore';
import Button from '../../../../components/atoms/Button';
import Badge from '../../../../components/atoms/Badge';
import Card from '../../../../components/atoms/Card';
import Icon from '../../../../components/atoms/Icon';
import Divider from '../../../../components/atoms/Divider';
import type { StepStatus } from '../../../../types';

export default function StepDetailScreen() {
  const { slug, stepId } = useLocalSearchParams<{ slug: string; stepId: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const steps = useModuleStore(s => s.steps);
  const modules = useModuleStore(s => s.modules);
  const progress = useProgressStore(s => s.progress);
  const updateStatus = useProgressStore(s => s.updateStepStatus);
  const updateNotes = useProgressStore(s => s.updateStepNotes);
  const updateCost = useProgressStore(s => s.updateStepCost);

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const mod = useMemo(() => modules.find(m => m.slug === slug), [modules, slug]);
  const allSteps = useMemo(() => steps[slug || ''] || [], [steps, slug]);
  const step = useMemo(() => allSteps.find(s => s.id === stepId), [allSteps, stepId]);
  const stepIndex = useMemo(() => allSteps.findIndex(s => s.id === stepId), [allSteps, stepId]);
  const stepProgress = progress[stepId || ''];
  const status: StepStatus = stepProgress?.status || 'not_started';

  const [notes, setNotes] = useState(stepProgress?.notes || '');
  const [costInput, setCostInput] = useState(String(stepProgress?.actualCost || ''));
  const [saveIndicator, setSaveIndicator] = useState('');

  const saveNotes = useCallback((text: string) => {
    setNotes(text);
    if (stepId) { updateNotes(stepId, text); setSaveIndicator('Saved'); setTimeout(() => setSaveIndicator(''), 2000); }
  }, [stepId, updateNotes]);

  const saveCost = useCallback((text: string) => {
    setCostInput(text);
    const num = parseFloat(text);
    if (stepId && !isNaN(num)) updateCost(stepId, num);
  }, [stepId, updateCost]);

  const changeStatus = (newStatus: StepStatus) => { if (stepId) updateStatus(stepId, newStatus); };
  const goToStep = (direction: 'prev' | 'next') => {
    const idx = direction === 'prev' ? stepIndex - 1 : stepIndex + 1;
    if (idx >= 0 && idx < allSteps.length) router.replace(`/modules/${slug}/steps/${allSteps[idx].id}`);
  };

  if (!step) return (<View style={[styles.center, { backgroundColor: theme.colors.base }]}><Text style={{ color: theme.colors.text }}>Step not found</Text></View>);

  const statusLabel = status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : status === 'skipped' ? 'Skipped' : 'Not Started';
  const statusColor = status === 'completed' ? theme.colors.accent : status === 'in_progress' ? theme.colors.primary : theme.colors.textMuted;
  const costStr = step.estimatedCostLow === 0 && step.estimatedCostHigh === 0 ? 'Free' : `$${step.estimatedCostLow.toLocaleString()} - $${step.estimatedCostHigh.toLocaleString()}`;

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <View style={styles.navBar}>
          <Pressable style={styles.navBtn} onPress={() => router.back()}>
            <Icon name="ArrowLeft" size={18} color={theme.colors.primary} />
            <Text style={[styles.navText, { color: theme.colors.primary, fontFamily: f }]}>{mod?.title || 'Back'}</Text>
          </Pressable>
          <Text style={[styles.stepCounter, { color: theme.colors.textMuted, fontFamily: f }]}>Step {stepIndex + 1} of {allSteps.length}</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>{step.title}</Text>
          <View style={styles.metaRow}>
            <Badge label={statusLabel} variant={status === 'completed' ? 'success' : status === 'in_progress' ? 'warning' : 'default'} />
            <View style={styles.metaItem}><Icon name="Clock" size={14} color={theme.colors.textMuted} /><Text style={[styles.metaText, { color: theme.colors.textMuted, fontFamily: f }]}>{step.estimatedTime}</Text></View>
            <View style={styles.metaItem}><Icon name="DollarSign" size={14} color={theme.colors.textMuted} /><Text style={[styles.metaText, { color: theme.colors.textMuted, fontFamily: f }]}>{costStr}</Text></View>
          </View>
        </View>

        <View style={[styles.statusBar, { backgroundColor: statusColor + '12', borderColor: statusColor + '30' }]}>
          {status === 'not_started' && <Button title="Start This Task" variant="primary" size="lg" icon="Play" onPress={() => changeStatus('in_progress')} />}
          {status === 'in_progress' && (
            <View style={styles.statusActions}>
              <View style={{ flex: 1 }}><Button title="Mark Complete" variant="primary" size="lg" icon="Check" onPress={() => changeStatus('completed')} /></View>
              <Button title="Skip" variant="ghost" size="sm" onPress={() => changeStatus('skipped')} />
            </View>
          )}
          {status === 'completed' && (
            <View style={styles.completedRow}>
              <Icon name="Check" size={22} color={theme.colors.accent} />
              <Text style={[styles.completedText, { color: theme.colors.accent, fontFamily: f }]}>Task completed!</Text>
              <Pressable onPress={() => changeStatus('in_progress')}><Text style={[styles.undoText, { color: theme.colors.textMuted, fontFamily: f }]}>Undo</Text></Pressable>
            </View>
          )}
          {status === 'skipped' && <Button title="Start This Task" variant="outline" icon="Play" onPress={() => changeStatus('in_progress')} />}
        </View>

        <Text style={[styles.desc, { color: theme.colors.text, fontFamily: f }]}>{step.description}</Text>
        {(step.seasonRelevance.length > 0 || step.tags.length > 0) && (
          <View style={styles.tagRow}>
            {step.seasonRelevance.map(s => <Badge key={s} label={s} variant="info" size="sm" />)}
            {step.tags.map(t => <Badge key={t} label={t} variant="default" size="sm" />)}
          </View>
        )}
        <Divider />

        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>How-To Guide</Text>
        <Card variant="default" style={{ backgroundColor: theme.colors.surface, marginBottom: 20 }}>
          <Text style={[styles.guide, { color: theme.colors.text, fontFamily: f }]}>{step.detailedGuide}</Text>
        </Card>

        {step.tips.length > 0 && (<>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Pro Tips</Text>
          {step.tips.map((tip, i) => (
            <Card key={i} variant="default" style={{ backgroundColor: theme.colors.surfaceAlt, marginBottom: 10 }}>
              <View style={styles.tipRow}><Icon name="Lightbulb" size={18} color={theme.colors.warning} /><Text style={[styles.tipText, { color: theme.colors.text, fontFamily: fa, fontSize: 17 }]}>{tip}</Text></View>
            </Card>
          ))}
        </>)}
        <Divider />

        <View style={styles.trackingSection}>
          <View style={styles.trackingCol}>
            <View style={styles.notesHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Your Notes</Text>
              {saveIndicator ? <View style={styles.savedRow}><Icon name="Check" size={12} color={theme.colors.accent} /><Text style={[styles.saved, { color: theme.colors.accent }]}>{saveIndicator}</Text></View> : null}
            </View>
            <TextInput style={[styles.notesInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]} value={notes} onChangeText={saveNotes} placeholder="Notes, observations, lessons learned..." placeholderTextColor={theme.colors.textMuted} multiline numberOfLines={4} />
          </View>
          <View style={styles.costCol}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Actual Cost</Text>
            <View style={styles.costRow}>
              <Text style={[styles.dollar, { color: theme.colors.textMuted }]}>$</Text>
              <TextInput style={[styles.costInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]} value={costInput} onChangeText={saveCost} placeholder="0" placeholderTextColor={theme.colors.textMuted} keyboardType="numeric" />
            </View>
            <Text style={[styles.costEst, { color: theme.colors.textMuted, fontFamily: f }]}>Estimated: {costStr}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.stepNav}>
          <Pressable style={[styles.stepNavBtn, { opacity: stepIndex > 0 ? 1 : 0.3 }]} onPress={() => stepIndex > 0 && goToStep('prev')} disabled={stepIndex <= 0}>
            <Icon name="ChevronLeft" size={18} color={theme.colors.primary} /><Text style={[styles.stepNavText, { color: theme.colors.primary, fontFamily: f }]}>Previous</Text>
          </Pressable>
          <Pressable style={[styles.stepNavBtn, { opacity: stepIndex < allSteps.length - 1 ? 1 : 0.3 }]} onPress={() => stepIndex < allSteps.length - 1 && goToStep('next')} disabled={stepIndex >= allSteps.length - 1}>
            <Text style={[styles.stepNavText, { color: theme.colors.primary, fontFamily: f }]}>Next</Text><Icon name="ChevronRight" size={18} color={theme.colors.primary} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, content: { paddingBottom: 60 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navText: { fontSize: 15, fontWeight: '500' },
  stepCounter: { fontSize: 13 },
  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13 },
  statusBar: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  statusActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  completedText: { fontSize: 17, fontWeight: '600', flex: 1 },
  undoText: { fontSize: 14, textDecorationLine: 'underline' },
  desc: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  guide: { fontSize: 16, lineHeight: 26 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipText: { flex: 1, lineHeight: 24 },
  trackingSection: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  trackingCol: { flex: 2, minWidth: 250 },
  costCol: { flex: 1, minWidth: 180 },
  notesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saved: { fontSize: 12, fontWeight: '500' },
  notesInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top' },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dollar: { fontSize: 20, fontWeight: '600' },
  costInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 18, flex: 1 },
  costEst: { fontSize: 12 },
  stepNav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  stepNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 12, paddingHorizontal: 4 },
  stepNavText: { fontSize: 15, fontWeight: '500' },
});
