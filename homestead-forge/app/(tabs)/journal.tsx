import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useJournalStore } from '../../stores/useJournalStore';
import JournalCard from '../../components/molecules/JournalCard';
import EmptyState from '../../components/molecules/EmptyState';
import Icon from '../../components/atoms/Icon';

export default function JournalScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const entries = useJournalStore(s => s.entries);

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.base }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>Journal</Text>
            <Pressable
              style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/journal/new')}
            >
              <Icon name="Plus" size={18} color={theme.colors.base} />
              <Text style={[styles.addBtnText, { color: theme.colors.base }]}>New Entry</Text>
            </Pressable>
          </View>

          {sorted.length === 0 ? (
            <EmptyState
              title="Your journal awaits"
              message="Document your homestead journey with photos, notes, and reflections. Every entry becomes part of your story."
              icon="Book"
              actionLabel="Write First Entry"
              onAction={() => router.push('/journal/new')}
            />
          ) : (
            <View style={styles.list}>
              {sorted.map(entry => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onPress={() => router.push(`/journal/${entry.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 6 },
  addBtnText: { fontSize: 14, fontWeight: '600' },
  list: { gap: 12 },
});
