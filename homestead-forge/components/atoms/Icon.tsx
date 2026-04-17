import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../theme';

const iconMap: Record<string, string> = {
  Home: '\u{1F3E0}',
  Map: '\u{1F5FA}',
  Droplets: '\u{1F4A7}',
  Zap: '\u26A1',
  Sprout: '\u{1F331}',
  TreePine: '\u{1F332}',
  Bird: '\u{1F414}',
  Archive: '\u{1F4E6}',
  Wrench: '\u{1F527}',
  Shield: '\u{1F6E1}',
  DollarSign: '\u{1F4B0}',
  Users: '\u{1F465}',
  Book: '\u{1F4D6}',
  Grid3X3: '\u25A6',
  User: '\u{1F464}',
  ChevronRight: '\u203A',
  ChevronLeft: '\u2039',
  Check: '\u2713',
  Plus: '+',
  X: '\u2715',
  Search: '\u{1F50D}',
  Filter: '\u2699',
  Edit: '\u270E',
  Trash: '\u{1F5D1}',
  Camera: '\u{1F4F7}',
  Sun: '\u2600',
  Moon: '\u{1F319}',
  ArrowLeft: '\u2190',
  Calendar: '\u{1F4C5}',
  TrendingUp: '\u{1F4C8}',
  Clock: '\u{1F550}',
  Star: '\u2B50',
  Heart: '\u2764',
  AlertTriangle: '\u26A0',
  Info: '\u2139',
  Settings: '\u2699',
  LogOut: '\u{1F6AA}',
  Download: '\u2B07',
  Share: '\u2197',
  Eye: '\u{1F441}',
  EyeOff: '\u{1F648}',
  Lock: '\u{1F512}',
  Unlock: '\u{1F513}',
  Menu: '\u2630',
  MoreVertical: '\u22EE',
  MoreHorizontal: '\u22EF',
  RefreshCw: '\u21BB',
  ArrowRight: '\u2192',
  Image: '\u{1F5BC}',
  Tag: '\u{1F3F7}',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color }: IconProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        fontSize: size * 0.75,
        color: color || theme.colors.text,
        lineHeight: size,
        textAlign: 'center',
        width: size,
        height: size,
      }}
      accessibilityLabel={name}
    >
      {iconMap[name] || '\u2022'}
    </Text>
  );
}
