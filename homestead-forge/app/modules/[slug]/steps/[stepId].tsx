import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TextInput } from 'react-native';
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

  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const mod = useMemo(() => modules.find(m => m.slug === slug), [modules, slug]);
  const allSteps = useMemo(() => steps[slug || ''] || [], [steps, slug]);
  const step = useMemo(() => allSteps.find(s => s.id === stepId), [allSteps, stepId]);
  const stepProgress = progress[stepId || ''];
  const status: StepStatus = stepProgress?.status || 'not_started';

  const [notes, setNotes] = useState(stepProgress?.notes || '');
  const [costInput, setCostInput] = useState(String(stepProgress?.actualCost || ''));
  const [saveIndicator, setSaveIndicator] = useState('');

  const saveNotes = useCallback((text: string) => {
    setNotes(text);
    if (stepId) {
      updateNotes(stepId, text);
      setSaveIndicator('Saved');
      setTimeout(() => setSaveIndicator(''), 2000);
    }
  }, [stepId, updateNotes]);

  const saveCost = useCallback((text: string) => {
    setCostInput(text);
    const num = parseFloat(text);
    if (stepId && !isNaN(num)) {
      updateCost(stepId, num);
    }
  }, [stepId, updateCost]);

  const changeStatus = (newStatus: StepStatus) => {
    if (stepId) updateStatus(stepId, newStatus);
  };

  if (!step) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.base }]}>
        <Text style={{ color: theme.colors.text }}>Step not found</Text>
      </View>
    );
  }

  const statusColor = status === 'completed' ? theme.colors.accent : status === 'in_progress' ? theme.colors.primary : theme.colors.textMuted;
  const statusLabel = status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : status === 'skipped' ? 'Skipped' : 'Not Started';

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        {/* Back */}
        <View style={styles.backRow}>
          <Button title={`Back to ${mod?.title || 'Module'}`} variant="ghost" icon="ArrowLeft" onPress={() => router.back()} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>{step.title}</Text>
          <View style={styles.metaRow}>
            <Badge label={statusLabel} variant={status === 'completed' ? 'success' : status === 'in_progress' ? 'warning' : 'default'} />
            <Text style={[styles.meta, { color: theme.colors.textMuted, fontFamily: 'monospace' }]}>
              {step.estimatedTime}
            </Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted, fontFamily: 'monospace' }]}>
              ${step.estimatedCostLow.toLocaleString()} - ${step.estimatedCostHigh.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.desc, { color: theme.colors.text, fontFamily: f }]}>{step.description}</Text>

        {/* Tags & Seasons */}
        <View style={styles.tagRow}>
          {step.seasonRelevance.map(s => (
            <Badge key={s} label={s} variant="info" size="sm" />
          ))}
          {step.tags.map(t => (
            <Badge key={t} label={t} variant="default" size="sm" />
          ))}
        </View>

        <Divider />

        {/* Detailed Guide */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Guide</Text>
        <Card variant="default" style={{ backgroundColor: theme.colors.surface, marginBottom: 20 }}>
          <Text style={[styles.guide, { color: theme.colors.text, fontFamily: f }]}>
            {step.detailedGuide}
          </Text>
        </Card>

        {/* Tips */}
        {step.tips.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Pro Tips</Text>
            {step.tips.map((tip, i) => (
              <Card key={i} variant="default" style={{ backgroundColor: theme.colors.surfaceAlt, marginBottom: 10 }}>
                <View style={styles.tipRow}>
                  <Icon name="Star" size={18} color={theme.colors.warning} />
                  <Text style={[styles.tipText, { color: theme.colors.text, fontFamily: fa, fontSize: 17 }]}>{tip}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        <Divider />

        {/* Notes */}
        <View style={styles.notesHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Your Notes</Text>
          {saveIndicator ? (
            <Text style={[styles.saved, { color: theme.colors.accent }]}>
              <Icon name="Check" size={14} color={theme.colors.accent} /> {saveIndicator}
            </Text>
          ) : null}
        </View>
        <TextInput
          style={[styles.notesInput, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
            fontFamily: f,
          }]}
          value={notes}
          onChangeText={saveNotes}
          placeholder="Add your notes, observations, and lessons learned..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={4}
        />

        {/* Cost */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd, marginTop: 20 }]}>Your Actual Cost</Text>
        <View style={styles.costRow}>
          <Text style={[styles.dollar, { color: theme.colors.textMuted }]}>$</Text>
          <TextInput
            style={[styles.costInput, {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
              fontFamily: 'monospace',
            }]}
            value={costInput}
            onChangeText={saveCost}
            placeholder="0"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
          />
        </View>

        <Divider />

        {/* Status Actions */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Status</Text>
        <View style={styles.actions}>
          {status === 'not_started' && (
            <>
              <Button title="Start This Step" variant="primary" size="lg" onPress={() => changeStatus('in_progress')} />
              <Button title="Skip" variant="ghost" onPress={() => changeStatus('skipped')} />
            </>
          )}
          {status === 'in_progress' && (
            <>
              <Button title="Mark Complete" variant="primary" size="lg" icon="Check" onPress={() => changeStatus('completed')} />
              <Button title="Skip" variant="ghost" onPress={() => changeStatus('skipped')} />
            </>
          )}
          {status === 'completed' && (
            <View style={[styles.completedBanner, { backgroundColor: theme.colors.accent + '20' }]}>
              <Icon name="Check" size={24} color={theme.colors.accent} />
              <Text style={[styles.completedText, { color: theme.colors.accent, fontFamily: f }]}>
                Completed!
              </Text>
              <Button title="Undo" variant="ghost" size="sm" onPress={() => changeStatus('in_progress')} />
            </View>
          )}
          {status === 'skipped' && (
            <View style={styles.actions}>
              <Button title="Start This Step" variant="outline" onPress={() => changeStatus('in_progress')} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backRow: { marginBottom: 8, marginTop: 8, alignItems: 'flex-start' },
  header: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  meta: { fontSize: 13 },
  desc: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  guide: { fontSize: 16, lineHeight: 26 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipText: { flex: 1, lineHeight: 24 },
  notesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saved: { fontSize: 13, fontWeight: '500' },
  notesInput: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, minHeight: 120, textAlignVertical: 'top' },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dollar: { fontSize: 20, fontWeight: '600' },
  costInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 18, width: 160 },
  actions: { gap: 12 },
  completedBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12 },
  completedText: { fontSize: 18, fontWeight: '600', flex: 1 },
});
