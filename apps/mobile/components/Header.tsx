import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import HamburgerMenu from './HamburgerMenu';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHamburger?: boolean;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  onBack?: () => void;
}

export default function Header({ title, showBack = false, showHamburger = true, showLogo = true, rightElement, onBack }: HeaderProps) {
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
      {/* Top Row: Logo + GatherUp + Hamburger */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          {showBack ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          ) : null}
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
          {showHamburger && (
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => setMenuVisible(true)}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Page Title */}
      {title && (
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backIcon: { 
    fontSize: 24, 
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
    justifyContent: 'space-between',
    marginTop: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
});
