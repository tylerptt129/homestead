import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Card, Text, Icon, Badge, ProgressRing } from '../atoms';

interface Module {
  title: string;
  slug: string;
  iconName: string;
  color: string;
  description: string;
  difficulty: string;
}

interface ModuleCardProps {
  module: Module;
  progress: number;
  onPress: () => void;
}

export default function ModuleCard({
  module,
  progress,
  onPress,
}: ModuleCardProps) {
  const { theme } = useTheme();

  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View
        style={[
          styles.accentBorder,
          { backgroundColor: module.color },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.mainRow}>
          <View style={styles.leftSection}>
            <View style={styles.titleRow}>
              <Icon name={module.iconName} size={22} color={module.color} />
              <Text variant="subheading" style={styles.title}>
                {module.title}
              </Text>
            </View>
            <Text
              variant="caption"
              numberOfLines={2}
              style={styles.description}
            >
              {module.description}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <ProgressRing progress={progress} size={50} strokeWidth={3} color={module.color} />
          </View>
        </View>
        <View style={styles.footer}>
          <Badge label={module.difficulty} size="sm" />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  accentBorder: {
    height: 3,
    width: '100%',
  },
  content: {
    padding: 16,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    marginLeft: 8,
  },
  description: {
    marginTop: 2,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});
