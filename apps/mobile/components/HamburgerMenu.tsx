import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const MENU_ITEMS = [
  { id: 'profile', icon: '👤', label: 'Profile', route: '/settings/profile' },
  { id: 'settings', icon: '⚙️', label: 'Settings', route: '/settings/account' },
  { id: 'notifications', icon: '🔔', label: 'Notification Settings', route: '/settings/notifications' },
  { id: 'privacy', icon: '🔒', label: 'Privacy', route: '/settings/account' },
  { id: 'help', icon: 'ℹ️', label: 'Help & Support' },
  { id: 'signout', icon: '🚪', label: 'Sign Out', danger: true },
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
  userEmail = 'user@example.com'
}: HamburgerMenuProps) {
  const router = useRouter();

  const handleMenuItemPress = (item: typeof MENU_ITEMS[0]) => {
    onClose();
    if (item.route) {
      router.push(item.route as any);
    } else if (item.id === 'signout') {
      router.replace('/login');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
          {/* User Profile Header */}
          <View style={styles.menuHeader}>
            <View style={styles.menuAvatar}>
              <Text style={styles.menuAvatarText}>{userName[0]?.toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.menuUserInfo}>
              <Text style={styles.menuUserName}>{userName}</Text>
              <Text style={styles.menuUserEmail}>{userEmail}</Text>
            </View>
          </View>
          
          <View style={styles.menuDivider} />
          
          {/* Menu Items */}
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
            >
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={[styles.menuItemLabel, item.danger && styles.menuItemDanger]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* App Version */}
          <View style={styles.menuFooter}>
            <Text style={styles.menuVersion}>GatherUp v1.0.0</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function HamburgerButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.hamburgerButton} onPress={onPress}>
      <Text style={styles.hamburgerIcon}>☰</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: { fontSize: 20, color: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#1e293b',
    marginTop: 100,
    marginLeft: 20,
    marginRight: 80,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuAvatarText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  menuUserInfo: { marginLeft: 12, flex: 1 },
  menuUserName: { fontSize: 17, fontWeight: '600', color: '#fff' },
  menuUserEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: '#334155', marginVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemIcon: { fontSize: 20, marginRight: 14, width: 28 },
  menuItemLabel: { fontSize: 16, color: '#fff' },
  menuItemDanger: { color: '#ef4444' },
  menuFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    marginTop: 8,
  },
  menuVersion: { fontSize: 12, color: '#475569', textAlign: 'center' },
});
