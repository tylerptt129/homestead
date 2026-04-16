import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Lightbulb,
  Loader2,
  Play,
  Plus,
  SkipForward,
  Video,
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
import { Button } from '@homestead/ui/atoms/Button';
import { Divider } from '@homestead/ui/atoms/Divider';
import { AUTOSAVE_DEBOUNCE_MS } from '@homestead/core/utils/constants';
import { formatCurrency } from '@homestead/core/utils/calculations';
import type { Step, StepStatus, ResourceLink } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Placeholder step data
// ---------------------------------------------------------------------------

const PLACEHOLDER_STEP: Step = {
  id: 's3',
  module_id: '1',
  title: 'Install Rain Collection Barrels',
  description: 'Set up rain barrels at downspout locations to collect and store rainwater for garden irrigation and non-potable uses.',
  detailed_guide: 'Rain collection is one of the most cost-effective water strategies for any homestead. A typical roof can capture hundreds of gallons from a single rainfall event.\n\nStep 1: Identify all downspout locations on your structures. Prioritize those closest to garden beds or livestock watering areas.\n\nStep 2: Prepare a level, stable base for each barrel. Cinder blocks or a wooden platform raised 12-18 inches will improve gravity flow.\n\nStep 3: Install a diverter on the downspout that routes water into the barrel while allowing overflow to continue to the original drainage path.\n\nStep 4: Connect an overflow hose from each barrel to either a secondary barrel (daisy-chain) or a safe drainage area away from foundations.\n\nStep 5: Install a spigot near the bottom of each barrel for hose connections. Use food-grade barrel thread adapters.\n\nStep 6: Add a screen or mesh filter at the barrel opening to prevent debris and mosquitoes from entering the water.',
  tips: [
    'Use food-grade barrels (55 gallon) -- you can often find them at car washes or food processing plants for $10-20.',
    'Paint barrels a dark color to inhibit algae growth. Black or dark green works best.',
    'Check local regulations -- some states restrict or require permits for rainwater collection.',
    'One inch of rain on a 1,000 sq ft roof yields about 600 gallons of water.',
    'Add a tablespoon of vegetable oil to standing water as a mosquito deterrent if screens fail.',
  ],
  estimated_cost_low: 80,
  estimated_cost_high: 300,
  estimated_time: '4-6 hours',
  display_order: 3,
  depends_on: ['s1'],
  tags: ['installation', 'water', 'collection'],
  season_relevance: ['spring', 'summer'],
  resources: {
    links: [
      { url: 'https://www.epa.gov/watersense/rain-barrels', label: 'EPA Rain Barrel Guide' },
      { url: 'https://extension.umn.edu/yard-and-garden/rain-barrels', label: 'University Extension - Rain Barrels' },
    ],
    books: [
      'The Water-Wise Home by Laura Allen',
      'Rainwater Harvesting for Drylands (Vol 1 & 2) by Brad Lancaster',
    ],
    videos: [
      'Rain Barrel Setup Tutorial - Homestead DIY',
      'Daisy Chain Rain Barrels for Maximum Storage',
    ],
  },
  created_at: '',
};

const PLACEHOLDER_STATUS: StepStatus = 'in_progress';
const PLACEHOLDER_NOTES = 'Got two barrels from the car wash on Main St for $15 each. Need to pick up PVC fittings this weekend.';
const PLACEHOLDER_PHOTOS: string[] = [];
const PLACEHOLDER_ACTUAL_COST: number | null = 89.99;

// ---------------------------------------------------------------------------
// Step Detail Screen
// ---------------------------------------------------------------------------

export default function StepDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { slug, stepId } = useLocalSearchParams<{ slug: string; stepId: string }>();

  const step = PLACEHOLDER_STEP;

  // Local state
  const [status, setStatus] = useState<StepStatus>(PLACEHOLDER_STATUS);
  const [notes, setNotes] = useState(PLACEHOLDER_NOTES);
  const [photos, setPhotos] = useState<string[]>(PLACEHOLDER_PHOTOS);
  const [actualCost, setActualCost] = useState(
    PLACEHOLDER_ACTUAL_COST !== null ? String(PLACEHOLDER_ACTUAL_COST) : '',
  );

  // Autosave timer for notes
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      // In production: persist notes to store/DB
    }, AUTOSAVE_DEBOUNCE_MS);
  }, []);

  const handleCostChange = useCallback((text: string) => {
    // Allow only numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    setActualCost(cleaned);
  }, []);

  const handleAddPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  }, []);

  const handleRemovePhoto = useCallback((uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  }, []);

  const handleSetStatus = useCallback((newStatus: StepStatus) => {
    setStatus(newStatus);
    // In production: persist to store/DB
  }, []);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link.');
    });
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
    };
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title & Description ─────────────────────── */}
        <View style={styles.headerSection}>
          <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
            {step.title}
          </Text>
          <Text variant="body" muted style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            {step.description}
          </Text>

          {/* Estimate badges */}
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
              <Clock size={12} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="caption" muted style={{ marginLeft: 4 }}>
                {step.estimated_time}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
              <DollarSign size={12} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="caption" muted style={{ marginLeft: 4 }}>
                {formatCurrency(step.estimated_cost_low)} - {formatCurrency(step.estimated_cost_high)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Status Controls ─────────────────────────── */}
        <View style={styles.statusSection}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}
          >
            Status
          </Text>
          <View style={styles.statusRow}>
            <Pressable
              style={[
                styles.statusButton,
                {
                  backgroundColor: status === 'in_progress' ? colors.primary + '20' : colors.surfaceAlt,
                  borderColor: status === 'in_progress' ? colors.primary : colors.border,
                },
              ]}
              onPress={() => handleSetStatus('in_progress')}
            >
              <Loader2 size={16} color={status === 'in_progress' ? colors.primary : colors.textMuted} strokeWidth={1.5} />
              <Text
                variant="caption"
                style={{
                  color: status === 'in_progress' ? colors.primary : colors.textMuted,
                  fontFamily: fontFamilies.bodySemiBold,
                  marginLeft: 6,
                }}
              >
                In Progress
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.statusButton,
                {
                  backgroundColor: status === 'completed' ? colors.accent + '20' : colors.surfaceAlt,
                  borderColor: status === 'completed' ? colors.accent : colors.border,
                },
              ]}
              onPress={() => handleSetStatus('completed')}
            >
              <CheckCircle2 size={16} color={status === 'completed' ? colors.accent : colors.textMuted} strokeWidth={1.5} />
              <Text
                variant="caption"
                style={{
                  color: status === 'completed' ? colors.accent : colors.textMuted,
                  fontFamily: fontFamilies.bodySemiBold,
                  marginLeft: 6,
                }}
              >
                Complete
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.statusButton,
                {
                  backgroundColor: status === 'skipped' ? colors.textMuted + '20' : colors.surfaceAlt,
                  borderColor: status === 'skipped' ? colors.textMuted : colors.border,
                },
              ]}
              onPress={() => handleSetStatus('skipped')}
            >
              <SkipForward size={16} color={colors.textMuted} strokeWidth={1.5} />
              <Text
                variant="caption"
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.bodySemiBold,
                  marginLeft: 6,
                }}
              >
                Skip
              </Text>
            </Pressable>
          </View>
        </View>

        <Divider />

        {/* ── Detailed Guide ──────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}
          >
            Guide
          </Text>
          {step.detailed_guide.split('\n\n').map((paragraph, idx) => (
            <Text
              key={idx}
              variant="body"
              style={{ color: colors.text, lineHeight: 24, marginBottom: spacing.md }}
            >
              {paragraph}
            </Text>
          ))}
        </View>

        <Divider />

        {/* ── Tips ─────────────────────────────────────── */}
        {step.tips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.tipHeader}>
              <Lightbulb size={20} color={colors.warning} strokeWidth={1.5} />
              <Text
                variant="h3"
                style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginLeft: spacing.sm }}
              >
                Pro Tips
              </Text>
            </View>
            {step.tips.map((tip, idx) => (
              <View key={idx} style={[styles.tipCard, { backgroundColor: colors.card }]}>
                <Text
                  variant="bodySmall"
                  style={{ color: colors.warning, fontFamily: fontFamilies.monoMedium, marginRight: spacing.sm }}
                >
                  {idx + 1}.
                </Text>
                <Text variant="bodySmall" style={{ color: colors.text, flex: 1, lineHeight: 20 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Divider />

        {/* ── Notes (autosaved) ────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}
          >
            Notes
          </Text>
          <TextInput
            style={[
              styles.notesInput,
              {
                color: colors.text,
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
                fontFamily: fontFamilies.body,
                fontSize: fontSizes.body,
                lineHeight: lineHeights.body,
              },
            ]}
            value={notes}
            onChangeText={handleNotesChange}
            placeholder="Add your notes here... (autosaved)"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </View>

        <Divider />

        {/* ── Photos ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}
          >
            Photos
          </Text>
          <View style={styles.photoGrid}>
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

        <Divider />

        {/* ── Cost Logging ─────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.sm }}
          >
            Actual Cost
          </Text>
          <Text variant="caption" muted style={{ marginBottom: spacing.md }}>
            Estimated: {formatCurrency(step.estimated_cost_low)} - {formatCurrency(step.estimated_cost_high)}
          </Text>
          <View
            style={[
              styles.costInput,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <DollarSign size={18} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.costTextInput,
                {
                  color: colors.text,
                  fontFamily: fontFamilies.mono,
                  fontSize: fontSizes.h3,
                },
              ]}
              value={actualCost}
              onChangeText={handleCostChange}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
        </View>

        <Divider />

        {/* ── Resources ────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="h3"
            style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}
          >
            Resources
          </Text>

          {/* Links */}
          {step.resources.links && step.resources.links.length > 0 && (
            <>
              {step.resources.links.map((link, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.resourceRow, { borderBottomColor: colors.border }]}
                  onPress={() => handleOpenLink(link.url)}
                >
                  <ExternalLink size={16} color={colors.primary} strokeWidth={1.5} />
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.primary, marginLeft: spacing.sm, flex: 1 }}
                    numberOfLines={1}
                  >
                    {link.label}
                  </Text>
                </Pressable>
              ))}
            </>
          )}

          {/* Books */}
          {step.resources.books && step.resources.books.length > 0 && (
            <>
              <Text
                variant="caption"
                muted
                style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginTop: spacing.md, marginBottom: spacing.sm }}
              >
                Books
              </Text>
              {step.resources.books.map((book, idx) => (
                <View key={idx} style={[styles.resourceRow, { borderBottomColor: colors.border }]}>
                  <BookOpen size={16} color={colors.textMuted} strokeWidth={1.5} />
                  <Text variant="bodySmall" style={{ color: colors.text, marginLeft: spacing.sm, flex: 1 }}>
                    {book}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* Videos */}
          {step.resources.videos && step.resources.videos.length > 0 && (
            <>
              <Text
                variant="caption"
                muted
                style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginTop: spacing.md, marginBottom: spacing.sm }}
              >
                Videos
              </Text>
              {step.resources.videos.map((video, idx) => (
                <View key={idx} style={[styles.resourceRow, { borderBottomColor: colors.border }]}>
                  <Video size={16} color={colors.textMuted} strokeWidth={1.5} />
                  <Text variant="bodySmall" style={{ color: colors.text, marginLeft: spacing.sm, flex: 1 }}>
                    {video}
                  </Text>
                </View>
              ))}
            </>
          )}
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
    paddingBottom: spacing['4xl'],
  },
  headerSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
  statusSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  section: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  notesInput: {
    minHeight: 120,
    padding: spacing.base,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  photoGrid: {
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
  costInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  costTextInput: {
    flex: 1,
    marginLeft: spacing.sm,
    padding: 0,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
