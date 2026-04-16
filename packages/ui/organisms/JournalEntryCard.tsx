import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  radii,
  shadows,
  spacing,
} from '../theme/tokens';
import { Text } from '../atoms/Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface JournalPhoto {
  /** Unique identifier */
  id: string;
  /** Image URI (local file or remote URL) */
  uri: string;
}

export interface JournalEntryCardProps {
  /** Entry date as a display string (e.g. "Apr 14, 2026") */
  date: string;
  /** Entry title */
  title: string;
  /** Mood emoji string (e.g. "😊") */
  moodEmoji?: string;
  /** Entry body text (will be truncated) */
  content: string;
  /** Maximum number of lines for content truncation (default 3) */
  contentMaxLines?: number;
  /** Thumbnail photos */
  photos?: JournalPhoto[];
  /** Module tag label (e.g. "Water System") */
  moduleTag?: string;
  /** Press handler */
  onPress?: () => void;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const THUMBNAIL_SIZE = 56;
const THUMBNAIL_GAP = spacing.sm;

// ─── Component ──────────────────────────────────────────────────────────────

export function JournalEntryCard({
  date,
  title,
  moodEmoji,
  content,
  contentMaxLines = 3,
  photos,
  moduleTag,
  onPress,
  style,
}: JournalEntryCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const hasPhotos = photos && photos.length > 0;

  const cardContent = (
    <View style={styles.inner}>
      {/* Header row: date + mood */}
      <View style={styles.headerRow}>
        <Text
          variant="caption"
          style={{
            fontFamily: fontFamilies.mono,
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          {date}
        </Text>
        {moodEmoji && (
          <Text variant="body" style={styles.moodEmoji}>
            {moodEmoji}
          </Text>
        )}
      </View>

      {/* Title */}
      <Text
        variant="h3"
        style={{ color: colors.text, marginTop: spacing.xs }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Truncated content */}
      <Text
        variant="bodySmall"
        muted
        numberOfLines={contentMaxLines}
        style={{ marginTop: spacing.sm }}
      >
        {content}
      </Text>

      {/* Photo thumbnail strip */}
      {hasPhotos && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoStrip}
          contentContainerStyle={styles.photoStripContent}
        >
          {photos.map((photo) => (
            <Image
              key={photo.id}
              source={{ uri: photo.uri }}
              style={[
                styles.thumbnail,
                {
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel="Journal photo thumbnail"
            />
          ))}
        </ScrollView>
      )}

      {/* Module tag */}
      {moduleTag && (
        <View style={styles.tagRow}>
          <View
            style={[
              styles.tag,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <Text
              variant="caption"
              style={{
                fontFamily: fontFamilies.bodyMedium,
                color: colors.primary,
              }}
            >
              {moduleTag}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            transform: [{ scale: scaleAnim }],
            ...shadows.md,
          },
          style,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
          accessibilityRole="button"
          accessibilityLabel={`Journal entry: ${title}, ${date}`}
        >
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          ...shadows.md,
        },
        style,
      ]}
    >
      {cardContent}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  pressable: {
    overflow: 'hidden',
  },
  inner: {
    padding: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodEmoji: {
    fontSize: 20,
  },
  photoStrip: {
    marginTop: spacing.md,
  },
  photoStripContent: {
    gap: THUMBNAIL_GAP,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
});
