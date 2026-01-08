'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPrivateMessages,
  sendPrivateMessage,
  subscribeToPrivateMessages,
  getCurrentUser,
  getProfile,
  markPrivateMessagesAsRead,
  useAuth,
} from '@gatherup/shared';

export default function DirectMessagePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [message, setMessage] = useState('');
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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
    let unsubscribe: (() => void) | undefined;

    (async () => {
      unsubscribe = await subscribeToPrivateMessages((newMessage) => {
        if (
          newMessage.sender_id === userId ||
          newMessage.recipient_id === userId
        ) {
          queryClient.invalidateQueries({
            queryKey: ['private-messages', userId],
          });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      });
    })();

    return () => unsubscribe?.();
  }, [userId, queryClient]);

  useEffect(() => {
    // Mark messages as read when opening the chat
    if (userId) {
      markPrivateMessagesAsRead(userId);
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    await sendMessageMutation.mutateAsync({
      sender_id: currentUser.id,
      recipient_id: userId,
      content: message.trim(),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {otherUser && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold">{otherUser.full_name}</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.reverse().map((msg) => {
              const isMyMessage = msg.sender_id === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isMyMessage
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">Send a message to start the conversation</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
