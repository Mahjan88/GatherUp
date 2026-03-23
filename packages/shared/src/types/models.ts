import { Database } from './database';

export type User = Database['public']['Tables']['users']['Row'];
export type EventRow = Database['public']['Tables']['events']['Row'];
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

export type EventPrivacy = 'public' | 'private' | 'invite-only';
export type GuestListVisibility = 'everyone' | 'attendees' | 'hidden';
export type RsvpOption = 'three-way' | 'two-way';
export type ChatPermission = 'hosts' | 'attendees';
export type MediaPermission = 'hosts' | 'attendees' | 'everyone';
export type UploadPermission = 'attendees' | 'hosts';
export type FeedbackVisibility = 'public' | 'attendees_only' | 'host_only';
export type EventCategory = 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
export type TicketType = 'free' | 'paid';
export type RsvpStatus = 'none' | 'interested' | 'going';

export interface Person {
  id: string;
  name: string;
  avatar?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  icon: string;
}

export interface Event {
  id: string;
  
  // Event Basics
  title: string;
  description: string | null;
  coverImage: string | null;
  galleryForAttendeesOnly: boolean;
  
  // When & Where
  startDate: Date;
  endDate: Date | null;
  address: string | null;
  locationCoords: LocationCoords | null;
  showAddressToInvitees: boolean;
  
  // Host & Co-hosts
  hostId: string;
  hostName: string;
  hostAvatar: string | null;
  coHosts: Person[];
  
  // Guests & Privacy
  eventPrivacy: EventPrivacy;
  invitedPeople: Person[];
  allowInviteOthers: boolean;
  guestListVisibility: GuestListVisibility;
  rsvpRequired: boolean;
  capacityLimit: number | null;
  rsvpOption: RsvpOption;
  rsvpDeadline: Date | null;
  
  // Chat & Sharing
  chatEnabled: boolean;
  whoCanChat: ChatPermission;
  whoCanPostMedia: MediaPermission;
  whoCanUpload: UploadPermission;
  
  // Notifications & Reminders
  reminder24h: boolean;
  reminder1h: boolean;
  
  // Advanced Settings
  category: EventCategory;
  hasAgenda: boolean;
  agendaItems: AgendaItem[];
  whatToBring: string | null;
  dressCode: string | null;
  accessibilityNotes: string | null;
  ageRestriction: string | null;
  ticketType: TicketType;
  ticketPrice: number | null;
  cancellationPolicy: string | null;
  
  // Reviews & Feedback
  feedbackEnabled: boolean;
  feedbackVisibility: FeedbackVisibility;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Computed/Display properties
  isPast?: boolean;
  isPending?: boolean;
  userRsvpStatus?: RsvpStatus;
  attendees?: Person[];
  memberCount?: number;
}

export interface EventCardData {
  id: string;
  title: string;
  image: string;
  date: Date;
  location: string;
  hostName: string;
  hostAvatar?: string;
  rsvpStatus: RsvpStatus;
  isPending?: boolean;
  isPast?: boolean;
  attendees?: Person[];
}

export const eventToCardData = (event: Event, userRsvpStatus?: RsvpStatus): EventCardData => ({
  id: event.id,
  title: event.title,
  image: event.coverImage || '',
  date: event.startDate,
  location: event.address || '',
  hostName: event.hostName,
  hostAvatar: event.hostAvatar || undefined,
  rsvpStatus: userRsvpStatus || event.userRsvpStatus || 'none',
  isPending: event.isPending,
  isPast: event.isPast,
  attendees: event.attendees,
});
export type MediaType = 'image' | 'video';

export interface EventWithHost extends EventRow {
  host: User;
  member_count?: number;
}

export interface EventWithMembers extends EventRow {
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
