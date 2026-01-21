import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

type Section = 'chats' | 'calls' | 'settings';

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  pinned: boolean;
  avatar: string | null;
}

const SIDEBAR_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: 'chats', icon: '💬', label: 'Chats' },
  { id: 'calls', icon: '📞', label: 'Calls' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

const INITIAL_CHATS: Chat[] = [
  { id: '1', name: 'John Doe', message: 'Hey, are you coming to the event?', time: '2:30 PM', unread: 2, pinned: true, avatar: null },
  { id: '2', name: 'Sarah Smith', message: 'The party was amazing! 🎉', time: '1:15 PM', unread: 0, pinned: false, avatar: null },
  { id: '3', name: 'Event Group', message: 'Alex: See you all there!', time: '12:00 PM', unread: 5, pinned: false, avatar: null },
  { id: '4', name: 'Mike Johnson', message: 'Thanks for the invite', time: 'Yesterday', unread: 0, pinned: false, avatar: null },
  { id: '5', name: 'Beach Party 🏖️', message: 'You: Can\'t wait!', time: 'Yesterday', unread: 0, pinned: false, avatar: null },
];

const SWIPE_THRESHOLD = 60;

function SwipeableChatItem({
  chat,
  isEditMode,
  isSelected,
  onSelect,
  onPin,
  onArchive,
  onDelete,
  onPress,
}: {
  chat: Chat;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onPress: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isEditMode && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: 60, useNativeDriver: true }).start();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: -120, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Pin action (swipe right) */}
      <View style={[styles.actionContainer, styles.pinAction]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => { onPin(); resetSwipe(); }}
        >
          <Text style={styles.actionIcon}>{chat.pinned ? '📍' : '📌'}</Text>
        </TouchableOpacity>
      </View>

      {/* Archive/Delete actions (swipe left) */}
      <View style={[styles.actionContainer, styles.leftActions]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={() => { onArchive(); resetSwipe(); }}
        >
          <Text style={styles.actionIcon}>📦</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => { onDelete(); resetSwipe(); }}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.chatItemAnimated, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.chatItem}
          onPress={isEditMode ? onSelect : onPress}
          activeOpacity={0.7}
        >
          {isEditMode && (
            <View style={[styles.selectCircle, isSelected && styles.selectCircleSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          )}
          {chat.pinned && <Text style={styles.pinnedIcon}>📌</Text>}
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
      </Animated.View>
    </View>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('chats');
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate total unread messages
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  const sortedChats = [...chats]
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedChats(newSelected);
  };

  const handlePin = (id: string) => {
    setChats(chats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };

  const handleArchive = (ids: string[]) => {
    setChats(chats.filter((c) => !ids.includes(c.id)));
    setSelectedChats(new Set());
  };

  const handleDelete = (ids: string[]) => {
    setChats(chats.filter((c) => !ids.includes(c.id)));
    setSelectedChats(new Set());
  };

  const handleMarkRead = (id: string) => {
    setChats(chats.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const handleReadAll = () => {
    if (selectedChats.size === 0) {
      setChats(chats.map((c) => ({ ...c, unread: 0 })));
    } else {
      setChats(chats.map((c) => (selectedChats.has(c.id) ? { ...c, unread: 0 } : c)));
    }
  };

  const selectedHaveUnread = Array.from(selectedChats).some(
    (id) => (chats.find((c) => c.id === id)?.unread ?? 0) > 0
  );

  const renderChats = () => (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
          <Text style={styles.headerButton}>{isEditMode ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push('/compose')}
          >
            <Text style={styles.iconText}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList}>
        {sortedChats.map((chat) => (
          <SwipeableChatItem
            key={chat.id}
            chat={chat}
            isEditMode={isEditMode}
            isSelected={selectedChats.has(chat.id)}
            onSelect={() => toggleSelect(chat.id)}
            onPin={() => handlePin(chat.id)}
            onArchive={() => handleArchive([chat.id])}
            onDelete={() => handleDelete([chat.id])}
            onPress={() => {
              handleMarkRead(chat.id);
              router.push(`/chat/${chat.id}`);
            }}
          />
        ))}
      </ScrollView>

      {/* Bottom Action Bar (Edit Mode) */}
      {isEditMode && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.bottomButton, selectedChats.size > 0 && !selectedHaveUnread && styles.bottomButtonDisabled]}
            onPress={handleReadAll}
            disabled={selectedChats.size > 0 && !selectedHaveUnread}
          >
            <Text style={[styles.bottomButtonText, selectedChats.size > 0 && !selectedHaveUnread && styles.bottomButtonTextDisabled]}>
              {selectedChats.size === 0 ? 'Read All' : 'Read'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, selectedChats.size === 0 && styles.bottomButtonDisabled]}
            onPress={() => handleArchive(Array.from(selectedChats))}
            disabled={selectedChats.size === 0}
          >
            <Text style={[styles.bottomButtonText, selectedChats.size === 0 && styles.bottomButtonTextDisabled]}>
              Archive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, selectedChats.size === 0 && styles.bottomButtonDisabled]}
            onPress={() => handleDelete(Array.from(selectedChats))}
            disabled={selectedChats.size === 0}
          >
            <Text style={[styles.bottomButtonText, styles.deleteText, selectedChats.size === 0 && styles.bottomButtonTextDisabled]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderCalls = () => (
    <View style={styles.content}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📞</Text>
        <Text style={styles.emptyTitle}>Calls</Text>
        <Text style={styles.emptyText}>Your call history will appear here</Text>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.content}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsHeaderTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.settingsScroll}>
        {/* Profile Section */}
        <TouchableOpacity 
          style={styles.profileRow}
          onPress={() => router.push('/settings/profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>S</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sabohiddin</Text>
            <Text style={styles.profileBio}>Digital goodies designer - Pixsellz</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingsIconBox, { backgroundColor: '#fbbf24' }]}>
              <Text style={styles.settingsRowIcon}>⭐</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Starred Messages</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingsIconBox, { backgroundColor: '#10b981' }]}>
              <Text style={styles.settingsRowIcon}>💻</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Linked Devices</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Main Settings */}
        <View style={styles.settingsSection}>
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => router.push('/settings/account')}
          >
            <View style={[styles.settingsIconBox, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.settingsRowIcon}>🔑</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Account</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => router.push('/settings/chats')}
          >
            <View style={[styles.settingsIconBox, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.settingsRowIcon}>💬</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Chats</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => router.push('/settings/notifications')}
          >
            <View style={[styles.settingsIconBox, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.settingsRowIcon}>🔔</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Notifications</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => router.push('/settings/data-storage')}
          >
            <View style={[styles.settingsIconBox, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.settingsRowIcon}>📊</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Data and Storage Usage</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingsIconBox, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.settingsRowIcon}>ℹ️</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Help</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingsIconBox, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.settingsRowIcon}>❤️</Text>
            </View>
            <Text style={styles.settingsRowLabel}>Tell a Friend</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.settingsFooter}>GatherUp</Text>
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chats': return renderChats();
      case 'calls': return renderCalls();
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
            onPress={() => {
              setActiveSection(item.id);
              setIsEditMode(false);
              setSelectedChats(new Set());
            }}
          >
            <View style={styles.sidebarIconContainer}>
              <Text style={styles.sidebarIcon}>{item.icon}</Text>
              {item.id === 'chats' && totalUnread > 0 && (
                <View style={styles.sidebarBadge}>
                  <Text style={styles.sidebarBadgeText}>
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.sidebarLabel, activeSection === item.id && styles.sidebarLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#f9fafb' },
  sidebar: { width: 70, backgroundColor: '#1f2937', paddingTop: 16, alignItems: 'center' },
  sidebarItem: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, width: '100%' },
  sidebarItemActive: { backgroundColor: '#374151', borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  sidebarIconContainer: { position: 'relative', marginBottom: 4 },
  sidebarIcon: { fontSize: 24 },
  sidebarBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  sidebarBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sidebarLabel: { fontSize: 10, color: '#9ca3af', textAlign: 'center' },
  sidebarLabelActive: { color: '#ffffff', fontWeight: '600' },
  content: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerButton: { color: '#3b82f6', fontSize: 16, fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerPlaceholder: { width: 50 },
  headerIcon: { marginLeft: 16 },
  iconText: { fontSize: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#111827' },
  chatList: { flex: 1 },
  swipeContainer: { position: 'relative', overflow: 'hidden' },
  actionContainer: { position: 'absolute', top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center' },
  pinAction: { left: 0, backgroundColor: '#3b82f6' },
  leftActions: { right: 0 },
  actionButton: { width: 60, height: '100%', alignItems: 'center', justifyContent: 'center' },
  archiveButton: { backgroundColor: '#8b5cf6' },
  deleteButton: { backgroundColor: '#ef4444' },
  actionIcon: { fontSize: 18 },
  chatItemAnimated: { backgroundColor: '#ffffff' },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCircleSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  checkmark: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  pinnedIcon: { fontSize: 10, marginRight: 4 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  chatInfo: { flex: 1, marginLeft: 12 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  chatTime: { fontSize: 12, color: '#9ca3af' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  chatMessage: { fontSize: 14, color: '#6b7280', flex: 1 },
  unreadBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  bottomButton: { paddingHorizontal: 20, paddingVertical: 8 },
  bottomButtonDisabled: { opacity: 0.4 },
  bottomButtonText: { color: '#3b82f6', fontSize: 16, fontWeight: '500' },
  bottomButtonTextDisabled: { color: '#9ca3af' },
  deleteText: { color: '#ef4444' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 16 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 8 },
  // Settings styles
  settingsHeader: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5ea',
  },
  settingsHeaderTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  settingsScroll: { flex: 1, backgroundColor: '#f2f2f7' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: { color: '#fff', fontSize: 24, fontWeight: '600' },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 20, fontWeight: '600', color: '#000' },
  profileBio: { fontSize: 14, color: '#8e8e93', marginTop: 2 },
  chevron: { fontSize: 22, color: '#c7c7cc' },
  settingsSection: { backgroundColor: '#fff', marginBottom: 20 },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  settingsIconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsRowIcon: { fontSize: 16 },
  settingsRowLabel: { flex: 1, fontSize: 16, color: '#000' },
  settingsDivider: { height: 0.5, backgroundColor: '#e5e5ea', marginLeft: 58 },
  settingsFooter: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8e8e93',
    paddingVertical: 20,
  },
});
