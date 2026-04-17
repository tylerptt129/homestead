import React, { useMemo } from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';
import Icon from '../atoms/Icon';

interface ZoneData {
  slug: string;
  title: string;
  shortTitle: string;
  iconName: string;
  color: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
}

interface Props {
  zones: ZoneData[];
  onZonePress: (slug: string) => void;
}

const ZONE_LAYOUT: Record<string, { x: number; y: number; w: number; h: number }> = {
  land:         { x: 0,  y: 0,  w: 100, h: 12 },
  shelter:      { x: 35, y: 16, w: 30,  h: 22 },
  water:        { x: 70, y: 16, w: 28,  h: 18 },
  power:        { x: 2,  y: 16, w: 28,  h: 18 },
  garden:       { x: 2,  y: 40, w: 35,  h: 22 },
  orchard:      { x: 40, y: 40, w: 28,  h: 22 },
  livestock:    { x: 72, y: 40, w: 26,  h: 22 },
  preservation: { x: 2,  y: 66, w: 22,  h: 18 },
  tools:        { x: 27, y: 66, w: 22,  h: 18 },
  security:     { x: 52, y: 66, w: 22,  h: 18 },
  financial:    { x: 77, y: 66, w: 21,  h: 18 },
  community:    { x: 0,  y: 88, w: 100, h: 12 },
};

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

function ZoneCard({ zone, onPress, isWide }: { zone: ZoneData; onPress: () => void; isWide: boolean }) {
  const { theme } = useTheme();
  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });

  const progressPct = Math.round(zone.progress * 100);
  const bgOpacity = 0.15 + (zone.progress * 0.25);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.zoneCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: zone.progress > 0 ? zone.color : theme.colors.border,
          borderWidth: zone.progress > 0 ? 2 : 1,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.zoneAccent, { backgroundColor: zone.color, opacity: bgOpacity + 0.3 }]} />

      <View style={isWide ? styles.zoneContentWide : styles.zoneContent}>
        <View style={[styles.zoneIconCircle, { backgroundColor: zone.color + '30' }]}>
          <Icon name={zone.iconName} size={isWide ? 20 : 24} color={zone.color} />
        </View>
        <View style={styles.zoneInfo}>
          <Text
            style={[styles.zoneTitle, { color: theme.colors.text, fontFamily: fd }]}
            numberOfLines={1}
          >
            {isWide ? zone.title : zone.shortTitle}
          </Text>
          <View style={styles.zoneStats}>
            <Text style={[styles.zoneStepCount, { color: theme.colors.textMuted, fontFamily: f }]}>
              {zone.completedSteps}/{zone.totalSteps} steps
            </Text>
            {progressPct > 0 && (
              <Text style={[styles.zonePct, { color: zone.color, fontFamily: f }]}>
                {progressPct}%
              </Text>
            )}
          </View>
          <ProgressBar progress={zone.progress} color={zone.color} />
        </View>
      </View>

      {zone.progress >= 1 && (
        <View style={[styles.completeBadge, { backgroundColor: zone.color }]}>
          <Icon name="Check" size={12} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}

export default function HomesteadMap({ zones, onZonePress }: Props) {
  const { theme } = useTheme();
  const fd = Platform.select({ web: '"Bitter", serif', default: 'serif' });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const overallProgress = useMemo(() => {
    const totalSteps = zones.reduce((s, z) => s + z.totalSteps, 0);
    const completed = zones.reduce((s, z) => s + z.completedSteps, 0);
    return totalSteps > 0 ? completed / totalSteps : 0;
  }, [zones]);

  const rows = [
    { zones: zones.filter(z => z.slug === 'land'), wide: true },
    { zones: zones.filter(z => ['power', 'shelter', 'water'].includes(z.slug)), wide: false },
    { zones: zones.filter(z => ['garden', 'orchard', 'livestock'].includes(z.slug)), wide: false },
    { zones: zones.filter(z => ['preservation', 'tools', 'security', 'financial'].includes(z.slug)), wide: false },
    { zones: zones.filter(z => z.slug === 'community'), wide: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mapHeader}>
        <Text style={[styles.mapTitle, { color: theme.colors.text, fontFamily: fd }]}>
          Your Homestead
        </Text>
        <Text style={[styles.mapSubtitle, { color: theme.colors.primaryMuted, fontFamily: fa }]}>
          Tap any area to view details & track progress
        </Text>
      </View>

      <View style={[styles.overallBar, { backgroundColor: theme.colors.surfaceAlt }]}>
        <View style={styles.overallBarInner}>
          <Text style={[styles.overallLabel, { color: theme.colors.textMuted }]}>
            Overall Progress
          </Text>
          <Text style={[styles.overallPct, { color: theme.colors.primary }]}>
            {Math.round(overallProgress * 100)}%
          </Text>
        </View>
        <View style={[styles.overallTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.overallFill, { width: `${Math.round(overallProgress * 100)}%`, backgroundColor: theme.colors.primary }]} />
        </View>
      </View>

      <View style={[styles.propertyGrid, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.gridRow}>
            {row.zones.map((zone) => (
              <View key={zone.slug} style={[styles.gridCell, row.wide && styles.gridCellWide]}>
                <ZoneCard
                  zone={zone}
                  onPress={() => onZonePress(zone.slug)}
                  isWide={row.wide}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  mapHeader: { marginBottom: 16 },
  mapTitle: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  mapSubtitle: { fontSize: 18, fontStyle: 'italic' },
  overallBar: { borderRadius: 12, padding: 14, marginBottom: 16 },
  overallBarInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  overallLabel: { fontSize: 14, fontWeight: '500' },
  overallPct: { fontSize: 18, fontWeight: '700' },
  overallTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  overallFill: { height: '100%', borderRadius: 4 },
  propertyGrid: { borderRadius: 16, borderWidth: 1, padding: 8, gap: 8 },
  gridRow: { flexDirection: 'row', gap: 8 },
  gridCell: { flex: 1, minWidth: 0 },
  gridCellWide: { flex: 1 },
  zoneCard: { borderRadius: 12, overflow: 'hidden', position: 'relative' },
  zoneAccent: { height: 4, width: '100%' },
  zoneContent: { padding: 12, flexDirection: 'column', alignItems: 'center', gap: 8 },
  zoneContentWide: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  zoneIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  zoneInfo: { flex: 1, minWidth: 0 },
  zoneTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  zoneStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  zoneStepCount: { fontSize: 11 },
  zonePct: { fontSize: 11, fontWeight: '700' },
  progressBarBg: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  completeBadge: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
