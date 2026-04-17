import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface DividerProps {
  style?: ViewStyle;
}

export default function Divider({ style }: DividerProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: theme.colors.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
});
