import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = false, showSearch = true, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Top Row: Logo + GatherUp + Search */}
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
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Page Title */}
      {title && (
        <Text style={styles.pageTitle}>{title}</Text>
      )}
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { fontSize: 22 },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
  },
});
