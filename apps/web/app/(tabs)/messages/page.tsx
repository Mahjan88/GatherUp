'use client';

import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@gatherup/shared';
import { useAuth } from '@gatherup/shared';

export default function MessagesPage() {
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const getOtherUser = (conversation: any) => {
    return conversation.sender_id === user?.id
      ? conversation.recipient
      : conversation.sender;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : conversations && conversations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            return (
              <button
                key={conversation.id}
                onClick={() => window.location.href = `/dm/${otherUser.id}`}
                className="w-full flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                {otherUser.avatar_url ? (
                  <img
                    src={otherUser.avatar_url}
                    alt={otherUser.first_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {otherUser.first_name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 ml-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-base">
                      {otherUser.first_name}{otherUser.last_name ? ` ${otherUser.last_name}` : ''}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-600 flex-1 truncate">
                      {conversation.content}
                    </p>
                    {!conversation.read && (
                      <div className="w-2 h-2 rounded-full bg-primary-600 ml-2" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No messages yet</p>
          <p className="text-gray-400 mt-2">
            Start a conversation with someone from your events
          </p>
        </div>
      )}
    </div>
  );
}
