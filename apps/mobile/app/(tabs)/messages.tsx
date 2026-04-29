import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import SlideUpModal from '../../components/SlideUpModal';
import { useCenterButton } from '../../contexts/CenterButtonContext';

// Import icons
const EditIcon = require('../../assets/Icons/edit_icon.png');
const SearchIcon = require('../../assets/Icons/search_icon.png');
const ArchiveIcon = require('../../assets/Icons/archive_icon.png');
const DoneIcon = require('../../assets/Icons/done_icon.png');

type ChatFilter = 'all' | 'personal' | 'event' | 'unread' | 'archived';

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  pinned: boolean;
  archived?: boolean;
  avatar: string | null;
  isEventChat?: boolean;
}


// TODO: Replace with real data from API
const INITIAL_CHATS: Chat[] = [];
const EVENT_CHATS: Chat[] = [];

const CONTACTS: { id: string; name: string; status: string; avatar: string | null }[] = [];

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
              {chat.isEventChat ? '🎉' : (() => {
                const parts = chat.name.split(' ');
                if (parts.length >= 2) {
                  return parts[0][0] + parts[1][0];
                }
                return chat.name.substring(0, 2);
              })()}
            </Text>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {chat.message}
            </Text>
          </View>
          <View style={styles.chatRight}>
            {chat.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{chat.unread}</Text>
              </View>
            )}
            <Text style={styles.chatTime}>{chat.time}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { setCustomAction } = useCenterButton();
  const [personalChats, setPersonalChats] = useState<Chat[]>(INITIAL_CHATS);
  const [eventChats, setEventChats] = useState<Chat[]>(EVENT_CHATS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getCurrentChats = () => {
    const allChats = [...personalChats, ...eventChats];
    
    switch (chatFilter) {
      case 'personal':
        return allChats.filter((c) => !c.isEventChat && !c.archived);
      case 'event':
        return allChats.filter((c) => c.isEventChat && !c.archived);
      case 'unread':
        return allChats.filter((c) => c.unread > 0 && !c.archived);
      case 'archived':
        return allChats.filter((c) => c.archived);
      default:
        return allChats.filter((c) => !c.archived);
    }
  };

  const sortedChats = [...getCurrentChats()]
    .filter((c) => 
      searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  // Calculate unread counts
  const personalUnreadCount = personalChats.filter(c => !c.archived && c.unread > 0).length;
  const eventUnreadCount = eventChats.filter(c => !c.archived && c.unread > 0).length;
  const totalUnreadCount = personalUnreadCount + eventUnreadCount;

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
    // Check if it's in personal chats
    if (personalChats.some((c) => c.id === id)) {
      setPersonalChats(
        personalChats.map((c) =>
          c.id === id ? { ...c, pinned: !c.pinned } : c
        )
      );
    } else {
      setEventChats(
        eventChats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
      );
    }
  };

  const handleArchive = (ids: string[]) => {
    // Mark chats as archived instead of deleting
    setPersonalChats(
      personalChats.map((c) =>
        ids.includes(c.id) ? { ...c, archived: !c.archived } : c
      )
    );
    setEventChats(
      eventChats.map((c) =>
        ids.includes(c.id) ? { ...c, archived: !c.archived } : c
      )
    );
    setSelectedChats(new Set());
  };

  const handleDelete = (ids: string[]) => {
    setPersonalChats(personalChats.filter((c) => !ids.includes(c.id)));
    setEventChats(eventChats.filter((c) => !ids.includes(c.id)));
    setSelectedChats(new Set());
  };

  const handleMarkRead = (id: string) => {
    // Check if it's in personal chats
    if (personalChats.some((c) => c.id === id)) {
      setPersonalChats(
        personalChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    } else {
      setEventChats(
        eventChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    }
  };

  const handleReadAll = () => {
    const currentChats = getCurrentChats();
    const idsToMark = selectedChats.size === 0 
      ? currentChats.map((c) => c.id) 
      : Array.from(selectedChats);
    
    setPersonalChats(
      personalChats.map((c) =>
        idsToMark.includes(c.id) ? { ...c, unread: 0 } : c
      )
    );
    setEventChats(
      eventChats.map((c) =>
        idsToMark.includes(c.id) ? { ...c, unread: 0 } : c
      )
    );
  };

  const selectedHaveUnread = Array.from(selectedChats).some(
    (id) => (getCurrentChats().find((c) => c.id === id)?.unread ?? 0) > 0
  );

  const filteredContacts = CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  const handleStartChat = (contactId: string, contactName: string) => {
    setShowNewChatModal(false);
    setContactSearchQuery('');
    
    // Find existing personal chat with this contact (not event/group chat)
    const existingChat = personalChats.find(
      (chat) => !chat.isEventChat && chat.name === contactName
    );
    
    if (existingChat) {
      // Open existing chat
      router.push(`/chat/${existingChat.id}`);
    } else {
      // Open new DM chat with this contact
      router.push(`/chat/dm-${contactId}`);
    }
  };

  const renderChats = () => (
    <View style={styles.content}>
      {/* Content Header */}
      <View style={styles.contentHeader}>
        {/* Left - Edit Button */}
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => setIsEditMode(!isEditMode)}
        >
          <Image 
            source={isEditMode ? DoneIcon : EditIcon} 
            style={styles.headerIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>

        {/* Right - Search & Archive */}
        {!isEditMode && (
          <View style={styles.headerRightSection}>
            {isSearchMode && (
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#64748b"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
            )}
            <View style={styles.iconsWrapper}>
              <TouchableOpacity
                style={styles.wrapperIconButton}
                onPress={() => {
                  setIsSearchMode(!isSearchMode);
                  if (isSearchMode) {
                    setSearchQuery('');
                  }
                }}
              >
                <Image
                  source={SearchIcon}
                  style={[
                    styles.wrapperIcon,
                    isSearchMode && styles.wrapperIconActive
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.iconDivider} />
              <TouchableOpacity
                style={styles.wrapperIconButton}
                onPress={() => setChatFilter(chatFilter === 'archived' ? 'all' : 'archived')}
              >
                <Image
                  source={ArchiveIcon}
                  style={[
                    styles.wrapperIcon,
                    chatFilter === 'archived' && styles.wrapperIconActive
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        <View style={styles.filterTabsWrapper}>
          <TouchableOpacity
            style={[styles.filterTab, chatFilter === 'all' && styles.filterTabActive]}
            onPress={() => setChatFilter('all')}
          >
            <Text style={[styles.filterTabText, chatFilter === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, chatFilter === 'personal' && styles.filterTabActive]}
            onPress={() => setChatFilter('personal')}
          >
            <Text style={[styles.filterTabText, chatFilter === 'personal' && styles.filterTabTextActive]}>
              Personal
            </Text>
            {personalUnreadCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{personalUnreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, chatFilter === 'event' && styles.filterTabActive]}
            onPress={() => setChatFilter('event')}
          >
            <Text style={[styles.filterTabText, chatFilter === 'event' && styles.filterTabTextActive]}>
              Groups
            </Text>
            {eventUnreadCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{eventUnreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {sortedChats.length > 0 ? (
          sortedChats.map((chat) => (
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>Start a conversation with friends or join an event chat</Text>
          </View>
        )}
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

  return (
    <View style={styles.container}>
      <Header title="Messages" />

      {/* Main Content */}
      {renderChats()}

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
              onPress={() => handleStartChat(contact.id, contact.name)}
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
  headerIconButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButtonActive: {
    backgroundColor: '#14b8a6',
  },
  headerIcon: {
    width: 30,
    height: 30,
    tintColor: '#14b8a6',
  },
  headerIconActive: {
    tintColor: '#fff',
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 25,
    paddingHorizontal: 8
  },
  wrapperIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperIcon: {
    width: 28,
    height: 28,
    tintColor: '#14b8a6',
  },
  wrapperIconActive: {
    tintColor: '#fff',
  },
  iconDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  searchInputContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 150,
  },
  searchInput: {
    color: '#fff',
    fontSize: 14,
  },
  filterTabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#334155',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
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
  chatList: { 
    flex: 1,
    paddingHorizontal: 12,
  },
  swipeContainer: { 
    position: 'relative', 
    overflow: 'hidden',
    marginBottom: 10,
    borderRadius: 16,
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinAction: { left: 0, backgroundColor: '#3b82f6', borderRadius: 16 },
  leftActions: { right: 0 },
  actionButton: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveButton: { backgroundColor: '#8b5cf6' },
  deleteButton: { backgroundColor: '#ef4444', borderTopRightRadius: 16, borderBottomRightRadius: 16 },
  actionIcon: { fontSize: 20 },
  chatItemAnimated: { 
    backgroundColor: '#1e293b',
    borderRadius: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventAvatar: { backgroundColor: '#000000' },
  avatarText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  chatInfo: { 
    flex: 1, 
    marginLeft: 12,
    justifyContent: 'center',
  },
  chatName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#fff',
    marginBottom: 4,
  },
  chatMessage: { 
    fontSize: 14, 
    color: '#94a3b8',
  },
  chatRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
  },
  chatTime: { 
    fontSize: 12, 
    color: '#64748b',
    marginTop: 6,
  },
  unreadBadge: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
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
