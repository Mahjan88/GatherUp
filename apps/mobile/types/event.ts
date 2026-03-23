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

export interface LocationCoords {
  latitude: number;
  longitude: number;
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
