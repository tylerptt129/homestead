import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../stores/useAuthStore';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Icon from '../../components/atoms/Icon';
import type { GridStatus } from '../../types';

const GRID_OPTIONS: { value: GridStatus; label: string; icon: string; desc: string }[] = [
  { value: 'on_grid', label: 'On Grid', icon: 'Zap', desc: 'Connected to municipal utilities' },
  { value: 'off_grid', label: 'Off Grid', icon: 'Sun', desc: 'Fully independent systems' },
  { value: 'hybrid', label: 'Hybrid', icon: 'RefreshCw', desc: 'Mix of grid and independent' },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const setProfile = useAuthStore(s => s.setProfile);
  const setOnboarded = useAuthStore(s => s.setOnboarded);

  const [step, setStep] = useState(0);
  const [homesteadName, setHomesteadName] = useState('');
  const [locationState, setLocationState] = useState('');
  const [acreage, setAcreage] = useState('');
  const [gridStatus, setGridStatus] = useState<GridStatus>('on_grid');

  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });
  const fa = Platform.select({ web: '"Caveat", cursive', default: undefined });

  const finish = () => {
    setProfile({
      id: 'local-user',
      displayName: '',
      homesteadName: homesteadName || 'My Homestead',
      locationState,
      acreage: Number(acreage) || 0,
      climateZone: '',
      gridStatus,
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        {/* Dots indicator */}
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[styles.dot, {
                backgroundColor: i === step ? theme.colors.primary : theme.colors.border,
                width: i === step ? 24 : 8,
              }]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.step}>
            <Text style={[styles.welcome, { color: theme.colors.primary, fontFamily: fa, fontSize: 22 }]}>
              Welcome to
            </Text>
            <Text style={[styles.appName, { color: theme.colors.text, fontFamily: fd }]}>
              Homestead Forge
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.textMuted, fontFamily: fa, fontSize: 20 }]}>
              Plan your land. Build your life. Track every step.
            </Text>
            <View style={styles.featureList}>
              {['12 guided planning modules', 'Step-by-step progress tracking', 'Budget & expense management', 'Journal & photo documentation', 'Works offline — your data is always safe'].map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Icon name="Check" size={18} color={theme.colors.accent} />
                  <Text style={[styles.featureText, { color: theme.colors.text }]}>{f}</Text>
                </View>
              ))}
            </View>
            <Button title="Get Started" variant="primary" size="lg" onPress={next} />
          </View>
        )}

        {step === 1 && (
          <View style={styles.step}>
            <Text style={[styles.stepTitle, { color: theme.colors.text, fontFamily: fd }]}>
              Name Your Homestead
            </Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textMuted, fontFamily: f }]}>
              Every great homestead deserves a name. What do you call yours?
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                fontFamily: f,
              }]}
              value={homesteadName}
              onChangeText={setHomesteadName}
              placeholder="The Smith Homestead"
              placeholderTextColor={theme.colors.textMuted}
              autoFocus
            />
            <View style={styles.navRow}>
              <Button title="Back" variant="ghost" onPress={prev} />
              <Button title="Next" variant="primary" onPress={next} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <Text style={[styles.stepTitle, { color: theme.colors.text, fontFamily: fd }]}>
              Where Is Your Land?
            </Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textMuted, fontFamily: f }]}>
              This helps us tailor seasonal advice and climate recommendations.
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                fontFamily: f,
              }]}
              value={locationState}
              onChangeText={setLocationState}
              placeholder="State (e.g. Colorado)"
              placeholderTextColor={theme.colors.textMuted}
            />
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                fontFamily: f,
                marginTop: 12,
              }]}
              value={acreage}
              onChangeText={setAcreage}
              placeholder="Acreage (e.g. 10)"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
            />
            <View style={styles.navRow}>
              <Button title="Back" variant="ghost" onPress={prev} />
              <Button title="Next" variant="primary" onPress={next} />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <Text style={[styles.stepTitle, { color: theme.colors.text, fontFamily: fd }]}>
              What's Your Grid Status?
            </Text>
            <Text style={[styles.stepDesc, { color: theme.colors.textMuted, fontFamily: f }]}>
              This helps us prioritize your power and infrastructure modules.
            </Text>
            <View style={styles.gridOptions}>
              {GRID_OPTIONS.map(opt => (
                <Pressable key={opt.value} onPress={() => setGridStatus(opt.value)}>
                  <Card
                    variant={gridStatus === opt.value ? 'elevated' : 'outlined'}
                    style={{
                      backgroundColor: gridStatus === opt.value ? theme.colors.card : 'transparent',
                      borderColor: gridStatus === opt.value ? theme.colors.primary : theme.colors.border,
                      borderWidth: gridStatus === opt.value ? 2 : 1,
                      marginBottom: 12,
                    }}
                  >
                    <View style={styles.gridOptionRow}>
                      <Icon name={opt.icon} size={28} color={gridStatus === opt.value ? theme.colors.primary : theme.colors.textMuted} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.gridLabel, { color: theme.colors.text, fontFamily: f }]}>{opt.label}</Text>
                        <Text style={[styles.gridDesc, { color: theme.colors.textMuted, fontFamily: f }]}>{opt.desc}</Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
            <View style={styles.navRow}>
              <Button title="Back" variant="ghost" onPress={prev} />
              <Button title="Next" variant="primary" onPress={next} />
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.step}>
            <Text style={[styles.stepTitle, { color: theme.colors.text, fontFamily: fd }]}>
              You're All Set!
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.textMuted, fontFamily: fa, fontSize: 20, marginBottom: 24 }]}>
              Your homestead journey starts now.
            </Text>
            <Card variant="elevated" style={{ backgroundColor: theme.colors.card, marginBottom: 24 }}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textMuted, fontFamily: f }]}>Homestead</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text, fontFamily: fd }]}>{homesteadName || 'My Homestead'}</Text>
              {locationState ? (
                <>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textMuted, fontFamily: f, marginTop: 12 }]}>Location</Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text, fontFamily: f }]}>{locationState}{acreage ? ` · ${acreage} acres` : ''}</Text>
                </>
              ) : null}
              <Text style={[styles.summaryLabel, { color: theme.colors.textMuted, fontFamily: f, marginTop: 12 }]}>Grid Status</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text, fontFamily: f }]}>
                {GRID_OPTIONS.find(o => o.value === gridStatus)?.label}
              </Text>
            </Card>
            <View style={styles.navRow}>
              <Button title="Back" variant="ghost" onPress={prev} />
              <Button title="Start Planning" variant="primary" size="lg" onPress={finish} />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
  wrapper: { maxWidth: 500, width: '100%', alignSelf: 'center', padding: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 },
  dot: { height: 8, borderRadius: 4 },
  step: { alignItems: 'stretch' },
  welcome: { textAlign: 'center', marginBottom: 4 },
  appName: { fontSize: 42, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  tagline: { textAlign: 'center', marginBottom: 32 },
  featureList: { marginBottom: 32, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 16 },
  stepTitle: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  stepDesc: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 18 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  gridOptions: { marginBottom: 8 },
  gridOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  gridLabel: { fontSize: 18, fontWeight: '600' },
  gridDesc: { fontSize: 14, marginTop: 2 },
  summaryLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { fontSize: 20, fontWeight: '600' },
});
