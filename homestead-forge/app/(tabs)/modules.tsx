import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useModuleStore } from '../../stores/useModuleStore';
import { useProgressStore } from '../../stores/useProgressStore';
import ModuleCard from '../../components/molecules/ModuleCard';
import SearchBar from '../../components/molecules/SearchBar';

export default function ModulesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const modules = useModuleStore(s => s.modules);
  const steps = useModuleStore(s => s.steps);
  const progress = useProgressStore(s => s.progress);
  const [search, setSearch] = useState('');

  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });

  const filteredModules = useMemo(() => {
    if (!search.trim()) return modules;
    const q = search.toLowerCase();
    return modules.filter(m =>
      m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [modules, search]);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>Modules</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {modules.length} planning modules to guide your homestead journey
        </Text>

        <SearchBar value={search} onChangeText={setSearch} placeholder="Search modules..." />

        <View style={styles.grid}>
          {filteredModules.map((mod) => {
            const modSteps = steps[mod.slug] || [];
            const completed = modSteps.filter(s => progress[s.id]?.status === 'completed').length;
            const pct = modSteps.length > 0 ? completed / modSteps.length : 0;
            return (
              <View key={mod.id} style={styles.gridItem}>
                <ModuleCard
                  module={mod}
                  progress={pct}
                  onPress={() => router.push(`/modules/${mod.slug}`)}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  gridItem: { width: '48%', minWidth: 300 },
});
