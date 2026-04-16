import React from 'react';
import { useTheme } from '../theme';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface IconProps {
  /**
   * A lucide-react-native icon component, e.g. `import { Home } from 'lucide-react-native'`
   * Pass the component itself, not a JSX element.
   */
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  /** Icon size in pixels (default 24) */
  size?: number;
  /** Override icon color (defaults to theme text color) */
  color?: string;
  /** Override stroke width (default 1.5 per spec) */
  strokeWidth?: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Icon({
  icon: IconComponent,
  size = 24,
  color,
  strokeWidth = 1.5,
}: IconProps) {
  const { colors } = useTheme();

  return (
    <IconComponent
      size={size}
      color={color ?? colors.text}
      strokeWidth={strokeWidth}
    />
  );
}
