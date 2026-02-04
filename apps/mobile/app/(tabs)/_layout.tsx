import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Import icons (512px for high-DPI quality)
const HomeIcon = require('../../assets/Icons/home_icon.png');
const CalendarIcon = require('../../assets/Icons/calendar_icon.png');
const NotificationIcon = require('../../assets/Icons/notification_icon.png');
const ChatIcon = require('../../assets/Icons/message_icon.png');

function CreateButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => router.push('/create-event')}
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
        name="index"
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
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={CalendarIcon}
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
        name="profile"
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
});
