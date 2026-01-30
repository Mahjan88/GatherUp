import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

// Import icons (512px for high-DPI quality)
const HomeIcon = require('../assets/Icons/home_icon_512.png');
const CalendarIcon = require('../assets/Icons/calendar_icon_512.png');
const ChatIcon = require('../assets/Icons/chat_icon_512.png');
const ProfileIcon = require('../assets/Icons/profile_icon_512.png');

interface BottomTabBarProps {
  middleButton?: {
    label: string;
    onPress: () => void;
  };
  hideMiddleButton?: boolean;
}

export default function BottomTabBar({ middleButton, hideMiddleButton }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleCreatePress = () => {
    router.push('/create-event');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/')}
      >
        <Image 
          source={HomeIcon} 
          style={[styles.tabIcon, isActive('/') && styles.tabIconActive]} 
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => router.push('/notifications')}
      >
        <Image 
          source={CalendarIcon} 
          style={[styles.tabIcon, isActive('/notifications') && styles.tabIconActive]} 
          resizeMode="contain"
        />
      </TouchableOpacity>

      {!hideMiddleButton && (
        middleButton ? (
          <TouchableOpacity 
            style={styles.middleButtonCustom}
            onPress={middleButton.onPress}
          >
            <Text style={styles.middleButtonText}>{middleButton.label}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.middleButton}
            onPress={handleCreatePress}
          >
            <Text style={styles.middleButtonIcon}>+</Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => router.push('/messages')}
      >
        <Image 
          source={ChatIcon} 
          style={[styles.chatIcon, isActive('/messages') && styles.chatIconActive]} 
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => router.push('/profile')}
      >
        <Image 
          source={ProfileIcon} 
          style={[styles.tabIcon, isActive('/profile') && styles.tabIconActive]} 
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0f172a',
    paddingTop: 12,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
  },
  tabIcon: { 
    width: 26,
    height: 26,
    tintColor: '#64748b',
  },
  tabIconActive: {
    width: 30,
    height: 30,
    tintColor: '#14b8a6',
  },
  chatIcon: {
    width: 30,
    height: 30,
    tintColor: '#64748b',
  },
  chatIconActive: {
    width: 34,
    height: 34,
    tintColor: '#14b8a6',
  },
  middleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  middleButtonIcon: {
    fontSize: 26,
    color: '#0f172a',
    fontWeight: '300',
    marginTop: -2,
  },
  middleButtonCustom: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#14b8a6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: -10,
  },
  middleButtonText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#14b8a6',
  },
});
