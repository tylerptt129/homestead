import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useBudgetStore } from '../../stores/useBudgetStore';
import { useModuleStore } from '../../stores/useModuleStore';
import Button from '../../components/atoms/Button';
import type { BudgetCategory } from '../../types';

const CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: 'materials', label: 'Materials' },
  { value: 'tools', label: 'Tools' },
  { value: 'labor', label: 'Labor' },
  { value: 'permits', label: 'Permits' },
  { value: 'equipment', label: 'Equipment' },
];

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function AddBudgetItem() {
  const { theme } = useTheme();
  const router = useRouter();
  const addItem = useBudgetStore(s => s.addItem);
  const modules = useModuleStore(s => s.modules);

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BudgetCategory>('materials');
  const [moduleId, setModuleId] = useState('');
  const [vendor, setVendor] = useState('');

  const handleSave = () => {
    if (!description.trim() || !amount.trim()) return;
    addItem({
      id: generateId(),
      userId: 'local-user',
      moduleId: moduleId || '',
      stepId: '',
      description,
      amount: parseFloat(amount) || 0,
      category,
      vendor,
      receiptUrl: '',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: fd }]}>Add Expense</Text>
          <Button title="Save" variant="primary" onPress={handleSave} disabled={!description.trim() || !amount.trim()} />
        </View>

        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Description</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]}
          value={description}
          onChangeText={setDescription}
          placeholder="What did you buy?"
          placeholderTextColor={theme.colors.textMuted}
          autoFocus
        />

        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Amount ($)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: 'monospace', fontSize: 24 }]}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Category</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map(c => (
            <Pressable key={c.value} onPress={() => setCategory(c.value)} style={[styles.catChip, {
              backgroundColor: category === c.value ? theme.colors.primary : theme.colors.surface,
              borderColor: category === c.value ? theme.colors.primary : theme.colors.border,
            }]}>
              <Text style={{ color: category === c.value ? theme.colors.base : theme.colors.text, fontFamily: f, fontSize: 14 }}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Module (optional)</Text>
        <View style={styles.catRow}>
          <Pressable onPress={() => setModuleId('')} style={[styles.catChip, {
            backgroundColor: moduleId === '' ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
          }]}>
            <Text style={{ color: moduleId === '' ? theme.colors.base : theme.colors.text, fontFamily: f, fontSize: 14 }}>None</Text>
          </Pressable>
          {modules.map(m => (
            <Pressable key={m.id} onPress={() => setModuleId(m.id)} style={[styles.catChip, {
              backgroundColor: moduleId === m.id ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }]}>
              <Text style={{ color: moduleId === m.id ? theme.colors.base : theme.colors.text, fontFamily: f, fontSize: 14 }} numberOfLines={1}>{m.title}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: f }]}>Vendor (optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border, fontFamily: f }]}
          value={vendor}
          onChangeText={setVendor}
          placeholder="Where did you buy it?"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 600, width: '100%', alignSelf: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  label: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 8 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
});
