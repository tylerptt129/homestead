import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Droplets,
  Sprout,
  Cookie,
  Rabbit,
  Zap,
  Hammer,
  Wrench,
  Leaf,
  ShieldCheck,
  Landmark,
  Fence,
  Wheat,
} from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import { Icon } from '@homestead/ui/atoms/Icon';
import { ProgressRing } from '@homestead/ui/molecules/ProgressRing';
import type { ModuleWithProgress } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

type FilterOption = 'all' | 'in_progress' | 'not_started' | 'completed';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'not_started', label: 'Not Started' },
  { key: 'completed', label: 'Completed' },
];

// ---------------------------------------------------------------------------
// Icon map — maps module slugs to lucide icons
// ---------------------------------------------------------------------------

const MODULE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  'water-systems': Droplets,
  'garden-planning': Sprout,
  'food-preservation': Cookie,
  'livestock': Rabbit,
  'energy-power': Zap,
  'shelter-structures': Hammer,
  'tools-equipment': Wrench,
  'soil-composting': Leaf,
  'security-safety': ShieldCheck,
  'finances-legal': Landmark,
  'fencing-boundaries': Fence,
  'food-forest': Wheat,
};

// ---------------------------------------------------------------------------
// Placeholder module data
// ---------------------------------------------------------------------------

const PLACEHOLDER_MODULES: ModuleWithProgress[] = [
  { id: '1', slug: 'water-systems', title: 'Water Systems', description: 'Collect, store, and distribute water across your homestead.', icon_name: 'Droplets', display_order: 1, color: '#4A90D9', estimated_hours: 40, difficulty: 'intermediate', created_at: '', completedSteps: 3, totalSteps: 10, progressPercent: 30 },
  { id: '2', slug: 'garden-planning', title: 'Garden Planning', description: 'Design, plant, and manage productive gardens.', icon_name: 'Sprout', display_order: 2, color: '#5B8C5A', estimated_hours: 30, difficulty: 'beginner', created_at: '', completedSteps: 7, totalSteps: 12, progressPercent: 58 },
  { id: '3', slug: 'food-preservation', title: 'Food Preservation', description: 'Can, dry, ferment, and store food for year-round use.', icon_name: 'Cookie', display_order: 3, color: '#D4A437', estimated_hours: 20, difficulty: 'beginner', created_at: '', completedSteps: 0, totalSteps: 8, progressPercent: 0 },
  { id: '4', slug: 'livestock', title: 'Livestock', description: 'Raise and care for chickens, goats, bees, and more.', icon_name: 'Rabbit', display_order: 4, color: '#B07D56', estimated_hours: 50, difficulty: 'advanced', created_at: '', completedSteps: 2, totalSteps: 15, progressPercent: 13 },
  { id: '5', slug: 'energy-power', title: 'Energy & Power', description: 'Solar, wind, generators, and battery backup systems.', icon_name: 'Zap', display_order: 5, color: '#E8A838', estimated_hours: 60, difficulty: 'advanced', created_at: '', completedSteps: 0, totalSteps: 14, progressPercent: 0 },
  { id: '6', slug: 'shelter-structures', title: 'Shelter & Structures', description: 'Build, repair, and maintain barns, coops, and sheds.', icon_name: 'Hammer', display_order: 6, color: '#8B6F47', estimated_hours: 80, difficulty: 'advanced', created_at: '', completedSteps: 5, totalSteps: 11, progressPercent: 45 },
  { id: '7', slug: 'tools-equipment', title: 'Tools & Equipment', description: 'Acquire, maintain, and organize essential tools.', icon_name: 'Wrench', display_order: 7, color: '#7B8794', estimated_hours: 15, difficulty: 'beginner', created_at: '', completedSteps: 6, totalSteps: 6, progressPercent: 100 },
  { id: '8', slug: 'soil-composting', title: 'Soil & Composting', description: 'Build healthy soil with composting and amendments.', icon_name: 'Leaf', display_order: 8, color: '#6B7C3E', estimated_hours: 25, difficulty: 'beginner', created_at: '', completedSteps: 4, totalSteps: 9, progressPercent: 44 },
  { id: '9', slug: 'security-safety', title: 'Security & Safety', description: 'Protect your property, family, and livestock.', icon_name: 'ShieldCheck', display_order: 9, color: '#C75D3A', estimated_hours: 35, difficulty: 'intermediate', created_at: '', completedSteps: 0, totalSteps: 10, progressPercent: 0 },
  { id: '10', slug: 'finances-legal', title: 'Finances & Legal', description: 'Manage budgets, permits, insurance, and taxes.', icon_name: 'Landmark', display_order: 10, color: '#5A7D6E', estimated_hours: 20, difficulty: 'intermediate', created_at: '', completedSteps: 1, totalSteps: 7, progressPercent: 14 },
  { id: '11', slug: 'fencing-boundaries', title: 'Fencing & Boundaries', description: 'Install and maintain fences, gates, and property lines.', icon_name: 'Fence', display_order: 11, color: '#9B8455', estimated_hours: 30, difficulty: 'intermediate', created_at: '', completedSteps: 0, totalSteps: 8, progressPercent: 0 },
  { id: '12', slug: 'food-forest', title: 'Food Forest', description: 'Establish perennial food systems and orchard layers.', icon_name: 'Wheat', display_order: 12, color: '#7FB069', estimated_hours: 45, difficulty: 'intermediate', created_at: '', completedSteps: 2, totalSteps: 10, progressPercent: 20 },
];

// ---------------------------------------------------------------------------
// Module Card Item
// ---------------------------------------------------------------------------

interface ModuleGridItemProps {
  module: ModuleWithProgress;
  onPress: () => void;
}

function ModuleGridItem({ module, onPress }: ModuleGridItemProps) {
  const { colors } = useTheme();
  const IconComponent = MODULE_ICON_MAP[module.slug] ?? Sprout;

  return (
    <Pressable
      style={[styles.gridCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${module.title}, ${module.progressPercent}% complete, ${module.completedSteps} of ${module.totalSteps} steps`}
    >
      <View style={styles.gridCardTop}>
        <View style={[styles.iconBox, { backgroundColor: module.color + '20' }]}>
          <IconComponent size={24} color={module.color} strokeWidth={1.5} />
        </View>
        <ProgressRing percentage={module.progressPercent} size={44} strokeWidth={4}>
          <Text
            variant="caption"
            style={{ fontFamily: fontFamilies.monoMedium, color: colors.primary, fontSize: 10 }}
          >
            {module.progressPercent}%
          </Text>
        </ProgressRing>
      </View>
      <Text
        variant="body"
        style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginTop: spacing.md }}
        numberOfLines={1}
      >
        {module.title}
      </Text>
      <Text variant="caption" muted style={{ fontFamily: fontFamilies.mono, marginTop: spacing.xs }}>
        {module.completedSteps}/{module.totalSteps} steps
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Modules List Screen
// ---------------------------------------------------------------------------

export default function ModulesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterOption>('all');

  const modules = PLACEHOLDER_MODULES;

  const filteredModules = useMemo(() => {
    switch (filter) {
      case 'in_progress':
        return modules.filter((m) => m.completedSteps > 0 && m.progressPercent < 100);
      case 'not_started':
        return modules.filter((m) => m.completedSteps === 0);
      case 'completed':
        return modules.filter((m) => m.progressPercent === 100);
      default:
        return modules;
    }
  }, [modules, filter]);

  const handleModulePress = useCallback(
    (slug: string) => {
      router.push(`/modules/${slug}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: ModuleWithProgress }) => (
      <ModuleGridItem
        module={item}
        onPress={() => handleModulePress(item.slug)}
      />
    ),
    [handleModulePress],
  );

  const keyExtractor = useCallback((item: ModuleWithProgress) => item.id, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={['top']}>
      {/* ── Header ──────────────────────────────────── */}
      <View style={styles.headerSection}>
        <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
          Your Modules
        </Text>
        <Text variant="bodySmall" muted style={{ marginTop: 2 }}>
          {modules.length} modules, {modules.filter((m) => m.progressPercent === 100).length} completed
        </Text>
      </View>

      {/* ── Filter Chips ──────────────────────────────── */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.key;
          return (
            <Pressable
              key={opt.key}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(opt.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
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
        })}
      </View>

      {/* ── Grid ──────────────────────────────────────── */}
      <FlatList
        data={filteredModules}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="body" muted center>
              No modules match this filter.
            </Text>
          </View>
        }
      />
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
  filterRow: {
    flexDirection: 'row',
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
  columnWrapper: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing['4xl'],
    gap: spacing.sm,
  },
  gridCard: {
    flex: 1,
    padding: spacing.base,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
  },
});
