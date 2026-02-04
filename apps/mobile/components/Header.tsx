import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import HamburgerMenu from './HamburgerMenu';

const SearchIcon = require('../assets/Icons/search_icon.png');

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showHamburger?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = false, showSearch = true, showHamburger = true, rightElement }: HeaderProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      {/* Top Row: Logo + GatherUp + Search + Hamburger */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          {showBack ? (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          ) : null}
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>
            <Text style={styles.titleCyan}>Gather</Text>
            <Text style={styles.titlePink}>Up</Text>
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {rightElement}
          {showSearch && (
            <TouchableOpacity style={styles.searchButton}>
              <Image 
                source={SearchIcon}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {showHamburger && (
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => setMenuVisible(true)}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Page Title */}
      {title && (
        <Text style={styles.pageTitle}>{title}</Text>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { 
    width: 22, 
    height: 22,
    tintColor: '#fff',
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
  },
});
