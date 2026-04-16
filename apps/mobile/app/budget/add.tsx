import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  Calendar,
  Camera,
  ChevronDown,
  DollarSign,
  Receipt,
  Store,
  Tag,
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
import { AUTOSAVE_DEBOUNCE_MS, BUDGET_CATEGORIES } from '@homestead/core/utils/constants';
import type { BudgetCategory } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Module options (placeholder)
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

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  materials: 'Materials',
  tools: 'Tools',
  labor: 'Labor',
  permits: 'Permits',
  equipment: 'Equipment',
};

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  materials: '#C8A96E',
  tools: '#7B8794',
  labor: '#5B8C5A',
  permits: '#C75D3A',
  equipment: '#4A90D9',
};

// ---------------------------------------------------------------------------
// Add Budget Item Screen
// ---------------------------------------------------------------------------

export default function AddBudgetScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BudgetCategory | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleOption | null>(null);
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);

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

  const handleAmountChange = useCallback(
    (text: string) => {
      // Allow only numbers and decimal point
      const cleaned = text.replace(/[^0-9.]/g, '');
      // Prevent multiple decimal points
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
      setAmount(formatted);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleDateChange = useCallback(
    (text: string) => {
      // Simple date input: allow digits and dashes
      const cleaned = text.replace(/[^0-9-]/g, '');
      setDate(cleaned);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleReceiptPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setReceiptPhoto(result.assets[0].uri);
      scheduleAutosave();
    }
  }, [scheduleAutosave]);

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
        {/* ── Description ─────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Description
          </Text>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Tag size={18} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, fontFamily: fontFamilies.body, fontSize: fontSizes.body },
              ]}
              value={description}
              onChangeText={(text) => { setDescription(text); scheduleAutosave(); }}
              placeholder="What did you buy?"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              autoFocus
            />
          </View>
        </View>

        {/* ── Amount ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Amount
          </Text>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <DollarSign size={18} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, fontFamily: fontFamilies.mono, fontSize: fontSizes.h2 },
              ]}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* ── Category Picker ─────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Category
          </Text>
          <View style={styles.categoryGrid}>
            {BUDGET_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: active ? CATEGORY_COLORS[cat] + '20' : colors.surfaceAlt,
                      borderColor: active ? CATEGORY_COLORS[cat] : colors.border,
                    },
                  ]}
                  onPress={() => { setCategory(cat); scheduleAutosave(); }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
                  <Text
                    variant="bodySmall"
                    style={{
                      color: active ? CATEGORY_COLORS[cat] : colors.textMuted,
                      fontFamily: fontFamilies.bodySemiBold,
                      marginLeft: spacing.sm,
                    }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Module Picker (Optional) ────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Module (optional)
          </Text>
          <Pressable
            style={[
              styles.inputRow,
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
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Pressable
                style={[styles.dropdownOption, { borderBottomColor: colors.border }]}
                onPress={() => handleModuleSelect(null)}
              >
                <Text variant="bodySmall" muted>
                  None
                </Text>
              </Pressable>
              {MODULE_OPTIONS.map((mod) => (
                <Pressable
                  key={mod.id}
                  style={[styles.dropdownOption, { borderBottomColor: colors.border }]}
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

        {/* ── Vendor ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Vendor
          </Text>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Store size={18} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, fontFamily: fontFamilies.body, fontSize: fontSizes.body },
              ]}
              value={vendor}
              onChangeText={(text) => { setVendor(text); scheduleAutosave(); }}
              placeholder="Where did you buy it?"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* ── Date ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Date
          </Text>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Calendar size={18} color={colors.textMuted} strokeWidth={1.5} />
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, fontFamily: fontFamilies.mono, fontSize: fontSizes.body },
              ]}
              value={date}
              onChangeText={handleDateChange}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              maxLength={10}
            />
          </View>
        </View>

        {/* ── Receipt Photo ───────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}
          >
            Receipt
          </Text>
          {receiptPhoto ? (
            <View style={styles.receiptPreview}>
              <View style={[styles.receiptThumb, { backgroundColor: colors.surfaceAlt }]}>
                <Receipt size={32} color={colors.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.receiptInfo}>
                <Text variant="bodySmall" style={{ color: colors.text }}>
                  Receipt attached
                </Text>
                <Pressable onPress={() => { setReceiptPhoto(null); scheduleAutosave(); }}>
                  <Text variant="caption" style={{ color: colors.danger, marginTop: 4 }}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={[
                styles.receiptButton,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
              onPress={handleReceiptPhoto}
              accessibilityLabel="Upload receipt photo"
            >
              <Camera size={24} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="bodySmall" muted style={{ marginTop: spacing.sm }}>
                Tap to upload receipt photo
              </Text>
            </Pressable>
          )}
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
  section: {
    marginBottom: spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    marginLeft: spacing.sm,
    padding: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.base,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dropdown: {
    marginTop: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 250,
    ...shadows.md,
  },
  dropdownOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  receiptButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  receiptPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptThumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptInfo: {
    marginLeft: spacing.md,
  },
  autosaveNote: {
    paddingVertical: spacing.xl,
  },
});
