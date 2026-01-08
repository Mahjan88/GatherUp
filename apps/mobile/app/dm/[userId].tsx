import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPrivateMessages,
  sendPrivateMessage,
  subscribeToPrivateMessages,
  getCurrentUser,
  getProfile,
  markPrivateMessagesAsRead,
} from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';

export default function DirectMessageScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id || null));
  }, []);

  const { data: otherUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getProfile(userId),
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ['private-messages', userId],
    queryFn: () => getPrivateMessages(userId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendPrivateMessage,
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['private-messages', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToPrivateMessages((newMessage) => {
      if (
        newMessage.sender_id === userId ||
        newMessage.recipient_id === userId
      ) {
        queryClient.invalidateQueries({ queryKey: ['private-messages', userId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, queryClient]);

  useEffect(() => {
    // Mark messages as read when opening the chat
    if (userId) {
      markPrivateMessagesAsRead(userId);
    }
  }, [userId]);

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return;

    await sendMessageMutation.mutateAsync({
      sender_id: currentUserId,
      recipient_id: userId,
      content: message.trim(),
    });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.sender_id === currentUserId;

    return (
      <View className={`mb-4 ${isMyMessage ? 'items-end' : 'items-start'}`}>
        <View
          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
            isMyMessage ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <Text className={isMyMessage ? 'text-white' : 'text-gray-900'}>
            {item.content}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1 px-2">
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {otherUser && (
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <Text className="text-lg font-semibold">{otherUser.full_name}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages?.reverse()}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4 py-2"
        inverted
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View className="flex-row items-center p-4 border-t border-gray-200">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          className="w-10 h-10 bg-primary-600 rounded-full items-center justify-center"
          onPress={handleSend}
          disabled={!message.trim() || sendMessageMutation.isPending}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
