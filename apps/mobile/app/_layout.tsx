import { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../components/SplashScreen';
import { StatusBar } from 'expo-status-bar';
import { CenterButtonProvider } from '../contexts/CenterButtonContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

// Prevent the native splash screen from hiding automatically
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Open on the tabs; useAuthRedirect sends signed-out users to welcome
export const unstable_settings = { anchor: '(tabs)' };

/** Onboarding steps a signed-in user may still be on before finishing. */
const ONBOARDING_SCREENS = ['profile-setup', 'notification-prefs'];

/**
 * Sends users to the right place for their auth state: signed out → welcome,
 * signed in but not onboarded → profile setup, onboarded or guest → the tabs.
 */
function useAuthRedirect(enabled: boolean) {
  const { session, loading, isOnboarded, isGuest } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!enabled || loading) return;
    const [group, screen = ''] = segments as string[];
    const inAuthGroup = group === '(auth)';

    if (!session && isGuest) {
      if (inAuthGroup) router.replace('/(tabs)/explore');
    } else if (!session) {
      if (!inAuthGroup) router.replace('/(auth)/welcome');
    } else if (!isOnboarded) {
      if (!inAuthGroup || !ONBOARDING_SCREENS.includes(screen)) {
        router.replace('/(auth)/profile-setup');
      }
    } else if (inAuthGroup) {
      router.replace('/(tabs)/explore');
    }
  }, [enabled, loading, session, isOnboarded, isGuest, segments, router]);
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  useAuthRedirect(appIsReady && !showSplash);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading resources
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the native splash screen immediately
        await ExpoSplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CenterButtonProvider>
        {showSplash && <SplashScreen onFinish={onSplashFinish} />}
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="compose"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="contact/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings/profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="settings/account"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="settings/chats"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="settings/notifications"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="settings/data-storage"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="gallery/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="event/create"
            options={{
              title: 'Create Event',
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen name="event/past" options={{ headerShown: false }} />
          <Stack.Screen name="event/invite" options={{ headerShown: false }} />
          <Stack.Screen name="discover" options={{ headerShown: false }} />
          <Stack.Screen
            name="community/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="community/create"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="series/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="series/create" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings/blocked"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="report" options={{ headerShown: false }} />
        </Stack>
      </CenterButtonProvider>
    </QueryClientProvider>
  );
}
