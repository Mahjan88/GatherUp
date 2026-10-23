import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, IconButton, IconName, ListRow } from './ui';
import { colors, radius, spacing, typography, GUTTER } from '../theme';

interface MenuItem {
  id: string;
  icon: IconName;
  label: string;
  route?: string;
  danger?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    icon: 'person-outline',
    label: 'Profile',
    route: '/profile',
  },
  {
    id: 'settings',
    icon: 'settings-outline',
    label: 'Settings',
    route: '/settings/account',
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    label: 'Notification Settings',
    route: '/settings/notifications',
  },
  {
    id: 'privacy',
    icon: 'lock-closed-outline',
    label: 'Privacy',
    route: '/settings/account',
  },
  { id: 'help', icon: 'help-circle-outline', label: 'Help & Support' },
  { id: 'signout', icon: 'log-out-outline', label: 'Sign Out', danger: true },
];

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

export default function HamburgerMenu({
  visible,
  onClose,
  userName = 'User Name',
  userEmail = 'user@example.com',
}: HamburgerMenuProps) {
  const router = useRouter();

  const handleMenuItemPress = (item: MenuItem) => {
    onClose();
    if (item.route) {
      router.push(item.route as any);
    } else if (item.id === 'signout') {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.grabber} />

          {/* User header */}
          <View style={styles.header}>
            <Avatar name={userName} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={typography.h2} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={typography.bodySecondary} numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
            <IconButton
              name="close"
              variant="filled"
              size={20}
              onPress={onClose}
              accessibilityLabel="Close menu"
            />
          </View>

          {/* Menu items */}
          <View style={styles.list}>
            {MENU_ITEMS.map((item) => (
              <ListRow
                key={item.id}
                icon={item.icon}
                title={item.label}
                destructive={item.danger}
                showChevron={!item.danger}
                onPress={() => handleMenuItemPress(item)}
              />
            ))}
          </View>

          <Text style={styles.version}>GatherUp v1.0.0</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function HamburgerButton({ onPress }: { onPress: () => void }) {
  return (
    <IconButton
      name="menu"
      variant="filled"
      onPress={onPress}
      accessibilityLabel="Open menu"
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingBottom: 36,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: GUTTER,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  list: { paddingTop: spacing.xs },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
