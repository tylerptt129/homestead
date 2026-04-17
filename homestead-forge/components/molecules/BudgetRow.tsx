import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Badge } from '../atoms';

interface BudgetItem {
  description: string;
  amount: number;
  category: string;
  vendor?: string;
  date: string;
  moduleName?: string;
}

interface BudgetRowProps {
  item: BudgetItem;
  onPress?: () => void;
}

export default function BudgetRow({ item, onPress }: BudgetRowProps) {
  const { theme } = useTheme();

  const formatAmount = (amount: number) => {
    const prefix = amount < 0 ? '-' : '';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const content = (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.leftSection}>
          <Text variant="body" style={{ fontWeight: '500' }}>
            {item.description}
          </Text>
          {item.vendor && (
            <Text variant="caption">{item.vendor}</Text>
          )}
        </View>
        <Text
          variant="mono"
          style={[
            styles.amount,
            {
              color: item.amount < 0 ? theme.colors.danger : theme.colors.accent,
            },
          ]}
        >
          {formatAmount(item.amount)}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.badges}>
          <Badge label={item.category} size="sm" />
          {item.moduleName && (
            <Badge label={item.moduleName} size="sm" variant="info" />
          )}
        </View>
        <Text variant="caption">{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
});
