import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import OnboardingHeader from '../../components/OnboardingHeader';
import { colors } from '../../theme';

/** Sign-up steps that show the shared progress header. */
const STEPS: Record<string, number> = {
  '/phone': 0,
  '/email': 0,
  '/verify': 1,
  '/profile-setup': 2,
  '/notification-prefs': 3,
};
const TOTAL_STEPS = 4;

// Without this expo-router starts the group on its first file (email)
export const unstable_settings = { anchor: 'welcome' };

export default function AuthLayout() {
  const pathname = usePathname();
  const step = STEPS[pathname] ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="phone" />
        <Stack.Screen name="email" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="notification-prefs" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      {/* Drawn above the stack so it stays still during transitions */}
      <OnboardingHeader step={step} total={TOTAL_STEPS} />
    </View>
  );
}
