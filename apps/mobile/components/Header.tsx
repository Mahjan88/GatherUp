import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import HamburgerMenu from './HamburgerMenu';

const NotificationIcon = require('../assets/Icons/notification_icon.png');

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHamburger?: boolean;
  showLogo?: boolean;
  showNotificationBell?: boolean;
  unreadNotificationCount?: number;
  rightElement?: React.ReactNode;
  onBack?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showHamburger = true,
  showLogo = true,
  showNotificationBell = true,
  unreadNotificationCount = 0,
  rightElement,
  onBack,
}: HeaderProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {/* Top Row: Logo + GatherUp + Bell + Hamburger */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backIcon}>&#x2039;</Text>
            </TouchableOpacity>
          )}
          {showLogo && (
            <>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>
                <Text style={styles.titleCyan}>Gather</Text>
                <Text style={styles.titlePink}>Up</Text>
              </Text>
            </>
          )}
        </View>

        <View style={styles.headerRight}>
          {rightElement}
          {showNotificationBell && (
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => router.push('/notifications')}
            >
              <Image
                source={NotificationIcon}
                style={styles.bellIcon}
                resizeMode="contain"
              />
              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {showHamburger && (
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => setMenuVisible(true)}>
              <Text style={styles.hamburgerIcon}>&#x2630;</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Page Title (shown below logo row when no back button) */}
      {title && !showBack && (
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>{title}</Text>
        </View>
      )}

      {/* Hamburger Menu Modal */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        userName="John Doe"
        userEmail="john@example.com"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#0f172a',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backIcon: {
    fontSize: 22,
    color: '#fff',
    marginTop: -2,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  titleCyan: { color: '#00FFFF' },
  titlePink: { color: '#FF00FF' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    width: 22,
    height: 22,
    tintColor: '#94a3b8',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 20,
    color: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
});
