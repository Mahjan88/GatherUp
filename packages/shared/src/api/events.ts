import { getSupabase } from './supabase';
import {
  Event,
  EventInsert,
  EventUpdate,
  EventWithHost,
  EventMemberInsert,
} from '../types';

export async function createEvent(event: EventInsert) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEvent(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      host:users!events_host_id_fkey(*),
      members:event_members(count)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as EventWithHost;
}

export async function updateEvent(id: string, updates: EventUpdate) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) throw error;
}

export async function getEvents(filters?: {
  visibility?: 'public' | 'private';
  startDate?: string;
  endDate?: string;
}) {
  const supabase = getSupabase();
  let query = supabase.from('events').select(
    `
      *,
      host:users!events_host_id_fkey(*),
      members:event_members(count)
    `
  );

  if (filters?.visibility) {
    query = query.eq('visibility', filters.visibility);
  }

  if (filters?.startDate) {
    query = query.gte('start_time', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('start_time', filters.endDate);
  }

  query = query.order('start_time', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  return data as unknown as EventWithHost[];
}

export async function getMyHostedEvents() {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      host:users!events_host_id_fkey(*),
      members:event_members(count)
    `
    )
    .eq('host_id', user.id)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as unknown as EventWithHost[];
}

export async function getMyInvitedEvents() {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('event_members')
    .select(
      `
      *,
      event:events(
        *,
        host:users!events_host_id_fkey(*),
        members:event_members(count)
      )
    `
    )
    .eq('user_id', user.id)
    .in('status', ['invited', 'joined']);

  if (error) throw error;
  return (data as unknown as Array<{ event: unknown }>).map(
    (d) => d.event as EventWithHost
  );
}

export async function inviteToEvent(eventId: string, userId: string) {
  const supabase = getSupabase();
  const member: EventMemberInsert = {
    event_id: eventId,
    user_id: userId,
    status: 'invited',
    role: 'member',
  };

  const { data, error } = await supabase
    .from('event_members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function respondToInvitation(
  eventId: string,
  status: 'joined' | 'declined'
) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('event_members')
    .update({ status })
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function requestToJoinEvent(eventId: string) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const member: EventMemberInsert = {
    event_id: eventId,
    user_id: user.id,
    status: 'pending',
    role: 'member',
  };

  const { data, error } = await supabase
    .from('event_members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveJoinRequest(eventId: string, userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_members')
    .update({ status: 'joined' })
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function declineJoinRequest(eventId: string, userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_members')
    .update({ status: 'declined' })
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
