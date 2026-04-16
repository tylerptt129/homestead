import React from 'react';
import { View } from 'react-native';
import { spacing, type SpacingToken } from '../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SpacerProps {
  /** Named spacing token */
  size?: SpacingToken;
  /** Raw pixel value (overrides size token) */
  px?: number;
  /** Direction: vertical (default) or horizontal */
  direction?: 'vertical' | 'horizontal';
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Spacer({
  size = 'base',
  px,
  direction = 'vertical',
}: SpacerProps) {
  const value = px ?? spacing[size];

  if (direction === 'horizontal') {
    return <View style={{ width: value }} />;
  }

  return <View style={{ height: value }} />;
}
