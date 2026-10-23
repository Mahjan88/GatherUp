import { Database } from './database.js';

// --- Row types (direct DB rows) ---
export type User = Database['public']['Tables']['users']['Row'];
export type Community = Database['public']['Tables']['communities']['Row'];
export type CommunityMember = Database['public']['Tables']['community_members']['Row'];
export type EventRow = Database['public']['Tables']['events']['Row'];
export type EventMember = Database['public']['Tables']['event_members']['Row'];
export type EventMessage = Database['public']['Tables']['event_message']['Row'];
export type PrivateMessage =
  Database['public']['Tables']['private_message']['Row'];
export type EventMedia = Database['public']['Tables']['event_media']['Row'];
export type EventReview = Database['public']['Tables']['event_review']['Row'];
export type MessageReaction = Database['public']['Tables']['message_reaction']['Row'];
export type Notification = Database['public']['Tables']['notification']['Row'];
export type UserFollow = Database['public']['Tables']['user_follows']['Row'];
export type EventSeriesRow = Database['public']['Tables']['event_series']['Row'];
export type EventSeriesSubscription = Database['public']['Tables']['event_series_subscriptions']['Row'];
export type CommunityFollow = Database['public']['Tables']['community_follows']['Row'];
export type EventInvitationRow = Database['public']['Tables']['event_invitations']['Row'];
export type SavedEventRow = Database['public']['Tables']['saved_events']['Row'];
export type BlockedUserRow = Database['public']['Tables']['blocked_users']['Row'];
export type ReportRow = Database['public']['Tables']['reports']['Row'];
export type AuditLogRow = Database['public']['Tables']['audit_log']['Row'];

// --- Insert types ---
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type EventMemberInsert =
  Database['public']['Tables']['event_members']['Insert'];
export type EventMemberUpdate =
  Database['public']['Tables']['event_members']['Update'];

export type EventMessageInsert =
  Database['public']['Tables']['event_message']['Insert'];

export type PrivateMessageInsert =
  Database['public']['Tables']['private_message']['Insert'];

export type EventMediaInsert =
  Database['public']['Tables']['event_media']['Insert'];

export type NotificationInsert =
  Database['public']['Tables']['notification']['Insert'];

export type CommunityInsert = Database['public']['Tables']['communities']['Insert'];
export type CommunityUpdate = Database['public']['Tables']['communities']['Update'];

export type CommunityMemberInsert = Database['public']['Tables']['community_members']['Insert'];
export type CommunityMemberUpdate = Database['public']['Tables']['community_members']['Update'];

export type EventReviewInsert = Database['public']['Tables']['event_review']['Insert'];
export type EventReviewUpdate = Database['public']['Tables']['event_review']['Update'];

export type MessageReactionInsert = Database['public']['Tables']['message_reaction']['Insert'];

export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type UserFollowInsert = Database['public']['Tables']['user_follows']['Insert'];

export type EventSeriesInsert = Database['public']['Tables']['event_series']['Insert'];
export type EventSeriesUpdate = Database['public']['Tables']['event_series']['Update'];
export type EventSeriesSubscriptionInsert = Database['public']['Tables']['event_series_subscriptions']['Insert'];
export type CommunityFollowInsert = Database['public']['Tables']['community_follows']['Insert'];

export type EventInvitationInsert = Database['public']['Tables']['event_invitations']['Insert'];
export type EventInvitationUpdate = Database['public']['Tables']['event_invitations']['Update'];
export type SavedEventInsert = Database['public']['Tables']['saved_events']['Insert'];
export type BlockedUserInsert = Database['public']['Tables']['blocked_users']['Insert'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];
export type AuditLogInsert = Database['public']['Tables']['audit_log']['Insert'];

// --- Interfaces & enums ---

export interface UserData {
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  website_url?: string;
  preferred_language?: string;
  timezone?: string;
  interests?: string[];
  [key: string]: unknown;
}

export interface PublicFields {
  title?: boolean;
  description?: boolean;
  location?: boolean;
  guestList?: boolean;
  chat?: boolean;
  gallery?: boolean;
}

export type EventVisibility = 'public' | 'private' | 'invite_only';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventMemberStatus = 'invited' | 'pending' | 'joined' | 'declined' | 'removed';
export type EventMemberRole = 'host' | 'cohost' | 'member';
export type CommunityVisibility = 'public' | 'private';
export type CommunityMemberRole = 'owner' | 'admin' | 'member';
export type CommunityMemberStatus = 'active' | 'pending' | 'banned' | 'left' | 'removed';
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
export type ReactionMessageType = 'event' | 'private';

export type OrganizerType = 'user' | 'community';
export type RecurrenceHint = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type EventPrivacy = 'public' | 'private' | 'invite-only';
export type GuestListVisibility = 'everyone' | 'attendees' | 'hidden';
export type RsvpOption = 'three-way' | 'two-way';
export type ChatPermission = 'hosts' | 'attendees';
export type MediaPermission = 'hosts' | 'attendees' | 'everyone';
export type UploadPermission = 'attendees' | 'hosts';
export type FeedbackVisibility = 'public' | 'attendees_only' | 'host_only';
export type EventCategory = 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
export type EventInvitationStatus = 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';
export type ReportTargetType = 'user' | 'event' | 'community' | 'message' | 'media';
export type ReportStatus = 'open' | 'reviewed' | 'dismissed' | 'action_taken';
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

export interface EventSettings {
  publicFields?: Record<string, boolean> | null;
  requiresApproval?: boolean;
  galleryForAttendeesOnly?: boolean;
  showAddressToInvitees?: boolean;
  allowInviteOthers?: boolean;
  guestListVisibility?: GuestListVisibility;
  rsvpRequired?: boolean;
  rsvpOption?: RsvpOption;
  rsvpDeadline?: Date | null;
  chatEnabled?: boolean;
  whoCanChat?: ChatPermission;
  whoCanPostMedia?: MediaPermission;
  whoCanUpload?: UploadPermission;
  reminder24h?: boolean;
  reminder1h?: boolean;
  hasAgenda?: boolean;
  agendaItems?: AgendaItem[];
  whatToBring?: string | null;
  dressCode?: string | null;
  accessibilityNotes?: string | null;
  ageRestriction?: string | null;
  ticketType?: TicketType;
  ticketPrice?: number | null;
  cancellationPolicy?: string | null;
  feedbackEnabled?: boolean;
  feedbackVisibility?: FeedbackVisibility;
}

export interface Event {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  coverImage: string | null;
  startDate: Date;
  endDate: Date | null;
  timezone: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isOnline: boolean;
  virtualLink: string | null;
  hostId: string;
  hostName: string;
  hostAvatar: string | null;
  communityId: string | null;
  seriesId: string | null;
  organizerType: OrganizerType;
  coHosts: Person[];
  eventPrivacy: EventPrivacy;
  status: EventStatus;
  invitedPeople: Person[];
  category: EventCategory;
  capacityLimit: number | null;
  settings: EventSettings;
  publishedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
  organizerType?: OrganizerType;
  communityName?: string;
  communityAvatar?: string;
  seriesName?: string;
  seriesPending?: boolean;
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

// --- Composed types (joins) ---

export interface EventWithHost extends EventRow {
  host: User;
  member_count?: number;
  /** Joined when organizer_type = 'community'. */
  community?: Pick<Community, 'id' | 'name'> | null;
  /** Joined when the event belongs to a series. */
  series?: Pick<EventSeriesRow, 'id' | 'title'> | null;
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

export interface CommunityWithOwner extends Community {
  owner: User;
}

export interface CommunityWithMembers extends Community {
  owner: User;
  members: (CommunityMember & { user: User })[];
}

export interface EventReviewWithUser extends EventReview {
  user: User;
}

export interface EventSeriesWithHost extends EventSeriesRow {
  host: User;
  community?: Community | null;
}

export interface NotificationData {
  event_id?: string;
  event_title?: string;
  sender_id?: string;
  sender_name?: string;
  message?: string;
  community_id?: string;
  community_name?: string;
}

export type NotificationType =
  | 'event_invitation'
  | 'join_request'
  | 'join_approved'
  | 'join_declined'
  | 'event_update'
  | 'new_message'
  | 'event_reminder'
  | 'community_invitation'
  | 'new_review'
  | 'new_series_event'
  | 'new_follower'
  | 'community_new_follower';
