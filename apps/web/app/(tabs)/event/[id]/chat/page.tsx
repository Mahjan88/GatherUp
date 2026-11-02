'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvent,
  getEventMessages,
  sendEventMessage,
  subscribeToEventMessages,
  useAuth,
} from '@gatherup/shared';

export default function EventChatPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [message, setMessage] = useState('');
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ['event-messages', eventId],
    queryFn: () => getEventMessages(eventId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendEventMessage,
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['event-messages', eventId] });
    },
    onError: () => {
      alert('Only members who joined this event can send messages.');
    },
  });

  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;

    const setupSubscription = async () => {
      unsubscribeFn = await subscribeToEventMessages(eventId, () => {
        queryClient.invalidateQueries({
          queryKey: ['event-messages', eventId],
        });
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [eventId, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    sendMessageMutation.mutate({
      event_id: eventId,
      sender_id: currentUser.id,
      content: message.trim(),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {event && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold">{event.title}</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {[...messages].reverse().map((msg) => {
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
                    {!isMyMessage && msg.sender && (
                      <p className="text-xs font-semibold mb-1">
                        {msg.sender.first_name}
                      </p>
                    )}
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.created_at &&
                        new Date(msg.created_at).toLocaleTimeString([], {
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
            <p className="text-gray-400 text-sm mt-2">
              Say hi to everyone going to this event
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 px-6 py-4 bg-white"
      >
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
