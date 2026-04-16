import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  ChevronDown,
  Hash,
  X,
} from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import { AUTOSAVE_DEBOUNCE_MS, MOOD_OPTIONS } from '@homestead/core/utils/constants';
import type { Mood } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Module picker options (placeholder)
// ---------------------------------------------------------------------------

interface ModuleOption {
  id: string;
  title: string;
}

const MODULE_OPTIONS: ModuleOption[] = [
  { id: '1', title: 'Water Systems' },
  { id: '2', title: 'Garden Planning' },
  { id: '3', title: 'Food Preservation' },
  { id: '4', title: 'Livestock' },
  { id: '5', title: 'Energy & Power' },
  { id: '6', title: 'Shelter & Structures' },
  { id: '7', title: 'Tools & Equipment' },
  { id: '8', title: 'Soil & Composting' },
  { id: '9', title: 'Security & Safety' },
  { id: '10', title: 'Finances & Legal' },
  { id: '11', title: 'Fencing & Boundaries' },
  { id: '12', title: 'Food Forest' },
];

// ---------------------------------------------------------------------------
// New Journal Entry Screen
// ---------------------------------------------------------------------------

export default function NewJournalScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleOption | null>(null);
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Autosave timer
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      // In production: persist draft to local store
    }, AUTOSAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  const handleTitleChange = useCallback(
    (text: string) => {
      setTitle(text);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleContentChange = useCallback(
    (text: string) => {
      setContent(text);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      scheduleAutosave();
    }
    setTagInput('');
  }, [tagInput, tags, scheduleAutosave]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      setTags((prev) => prev.filter((t) => t !== tag));
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleAddPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
      scheduleAutosave();
    }
  }, [scheduleAutosave]);

  const handleRemovePhoto = useCallback(
    (uri: string) => {
      setPhotos((prev) => prev.filter((p) => p !== uri));
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleMoodSelect = useCallback(
    (m: Mood) => {
      setMood(m);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleModuleSelect = useCallback(
    (mod: ModuleOption | null) => {
      setSelectedModule(mod);
      setShowModulePicker(false);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title Input ─────────────────────────────── */}
        <TextInput
          style={[
            styles.titleInput,
            {
              color: colors.text,
              fontFamily: fontFamilies.headerBold,
              fontSize: fontSizes.h1,
              borderBottomColor: colors.border,
            },
          ]}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Entry title..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="next"
          autoFocus
        />

        {/* ── Mood Selector ───────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}
          >
            How are you feeling?
          </Text>
          <View style={styles.moodRow}>
            {MOOD_OPTIONS.map((opt) => {
              const active = mood === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.moodButton,
                    {
                      backgroundColor: active ? colors.primary + '20' : colors.surfaceAlt,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleMoodSelect(opt.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={opt.label}
                >
                  <Text style={{ fontSize: 24 }}>{opt.emoji}</Text>
                  <Text
                    variant="caption"
                    style={{
                      color: active ? colors.primary : colors.textMuted,
                      fontFamily: fontFamilies.bodySemiBold,
                      marginTop: 4,
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Content Text Area ───────────────────────── */}
        <TextInput
          style={[
            styles.contentInput,
            {
              color: colors.text,
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              fontFamily: fontFamilies.body,
              fontSize: fontSizes.body,
              lineHeight: lineHeights.body,
            },
          ]}
          value={content}
          onChangeText={handleContentChange}
          placeholder="What happened today? What did you learn? What's on your mind?"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          scrollEnabled={false}
        />

        {/* ── Module Picker ───────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}
          >
            Related Module (optional)
          </Text>
          <Pressable
            style={[
              styles.pickerButton,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
            onPress={() => setShowModulePicker(!showModulePicker)}
          >
            <Text
              variant="body"
              style={{ color: selectedModule ? colors.text : colors.textMuted, flex: 1 }}
            >
              {selectedModule?.title ?? 'Select a module...'}
            </Text>
            <ChevronDown size={18} color={colors.textMuted} strokeWidth={1.5} />
          </Pressable>

          {showModulePicker && (
            <View style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Pressable
                style={[styles.pickerOption, { borderBottomColor: colors.border }]}
                onPress={() => handleModuleSelect(null)}
              >
                <Text variant="bodySmall" muted>
                  None
                </Text>
              </Pressable>
              {MODULE_OPTIONS.map((mod) => (
                <Pressable
                  key={mod.id}
                  style={[styles.pickerOption, { borderBottomColor: colors.border }]}
                  onPress={() => handleModuleSelect(mod)}
                >
                  <Text
                    variant="bodySmall"
                    style={{
                      color: selectedModule?.id === mod.id ? colors.primary : colors.text,
                      fontFamily: selectedModule?.id === mod.id ? fontFamilies.bodySemiBold : fontFamilies.body,
                    }}
                  >
                    {mod.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ── Photo Attach ────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}
          >
            Photos
          </Text>
          <View style={styles.photoRow}>
            {photos.map((uri) => (
              <View key={uri} style={[styles.photoThumb, { backgroundColor: colors.surfaceAlt }]}>
                <Pressable
                  style={[styles.photoRemove, { backgroundColor: colors.danger }]}
                  onPress={() => handleRemovePhoto(uri)}
                  accessibilityLabel="Remove photo"
                >
                  <X size={12} color="#FFFFFF" strokeWidth={2} />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={[styles.addPhotoButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={handleAddPhoto}
              accessibilityLabel="Add photo"
            >
              <Camera size={24} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="caption" muted style={{ marginTop: 4 }}>
                Add
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Tags Input ──────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}
          >
            Tags
          </Text>

          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  style={[styles.tagChip, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => handleRemoveTag(tag)}
                  accessibilityLabel={`Remove tag ${tag}`}
                >
                  <Hash size={12} color={colors.primary} strokeWidth={1.5} />
                  <Text variant="caption" style={{ color: colors.primary, marginLeft: 2, marginRight: 4 }}>
                    {tag}
                  </Text>
                  <X size={12} color={colors.primary} strokeWidth={1.5} />
                </Pressable>
              ))}
            </View>
          )}

          <View
            style={[
              styles.tagInputContainer,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Hash size={16} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.tagTextInput,
                {
                  color: colors.text,
                  fontFamily: fontFamilies.body,
                  fontSize: fontSizes.bodySmall,
                },
              ]}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* ── Autosave indicator ──────────────────────── */}
        <View style={styles.autosaveNote}>
          <Text variant="caption" muted center style={{ fontFamily: fontFamilies.handwritten, fontSize: 16 }}>
            Everything is saved automatically
          </Text>
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
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
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['5xl'],
  },
  titleInput: {
    paddingVertical: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
  },
  moodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  contentInput: {
    minHeight: 160,
    padding: spacing.base,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 50,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  pickerDropdown: {
    marginTop: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.md,
  },
  pickerOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    position: 'relative',
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  tagTextInput: {
    flex: 1,
    marginLeft: spacing.sm,
    padding: 0,
  },
  autosaveNote: {
    paddingVertical: spacing.xl,
  },
});
