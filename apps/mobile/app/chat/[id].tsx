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
  getEventMessages,
  sendEventMessage,
  subscribeToEventMessages,
  getCurrentUser,
} from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';

export default function EventChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id || null));
  }, []);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['event-messages', id],
    queryFn: () => getEventMessages(id),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendEventMessage,
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['event-messages', id] });
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToEventMessages(id, (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ['event-messages', id] });
    });

    return () => {
      unsubscribe();
    };
  }, [id, queryClient]);

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return;

    await sendMessageMutation.mutateAsync({
      event_id: id,
      sender_id: currentUserId,
      content: message.trim(),
    });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.sender_id === currentUserId;

    return (
      <View
        className={`mb-4 ${isMyMessage ? 'items-end' : 'items-start'}`}
      >
        {!isMyMessage && (
          <Text className="text-xs text-gray-600 mb-1 px-2">
            {item.sender?.full_name}
          </Text>
        )}
        <View
          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
            isMyMessage
              ? 'bg-primary-600'
              : 'bg-gray-200'
          }`}
        >
          <Text
            className={isMyMessage ? 'text-white' : 'text-gray-900'}
          >
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
