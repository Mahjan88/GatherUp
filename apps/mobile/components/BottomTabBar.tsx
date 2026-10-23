/**
 * @deprecated The app now uses the Expo Router `Tabs` bar defined in
 * `app/(tabs)/_layout.tsx`. This component mirrors that bar visually so any
 * remaining callers render consistently. Prefer a sticky bottom CTA on pushed
 * screens instead of rendering this.
 */
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, IconName, Button } from './ui';
import { colors, spacing } from '../theme';

interface BottomTabBarProps {
  /** Optional inline action rendered between the tabs (legacy, e.g. RSVP). */
  middleButton?: {
    label: string;
    onPress: () => void;
  };
  /** Legacy: hides the middle action. */
  hideMiddleButton?: boolean;
}

const TABS: {
  label: string;
  route: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  {
    label: 'Explore',
    route: '/explore',
    icon: 'compass-outline',
    activeIcon: 'compass',
  },
  {
    label: 'My Events',
    route: '/my-events',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
  },
  {
    label: 'Communities',
    route: '/communities',
    icon: 'people-outline',
    activeIcon: 'people',
  },
  {
    label: 'Chats',
    route: '/messages',
    icon: 'chatbubble-ellipses-outline',
    activeIcon: 'chatbubble-ellipses',
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export default function BottomTabBar({
  middleButton,
  hideMiddleButton,
}: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const active = isActive(tab.route);
    const color = active ? colors.primary : colors.textMuted;
    return (
      <TouchableOpacity
        key={tab.route}
        style={styles.tabItem}
        onPress={() => router.push(tab.route as any)}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
      >
        <Ionicons
          name={active ? tab.activeIcon : tab.icon}
          size={24}
          color={color}
        />
        <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const showMiddle = !!middleButton && !hideMiddleButton;

  return (
    <View style={styles.container}>
      {TABS.slice(0, 2).map(renderTab)}
      {showMiddle && middleButton && (
        <View style={styles.middle}>
          <Button
            label={middleButton.label}
            onPress={middleButton.onPress}
            size="sm"
          />
        </View>
      )}
      {TABS.slice(2).map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    paddingBottom: 26,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  middle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
});
