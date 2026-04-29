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
import Header from '../../components/Header';

interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isMe: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

// TODO: Replace with real data from API
const EVENT_INFO = {
  title: '',
  participantCount: 0,
};

const PARTICIPANTS: Participant[] = [];
const INITIAL_MESSAGES: Message[] = [];

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#22c55e', '#f97316', '#06b6d4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header showBack />

      {/* Participants Preview */}
      {PARTICIPANTS.length > 0 && (
        <View style={styles.participantsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PARTICIPANTS.map((participant) => (
              <View
                key={participant.id}
                style={[styles.participantAvatar, { backgroundColor: getAvatarColor(participant.name) }]}
              >
                <Text style={styles.participantAvatarText}>{participant.avatar}</Text>
              </View>
            ))}
            {EVENT_INFO.participantCount > PARTICIPANTS.length && (
              <View style={styles.moreParticipants}>
                <Text style={styles.moreParticipantsText}>+{EVENT_INFO.participantCount - PARTICIPANTS.length}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[styles.messageRow, msg.isMe && styles.messageRowMe]}
          >
            {!msg.isMe && (
              <View style={[styles.messageAvatar, { backgroundColor: getAvatarColor(msg.sender) }]}>
                <Text style={styles.messageAvatarText}>{msg.senderAvatar}</Text>
              </View>
            )}
            <View style={[styles.messageBubble, msg.isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
              {!msg.isMe && <Text style={styles.senderName}>{msg.sender}</Text>}
              <Text style={[styles.messageText, msg.isMe && styles.messageTextMe]}>{msg.text}</Text>
              <Text style={[styles.messageTime, msg.isMe && styles.messageTimeMe]}>{msg.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#64748b"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
          onPress={sendMessage}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 28, color: '#fff', marginTop: -2 },
  headerCenter: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  headerSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  infoButton: { padding: 8 },
  infoIcon: { fontSize: 20 },
  participantsBar: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  participantAvatarText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  moreParticipants: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreParticipantsText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageAvatarText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleOther: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
  },
  messageBubbleMe: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: { fontSize: 15, color: '#fff', lineHeight: 20 },
  messageTextMe: { color: '#fff' },
  messageTime: { fontSize: 10, color: '#64748b', marginTop: 4, alignSelf: 'flex-end' },
  messageTimeMe: { color: 'rgba(255,255,255,0.7)' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: { fontSize: 22 },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sendIcon: { fontSize: 18, color: '#fff' },
});
