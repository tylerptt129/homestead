import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Card, Text, Icon } from '../atoms';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  const { theme } = useTheme();
  const accentColor = color || theme.colors.primary;

  return (
    <Card
      variant="default"
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceAlt },
      ]}
    >
      <View style={styles.iconRow}>
        <Icon name={icon} size={20} color={accentColor} />
      </View>
      <Text
        variant="mono"
        style={[styles.value, { color: accentColor }]}
      >
        {value}
      </Text>
      <Text variant="caption">{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    alignItems: 'center',
  },
  iconRow: {
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
});
