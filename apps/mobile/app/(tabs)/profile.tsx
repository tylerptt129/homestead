import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Download,
  ExternalLink,
  Info,
  LogOut,
  MapPin,
  Moon,
  Bell,
  Ruler,
  Sun,
  Monitor,
  Pencil,
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
import { Button } from '@homestead/ui/atoms/Button';
import { Divider } from '@homestead/ui/atoms/Divider';
import { ListItem } from '@homestead/ui/molecules/ListItem';
import type { ThemeMode } from '@homestead/core/types';

// ---------------------------------------------------------------------------
// Placeholder profile data
// ---------------------------------------------------------------------------

const PLACEHOLDER_PROFILE = {
  homestead_name: 'Whispering Pines',
  location_state: 'Oregon',
  acreage: 12.5,
  grid_status: 'hybrid' as const,
  climate_zone: '8',
};

const GRID_STATUS_LABELS: Record<string, string> = {
  on_grid: 'On-Grid',
  off_grid: 'Off-Grid',
  hybrid: 'Hybrid',
};

// ---------------------------------------------------------------------------
// Theme Picker
// ---------------------------------------------------------------------------

interface ThemePickerProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function ThemePicker({ value, onChange, colors }: ThemePickerProps) {
  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<any> }[] = [
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'auto', label: 'Auto', icon: Monitor },
  ];

  return (
    <View style={styles.themeRow}>
      {options.map((opt) => {
        const active = value === opt.mode;
        return (
          <Pressable
            key={opt.mode}
            style={[
              styles.themeOption,
              {
                backgroundColor: active ? colors.primary : colors.surfaceAlt,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onChange(opt.mode)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <opt.icon size={18} color={active ? '#1C1A17' : colors.textMuted} strokeWidth={1.5} />
            <Text
              variant="caption"
              style={{
                color: active ? '#1C1A17' : colors.textMuted,
                fontFamily: fontFamilies.bodySemiBold,
                marginTop: 4,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Profile Screen
// ---------------------------------------------------------------------------

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const router = useRouter();

  const profile = PLACEHOLDER_PROFILE;
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');

  const handleExportProgress = useCallback(() => {
    Alert.alert('Export Progress', 'Your progress data will be exported as CSV.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => {} },
    ]);
  }, []);

  const handleExportBudget = useCallback(() => {
    Alert.alert('Export Budget', 'Your budget data will be exported as CSV.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => {} },
    ]);
  }, []);

  const handleFullBackup = useCallback(() => {
    Alert.alert('Full Backup', 'All your data will be exported as a JSON file.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Backup', onPress: () => {} },
    ]);
  }, []);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => {} },
    ]);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={styles.headerSection}>
          <Text variant="h1" style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}>
            Profile
          </Text>
        </View>

        {/* ── Homestead Info Card ─────────────────────── */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoHeader}>
            <Text variant="h2" style={{ color: colors.text, fontFamily: fontFamilies.headerBold, flex: 1 }}>
              {profile.homestead_name}
            </Text>
            <Pressable
              style={[styles.editButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => {
                // Future: navigate to edit profile
              }}
              accessibilityLabel="Edit homestead info"
            >
              <Pencil size={16} color={colors.primary} strokeWidth={1.5} />
            </Pressable>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MapPin size={14} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="bodySmall" muted style={{ marginLeft: spacing.xs }}>
                {profile.location_state}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="bodySmall" muted>
                {profile.acreage} acres
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="bodySmall" muted>
                Zone {profile.climate_zone}
              </Text>
            </View>
          </View>

          <View style={[styles.gridStatusBadge, { backgroundColor: colors.surfaceAlt }]}>
            <Text variant="caption" style={{ color: colors.primary, fontFamily: fontFamilies.bodySemiBold }}>
              {GRID_STATUS_LABELS[profile.grid_status]}
            </Text>
          </View>
        </View>

        {/* ── App Settings ────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={[styles.sectionTitle, { textTransform: 'uppercase', letterSpacing: 1.2 }]}
          >
            App Settings
          </Text>

          {/* Theme */}
          <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
            <Text variant="body" style={{ color: colors.text, fontFamily: fontFamilies.bodyMedium }}>
              Theme
            </Text>
            <ThemePicker value={mode} onChange={setMode} colors={colors} />
          </View>

          {/* Notifications */}
          <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="body" style={{ color: colors.text, fontFamily: fontFamilies.bodyMedium, marginLeft: spacing.md }}>
                Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={notifications ? colors.primary : colors.textMuted}
            />
          </View>

          {/* Units */}
          <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Ruler size={20} color={colors.textMuted} strokeWidth={1.5} />
              <Text variant="body" style={{ color: colors.text, fontFamily: fontFamilies.bodyMedium, marginLeft: spacing.md }}>
                Units
              </Text>
            </View>
            <View style={styles.unitToggle}>
              {(['imperial', 'metric'] as const).map((u) => {
                const active = units === u;
                return (
                  <Pressable
                    key={u}
                    style={[
                      styles.unitOption,
                      {
                        backgroundColor: active ? colors.primary : 'transparent',
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setUnits(u)}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active ? '#1C1A17' : colors.textMuted,
                        fontFamily: fontFamilies.bodySemiBold,
                      }}
                    >
                      {u === 'imperial' ? 'Imperial' : 'Metric'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Data ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={[styles.sectionTitle, { textTransform: 'uppercase', letterSpacing: 1.2 }]}
          >
            Data
          </Text>

          <ListItem
            iconLeft={<Download size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="Export Progress (CSV)"
            onPress={handleExportProgress}
            accessoryRight={<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />}
            style={{ marginBottom: spacing.xs }}
          />
          <ListItem
            iconLeft={<Download size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="Export Budget (CSV)"
            onPress={handleExportBudget}
            accessoryRight={<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />}
            style={{ marginBottom: spacing.xs }}
          />
          <ListItem
            iconLeft={<Download size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="Full Backup (JSON)"
            onPress={handleFullBackup}
            accessoryRight={<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />}
          />
        </View>

        {/* ── About ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text
            variant="caption"
            muted
            style={[styles.sectionTitle, { textTransform: 'uppercase', letterSpacing: 1.2 }]}
          >
            About
          </Text>

          <ListItem
            iconLeft={<Info size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="App Version"
            subtitle="1.0.0 (Build 1)"
            style={{ marginBottom: spacing.xs }}
          />
          <ListItem
            iconLeft={<ExternalLink size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="License"
            onPress={() => {}}
            accessoryRight={<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />}
            style={{ marginBottom: spacing.xs }}
          />
          <ListItem
            iconLeft={<ExternalLink size={20} color={colors.textMuted} strokeWidth={1.5} />}
            title="Send Feedback"
            onPress={() => {}}
            accessoryRight={<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />}
          />
        </View>

        {/* ── Sign Out ────────────────────────────────── */}
        <View style={styles.signOutSection}>
          <Button
            label="Sign Out"
            variant="danger"
            iconLeft={<LogOut size={18} color="#FFFFFF" strokeWidth={1.5} />}
            onPress={handleSignOut}
            style={{ width: '100%' }}
          />
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
    paddingBottom: spacing['5xl'],
  },
  headerSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  infoCard: {
    marginHorizontal: spacing.base,
    padding: spacing.base,
    borderRadius: radii.md,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginTop: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: radii.md,
    marginBottom: spacing.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  themeOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  unitOption: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
  signOutSection: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    alignItems: 'center',
  },
});
