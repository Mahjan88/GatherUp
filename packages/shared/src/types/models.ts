import { Database } from './database';

export type User = Database['public']['Tables']['users']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventMember = Database['public']['Tables']['event_members']['Row'];
export type EventMessage = Database['public']['Tables']['event_messages']['Row'];
export type PrivateMessage =
  Database['public']['Tables']['private_messages']['Row'];
export type EventMedia = Database['public']['Tables']['event_media']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type EventMemberInsert =
  Database['public']['Tables']['event_members']['Insert'];
export type EventMemberUpdate =
  Database['public']['Tables']['event_members']['Update'];

export type EventMessageInsert =
  Database['public']['Tables']['event_messages']['Insert'];

export type PrivateMessageInsert =
  Database['public']['Tables']['private_messages']['Insert'];

export type EventMediaInsert =
  Database['public']['Tables']['event_media']['Insert'];

export type NotificationInsert =
  Database['public']['Tables']['notifications']['Insert'];

export type UserUpdate = Database['public']['Tables']['users']['Update'];

export interface PublicFields {
  title?: boolean;
  description?: boolean;
  location?: boolean;
  guestList?: boolean;
  chat?: boolean;
  gallery?: boolean;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export type EventVisibility = 'public' | 'private';
export type EventMemberStatus = 'invited' | 'pending' | 'joined' | 'declined';
export type EventMemberRole = 'host' | 'member';
export type MediaType = 'image' | 'video';

export interface EventWithHost extends Event {
  host: User;
  member_count?: number;
}

export interface EventWithMembers extends Event {
  host: User;
  members: (EventMember & { user: User })[];
}

export interface EventMessageWithSender extends EventMessage {
  sender: User;
}

export interface PrivateMessageWithSender extends PrivateMessage {
  sender: User;
  recipient: User;
}

export interface NotificationData {
  event_id?: string;
  event_title?: string;
  sender_id?: string;
  sender_name?: string;
  message?: string;
}

export type NotificationType =
  | 'event_invitation'
  | 'join_request'
  | 'join_approved'
  | 'join_declined'
  | 'event_update'
  | 'new_message'
  | 'event_reminder';
