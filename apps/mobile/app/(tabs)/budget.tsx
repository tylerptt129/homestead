import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
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
import { ProgressBar } from '@homestead/ui/molecules/ProgressBar';
import type { BudgetCategory, BudgetItem } from '@homestead/core/types';
import {
  calculateBudgetSummary,
  formatCurrency,
  formatDate,
} from '@homestead/core/utils/calculations';
import { BUDGET_CATEGORIES } from '@homestead/core/utils/constants';

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const PLACEHOLDER_ITEMS: BudgetItem[] = [
  { id: 'b1', user_id: 'u1', module_id: '1', step_id: 's1', description: 'Rain barrel (55 gal)', amount: 89.99, category: 'materials', vendor: 'Tractor Supply', receipt_url: null, date: '2026-04-14', created_at: '2026-04-14T10:00:00Z' },
  { id: 'b2', user_id: 'u1', module_id: '1', step_id: 's2', description: 'PVC pipe and fittings', amount: 47.50, category: 'materials', vendor: 'Home Depot', receipt_url: null, date: '2026-04-12', created_at: '2026-04-12T14:00:00Z' },
  { id: 'b3', user_id: 'u1', module_id: '6', step_id: null, description: 'Framing lumber (2x4, 2x6)', amount: 342.00, category: 'materials', vendor: 'Lumber Yard', receipt_url: null, date: '2026-04-10', created_at: '2026-04-10T09:00:00Z' },
  { id: 'b4', user_id: 'u1', module_id: '7', step_id: null, description: 'Circular saw (DeWalt)', amount: 159.00, category: 'tools', vendor: 'Amazon', receipt_url: null, date: '2026-04-08', created_at: '2026-04-08T16:00:00Z' },
  { id: 'b5', user_id: 'u1', module_id: '2', step_id: null, description: 'Raised bed soil mix (2 yd)', amount: 125.00, category: 'materials', vendor: 'Local Nursery', receipt_url: null, date: '2026-04-06', created_at: '2026-04-06T11:00:00Z' },
  { id: 'b6', user_id: 'u1', module_id: '9', step_id: null, description: 'Building permit - tool shed', amount: 150.00, category: 'permits', vendor: 'County Office', receipt_url: null, date: '2026-04-04', created_at: '2026-04-04T13:00:00Z' },
  { id: 'b7', user_id: 'u1', module_id: '4', step_id: null, description: 'Chicken wire (100 ft roll)', amount: 38.50, category: 'materials', vendor: 'Tractor Supply', receipt_url: null, date: '2026-04-02', created_at: '2026-04-02T10:00:00Z' },
  { id: 'b8', user_id: 'u1', module_id: '6', step_id: null, description: 'Roofing materials', amount: 487.00, category: 'materials', vendor: 'Home Depot', receipt_url: null, date: '2026-03-28', created_at: '2026-03-28T15:00:00Z' },
  { id: 'b9', user_id: 'u1', module_id: null, step_id: null, description: 'Fence post driver rental', amount: 45.00, category: 'equipment', vendor: 'Tool Rental Co', receipt_url: null, date: '2026-03-25', created_at: '2026-03-25T08:00:00Z' },
  { id: 'b10', user_id: 'u1', module_id: '8', step_id: null, description: 'Compost tumbler', amount: 129.00, category: 'equipment', vendor: 'Amazon', receipt_url: null, date: '2026-03-20', created_at: '2026-03-20T12:00:00Z' },
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
// Budget Screen
// ---------------------------------------------------------------------------

export default function BudgetScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const items = PLACEHOLDER_ITEMS;
  const summary = useMemo(() => calculateBudgetSummary(items), [items]);

  // Current month items
  const now = new Date();
  const thisMonthItems = useMemo(
    () =>
      items.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }),
    [items],
  );
  const thisMonthTotal = useMemo(
    () => thisMonthItems.reduce((acc, item) => acc + item.amount, 0),
    [thisMonthItems],
  );

  // Budget health: simple heuristic
  const budgetEstimate = 8500; // placeholder total budget
  const healthPercent = Math.round((summary.total / budgetEstimate) * 100);
  const isOverBudget = summary.total > budgetEstimate;

  // Max category for bar scaling
  const maxCategoryAmount = Math.max(...BUDGET_CATEGORIES.map((c) => summary.byCategory[c] ?? 0), 1);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.headerSection}>
          <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
            Budget
          </Text>
        </View>

        {/* ── Summary Cards ───────────────────────────── */}
        <View style={styles.summaryRow}>
          {/* Total Spent */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '20' }]}>
              <Wallet size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
              Total Spent
            </Text>
            <Text
              variant="h3"
              style={{ color: colors.text, fontFamily: fontFamilies.monoMedium, marginTop: 2 }}
              numberOfLines={1}
            >
              {formatCurrency(summary.total)}
            </Text>
          </View>

          {/* This Month */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.accent + '20' }]}>
              <DollarSign size={20} color={colors.accent} strokeWidth={1.5} />
            </View>
            <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
              This Month
            </Text>
            <Text
              variant="h3"
              style={{ color: colors.text, fontFamily: fontFamilies.monoMedium, marginTop: 2 }}
              numberOfLines={1}
            >
              {formatCurrency(thisMonthTotal)}
            </Text>
          </View>

          {/* Budget Health */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.summaryIcon,
                { backgroundColor: (isOverBudget ? colors.danger : colors.accent) + '20' },
              ]}
            >
              {isOverBudget ? (
                <TrendingUp size={20} color={colors.danger} strokeWidth={1.5} />
              ) : (
                <TrendingDown size={20} color={colors.accent} strokeWidth={1.5} />
              )}
            </View>
            <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
              Budget Health
            </Text>
            <Text
              variant="h3"
              style={{
                color: isOverBudget ? colors.danger : colors.accent,
                fontFamily: fontFamilies.monoMedium,
                marginTop: 2,
              }}
            >
              {healthPercent}%
            </Text>
          </View>
        </View>

        {/* ── Budget vs Estimate (placeholder bar chart) ── */}
        <View style={[styles.section, { backgroundColor: colors.card, borderRadius: radii.md, padding: spacing.base }]}>
          <Text variant="h3" style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold }}>
            Spending vs. Estimate
          </Text>
          <Text variant="caption" muted style={{ marginTop: 2, marginBottom: spacing.base }}>
            {formatCurrency(summary.total)} of {formatCurrency(budgetEstimate)} budget used
          </Text>
          <ProgressBar
            percentage={Math.min(healthPercent, 100)}
            height={10}
            color={isOverBudget ? colors.danger : colors.primary}
          />
          <View style={styles.barLabels}>
            <Text variant="caption" muted>$0</Text>
            <Text variant="caption" muted>{formatCurrency(budgetEstimate)}</Text>
          </View>
        </View>

        {/* ── Category Breakdown ──────────────────────── */}
        <View style={styles.section}>
          <Text variant="h3" style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}>
            By Category
          </Text>
          {BUDGET_CATEGORIES.map((cat) => {
            const amount = summary.byCategory[cat] ?? 0;
            const pct = maxCategoryAmount > 0 ? (amount / maxCategoryAmount) * 100 : 0;
            return (
              <View key={cat} style={styles.categoryRow}>
                <View style={styles.categoryLabel}>
                  <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
                  <Text variant="bodySmall" style={{ color: colors.text, flex: 1 }}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.text, fontFamily: fontFamilies.mono }}
                  >
                    {formatCurrency(amount)}
                  </Text>
                </View>
                <View style={[styles.categoryBarTrack, { backgroundColor: colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      { width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Recent Expenses ─────────────────────────── */}
        <View style={styles.section}>
          <Text variant="h3" style={{ color: colors.text, fontFamily: fontFamilies.bodySemiBold, marginBottom: spacing.md }}>
            Recent Expenses
          </Text>
          {items.slice(0, 8).map((item) => (
            <View
              key={item.id}
              style={[styles.expenseRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.expenseLeft}>
                <Text
                  variant="body"
                  style={{ color: colors.text, fontFamily: fontFamilies.bodyMedium }}
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
                <Text variant="caption" muted>
                  {formatDate(item.date, 'short')} \u00B7 {item.vendor}
                </Text>
              </View>
              <View style={styles.expenseRight}>
                <Text
                  variant="body"
                  style={{ color: colors.text, fontFamily: fontFamilies.mono, textAlign: 'right' }}
                >
                  {formatCurrency(item.amount)}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[item.category] + '20' }]}>
                  <Text variant="caption" style={{ color: CATEGORY_COLORS[item.category], fontSize: 10 }}>
                    {CATEGORY_LABELS[item.category]}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      {/* ── FAB ───────────────────────────────────────── */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary, ...shadows.warm }]}
        onPress={() => router.push('/budget/add')}
        accessibilityRole="button"
        accessibilityLabel="Add new expense"
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
  content: {
    paddingBottom: spacing['5xl'],
  },
  headerSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  categoryRow: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  categoryBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: 6,
    borderRadius: 3,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  expenseLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
    marginTop: 2,
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
