import { getSupabase } from './supabase';
import {
  EventMessage,
  EventMessageInsert,
  EventMessageWithSender,
  PrivateMessage,
  PrivateMessageInsert,
  PrivateMessageWithSender,
} from '../types';

// Event Messages
export async function sendEventMessage(message: EventMessageInsert) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_message')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEventMessages(eventId: string, limit = 50) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_message')
    .select(
      `
      *,
      sender:users!event_message_sender_id_fkey(*)
    `
    )
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as EventMessageWithSender[];
}

export async function subscribeToEventMessages(
  eventId: string,
  callback: (message: EventMessage) => void
) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`event_messages:${eventId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'event_message',
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        callback(payload.new as EventMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Private Messages
export async function sendPrivateMessage(message: PrivateMessageInsert) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('private_message')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPrivateMessages(otherUserId: string, limit = 50) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('private_message')
    .select(
      `
      *,
      sender:users!private_message_sender_id_fkey(*),
      recipient:users!private_message_recipient_id_fkey(*)
    `
    )
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as PrivateMessageWithSender[];
}

export async function getConversations() {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Get latest message for each conversation
  const { data, error } = await supabase
    .from('private_message')
    .select(
      `
      *,
      sender:users!private_message_sender_id_fkey(*),
      recipient:users!private_message_recipient_id_fkey(*)
    `
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Group by conversation and get latest message
  const conversationsMap = new Map<string, PrivateMessageWithSender>();
  data.forEach((msg) => {
    const otherUserId =
      msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, msg as PrivateMessageWithSender);
    }
  });

  return Array.from(conversationsMap.values());
}

export async function markPrivateMessagesAsRead(otherUserId: string) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('private_message')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('recipient_id', user.id)
    .eq('read', false);

  if (error) throw error;
}

export async function subscribeToPrivateMessages(
  callback: (message: PrivateMessage) => void
) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const channel = supabase
    .channel('private_message')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'private_message',
        filter: `recipient_id=eq.${user.id}`,
      },
      (payload) => {
        callback(payload.new as PrivateMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
