import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { IconName } from '../../components/ui';

function tabIcon(active: IconName, inactive: IconName) {
  return ({ focused, color }: { focused: boolean; color: ColorValue }) => (
    <Ionicons
      name={focused ? active : inactive}
      size={24}
      color={color as string}
    />
  );
}

const hidden = { href: null } as const;

/**
 * Tabs: Explore · My Events · Communities · Chats · Profile.
 * Create lives in a floating + button on Explore / My Events.
 * Notifications open from the header bell.
 */
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
          paddingBottom: 26,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: tabIcon('compass', 'compass-outline'),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'My Events',
          tabBarIcon: tabIcon('calendar', 'calendar-outline'),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          tabBarIcon: tabIcon('people', 'people-outline'),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chats',
          tabBarIcon: tabIcon(
            'chatbubble-ellipses',
            'chatbubble-ellipses-outline'
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
      />

      {/* Not tabs — reachable via navigation */}
      <Tabs.Screen name="index" options={hidden} />
      <Tabs.Screen name="home" options={hidden} />
      <Tabs.Screen name="discover" options={hidden} />
      <Tabs.Screen name="create" options={hidden} />
      <Tabs.Screen name="calendar" options={hidden} />
      <Tabs.Screen name="notifications" options={hidden} />
    </Tabs>
  );
}
