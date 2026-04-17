import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useJournalStore } from '../../stores/useJournalStore';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import Divider from '../../components/atoms/Divider';

const MOOD_EMOJI: Record<string, string> = {
  great: '😄', good: '🙂', neutral: '😐', tough: '😓', rough: '😞',
};

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const entries = useJournalStore(s => s.entries);
  const deleteEntry = useJournalStore(s => s.deleteEntry);

  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });

  const entry = useMemo(() => entries.find(e => e.id === id), [entries, id]);

  if (!entry) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.base }]}>
        <Text style={{ color: theme.colors.text }}>Entry not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.back();
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <Button title="Back to Journal" variant="ghost" icon="ArrowLeft" onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 16 }} />

        <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>{entry.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.date, { color: theme.colors.textMuted, fontFamily: f }]}>{date}</Text>
          {entry.mood && (
            <Text style={styles.mood}>{MOOD_EMOJI[entry.mood]} {entry.mood}</Text>
          )}
        </View>

        {entry.tags.length > 0 && (
          <View style={styles.tags}>
            {entry.tags.map(t => <Badge key={t} label={t} variant="default" size="sm" />)}
          </View>
        )}

        <Divider />

        <Text style={[styles.body, { color: theme.colors.text, fontFamily: f }]}>{entry.content}</Text>

        <Divider />

        <Button title="Delete Entry" variant="danger" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 700, width: '100%', alignSelf: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  date: { fontSize: 14 },
  mood: { fontSize: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  body: { fontSize: 17, lineHeight: 28 },
});
