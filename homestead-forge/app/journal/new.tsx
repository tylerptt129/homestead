import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useJournalStore } from '../../stores/useJournalStore';
import { useModuleStore } from '../../stores/useModuleStore';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Icon from '../../components/atoms/Icon';
import type { Mood } from '../../types';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'tough', emoji: '😓', label: 'Tough' },
  { value: 'rough', emoji: '😞', label: 'Rough' },
];

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function NewJournalEntry() {
  const { theme } = useTheme();
  const router = useRouter();
  const addEntry = useJournalStore(s => s.addEntry);
  const modules = useModuleStore(s => s.modules);

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('good');
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    addEntry({
      id: generateId(),
      userId: 'local-user',
      moduleId,
      title: title || 'Untitled Entry',
      content,
      mood,
      weather: null,
      photos: [],
      tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: now,
      updatedAt: now,
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: fd }]}>New Entry</Text>
          <Button title="Save" variant="primary" onPress={handleSave} disabled={!content.trim()} />
        </View>

        <TextInput
          style={[styles.titleInput, { color: theme.colors.text, borderBottomColor: theme.colors.border, fontFamily: fd }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Entry title (optional)"
          placeholderTextColor={theme.colors.textMuted}
        />

        <TextInput
          style={[styles.contentInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]}
          value={content}
          onChangeText={setContent}
          placeholder="What happened on the homestead today? What did you learn, build, or observe?"
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={8}
          autoFocus
        />

        {/* Mood Picker */}
        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>How's it going?</Text>
        <View style={styles.moodRow}>
          {MOODS.map(m => (
            <Pressable key={m.value} onPress={() => setMood(m.value)} style={[styles.moodOption, {
              backgroundColor: mood === m.value ? theme.colors.surfaceAlt : 'transparent',
              borderColor: mood === m.value ? theme.colors.primary : theme.colors.border,
            }]}>
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, { color: mood === m.value ? theme.colors.primary : theme.colors.textMuted, fontFamily: f }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Module Selector */}
        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Related module (optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleScroll}>
          <Pressable
            onPress={() => setModuleId(null)}
            style={[styles.moduleChip, {
              backgroundColor: moduleId === null ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }]}
          >
            <Text style={{ color: moduleId === null ? theme.colors.base : theme.colors.text, fontFamily: f, fontSize: 14 }}>General</Text>
          </Pressable>
          {modules.map(mod => (
            <Pressable
              key={mod.id}
              onPress={() => setModuleId(mod.id)}
              style={[styles.moduleChip, {
                backgroundColor: moduleId === mod.id ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              }]}
            >
              <Text style={{ color: moduleId === mod.id ? theme.colors.base : theme.colors.text, fontFamily: f, fontSize: 14 }}>{mod.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tags */}
        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Tags (comma separated)</Text>
        <TextInput
          style={[styles.tagsInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]}
          value={tagsText}
          onChangeText={setTagsText}
          placeholder="garden, harvest, learning"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 600, width: '100%', alignSelf: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  titleInput: { fontSize: 24, fontWeight: '600', borderBottomWidth: 1, paddingVertical: 12, marginBottom: 16 },
  contentInput: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, minHeight: 200, textAlignVertical: 'top', marginBottom: 24 },
  label: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  moodOption: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  moodEmoji: { fontSize: 24 },
  moodLabel: { fontSize: 12, marginTop: 4 },
  moduleScroll: { marginBottom: 24 },
  moduleChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  tagsInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 24 },
});
