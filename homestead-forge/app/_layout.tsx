import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { useTheme } from '../theme';
import { useAuthStore } from '../stores/useAuthStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useJournalStore } from '../stores/useJournalStore';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useModuleStore } from '../stores/useModuleStore';

function AppContent() {
  const { theme } = useTheme();
  const loadAuth = useAuthStore(s => s.loadFromStorage);
  const loadProgress = useProgressStore(s => s.loadFromStorage);
  const loadJournal = useJournalStore(s => s.loadFromStorage);
  const loadBudget = useBudgetStore(s => s.loadFromStorage);
  const setModules = useModuleStore(s => s.setModules);
  const setSteps = useModuleStore(s => s.setSteps);

  useEffect(() => {
    loadAuth();
    loadProgress();
    loadJournal();
    loadBudget();

    // Load seed data dynamically to avoid circular imports
    import('../data/seed/modules').then(({ seedModules, seedSteps }) => {
      setModules(seedModules);
      Object.entries(seedSteps).forEach(([slug, steps]) => {
        setSteps(slug, steps as any[]);
      });
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.base }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.base },
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
