import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Icon, Button } from '../atoms';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Icon name={icon} size={56} color={theme.colors.textMuted} />
      <Text variant="accent" style={styles.title}>
        {title}
      </Text>
      <Text
        variant="body"
        align="center"
        color={theme.colors.textMuted}
        style={styles.message}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <View style={styles.actionWrapper}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
            size="md"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    maxWidth: 280,
  },
  actionWrapper: {
    marginTop: 24,
  },
});
