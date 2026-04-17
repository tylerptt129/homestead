import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../stores/useAuthStore';
import Card from '../../components/atoms/Card';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Icon from '../../components/atoms/Icon';
import Divider from '../../components/atoms/Divider';

export default function ProfileScreen() {
  const { theme, mode, toggleTheme } = useTheme();
  const profile = useAuthStore(s => s.profile);
  const updateProfile = useAuthStore(s => s.updateProfile);
  const fd = Platform.select({ web: '"Playfair Display", serif', default: 'serif' });
  const f = Platform.select({ web: '"Source Sans 3", sans-serif', default: undefined });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.homesteadName || '');
  const [state, setState] = useState(profile?.locationState || '');
  const [acreage, setAcreage] = useState(String(profile?.acreage || ''));

  const handleSave = () => {
    updateProfile({
      homesteadName: name,
      locationState: state,
      acreage: Number(acreage) || 0,
    });
    setEditing(false);
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: fd }]}>Profile</Text>

        <Card variant="elevated" style={{ backgroundColor: theme.colors.card, marginBottom: 20 }}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Icon name="User" size={32} color={theme.colors.base} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.homesteadName, { color: theme.colors.text, fontFamily: fd }]}>
                {profile?.homesteadName || 'Your Homestead'}
              </Text>
              <Text style={[styles.detail, { color: theme.colors.textMuted, fontFamily: f }]}>
                {profile?.locationState || 'Location not set'} {profile?.acreage ? `· ${profile.acreage} acres` : ''}
              </Text>
              <Text style={[styles.detail, { color: theme.colors.textMuted, fontFamily: f }]}>
                {profile?.gridStatus === 'off_grid' ? 'Off Grid' : profile?.gridStatus === 'hybrid' ? 'Hybrid' : 'On Grid'}
              </Text>
            </View>
          </View>
        </Card>

        {editing ? (
          <Card variant="default" style={{ backgroundColor: theme.colors.surface, marginBottom: 20 }}>
            <Input label="Homestead Name" value={name} onChangeText={setName} placeholder="The Smith Homestead" />
            <View style={{ height: 12 }} />
            <Input label="State" value={state} onChangeText={setState} placeholder="e.g. Colorado" />
            <View style={{ height: 12 }} />
            <Input label="Acreage" value={acreage} onChangeText={setAcreage} placeholder="e.g. 10" keyboardType="numeric" />
            <View style={{ height: 16 }} />
            <View style={styles.btnRow}>
              <Button title="Save" variant="primary" onPress={handleSave} />
              <Button title="Cancel" variant="ghost" onPress={() => setEditing(false)} />
            </View>
          </Card>
        ) : (
          <Button title="Edit Homestead Info" variant="outline" onPress={() => setEditing(true)} style={{ marginBottom: 20 }} />
        )}

        <Divider />

        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Settings</Text>

        <Card variant="default" style={{ backgroundColor: theme.colors.surface, marginBottom: 20 }}>
          <Pressable style={styles.settingRow} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Icon name={mode === 'dark' ? 'Moon' : 'Sun'} size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text, fontFamily: f }]}>
                Theme
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.colors.textMuted, fontFamily: f }]}>
              {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </Pressable>
        </Card>

        <Divider />

        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: fd }]}>Data</Text>
        <Button title="Export Data (Coming Soon)" variant="secondary" disabled onPress={() => {}} style={{ marginBottom: 20 }} />

        <Divider />

        <View style={styles.about}>
          <Text style={[styles.aboutText, { color: theme.colors.textMuted, fontFamily: f }]}>
            Homestead Forge v1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: theme.colors.textMuted, fontFamily: f }]}>
            Plan your land. Build your life. Track every step.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  wrapper: { maxWidth: 800, width: '100%', alignSelf: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: '700', marginTop: 16, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  homesteadName: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  detail: { fontSize: 14, marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 16 },
  settingValue: { fontSize: 14 },
  btnRow: { flexDirection: 'row', gap: 12 },
  about: { alignItems: 'center', paddingVertical: 24 },
  aboutText: { fontSize: 14, marginBottom: 4 },
});
