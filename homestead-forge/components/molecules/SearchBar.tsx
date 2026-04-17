import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../atoms';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
}: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.iconLeft}>
        <Icon name="Search" size={18} color={theme.colors.textMuted} />
      </View>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontFamily: '"Inter", "Inter", system-ui, sans-serif',
            fontSize: 16,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Icon name="X" size={16} color={theme.colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 14,
    height: 44,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    outlineStyle: 'none',
  } as any,
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
