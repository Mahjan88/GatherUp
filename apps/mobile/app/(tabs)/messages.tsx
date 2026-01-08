import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MessagesScreen() {
  const router = useRouter();

  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const getOtherUser = (conversation: any, currentUserId: string) => {
    return conversation.sender_id === currentUserId
      ? conversation.recipient
      : conversation.sender;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {conversations && conversations.length > 0 ? (
          <View className="bg-white">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation, conversation.sender_id);
              return (
                <TouchableOpacity
                  key={conversation.id}
                  className="flex-row items-center px-4 py-3 border-b border-gray-200"
                  onPress={() => {
                    router.push(`/dm/${otherUser.id}`);
                  }}
                >
                  {otherUser.avatar_url ? (
                    <Image
                      source={{ uri: otherUser.avatar_url }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
                      <Text className="text-white text-lg font-semibold">
                        {otherUser.full_name[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-semibold text-base">
                        {otherUser.full_name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(conversation.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        className="text-gray-600 flex-1"
                        numberOfLines={1}
                      >
                        {conversation.content}
                      </Text>
                      {!conversation.read && (
                        <View className="w-2 h-2 rounded-full bg-primary-600 ml-2" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="chatbubbles-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4">
              No messages yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Start a conversation with someone from your events
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
