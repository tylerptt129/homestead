import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Card, Text, Badge, Icon } from '../atoms';

interface JournalEntry {
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  tags: string[];
  photosCount?: number;
}

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

const moodEmojis: Record<string, string> = {
  great: '\u{1F60A}',
  good: '\u{1F642}',
  neutral: '\u{1F610}',
  tired: '\u{1F634}',
  frustrated: '\u{1F624}',
  proud: '\u{1F929}',
  excited: '\u{1F389}',
};

export default function JournalCard({ entry, onPress }: JournalCardProps) {
  const { theme } = useTheme();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card variant="default" onPress={onPress}>
      {/* Top row: title + date */}
      <View style={styles.topRow}>
        <Text variant="subheading" style={styles.title} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text variant="caption">{formatDate(entry.createdAt)}</Text>
      </View>

      {/* Content preview */}
      <Text
        variant="body"
        numberOfLines={2}
        style={[styles.preview, { color: theme.colors.textMuted }]}
      >
        {entry.content}
      </Text>

      {/* Bottom row: mood + tags + photo indicator */}
      <View style={styles.bottomRow}>
        <View style={styles.moodAndTags}>
          <Text style={styles.mood}>
            {moodEmojis[entry.mood] || '\u{1F642}'}
          </Text>
          {entry.tags.map((tag) => (
            <Badge key={tag} label={tag} size="sm" variant="default" />
          ))}
        </View>
        {entry.photosCount != null && entry.photosCount > 0 && (
          <View style={styles.photoIndicator}>
            <Icon name="Camera" size={14} color={theme.colors.textMuted} />
            <Text variant="caption" style={styles.photoCount}>
              {entry.photosCount}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  preview: {
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodAndTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  mood: {
    fontSize: 16,
    marginRight: 4,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCount: {
    marginLeft: 4,
  },
});
