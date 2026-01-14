import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';

type Section = 'chats' | 'calls' | 'status' | 'settings';

const SIDEBAR_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: 'chats', icon: '💬', label: 'Chats' },
  { id: 'calls', icon: '📞', label: 'Calls' },
  { id: 'status', icon: '🔵', label: 'Status' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

// Mock chat data
const MOCK_CHATS = [
  { id: '1', name: 'John Doe', message: 'Hey, are you coming to the event?', time: '2:30 PM', unread: 2, avatar: null },
  { id: '2', name: 'Sarah Smith', message: 'The party was amazing! 🎉', time: '1:15 PM', unread: 0, avatar: null },
  { id: '3', name: 'Event Group', message: 'Alex: See you all there!', time: '12:00 PM', unread: 5, avatar: null },
  { id: '4', name: 'Mike Johnson', message: 'Thanks for the invite', time: 'Yesterday', unread: 0, avatar: null },
  { id: '5', name: 'Beach Party 🏖️', message: 'You: Can\'t wait!', time: 'Yesterday', unread: 0, avatar: null },
];

const MOCK_CALLS = [
  { id: '1', name: 'John Doe', type: 'incoming', time: 'Today, 2:30 PM' },
  { id: '2', name: 'Sarah Smith', type: 'outgoing', time: 'Today, 1:15 PM' },
  { id: '3', name: 'Mike Johnson', type: 'missed', time: 'Yesterday' },
];

export default function MessagesScreen() {
  const [activeSection, setActiveSection] = useState<Section>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const renderChats = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>
      <ScrollView style={styles.chatList}>
        {MOCK_CHATS.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{chat.name[0]}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.chatMessage} numberOfLines={1}>{chat.message}</Text>
                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalls = () => (
    <View style={styles.content}>
      <ScrollView style={styles.chatList}>
        {MOCK_CALLS.map((call) => (
          <TouchableOpacity key={call.id} style={styles.chatItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{call.name[0]}</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{call.name}</Text>
              <View style={styles.callInfo}>
                <Text style={[styles.callType, call.type === 'missed' && styles.missedCall]}>
                  {call.type === 'incoming' ? '📥' : call.type === 'outgoing' ? '📤' : '📵'} {call.type}
                </Text>
                <Text style={styles.chatTime}>{call.time}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text>📞</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStatus = () => (
    <View style={styles.content}>
      <ScrollView style={styles.chatList}>
        <TouchableOpacity style={styles.statusItem}>
          <View style={styles.statusAvatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>My Status</Text>
            <Text style={styles.statusSubtext}>Tap to add status update</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent status updates</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.content}>
      <ScrollView style={styles.chatList}>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>👤</Text>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsLabel}>Account</Text>
            <Text style={styles.settingsSubtext}>Privacy, security, change number</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🔔</Text>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsLabel}>Notifications</Text>
            <Text style={styles.settingsSubtext}>Message, group & call tones</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>💾</Text>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsLabel}>Storage and Data</Text>
            <Text style={styles.settingsSubtext}>Network usage, auto-download</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>❓</Text>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsLabel}>Help</Text>
            <Text style={styles.settingsSubtext}>FAQ, contact us, privacy policy</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chats': return renderChats();
      case 'calls': return renderCalls();
      case 'status': return renderStatus();
      case 'settings': return renderSettings();
      default: return renderChats();
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        {SIDEBAR_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.sidebarItem, activeSection === item.id && styles.sidebarItemActive]}
            onPress={() => setActiveSection(item.id)}
          >
            <Text style={styles.sidebarIcon}>{item.icon}</Text>
            <Text style={[styles.sidebarLabel, activeSection === item.id && styles.sidebarLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
  },
  sidebar: {
    width: 70,
    backgroundColor: '#1f2937',
    paddingTop: 16,
    alignItems: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  sidebarItemActive: {
    backgroundColor: '#374151',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  sidebarIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sidebarLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  sidebarLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#f3f4f6',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  callType: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
    textTransform: 'capitalize',
  },
  missedCall: {
    color: '#ef4444',
  },
  callButton: {
    padding: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusAvatarContainer: {
    position: 'relative',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
