import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function Index() {
  const isOnboarded = useAuthStore(s => s.isOnboarded);

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
