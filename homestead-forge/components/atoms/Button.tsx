import React, { useCallback, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import Text from './Text';
import Icon from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const variantStyles: Record<
    ButtonVariant,
    { container: ViewStyle; text: TextStyle }
  > = {
    primary: {
      container: {
        backgroundColor: theme.colors.primary,
      },
      text: { color: theme.colors.base },
    },
    secondary: {
      container: {
        backgroundColor: theme.colors.surfaceAlt,
      },
      text: { color: theme.colors.text },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      text: { color: theme.colors.primary },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: { color: theme.colors.primary },
    },
    danger: {
      container: {
        backgroundColor: theme.colors.danger,
      },
      text: { color: '#FFFFFF' },
    },
  };

  const sizeStyles: Record<
    ButtonSize,
    { container: ViewStyle; fontSize: number }
  > = {
    sm: {
      container: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
      },
      fontSize: theme.fontSizes.sm,
    },
    md: {
      container: {
        paddingVertical: theme.spacing.sm + 2,
        paddingHorizontal: theme.spacing.lg,
      },
      fontSize: theme.fontSizes.md,
    },
    lg: {
      container: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
      },
      fontSize: theme.fontSizes.lg,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          currentVariant.container,
          currentSize.container,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={currentVariant.text.color as string}
          />
        ) : (
          <View style={styles.content}>
            {icon && (
              <View style={styles.iconWrapper}>
                <Icon
                  name={icon}
                  size={currentSize.fontSize}
                  color={currentVariant.text.color as string}
                />
              </View>
            )}
            <Text
              variant="body"
              style={[
                currentVariant.text,
                { fontSize: currentSize.fontSize, fontWeight: '600' },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
