import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import SlideUpModal from '../../components/SlideUpModal';
import { useCenterButton } from '../../contexts/CenterButtonContext';

// Import icons (512px for high-DPI quality)
const ChatIcon = require('../../assets/Icons/chat_icon.png');
const GroupChatIcon = require('../../assets/Icons/group_chat_icon.png');
const PhoneIcon = require('../../assets/Icons/phone_icon.png');
const ContactIcon = require('../../assets/Icons/contact_icon.png');

type SidebarSection = 'personal_chats' | 'event_chats' | 'calls' | 'contacts';

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  pinned: boolean;
  avatar: string | null;
  isEventChat?: boolean;
}

interface SidebarItem {
  id: SidebarSection;
  icon: ImageSourcePropType;
  label: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'personal_chats', icon: ChatIcon, label: 'Personal' },
  { id: 'event_chats', icon: GroupChatIcon, label: 'Event Chats' },
  { id: 'calls', icon: PhoneIcon, label: 'Calls' },
  { id: 'contacts', icon: ContactIcon, label: 'Contacts' },
];

const INITIAL_CHATS: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Hey, are you coming to the event?',
    time: '2:30 PM',
    unread: 2,
    pinned: true,
    avatar: null,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    message: 'The party was amazing! 🎉',
    time: '1:15 PM',
    unread: 0,
    pinned: false,
    avatar: null,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    message: 'Thanks for the invite',
    time: 'Yesterday',
    unread: 0,
    pinned: false,
    avatar: null,
  },
  {
    id: '4',
    name: 'Alex Chen',
    message: 'See you tomorrow!',
    time: 'Yesterday',
    unread: 0,
    pinned: false,
    avatar: null,
  },
];

const EVENT_CHATS: Chat[] = [
  {
    id: 'e1',
    name: 'Neon Nights Festival',
    message: 'Alex: See you all there!',
    time: '12:00 PM',
    unread: 5,
    pinned: false,
    avatar: null,
    isEventChat: true,
  },
  {
    id: 'e2',
    name: 'Beach Party 🏖️',
    message: "You: Can't wait!",
    time: 'Yesterday',
    unread: 0,
    pinned: false,
    avatar: null,
    isEventChat: true,
  },
  {
    id: 'e3',
    name: 'Tech Summit 2026',
    message: 'Host: Doors open at 9 AM',
    time: 'Yesterday',
    unread: 3,
    pinned: false,
    avatar: null,
    isEventChat: true,
  },
];

const CONTACTS = [
  { id: 'c1', name: 'Alex Chen', status: 'Online', avatar: null },
  { id: 'c2', name: 'Sarah Smith', status: 'Last seen 2h ago', avatar: null },
  { id: 'c3', name: 'John Doe', status: 'Last seen yesterday', avatar: null },
  { id: 'c4', name: 'Mike Johnson', status: 'Online', avatar: null },
  { id: 'c5', name: 'Emma Wilson', status: 'Last seen 5h ago', avatar: null },
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
          Animated.spring(translateX, {
            toValue: 60,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -120,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.swipeContainer}>
      <View style={[styles.actionContainer, styles.pinAction]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onPin();
            resetSwipe();
          }}
        >
          <Text style={styles.actionIcon}>{chat.pinned ? '📍' : '📌'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.actionContainer, styles.leftActions]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={() => {
            onArchive();
            resetSwipe();
          }}
        >
          <Text style={styles.actionIcon}>📦</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            onDelete();
            resetSwipe();
          }}
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
            <View
              style={[
                styles.selectCircle,
                isSelected && styles.selectCircleSelected,
              ]}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          )}
          {chat.pinned && <Text style={styles.pinnedIcon}>📌</Text>}
          <View style={[styles.avatar, chat.isEventChat && styles.eventAvatar]}>
            <Text style={styles.avatarText}>
              {chat.isEventChat ? '🎉' : chat.name[0]}
            </Text>
          </View>
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.chatTime}>{chat.time}</Text>
            </View>
            <View style={styles.chatFooter}>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {chat.message}
              </Text>
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
  const { setCustomAction } = useCenterButton();
  const [activeSection, setActiveSection] =
    useState<SidebarSection>('personal_chats');
  const [personalChats, setPersonalChats] = useState<Chat[]>(INITIAL_CHATS);
  const [eventChats, setEventChats] = useState<Chat[]>(EVENT_CHATS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  // Register custom action for center button when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCustomAction(() => setShowNewChatModal(true));
      
      // Cleanup: reset to default when leaving this screen
      return () => {
        setCustomAction(null);
      };
    }, [setCustomAction])
  );

  const totalUnread = personalChats.reduce((sum, chat) => sum + chat.unread, 0);
  const eventUnread = eventChats.reduce((sum, chat) => sum + chat.unread, 0);

  const getCurrentChats = () => {
    if (activeSection === 'personal_chats') return personalChats;
    if (activeSection === 'event_chats') return eventChats;
    return [];
  };

  const sortedChats = [...getCurrentChats()]
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
    if (activeSection === 'personal_chats') {
      setPersonalChats(
        personalChats.map((c) =>
          c.id === id ? { ...c, pinned: !c.pinned } : c
        )
      );
    } else if (activeSection === 'event_chats') {
      setEventChats(
        eventChats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
      );
    }
  };

  const handleArchive = (ids: string[]) => {
    if (activeSection === 'personal_chats') {
      setPersonalChats(personalChats.filter((c) => !ids.includes(c.id)));
    } else if (activeSection === 'event_chats') {
      setEventChats(eventChats.filter((c) => !ids.includes(c.id)));
    }
    setSelectedChats(new Set());
  };

  const handleDelete = (ids: string[]) => {
    if (activeSection === 'personal_chats') {
      setPersonalChats(personalChats.filter((c) => !ids.includes(c.id)));
    } else if (activeSection === 'event_chats') {
      setEventChats(eventChats.filter((c) => !ids.includes(c.id)));
    }
    setSelectedChats(new Set());
  };

  const handleMarkRead = (id: string) => {
    if (activeSection === 'personal_chats') {
      setPersonalChats(
        personalChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    } else if (activeSection === 'event_chats') {
      setEventChats(
        eventChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    }
  };

  const handleReadAll = () => {
    const currentChats = getCurrentChats();
    const setCurrentChats =
      activeSection === 'personal_chats' ? setPersonalChats : setEventChats;
    if (selectedChats.size === 0) {
      setCurrentChats(currentChats.map((c) => ({ ...c, unread: 0 })));
    } else {
      setCurrentChats(
        currentChats.map((c) =>
          selectedChats.has(c.id) ? { ...c, unread: 0 } : c
        )
      );
    }
  };

  const selectedHaveUnread = Array.from(selectedChats).some(
    (id) => (getCurrentChats().find((c) => c.id === id)?.unread ?? 0) > 0
  );

  const filteredContacts = CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  const handleStartChat = (contactId: string) => {
    setShowNewChatModal(false);
    setContactSearchQuery('');
    router.push(`/chat/${contactId}`);
  };

  const renderChats = () => (
    <View style={styles.content}>
      {/* Content Header */}
      <View style={styles.contentHeader}>
        <TouchableOpacity
          onPress={() => setIsEditMode(!isEditMode)}
          style={{ width: 50 }}
        >
          <Text style={styles.headerButton}>
            {isEditMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.contentTitle}>
          {activeSection === 'personal_chats' ? 'Personal' : 'Group Chats'}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
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
        <View style={styles.listPadding} />
      </ScrollView>

      {/* Bottom Action Bar (Edit Mode) */}
      {isEditMode && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              selectedChats.size > 0 &&
                !selectedHaveUnread &&
                styles.bottomButtonDisabled,
            ]}
            onPress={handleReadAll}
            disabled={selectedChats.size > 0 && !selectedHaveUnread}
          >
            <Text
              style={[
                styles.bottomButtonText,
                selectedChats.size > 0 &&
                  !selectedHaveUnread &&
                  styles.bottomButtonTextDisabled,
              ]}
            >
              {selectedChats.size === 0 ? 'Read All' : 'Read'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              selectedChats.size === 0 && styles.bottomButtonDisabled,
            ]}
            onPress={() => handleArchive(Array.from(selectedChats))}
            disabled={selectedChats.size === 0}
          >
            <Text
              style={[
                styles.bottomButtonText,
                selectedChats.size === 0 && styles.bottomButtonTextDisabled,
              ]}
            >
              Archive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              selectedChats.size === 0 && styles.bottomButtonDisabled,
            ]}
            onPress={() => handleDelete(Array.from(selectedChats))}
            disabled={selectedChats.size === 0}
          >
            <Text
              style={[
                styles.bottomButtonText,
                styles.deleteText,
                selectedChats.size === 0 && styles.bottomButtonTextDisabled,
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderCalls = () => (
    <View style={styles.content}>
      <View style={styles.contentHeader}>
        <View style={{ width: 50 }} />
        <Text style={styles.contentTitle}>Calls</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📞</Text>
        <Text style={styles.emptyTitle}>No Calls Yet</Text>
        <Text style={styles.emptyText}>Your call history will appear here</Text>
      </View>
    </View>
  );

  const renderContacts = () => (
    <View style={styles.content}>
      <View style={styles.contentHeader}>
        <View style={{ width: 50 }} />
        <Text style={styles.contentTitle}>Contacts</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#64748b"
        />
      </View>

      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {CONTACTS.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => router.push(`/contact/${contact.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contact.name[0]}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactStatus}>{contact.status}</Text>
            </View>
            <TouchableOpacity style={styles.contactAction}>
              <Image
                source={ChatIcon}
                style={styles.contactActionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <View style={styles.listPadding} />
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal_chats':
      case 'event_chats':
        return renderChats();
      case 'calls':
        return renderCalls();
      case 'contacts':
        return renderContacts();
      default:
        return renderChats();
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Messages" />

      {/* Main Content with Sidebar */}
      <View style={styles.mainContent}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {SIDEBAR_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sidebarItem,
                activeSection === item.id && styles.sidebarItemActive,
              ]}
              onPress={() => {
                setActiveSection(item.id);
                setIsEditMode(false);
                setSelectedChats(new Set());
                setSearchQuery('');
              }}
            >
              <View style={styles.sidebarIconContainer}>
                <Image
                  source={item.icon}
                  style={[
                    item.id === 'personal_chats'
                      ? styles.sidebarIconChat
                      : styles.sidebarIcon,
                    activeSection === item.id && styles.sidebarIconActive,
                  ]}
                  resizeMode="contain"
                />
                {item.id === 'personal_chats' && totalUnread > 0 && (
                  <View style={styles.sidebarBadge}>
                    <Text style={styles.sidebarBadgeText}>
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </Text>
                  </View>
                )}
                {item.id === 'event_chats' && eventUnread > 0 && (
                  <View style={styles.sidebarBadge}>
                    <Text style={styles.sidebarBadgeText}>
                      {eventUnread > 99 ? '99+' : eventUnread}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.sidebarLabel,
                  activeSection === item.id && styles.sidebarLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Area */}
        {renderContent()}
      </View>

      {/* New Chat Modal */}
      <SlideUpModal
        visible={showNewChatModal}
        onClose={() => {
          setShowNewChatModal(false);
          setContactSearchQuery('');
        }}
        title="New Message"
        minHeight={0.7}
        maxHeight={0.9}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => {
              setShowNewChatModal(false);
              // Navigate to create group
            }}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>👥</Text>
            </View>
            <Text style={styles.quickActionText}>New Group</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => {
              setShowNewChatModal(false);
              // Navigate to add contact
            }}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>➕</Text>
            </View>
            <Text style={styles.quickActionText}>New Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.modalDivider} />

        {/* Contact Search */}
        <View style={styles.modalSearchContainer}>
          <Text style={styles.modalSearchIcon}>🔍</Text>
          <TextInput
            style={styles.modalSearchInput}
            placeholder="Search contacts"
            placeholderTextColor="#64748b"
            value={contactSearchQuery}
            onChangeText={setContactSearchQuery}
          />
        </View>

        {/* Contacts List */}
        <Text style={styles.modalSectionTitle}>Contacts</Text>
        <ScrollView 
          style={styles.modalContactsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.modalContactItem}
              onPress={() => handleStartChat(contact.id)}
            >
              <View style={styles.modalContactAvatar}>
                <Text style={styles.modalContactAvatarText}>{contact.name[0]}</Text>
              </View>
              <View style={styles.modalContactInfo}>
                <Text style={styles.modalContactName}>{contact.name}</Text>
                <Text style={styles.modalContactStatus}>{contact.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SlideUpModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#fff' },
  mainContent: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 80,
    backgroundColor: '#1e293b',
    paddingTop: 12,
    alignItems: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: '100%',
  },
  sidebarItemActive: {
    backgroundColor: '#334155',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  sidebarIconContainer: { position: 'relative', marginBottom: 6 },
  sidebarIcon: {
    width: 26,
    height: 26,
    opacity: 0.6,
  },
  sidebarIconChat: {
    width: 35,
    height: 35,
    opacity: 0.6,
  },
  sidebarIconActive: {
    opacity: 1,
    width: 40,
    height: 40,
    tintColor: '#14b8a6',
  },
  sidebarBadge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  sidebarBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sidebarLabel: { fontSize: 10, color: '#94a3b8', textAlign: 'center' },
  sidebarLabelActive: { color: '#ffffff', fontWeight: '600' },
  content: { flex: 1, backgroundColor: '#0f172a' },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  contentTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  headerButton: { color: '#3b82f6', fontSize: 16, fontWeight: '500' },
  composeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeIcon: { fontSize: 16 },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: { fontSize: 24, color: '#fff', marginTop: -2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  chatList: { flex: 1 },
  swipeContainer: { position: 'relative', overflow: 'hidden' },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinAction: { left: 0, backgroundColor: '#3b82f6' },
  leftActions: { right: 0 },
  actionButton: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveButton: { backgroundColor: '#8b5cf6' },
  deleteButton: { backgroundColor: '#ef4444' },
  actionIcon: { fontSize: 20 },
  chatItemAnimated: { backgroundColor: '#0f172a' },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCircleSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  checkmark: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  pinnedIcon: { fontSize: 12, marginRight: 6 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventAvatar: { backgroundColor: '#f97316' },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  chatInfo: { flex: 1, marginLeft: 12 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  chatTime: { fontSize: 12, color: '#64748b' },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  chatMessage: { fontSize: 14, color: '#94a3b8', flex: 1 },
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
  listPadding: { height: 20 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  bottomButton: { paddingHorizontal: 16, paddingVertical: 8 },
  bottomButtonDisabled: { opacity: 0.4 },
  bottomButtonText: { color: '#3b82f6', fontSize: 15, fontWeight: '500' },
  bottomButtonTextDisabled: { color: '#64748b' },
  deleteText: { color: '#ef4444' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginTop: 16 },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  contactStatus: { fontSize: 13, color: '#64748b', marginTop: 2 },
  contactAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactActionIcon: {
    width: 22,
    height: 22,
  },
  // New Chat Modal Styles
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalContactsList: {
    flex: 1,
  },
  modalContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalContactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContactAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  modalContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalContactStatus: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
});
