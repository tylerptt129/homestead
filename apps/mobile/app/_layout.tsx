import React, { useCallback, useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '@homestead/ui/theme';
import { colors } from '@homestead/ui/theme/tokens';

// ---------------------------------------------------------------------------
// Keep splash screen visible while we load resources
// ---------------------------------------------------------------------------
SplashScreen.preventAutoHideAsync();

// ---------------------------------------------------------------------------
// Font asset map — expo-font resolves these at build time via expo-font plugin
// ---------------------------------------------------------------------------
const FONTS = {
  PlayfairDisplay: require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
  'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
  'PlayfairDisplay-Italic': require('../assets/fonts/PlayfairDisplay-Italic.ttf'),
  SourceSans3: require('../assets/fonts/SourceSans3-Regular.ttf'),
  'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
  'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  'SourceSans3-Bold': require('../assets/fonts/SourceSans3-Bold.ttf'),
  JetBrainsMono: require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  Caveat: require('../assets/fonts/Caveat-Regular.ttf'),
  'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
};

// ---------------------------------------------------------------------------
// Simple persisted flag for onboarding completion
// In production this would live in an MMKV store or Zustand slice
// ---------------------------------------------------------------------------
let _onboardingComplete = false;

export function setOnboardingComplete(value: boolean) {
  _onboardingComplete = value;
}

export function isOnboardingComplete(): boolean {
  return _onboardingComplete;
}

// ---------------------------------------------------------------------------
// Inner navigator — needs ThemeProvider above it so useTheme() works
// ---------------------------------------------------------------------------
function RootNavigator() {
  const { colors: c, isDark } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // After initial render, check onboarding status and redirect
    const inOnboarding = segments[0] === 'onboarding';

    if (!_onboardingComplete && !inOnboarding) {
      router.replace('/onboarding');
    } else if (_onboardingComplete && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [segments]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.base },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="modules/[slug]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: c.base },
            headerTintColor: c.primary,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="modules/[slug]/steps/[stepId]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: c.base },
            headerTintColor: c.primary,
            headerShadowVisible: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="journal/new"
          options={{
            headerShown: true,
            headerTitle: 'New Entry',
            headerStyle: { backgroundColor: c.base },
            headerTintColor: c.primary,
            headerShadowVisible: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="budget/add"
          options={{
            headerShown: true,
            headerTitle: 'Add Expense',
            headerStyle: { backgroundColor: c.base },
            headerTintColor: c.primary,
            headerShadowVisible: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

// ---------------------------------------------------------------------------
// Root Layout — loads fonts then renders the provider + navigator
// ---------------------------------------------------------------------------
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(FONTS);
      } catch (e) {
        setFontError(e as Error);
        console.warn('Font loading error:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    // Still loading — splash screen remains visible
    return null;
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <ThemeProvider initialMode="auto">
        <RootNavigator />
      </ThemeProvider>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.base,
  },
});
