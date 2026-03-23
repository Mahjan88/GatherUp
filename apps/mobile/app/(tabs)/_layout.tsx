import { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCenterButton } from '../../contexts/CenterButtonContext';

// Import icons (512px for high-DPI quality)
const HomeIcon = require('../../assets/Icons/home_icon.png');
const NotificationIcon = require('../../assets/Icons/notification_icon.png');
const ChatIcon = require('../../assets/Icons/message_icon.png');
const ProfileIcon = require('../../assets/Icons/profile_icon.png');

// Sample user image URL - replace with actual user data
const USER_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';

function ProfileTabIcon({ focused }: { focused: boolean }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !USER_PROFILE_IMAGE) {
    // Fallback to profile icon
    return (
      <View style={styles.iconContainer}>
        <Image
          source={ProfileIcon}
          style={[styles.tabIcon, focused && styles.tabIconActive]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.profileIconContainer, focused && styles.profileIconContainerActive]}>
      <Image
        source={{ uri: USER_PROFILE_IMAGE }}
        style={styles.profileImage}
        onError={() => setImageError(true)}
      />
    </View>
  );
}

function CreateButton() {
  const router = useRouter();
  const { customAction } = useCenterButton();

  const handlePress = () => {
    if (customAction) {
      customAction();
    } else {
      router.push('/event/create');
    }
  };

  return (
    <TouchableOpacity
      style={styles.createButton}
      onPress={handlePress}
    >
      <Text style={styles.createButtonText}>+</Text>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#14b8a6',
        tabBarInactiveTintColor: '#64748b',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 12,
          paddingHorizontal: 20,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={HomeIcon}
                style={[styles.tabIcon, focused && styles.tabIconActive]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={NotificationIcon}
                style={[styles.tabIcon, focused && styles.tabIconActive]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: () => <CreateButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={ChatIcon}
                style={[styles.chatIcon, focused && styles.chatIconActive]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
        }}
      />
      {/* Hide index redirect from tabs */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      {/* Hide calendar from tabs */}
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 26,
    height: 26,
    tintColor: '#64748b',
  },
  tabIconActive: {
    width: 40,
    height: 40,
    tintColor: '#14b8a6',
  },
  chatIcon: {
    width: 40,
    height: 40,
    tintColor: '#64748b',
  },
  chatIconActive: {
    width: 55,
    height: 55,
    tintColor: '#14b8a6',
  },
  createButton: {
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
  createButtonText: {
    fontSize: 26,
    color: '#0f172a',
    fontWeight: '300',
    marginTop: -2,
  },
  profileIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  profileIconContainerActive: {
    borderColor: '#14b8a6',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
});
