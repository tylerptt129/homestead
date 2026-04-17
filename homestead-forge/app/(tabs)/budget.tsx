import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useBudgetStore } from '../../stores/useBudgetStore';
import Card from '../../components/atoms/Card';
import StatCard from '../../components/molecules/StatCard';
import BudgetRow from '../../components/molecules/BudgetRow';
import EmptyState from '../../components/molecules/EmptyState';
import Icon from '../../components/atoms/Icon';

const CATEGORIES = ['materials', 'tools', 'labor', 'permits', 'equipment'] as const;

export default function BudgetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const items = useBudgetStore(s => s.items);

  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });

  const totalSpent = useMemo(() => items.reduce((s, i) => s + i.amount, 0), [items]);

  const thisMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return items
      .filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((s, i) => s + i.amount, 0);
  }, [items]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(i => {
      map[i.category] = (map[i.category] || 0) + i.amount;
    });
    return CATEGORIES.map(c => ({ category: c, amount: map[c] || 0 })).sort((a, b) => b.amount - a.amount);
  }, [items]);

  const topCategory = byCategory[0]?.category || 'None';

  const sorted = useMemo(() => [...items].sort((a, b) => b.date.localeCompare(a.date)), [items]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.base }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>Budget</Text>
            <Pressable
              style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/budget/add')}
            >
              <Icon name="Plus" size={18} color={theme.colors.base} />
              <Text style={[styles.addBtnText, { color: theme.colors.base }]}>Add Expense</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Total Spent" value={`$${totalSpent.toLocaleString()}`} icon="DollarSign" />
            <StatCard label="This Month" value={`$${thisMonth.toLocaleString()}`} icon="Calendar" />
            <StatCard label="Top Category" value={topCategory} icon="TrendingUp" />
          </View>

          {items.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>By Category</Text>
              {byCategory.filter(c => c.amount > 0).map(({ category, amount }) => (
                <View key={category} style={styles.catRow}>
                  <Text style={[styles.catName, { color: theme.colors.text, fontFamily: f }]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <View style={[styles.catBar, { backgroundColor: theme.colors.border }]}>
                    <View style={[styles.catFill, {
                      backgroundColor: theme.colors.primary,
                      width: `${totalSpent > 0 ? (amount / totalSpent) * 100 : 0}%`,
                    }]} />
                  </View>
                  <Text style={[styles.catAmount, { color: theme.colors.textMuted, fontFamily: 'monospace' }]}>
                    ${amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Recent Expenses</Text>
            {sorted.length === 0 ? (
              <EmptyState
                title="No expenses yet"
                message="Track your homestead spending to stay on budget and see where your money goes."
                icon="DollarSign"
                actionLabel="Add First Expense"
                onAction={() => router.push('/budget/add')}
              />
            ) : (
              <View style={styles.list}>
                {sorted.slice(0, 20).map(item => (
                  <BudgetRow key={item.id} item={item} onPress={() => {}} />
                ))}
              </View>
            )}
          </View>
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
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  catName: { width: 80, fontSize: 14 },
  catBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 4 },
  catAmount: { width: 80, textAlign: 'right', fontSize: 13 },
  list: { gap: 8 },
});
