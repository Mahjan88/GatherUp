export const EVENT_VISIBILITY = {
  PUBLIC: 'public' as const,
  PRIVATE: 'private' as const,
};

export const EVENT_MEMBER_STATUS = {
  INVITED: 'invited' as const,
  PENDING: 'pending' as const,
  JOINED: 'joined' as const,
  DECLINED: 'declined' as const,
};

export const EVENT_MEMBER_ROLE = {
  HOST: 'host' as const,
  MEMBER: 'member' as const,
};

export const NOTIFICATION_TYPE = {
  EVENT_INVITATION: 'event_invitation' as const,
  JOIN_REQUEST: 'join_request' as const,
  JOIN_APPROVED: 'join_approved' as const,
  JOIN_DECLINED: 'join_declined' as const,
  EVENT_UPDATE: 'event_update' as const,
  NEW_MESSAGE: 'new_message' as const,
  EVENT_REMINDER: 'event_reminder' as const,
};

export const MEDIA_TYPE = {
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
};
