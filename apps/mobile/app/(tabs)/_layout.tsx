import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Home,
  LayoutGrid,
  BookOpen,
  DollarSign,
  User,
} from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import { fontFamilies, fontSizes, shadows } from '@homestead/ui/theme/tokens';

// ---------------------------------------------------------------------------
// Tab bar icon wrapper — adds a warm campfire glow beneath the active icon
// ---------------------------------------------------------------------------
interface TabIconProps {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  focused: boolean;
}

function TabIcon({ icon: IconComponent, color, focused }: TabIconProps) {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.glowDot} />}
      <IconComponent size={24} color={color} strokeWidth={focused ? 2 : 1.5} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tab Layout
// ---------------------------------------------------------------------------
export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // wheat gold #C8A96E
        tabBarInactiveTintColor: colors.textMuted, // weathered stone #9C9284
        tabBarStyle: {
          backgroundColor: colors.surface, // #2A2520 dark
          borderTopColor: colors.border, // fence post #4A4238
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 88,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.bodyMedium,
          fontSize: fontSizes.caption,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="modules"
        options={{
          title: 'Modules',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={LayoutGrid} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={BookOpen} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={DollarSign} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
  },
  glowDot: {
    position: 'absolute',
    bottom: -4,
    width: 24,
    height: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(200, 169, 110, 0.35)',
    // Campfire glow effect beneath active tab
    ...shadows.glow,
  },
});
