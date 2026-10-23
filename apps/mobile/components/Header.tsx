import { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenHeader, IconButton, IconName } from './ui';
import { colors, radius, GUTTER } from '../theme';

interface HeaderProps {
  /** Large left-aligned title. Omit to show the brand bar (logo + location). */
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Force the brand bar even when a title is given. */
  showLogo?: boolean;
  showNotificationBell?: boolean;
  unreadNotificationCount?: number;
  /** Current city shown in the brand bar location pill. */
  location?: string;
  /** Single icon action on the right (e.g. search, settings). */
  rightIcon?: IconName;
  onRightPress?: () => void;
  /** Arbitrary right-side content. */
  rightElement?: ReactNode;
  /** Content rendered under the title row (search bar, chips…). */
  children?: ReactNode;
  /** @deprecated Menu moved to Profile → settings. Kept for API compat. */
  showHamburger?: boolean;
}

/** Teal mountain mark + "gatherup" wordmark. */
export function BrandMark({
  size = 26,
  light,
  stacked,
}: {
  size?: number;
  light?: boolean;
  /** Icon above the wordmark (splash / welcome). */
  stacked?: boolean;
}) {
  return (
    <View style={stacked ? styles.brandStacked : styles.brand}>
      <MaterialCommunityIcons
        name="image-filter-hdr"
        size={stacked ? size * 1.3 : size}
        color={colors.primary}
      />
      <Text
        style={[
          styles.wordmark,
          { fontSize: size * 0.78 },
          stacked && { marginTop: -size * 0.15, letterSpacing: -1 },
          light && { color: colors.textOnImage },
        ]}
      >
        gatherup
      </Text>
    </View>
  );
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  showLogo,
  showNotificationBell = true,
  unreadNotificationCount = 0,
  location = 'San Jose, CA',
  rightIcon,
  onRightPress,
  rightElement,
  children,
}: HeaderProps) {
  const router = useRouter();

  const bell = showNotificationBell ? (
    <IconButton
      name="notifications-outline"
      badge={unreadNotificationCount > 0 ? unreadNotificationCount : false}
      onPress={() => router.push('/notifications')}
      accessibilityLabel="Notifications"
    />
  ) : null;

  const right = (
    <>
      {rightElement}
      {rightIcon && <IconButton name={rightIcon} onPress={onRightPress} />}
      {!showBack && bell}
    </>
  );

  const brandBar = showLogo || (!title && !showBack);

  if (brandBar) {
    return (
      <View style={styles.brandHeader}>
        <View style={styles.brandRow}>
          <BrandMark />
          <TouchableOpacity style={styles.locationPill} activeOpacity={0.8}>
            <Ionicons
              name="location-outline"
              size={13}
              color={colors.primary}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {right}
        </View>
        {children}
      </View>
    );
  }

  return (
    <ScreenHeader
      title={title}
      subtitle={subtitle}
      showBack={showBack}
      onBack={onBack}
      right={right}
    >
      {children}
    </ScreenHeader>
  );
}

const styles = StyleSheet.create({
  brandHeader: {
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: colors.background,
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    gap: 10,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandStacked: { alignItems: 'center' },
  wordmark: {
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    maxWidth: 140,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
