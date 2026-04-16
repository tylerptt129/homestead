import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  spacing,
  durations,
} from '../theme/tokens';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Floating label text */
  label: string;
  /** Error message (shows in campfire ember) */
  error?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Input({
  label,
  error,
  helperText,
  disabled = false,
  value,
  onFocus,
  onBlur,
  style,
  ...rest
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const hasValue = !!value && value.length > 0;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: durations.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue, labelAnim]);

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const borderColor = error
    ? colors.danger
    : isFocused
      ? colors.primary
      : colors.border;

  const labelColor = error
    ? colors.danger
    : isFocused
      ? colors.primary
      : colors.textMuted;

  // Animated label position
  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 6],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [fontSizes.body, fontSizes.caption],
  });

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
              fontFamily: fontFamilies.body,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: fontFamilies.body,
              fontSize: fontSizes.body,
              lineHeight: lineHeights.body,
            },
          ]}
          accessibilityLabel={label}
          {...rest}
        />
      </View>
      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? colors.danger : colors.textMuted}
          style={styles.helperText}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
    minHeight: 56,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
  },
  input: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    margin: 0,
    padding: 0,
    paddingHorizontal: 0,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
