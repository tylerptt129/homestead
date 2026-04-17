import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Icon } from '../atoms';

interface LocationTipProps {
  locationState: string;
  climateZone: string;
  seasonRelevance?: string[];
  tags?: string[];
}

// Current season based on month
function getCurrentSeason(): string {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

// Climate zone tips
const ZONE_TIPS: Record<string, string> = {
  '1': 'Extreme cold zone — prioritize insulation, cold-hardy varieties, and indoor growing.',
  '2': 'Very cold zone — short growing season. Start seeds indoors early and use season extenders.',
  '3': 'Cold zone — consider cold frames and row covers to extend your growing season.',
  '4': 'Moderate cold — good for cool-season crops. Plan for late spring frosts.',
  '5': 'Moderate zone — versatile growing conditions. Most common crops thrive here.',
  '6': 'Mild zone — long growing season. Great for succession planting.',
  '7': 'Warm zone — watch for heat stress on plants. Mulch heavily in summer.',
  '8': 'Hot zone — shade cloth and drip irrigation are essential. Great for warm-season crops.',
  '9': 'Very warm zone — nearly year-round growing. Focus on heat-tolerant varieties.',
  '10': 'Subtropical zone — frost-free. Tropical fruits and year-round gardening possible.',
  '11': 'Tropical zone — manage humidity and pests. Incredible growing potential.',
  '12': 'Tropical zone — year-round warmth. Focus on tropical species and water management.',
  '13': 'Tropical zone — extreme heat management needed. Maximize shade and water systems.',
};

// State-specific cost/regulation tips
const STATE_TIPS: Record<string, string> = {
  'Texas': 'Texas has favorable homesteading laws — no state income tax and strong property rights.',
  'Tennessee': 'Tennessee offers no state income tax and affordable rural land for homesteading.',
  'Florida': 'Florida offers a strong homestead exemption. Watch for hurricane-season prep needs.',
  'Alaska': 'Alaska has unique off-grid opportunities. Factor in extreme weather prep and supply costs.',
  'Oregon': 'Oregon allows rain water harvesting. Check county zoning for livestock regulations.',
  'Montana': 'Montana offers vast affordable acreage. Factor in well drilling and winter prep costs.',
  'Idaho': 'Idaho is homestead-friendly with low property taxes in rural areas.',
  'Vermont': 'Vermont has strong agricultural traditions. Look into farm-to-table market opportunities.',
  'Colorado': 'Colorado has specific water rights laws — check your district before collecting rainwater.',
  'Arizona': 'Arizona requires careful water planning. Consider xeriscaping and desert-adapted varieties.',
  'California': 'California has complex permitting. Check county agricultural exemptions.',
  'Washington': 'Washington allows rainwater collection and has great farmers market networks.',
  'Virginia': 'Virginia has strong agricultural community. Check Right to Farm laws for your county.',
  'North Carolina': 'North Carolina has favorable agricultural exemptions and a long growing season.',
  'Georgia': 'Georgia has a long growing season and affordable rural land. Watch for clay soil prep needs.',
  'Kentucky': 'Kentucky has affordable land and a strong agricultural heritage. Great for small livestock.',
  'Missouri': 'Missouri offers affordable rural land and moderate climate for diverse homesteading.',
  'Ohio': 'Ohio has rich soil and four-season growing. Look into heritage farming resources.',
  'Pennsylvania': 'Pennsylvania has strong farming communities and seasonal farmers markets.',
  'Michigan': 'Michigan has Great Lakes influence — longer fall growing near the lake shore.',
};

// Seasonal tips
const SEASON_TIPS: Record<string, string> = {
  spring: 'Spring is ideal for soil prep, planting, and starting new infrastructure projects.',
  summer: 'Summer focus: irrigation, pest management, harvesting, and preserving the bounty.',
  fall: 'Fall is the time for harvesting, preserving, winterizing, and planting cover crops.',
  winter: 'Winter is great for planning, tool maintenance, indoor projects, and seed ordering.',
};

export default function LocationTip({
  locationState,
  climateZone,
  seasonRelevance = [],
  tags = [],
}: LocationTipProps) {
  const { theme } = useTheme();
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });
  const currentSeason = getCurrentSeason();

  const tips: string[] = [];

  // Season-relevant tip
  const isSeasonRelevant = seasonRelevance.length === 0 ||
    seasonRelevance.some(s => s.toLowerCase() === currentSeason);

  if (seasonRelevance.length > 0) {
    if (isSeasonRelevant) {
      tips.push(`This task is perfect for ${currentSeason}! Good timing.`);
    } else {
      tips.push(`Best seasons: ${seasonRelevance.join(', ')}. Consider timing this accordingly.`);
    }
  }

  // Climate zone tip
  const zone = climateZone?.replace(/[^0-9]/g, '') || '';
  if (zone && ZONE_TIPS[zone]) {
    tips.push(ZONE_TIPS[zone]);
  }

  // State tip
  if (locationState && STATE_TIPS[locationState]) {
    tips.push(STATE_TIPS[locationState]);
  }

  if (tips.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary + '08', borderColor: theme.colors.primary + '20' }]}>
      <View style={styles.header}>
        <Icon name="MapPin" size={16} color={theme.colors.primary} />
        <Text variant="caption" style={{ fontWeight: '600', color: theme.colors.primary, fontFamily: f }}>
          {locationState ? `Tips for ${locationState}` : 'Location Tips'}
          {climateZone ? ` · Zone ${zone}` : ''}
        </Text>
      </View>
      {tips.map((tip, i) => (
        <Text key={i} variant="caption" style={[styles.tipText, { color: theme.colors.text, fontFamily: f }]}>
          {tip}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
});
