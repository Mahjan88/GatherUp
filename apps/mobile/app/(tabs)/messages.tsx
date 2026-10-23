import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import SlideUpModal from '../../components/SlideUpModal';
import {
  Avatar,
  Chip,
  EmptyState,
  Ionicons,
  IconName,
  SearchBar,
} from '../../components/ui';
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
  GUTTER,
} from '../../theme';

type ChatFilter = 'all' | 'personal' | 'groups' | 'unread' | 'archived';

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  pinned: boolean;
  archived?: boolean;
  avatar: string | null;
  isGroupChat?: boolean;
}

// TODO: Replace with real API data
const INITIAL_CHATS: Chat[] = [];
const GROUP_CHATS: Chat[] = [];

const CONTACTS: {
  id: string;
  name: string;
  status: string;
  avatar: string | null;
}[] = [];

const SWIPE_THRESHOLD = 60;
const AVATAR_SIZE = 48;

/** Compose FAB (pencil) — opens the New Message sheet. */
function ComposeFab({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.fab}
      accessibilityLabel="New message"
    >
      <Ionicons name="create-outline" size={26} color={colors.primaryOn} />
    </TouchableOpacity>
  );
}

function SwipeAction({
  icon,
  color,
  onPress,
  label,
}: {
  icon: IconName;
  color: string;
  onPress: () => void;
  label: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color={colors.primaryOn} />
    </TouchableOpacity>
  );
}

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

  const hasUnread = chat.unread > 0;

  return (
    <View style={styles.swipeContainer}>
      <View style={[styles.actionContainer, styles.pinAction]}>
        <SwipeAction
          icon={chat.pinned ? 'pin' : 'pin-outline'}
          color={colors.primary}
          label={chat.pinned ? 'Unpin' : 'Pin'}
          onPress={() => {
            onPin();
            resetSwipe();
          }}
        />
      </View>

      <View style={[styles.actionContainer, styles.rightActions]}>
        <SwipeAction
          icon="archive-outline"
          color={colors.info}
          label={chat.archived ? 'Unarchive' : 'Archive'}
          onPress={() => {
            onArchive();
            resetSwipe();
          }}
        />
        <SwipeAction
          icon="trash-outline"
          color={colors.danger}
          label="Delete"
          onPress={() => {
            onDelete();
            resetSwipe();
          }}
        />
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
              {isSelected && (
                <Ionicons name="checkmark" size={15} color={colors.primaryOn} />
              )}
            </View>
          )}

          {chat.isGroupChat && !chat.avatar ? (
            <View style={styles.groupAvatar}>
              <Ionicons name="people" size={22} color={colors.primary} />
            </View>
          ) : (
            <Avatar uri={chat.avatar} name={chat.name} size={AVATAR_SIZE} />
          )}

          <View style={styles.chatInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.chatName} numberOfLines={1}>
                {chat.name}
              </Text>
              {chat.pinned && (
                <Ionicons name="pin" size={13} color={colors.textMuted} />
              )}
            </View>
            <Text
              style={[
                styles.chatMessage,
                hasUnread && styles.chatMessageUnread,
              ]}
              numberOfLines={1}
            >
              {chat.message}
            </Text>
          </View>

          <View style={styles.chatRight}>
            <Text
              style={[styles.chatTime, hasUnread && { color: colors.primary }]}
            >
              {chat.time}
            </Text>
            {hasUnread ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {chat.unread > 99 ? '99+' : chat.unread}
                </Text>
              </View>
            ) : (
              <View style={styles.unreadSpacer} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const [personalChats, setPersonalChats] = useState<Chat[]>(INITIAL_CHATS);
  const [groupChats, setGroupChats] = useState<Chat[]>(GROUP_CHATS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCurrentChats = () => {
    const allChats = [...personalChats, ...groupChats];
    switch (chatFilter) {
      case 'personal':
        return allChats.filter((c) => !c.isGroupChat && !c.archived);
      case 'groups':
        return allChats.filter((c) => c.isGroupChat && !c.archived);
      case 'unread':
        return allChats.filter((c) => c.unread > 0 && !c.archived);
      case 'archived':
        return allChats.filter((c) => c.archived);
      default:
        return allChats.filter((c) => !c.archived);
    }
  };

  const sortedChats = [...getCurrentChats()]
    .filter(
      (c) =>
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
  const personalUnreadCount = personalChats.filter(
    (c) => !c.archived && c.unread > 0
  ).length;
  const groupUnreadCount = groupChats.filter(
    (c) => !c.archived && c.unread > 0
  ).length;

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
    if (personalChats.some((c) => c.id === id)) {
      setPersonalChats(
        personalChats.map((c) =>
          c.id === id ? { ...c, pinned: !c.pinned } : c
        )
      );
    } else {
      setGroupChats(
        groupChats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
      );
    }
  };

  const handleArchive = (ids: string[]) => {
    setPersonalChats(
      personalChats.map((c) =>
        ids.includes(c.id) ? { ...c, archived: !c.archived } : c
      )
    );
    setGroupChats(
      groupChats.map((c) =>
        ids.includes(c.id) ? { ...c, archived: !c.archived } : c
      )
    );
    setSelectedChats(new Set());
  };

  const handleDelete = (ids: string[]) => {
    setPersonalChats(personalChats.filter((c) => !ids.includes(c.id)));
    setGroupChats(groupChats.filter((c) => !ids.includes(c.id)));
    setSelectedChats(new Set());
  };

  const handleMarkRead = (id: string) => {
    if (personalChats.some((c) => c.id === id)) {
      setPersonalChats(
        personalChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    } else {
      setGroupChats(
        groupChats.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
    }
  };

  const handleReadAll = () => {
    const currentChats = getCurrentChats();
    const idsToMark =
      selectedChats.size === 0
        ? currentChats.map((c) => c.id)
        : Array.from(selectedChats);

    setPersonalChats(
      personalChats.map((c) =>
        idsToMark.includes(c.id) ? { ...c, unread: 0 } : c
      )
    );
    setGroupChats(
      groupChats.map((c) =>
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

    const existingChat = personalChats.find(
      (chat) => chat.name === contactName
    );

    if (existingChat) {
      // Open existing chat
      router.push(`/chat/${existingChat.id}`);
    } else {
      // Open new DM chat with this contact
      router.push(`/chat/dm-${contactId}`);
    }
  };

  const withCount = (label: string, count: number) =>
    count > 0 ? `${label} · ${count}` : label;

  const filterOptions: { value: ChatFilter; label: string; icon?: IconName }[] =
    [
      { value: 'all', label: 'All' },
      { value: 'personal', label: withCount('Personal', personalUnreadCount) },
      { value: 'groups', label: withCount('Groups', groupUnreadCount) },
      { value: 'archived', label: 'Archived', icon: 'archive-outline' },
    ];

  const noSelection = selectedChats.size === 0;
  const readDisabled = !noSelection && !selectedHaveUnread;

  return (
    <View style={styles.container}>
      <Header
        title="Messages"
        rightElement={
          <TouchableOpacity
            onPress={() => setIsEditMode(!isEditMode)}
            hitSlop={8}
            style={styles.editToggle}
          >
            <Text style={styles.editToggleText}>
              {isEditMode ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        }
      >
        <SearchBar
          placeholder="Search messages"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filterOptions.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              icon={o.icon}
              selected={chatFilter === o.value}
              onPress={() =>
                setChatFilter(
                  o.value === 'archived' && chatFilter === 'archived'
                    ? 'all'
                    : o.value
                )
              }
            />
          ))}
        </ScrollView>
      </Header>

      {/* Chat List */}
      <ScrollView
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          <EmptyState
            icon="chatbubbles-outline"
            title="No messages yet"
            message="Start a conversation with friends or create a group chat"
            actionLabel="New Message"
            onAction={() => setShowNewChatModal(true)}
          />
        )}
      </ScrollView>

      {/* Bottom Action Bar (Edit Mode) */}
      {isEditMode ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.bottomButton, readDisabled && styles.disabled]}
            onPress={handleReadAll}
            disabled={readDisabled}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={readDisabled ? colors.textMuted : colors.primary}
            />
            <Text
              style={[
                styles.bottomButtonText,
                readDisabled && styles.bottomButtonTextDisabled,
              ]}
            >
              {noSelection ? 'Read All' : 'Read'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, noSelection && styles.disabled]}
            onPress={() => handleArchive(Array.from(selectedChats))}
            disabled={noSelection}
          >
            <Ionicons
              name="archive-outline"
              size={20}
              color={noSelection ? colors.textMuted : colors.primary}
            />
            <Text
              style={[
                styles.bottomButtonText,
                noSelection && styles.bottomButtonTextDisabled,
              ]}
            >
              Archive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomButton, noSelection && styles.disabled]}
            onPress={() => handleDelete(Array.from(selectedChats))}
            disabled={noSelection}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={noSelection ? colors.textMuted : colors.danger}
            />
            <Text
              style={[
                styles.bottomButtonText,
                styles.deleteText,
                noSelection && styles.bottomButtonTextDisabled,
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ComposeFab onPress={() => setShowNewChatModal(true)} />
      )}

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
              <Ionicons
                name="people-outline"
                size={22}
                color={colors.primary}
              />
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
              <Ionicons
                name="person-add-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.quickActionText}>New Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Search */}
        <SearchBar
          placeholder="Search contacts"
          value={contactSearchQuery}
          onChangeText={setContactSearchQuery}
          style={styles.modalSearch}
        />

        {/* Contacts List */}
        <Text style={styles.modalSectionTitle}>Contacts</Text>
        <View>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.modalContactItem}
                onPress={() => handleStartChat(contact.id, contact.name)}
                activeOpacity={0.7}
              >
                <Avatar uri={contact.avatar} name={contact.name} size={44} />
                <View style={styles.modalContactInfo}>
                  <Text style={styles.modalContactName} numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <Text style={typography.caption} numberOfLines={1}>
                    {contact.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.modalEmpty}>No contacts found</Text>
          )}
        </View>
      </SlideUpModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  editToggle: { paddingHorizontal: spacing.xs, marginRight: spacing.xs },
  editToggleText: { fontSize: 15, fontWeight: '600', color: colors.link },

  searchBar: { marginHorizontal: GUTTER },
  filterRow: { paddingHorizontal: GUTTER, gap: spacing.sm },

  chatList: { flex: 1 },
  chatListContent: { paddingBottom: 100 },

  swipeContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  pinAction: { left: 0 },
  rightActions: { right: 0 },
  actionButton: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatItemAnimated: {
    backgroundColor: colors.surface,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: GUTTER,
    backgroundColor: colors.surface,
  },
  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 3,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  chatMessage: {
    ...typography.bodySecondary,
  },
  chatMessageUnread: {
    color: colors.text,
  },
  chatRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  chatTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadSpacer: { height: 20 },
  unreadText: { color: colors.primaryOn, fontSize: 11, fontWeight: '700' },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  bottomButton: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  disabled: { opacity: 0.6 },
  bottomButtonText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  bottomButtonTextDisabled: { color: colors.textMuted },
  deleteText: { color: colors.danger },

  fab: {
    position: 'absolute',
    right: GUTTER,
    bottom: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },

  // New Chat Modal Styles
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickActionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    ...typography.label,
  },
  modalSearch: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  modalContactInfo: {
    flex: 1,
  },
  modalContactName: {
    ...typography.body,
    fontWeight: '600',
  },
  modalEmpty: {
    ...typography.bodySecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
