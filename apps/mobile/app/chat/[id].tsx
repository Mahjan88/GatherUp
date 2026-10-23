import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Avatar, IconButton, Ionicons } from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

interface Reaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isMe: boolean;
  avatarUri?: string | null;
  reactions?: Reaction[];
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

// TODO: Replace with real API data
const EVENT_INFO: {
  title: string;
  participantCount: number;
  thumbnail: string | null;
} = {
  title: '',
  participantCount: 0,
  thumbnail: null,
};

const PARTICIPANTS: Participant[] = [];

// TODO: Load pinned message from API
const PINNED_MESSAGE = null as { sender: string; text: string } | null;

const INITIAL_MESSAGES: Message[] = [];

function ChatHeader({
  title,
  subtitle,
  thumbnail,
  onBack,
  onInfo,
}: {
  title: string;
  subtitle: string;
  thumbnail: string | null;
  onBack: () => void;
  onInfo?: () => void;
}) {
  return (
    <View style={styles.header}>
      <IconButton
        name="chevron-back"
        size={26}
        onPress={onBack}
        accessibilityLabel="Back"
      />
      <Avatar uri={thumbnail} name={title} size={38} />
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={typography.caption} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <IconButton
        name="information-circle-outline"
        size={24}
        onPress={onInfo}
        accessibilityLabel="Chat info"
      />
    </View>
  );
}

function ReactionPills({
  reactions,
  alignRight,
}: {
  reactions: Reaction[];
  alignRight?: boolean;
}) {
  return (
    <View style={[styles.reactionsRow, alignRight && styles.reactionsRowMe]}>
      {reactions.map((r) => (
        <View
          key={r.emoji}
          style={[
            styles.reactionPill,
            r.reactedByMe && styles.reactionPillMine,
          ]}
        >
          <Text style={styles.reactionEmoji}>{r.emoji}</Text>
          <Text
            style={[
              styles.reactionCount,
              r.reactedByMe && { color: colors.primaryDark },
            ]}
          >
            {r.count}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function EventChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'You',
      senderAvatar: 'Y',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const memberCount = Math.max(
    EVENT_INFO.participantCount,
    PARTICIPANTS.length
  );
  const hasText = message.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ChatHeader
        title={EVENT_INFO.title || 'Event Chat'}
        subtitle={`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}
        thumbnail={EVENT_INFO.thumbnail}
        onBack={() => router.back()}
        onInfo={() => {
          // TODO: Open chat / event info for this chat (id param)
        }}
      />

      {/* Pinned message */}
      {PINNED_MESSAGE && (
        <TouchableOpacity style={styles.pinnedBanner} activeOpacity={0.8}>
          <Ionicons name="pin" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pinnedLabel}>Pinned Message</Text>
            <Text style={styles.pinnedText} numberOfLines={1}>
              {PINNED_MESSAGE.sender}: {PINNED_MESSAGE.text}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) =>
          msg.isMe ? (
            <View key={msg.id} style={styles.outgoingRow}>
              <Text style={[styles.messageTime, styles.outgoingTime]}>
                {msg.timestamp}
              </Text>
              <View style={[styles.bubble, styles.bubbleMe]}>
                <Text style={[styles.messageText, styles.messageTextMe]}>
                  {msg.text}
                </Text>
              </View>
              {!!msg.reactions?.length && (
                <ReactionPills reactions={msg.reactions} alignRight />
              )}
            </View>
          ) : (
            <View key={msg.id} style={styles.incomingRow}>
              <Avatar uri={msg.avatarUri} name={msg.sender} size={36} />
              <View style={styles.incomingBody}>
                <View style={styles.metaLine}>
                  <Text style={styles.senderName} numberOfLines={1}>
                    {msg.sender}
                  </Text>
                  <Text style={styles.messageTime}>{msg.timestamp}</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleOther]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
                {!!msg.reactions?.length && (
                  <ReactionPills reactions={msg.reactions} />
                )}
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Composer */}
      <View style={styles.composer}>
        <TouchableOpacity
          style={styles.composerIcon}
          accessibilityLabel="Add attachment"
        >
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Message…"
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity hitSlop={8} accessibilityLabel="Emoji">
            <Ionicons
              name="happy-outline"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {hasText ? (
          <TouchableOpacity
            style={[styles.composerIcon, styles.sendButton]}
            onPress={sendMessage}
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color={colors.primaryOn} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.composerIcon}
            accessibilityLabel="Record voice message"
          >
            <Ionicons
              name="mic-outline"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerCenter: { flex: 1, marginLeft: spacing.xs },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },

  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.md,
    backgroundColor: colors.primarySoft,
  },
  pinnedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pinnedText: { ...typography.bodySecondary, marginTop: 1 },

  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },

  incomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    maxWidth: '85%',
  },
  incomingBody: { flexShrink: 1 },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  senderName: { fontSize: 14, fontWeight: '700', color: colors.text },

  outgoingRow: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  outgoingTime: { marginBottom: spacing.xs },

  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceAlt,
    borderTopLeftRadius: spacing.xs,
    alignSelf: 'flex-start',
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderTopRightRadius: spacing.xs,
  },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 21 },
  messageTextMe: { color: colors.primaryOn },
  messageTime: { fontSize: 12, color: colors.textMuted },

  reactionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  reactionsRowMe: { justifyContent: 'flex-end' },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionPillMine: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  reactionEmoji: { fontSize: 12 },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  composerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 40,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceAlt,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
});
