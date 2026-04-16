import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Check,
  Mountain,
  Sprout,
  Droplets,
  Cookie,
  Rabbit,
  Zap,
  Hammer,
  Wrench,
  Leaf,
  ShieldCheck,
  Landmark,
  Fence,
  Wheat,
} from 'lucide-react-native';
import { useTheme } from '@homestead/ui/theme';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  shadows,
  spacing,
} from '@homestead/ui/theme/tokens';
import { Text } from '@homestead/ui/atoms/Text';
import { Button } from '@homestead/ui/atoms/Button';
import { Input } from '@homestead/ui/atoms/Input';
import { US_STATES } from '@homestead/core/utils/constants';
import { getClimateZoneFromState } from '@homestead/core/utils/calculations';
import { setOnboardingComplete } from '../_layout';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PAGES = 6;

const MODULE_OPTIONS: {
  id: string;
  slug: string;
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
}[] = [
  { id: '1', slug: 'water-systems', title: 'Water Systems', icon: Droplets, color: '#4A90D9' },
  { id: '2', slug: 'garden-planning', title: 'Garden Planning', icon: Sprout, color: '#5B8C5A' },
  { id: '3', slug: 'food-preservation', title: 'Food Preservation', icon: Cookie, color: '#D4A437' },
  { id: '4', slug: 'livestock', title: 'Livestock', icon: Rabbit, color: '#B07D56' },
  { id: '5', slug: 'energy-power', title: 'Energy & Power', icon: Zap, color: '#E8A838' },
  { id: '6', slug: 'shelter-structures', title: 'Shelter & Structures', icon: Hammer, color: '#8B6F47' },
  { id: '7', slug: 'tools-equipment', title: 'Tools & Equipment', icon: Wrench, color: '#7B8794' },
  { id: '8', slug: 'soil-composting', title: 'Soil & Composting', icon: Leaf, color: '#6B7C3E' },
  { id: '9', slug: 'security-safety', title: 'Security & Safety', icon: ShieldCheck, color: '#C75D3A' },
  { id: '10', slug: 'finances-legal', title: 'Finances & Legal', icon: Landmark, color: '#5A7D6E' },
  { id: '11', slug: 'fencing-boundaries', title: 'Fencing & Boundaries', icon: Fence, color: '#9B8455' },
  { id: '12', slug: 'food-forest', title: 'Food Forest', icon: Wheat, color: '#7FB069' },
];

const GRID_OPTIONS = [
  { value: 'on_grid', label: 'On-Grid', description: 'Connected to public utilities' },
  { value: 'off_grid', label: 'Off-Grid', description: 'Fully self-sufficient' },
  { value: 'hybrid', label: 'Hybrid', description: 'Mix of grid and independent' },
];

// ---------------------------------------------------------------------------
// Onboarding Screen
// ---------------------------------------------------------------------------

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const pagerRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Form state
  const [homesteadName, setHomesteadName] = useState('');
  const [locationState, setLocationState] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [acreage, setAcreage] = useState('');
  const [gridStatus, setGridStatus] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());

  // Derived
  const climateZone = locationState
    ? getClimateZoneFromState(
        US_STATES.find((s) => s.name === locationState)?.abbreviation ?? '',
      )
    : '';

  const goToPage = useCallback(
    (index: number) => {
      pagerRef.current?.scrollToIndex({ index, animated: true });
      setCurrentPage(index);
    },
    [],
  );

  const goNext = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const handleComplete = useCallback(() => {
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  }, [router]);

  const toggleModule = useCallback((id: string) => {
    setSelectedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAcreageChange = useCallback((text: string) => {
    setAcreage(text.replace(/[^0-9.]/g, ''));
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentPage(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // ── Page renderers ──────────────────────────────────

  const renderPage = useCallback(
    ({ index }: { item: number; index: number }) => {
      switch (index) {
        case 0:
          return <WelcomePage colors={colors} onNext={goNext} />;
        case 1:
          return (
            <NamePage
              colors={colors}
              value={homesteadName}
              onChange={setHomesteadName}
              onNext={goNext}
            />
          );
        case 2:
          return (
            <LocationPage
              colors={colors}
              locationState={locationState}
              showStatePicker={showStatePicker}
              setShowStatePicker={setShowStatePicker}
              setLocationState={setLocationState}
              acreage={acreage}
              onAcreageChange={handleAcreageChange}
              climateZone={climateZone}
              onNext={goNext}
            />
          );
        case 3:
          return (
            <GridPage
              colors={colors}
              gridStatus={gridStatus}
              setGridStatus={setGridStatus}
              onNext={goNext}
            />
          );
        case 4:
          return (
            <ModulesPage
              colors={colors}
              selectedModules={selectedModules}
              toggleModule={toggleModule}
              onNext={goNext}
            />
          );
        case 5:
          return <ReadyPage colors={colors} onComplete={handleComplete} />;
        default:
          return null;
      }
    },
    [
      colors,
      homesteadName,
      locationState,
      showStatePicker,
      acreage,
      climateZone,
      gridStatus,
      selectedModules,
      goNext,
      handleAcreageChange,
      toggleModule,
      handleComplete,
    ],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.base }]}>
      {/* ── Progress dots ──────────────────────────────── */}
      <View style={styles.dotsRow}>
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === currentPage ? colors.primary : colors.border,
                width: i === currentPage ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* ── Pager ──────────────────────────────────────── */}
      <FlatList
        ref={pagerRef}
        data={Array.from({ length: TOTAL_PAGES }, (_, i) => i)}
        renderItem={renderPage}
        keyExtractor={(item) => String(item)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Page 1: Welcome
// ---------------------------------------------------------------------------

interface PageProps {
  colors: ReturnType<typeof useTheme>['colors'];
}

function WelcomePage({ colors, onNext }: PageProps & { onNext: () => void }) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <View style={styles.pageCenter}>
        {/* Mountain silhouette placeholder */}
        <View style={styles.mountainContainer}>
          <Mountain size={80} color={colors.primary} strokeWidth={1} />
        </View>
        <Text
          variant="display"
          center
          style={{ color: colors.primary, fontFamily: fontFamilies.headerBold, marginTop: spacing['2xl'] }}
        >
          Homestead Forge
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.md, paddingHorizontal: spacing['2xl'], lineHeight: 24 }}
        >
          Plan your land. Build your life.{'\n'}Track every step of the journey.
        </Text>
        <Text
          variant="handwritten"
          center
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.handwritten,
            fontSize: 20,
            marginTop: spacing['3xl'],
          }}
        >
          Let's get your homestead set up...
        </Text>
      </View>
      <View style={styles.pageBottom}>
        <Button
          label="Get Started"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onNext}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 2: Name Your Homestead
// ---------------------------------------------------------------------------

function NamePage({
  colors,
  value,
  onChange,
  onNext,
}: PageProps & { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <View style={styles.pageCenter}>
        <Text
          variant="h1"
          center
          style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}
        >
          Name Your Homestead
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.sm, paddingHorizontal: spacing.xl, marginBottom: spacing['2xl'] }}
        >
          Every great homestead starts with a name. What will yours be?
        </Text>
        <Input
          label="Homestead Name"
          value={value}
          onChangeText={onChange}
          placeholder="e.g. Whispering Pines"
          autoFocus
          returnKeyType="done"
          style={{ marginHorizontal: spacing.base }}
        />
        <Text
          variant="handwritten"
          center
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.handwritten,
            fontSize: 18,
            marginTop: spacing.xl,
          }}
        >
          You can always change this later
        </Text>
      </View>
      <View style={styles.pageBottom}>
        <Button
          label="Continue"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onNext}
          disabled={value.trim().length < 2}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 3: Location & Acreage
// ---------------------------------------------------------------------------

interface LocationPageProps extends PageProps {
  locationState: string;
  showStatePicker: boolean;
  setShowStatePicker: (v: boolean) => void;
  setLocationState: (v: string) => void;
  acreage: string;
  onAcreageChange: (v: string) => void;
  climateZone: string;
  onNext: () => void;
}

function LocationPage({
  colors,
  locationState,
  showStatePicker,
  setShowStatePicker,
  setLocationState,
  acreage,
  onAcreageChange,
  climateZone,
  onNext,
}: LocationPageProps) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="h1"
          center
          style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}
        >
          Location & Acreage
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.sm, marginBottom: spacing['2xl'] }}
        >
          Help us tailor seasonal advice and climate recommendations.
        </Text>

        {/* State picker */}
        <Text
          variant="caption"
          muted
          style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm, marginLeft: spacing.xs }}
        >
          State
        </Text>
        <Pressable
          style={[
            styles.pickerButton,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
          onPress={() => setShowStatePicker(!showStatePicker)}
        >
          <Text
            variant="body"
            style={{ color: locationState ? colors.text : colors.textMuted, flex: 1 }}
          >
            {locationState || 'Select your state...'}
          </Text>
        </Pressable>

        {showStatePicker && (
          <View
            style={[
              styles.stateList,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {US_STATES.map((state) => (
                <Pressable
                  key={state.abbreviation}
                  style={[styles.stateOption, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setLocationState(state.name);
                    setShowStatePicker(false);
                  }}
                >
                  <Text
                    variant="bodySmall"
                    style={{
                      color: locationState === state.name ? colors.primary : colors.text,
                      fontFamily: locationState === state.name ? fontFamilies.bodySemiBold : fontFamilies.body,
                    }}
                  >
                    {state.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Acreage input */}
        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="Acreage"
            value={acreage}
            onChangeText={onAcreageChange}
            placeholder="e.g. 10"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Climate zone display */}
        {climateZone !== '' && (
          <View style={[styles.climateZone, { backgroundColor: colors.card }]}>
            <Text variant="bodySmall" muted>
              USDA Hardiness Zone
            </Text>
            <Text
              variant="h2"
              style={{ color: colors.primary, fontFamily: fontFamilies.monoMedium, marginTop: spacing.xs }}
            >
              Zone {climateZone}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.pageBottom}>
        <Button
          label="Continue"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onNext}
          disabled={!locationState || !acreage}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 4: Grid Status
// ---------------------------------------------------------------------------

function GridPage({
  colors,
  gridStatus,
  setGridStatus,
  onNext,
}: PageProps & { gridStatus: string; setGridStatus: (v: string) => void; onNext: () => void }) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <View style={styles.pageCenter}>
        <Text
          variant="h1"
          center
          style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}
        >
          Grid Status
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.sm, marginBottom: spacing['2xl'], paddingHorizontal: spacing.xl }}
        >
          How is your property connected to utilities?
        </Text>

        <View style={styles.gridOptions}>
          {GRID_OPTIONS.map((opt) => {
            const active = gridStatus === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: active ? colors.primary + '15' : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setGridStatus(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                {active && (
                  <View style={[styles.gridCheck, { backgroundColor: colors.primary }]}>
                    <Check size={14} color="#1C1A17" strokeWidth={2.5} />
                  </View>
                )}
                <Text
                  variant="h3"
                  style={{
                    color: active ? colors.primary : colors.text,
                    fontFamily: fontFamilies.bodySemiBold,
                  }}
                >
                  {opt.label}
                </Text>
                <Text variant="bodySmall" muted style={{ marginTop: spacing.xs }}>
                  {opt.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.pageBottom}>
        <Button
          label="Continue"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onNext}
          disabled={!gridStatus}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 5: Priority Modules
// ---------------------------------------------------------------------------

function ModulesPage({
  colors,
  selectedModules,
  toggleModule,
  onNext,
}: PageProps & { selectedModules: Set<string>; toggleModule: (id: string) => void; onNext: () => void }) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="h1"
          center
          style={{ color: colors.text, fontFamily: fontFamilies.headerBold }}
        >
          Priority Modules
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.sm, marginBottom: spacing.xl, paddingHorizontal: spacing.xl }}
        >
          Select the areas you want to focus on first. You can change this anytime.
        </Text>

        <View style={styles.moduleGrid}>
          {MODULE_OPTIONS.map((mod) => {
            const active = selectedModules.has(mod.id);
            return (
              <Pressable
                key={mod.id}
                style={[
                  styles.moduleCard,
                  {
                    backgroundColor: active ? mod.color + '15' : colors.card,
                    borderColor: active ? mod.color : colors.border,
                  },
                ]}
                onPress={() => toggleModule(mod.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                {active && (
                  <View style={[styles.moduleCheck, { backgroundColor: mod.color }]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                )}
                <View style={[styles.moduleIconBox, { backgroundColor: mod.color + '20' }]}>
                  <mod.icon size={22} color={mod.color} strokeWidth={1.5} />
                </View>
                <Text
                  variant="caption"
                  style={{
                    color: active ? colors.text : colors.textMuted,
                    fontFamily: fontFamilies.bodySemiBold,
                    marginTop: spacing.sm,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {mod.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.pageBottom}>
        <Text variant="caption" muted center style={{ marginBottom: spacing.md }}>
          {selectedModules.size} selected
        </Text>
        <Button
          label="Continue"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onNext}
          disabled={selectedModules.size === 0}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 6: You're Ready
// ---------------------------------------------------------------------------

function ReadyPage({ colors, onComplete }: PageProps & { onComplete: () => void }) {
  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <View style={styles.pageCenter}>
        <View style={[styles.readyIcon, { backgroundColor: colors.primary + '20' }]}>
          <Check size={48} color={colors.primary} strokeWidth={2} />
        </View>
        <Text
          variant="display"
          center
          style={{ color: colors.text, fontFamily: fontFamilies.headerBold, marginTop: spacing['2xl'] }}
        >
          You're Ready
        </Text>
        <Text
          variant="body"
          center
          muted
          style={{ marginTop: spacing.md, paddingHorizontal: spacing['2xl'], lineHeight: 24 }}
        >
          Your homestead is set up and waiting. Start tracking your progress, one step at a time.
        </Text>
        <Text
          variant="handwritten"
          center
          style={{
            color: colors.primary,
            fontFamily: fontFamilies.handwrittenBold,
            fontSize: 22,
            marginTop: spacing['3xl'],
          }}
        >
          The land is calling.
        </Text>
      </View>
      <View style={styles.pageBottom}>
        <Button
          label="Go to Dashboard"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={20} color="#1C1A17" strokeWidth={2} />}
          onPress={onComplete}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  page: {
    flex: 1,
  },
  pageCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  pageBottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  pageScroll: {
    flex: 1,
  },
  pageScrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  mountainContainer: {
    alignItems: 'center',
  },
  // Location page
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  stateList: {
    marginTop: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.md,
  },
  stateOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  climateZone: {
    marginTop: spacing.xl,
    padding: spacing.base,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  // Grid page
  gridOptions: {
    gap: spacing.md,
    paddingHorizontal: spacing.base,
  },
  gridCard: {
    padding: spacing.xl,
    borderRadius: radii.md,
    borderWidth: 1.5,
    position: 'relative',
  },
  gridCheck: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modules page
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  moduleCard: {
    width: (SCREEN_WIDTH - spacing.xl * 2 - spacing.sm * 2) / 3,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  moduleCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Ready page
  readyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
