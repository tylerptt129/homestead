import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Plus } from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import type { JournalEntry, Mood } from '@homestead/core/types';
import { formatDate } from '@homestead/core/utils/calculations';
import { MOOD_OPTIONS } from '@homestead/core/utils/constants';

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

type JournalFilter = 'all' | Mood;

const JOURNAL_FILTERS: { key: JournalFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  ...MOOD_OPTIONS.map((m) => ({ key: m.value as JournalFilter, label: `${m.emoji} ${m.label}` })),
];

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const PLACEHOLDER_ENTRIES: JournalEntry[] = [
  { id: 'j1', user_id: 'u1', module_id: '2', title: 'First tomatoes of the season', content: 'Harvested early girls today. Beautiful color and great taste. The kids loved picking them right off the vine. We need to stake the Roma plants tomorrow -- they are getting heavy.', mood: 'great', weather: { temp: 78, conditions: 'Sunny' }, photos: [], tags: ['harvest', 'tomatoes'], created_at: '2026-04-14T10:30:00Z', updated_at: '2026-04-14T10:30:00Z' },
  { id: 'j2', user_id: 'u1', module_id: '1', title: 'Rain barrel overflow fix', content: 'Added a diverter to the main barrel. No more flooding near the coop. Used 3/4" PVC and a simple ball valve.', mood: 'good', weather: { temp: 65, conditions: 'Overcast' }, photos: [], tags: ['water', 'maintenance'], created_at: '2026-04-12T14:20:00Z', updated_at: '2026-04-12T14:20:00Z' },
  { id: 'j3', user_id: 'u1', module_id: null, title: 'Fence line walk', content: 'Checked the perimeter. Found a weak spot on the north side that needs repair. Deer have been coming through.', mood: 'neutral', weather: { temp: 55, conditions: 'Windy' }, photos: [], tags: ['maintenance', 'fencing'], created_at: '2026-04-10T08:15:00Z', updated_at: '2026-04-10T08:15:00Z' },
  { id: 'j4', user_id: 'u1', module_id: '4', title: 'Lost a hen overnight', content: 'Found feathers near the run. Predator got in through a gap I missed. Need to reinforce the whole coop perimeter.', mood: 'rough', weather: { temp: 42, conditions: 'Clear' }, photos: [], tags: ['livestock', 'predators'], created_at: '2026-04-08T06:45:00Z', updated_at: '2026-04-08T06:45:00Z' },
  { id: 'j5', user_id: 'u1', module_id: '6', title: 'Tool shed framing done', content: 'Got the walls up on the new tool shed. Took three days working solo. Roof trusses go up this weekend.', mood: 'great', weather: { temp: 70, conditions: 'Partly Cloudy' }, photos: [], tags: ['building', 'tools'], created_at: '2026-04-05T17:00:00Z', updated_at: '2026-04-05T17:00:00Z' },
  { id: 'j6', user_id: 'u1', module_id: null, title: 'Tough weather week', content: 'Rain every day. Could not get anything done outside. Used the time to plan the food forest layout.', mood: 'tough', weather: { temp: 48, conditions: 'Rain' }, photos: [], tags: ['weather', 'planning'], created_at: '2026-04-02T11:00:00Z', updated_at: '2026-04-02T11:00:00Z' },
];

const MOOD_EMOJI: Record<string, string> = {
  great: '\u{1F929}',
  good: '\u{1F60A}',
  neutral: '\u{1F610}',
  tough: '\u{1F62B}',
  rough: '\u{1F622}',
};

// ---------------------------------------------------------------------------
// Journal Entry Card
// ---------------------------------------------------------------------------

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

function JournalEntryCard({ entry, onPress }: JournalEntryCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.entryCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry: ${entry.title}`}
    >
      <View style={styles.entryHeader}>
        <Text variant="bodySmall" style={{ fontSize: 20 }}>
          {MOOD_EMOJI[entry.mood] ?? ''}
        </Text>
        <View style={styles.entryMeta}>
          <Text
            variant="body"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold }}
            numberOfLines={1}
          >
            {entry.title}
          </Text>
          <Text variant="caption" muted>
            {formatDate(entry.created_at, 'medium')}
            {entry.weather?.conditions ? ` \u00B7 ${entry.weather.conditions}` : ''}
            {entry.weather?.temp ? ` ${entry.weather.temp}\u00B0F` : ''}
          </Text>
        </View>
      </View>
      <Text variant="bodySmall" muted numberOfLines={3} style={{ marginTop: spacing.sm }}>
        {entry.content}
      </Text>
      {entry.tags.length > 0 && (
        <View style={styles.tagRow}>
          {entry.tags.slice(0, 4).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
              <Text variant="caption" muted style={{ fontSize: 11 }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Journal List Screen
// ---------------------------------------------------------------------------

export default function JournalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<JournalFilter>('all');

  const entries = PLACEHOLDER_ENTRIES;

  const filteredEntries = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => e.mood === filter);
  }, [entries, filter]);

  const renderItem = useCallback(
    ({ item }: { item: JournalEntry }) => (
      <JournalEntryCard
        entry={item}
        onPress={() => {
          // Future: navigate to journal detail
        }}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: JournalEntry) => item.id, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={['top']}>
      {/* ── Header ──────────────────────────────────── */}
      <View style={styles.headerSection}>
        <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
          Journal
        </Text>
        <Text variant="bodySmall" muted style={{ marginTop: 2 }}>
          {entries.length} entries
        </Text>
      </View>

      {/* ── Filter Chips ──────────────────────────────── */}
      <FlatList
        horizontal
        data={JOURNAL_FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item: opt }) => {
          const active = filter === opt.key;
          return (
            <Pressable
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(opt.key)}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? '#1C1A17' : colors.textMuted,
                  fontFamily: fontFamilies.bodySemiBold,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* ── Entries List ──────────────────────────────── */}
      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={48} color={colors.border} strokeWidth={1} />
            <Text
              variant="handwritten"
              center
              style={{ color: colors.textMuted, fontFamily: fontFamilies.handwritten, fontSize: 22, marginTop: spacing.lg }}
            >
              No entries yet...
            </Text>
            <Text
              variant="handwritten"
              center
              style={{ color: colors.textMuted, fontFamily: fontFamilies.handwritten, fontSize: 18, marginTop: spacing.xs }}
            >
              Your homestead story starts with the first page.{'\n'}Tap the + button to begin writing.
            </Text>
          </View>
        }
      />

      {/* ── FAB ───────────────────────────────────────── */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary, ...shadows.warm }]}
        onPress={() => router.push('/journal/new')}
        accessibilityRole="button"
        accessibilityLabel="Add new journal entry"
      >
        <Plus size={28} color="#1C1A17" strokeWidth={2} />
      </Pressable>
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
  headerSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['5xl'],
  },
  entryCard: {
    padding: spacing.base,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  entryMeta: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
    paddingHorizontal: spacing['2xl'],
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
