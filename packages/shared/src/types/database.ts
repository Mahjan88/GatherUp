export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          location: string | null;
          location_coords: Json | null;
          visibility: 'public' | 'private' | 'invite_only';
          public_fields: Json | null;
          requires_approval: boolean;
          cover_image_url: string | null;
          address: string | null;
          city_region: string | null;
          category:
            | 'networking'
            | 'party'
            | 'workshop'
            | 'conference'
            | 'social'
            | 'sports'
            | 'other';
          gallery_for_attendees_only: boolean;
          show_address_to_invitees: boolean;
          allow_invite_others: boolean;
          guest_list_visibility: 'everyone' | 'attendees' | 'hidden';
          rsvp_required: boolean;
          capacity_limit: number | null;
          rsvp_option: 'three-way' | 'two-way';
          rsvp_deadline: string | null;
          chat_enabled: boolean;
          who_can_chat: 'hosts' | 'attendees';
          who_can_post_media: 'hosts' | 'attendees' | 'everyone';
          who_can_upload: 'attendees' | 'hosts';
          reminder_24h: boolean;
          reminder_1h: boolean;
          has_agenda: boolean;
          agenda_items: Json;
          what_to_bring: string | null;
          dress_code: string | null;
          accessibility_notes: string | null;
          age_restriction: string | null;
          ticket_type: 'free' | 'paid';
          ticket_price: number | null;
          cancellation_policy: string | null;
          feedback_enabled: boolean;
          feedback_visibility: 'public' | 'attendees_only' | 'host_only';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          location?: string | null;
          location_coords?: Json | null;
          visibility?: 'public' | 'private' | 'invite_only';
          public_fields?: Json | null;
          requires_approval?: boolean;
          cover_image_url?: string | null;
          address?: string | null;
          city_region?: string | null;
          category?:
            | 'networking'
            | 'party'
            | 'workshop'
            | 'conference'
            | 'social'
            | 'sports'
            | 'other';
          gallery_for_attendees_only?: boolean;
          show_address_to_invitees?: boolean;
          allow_invite_others?: boolean;
          guest_list_visibility?: 'everyone' | 'attendees' | 'hidden';
          rsvp_required?: boolean;
          capacity_limit?: number | null;
          rsvp_option?: 'three-way' | 'two-way';
          rsvp_deadline?: string | null;
          chat_enabled?: boolean;
          who_can_chat?: 'hosts' | 'attendees';
          who_can_post_media?: 'hosts' | 'attendees' | 'everyone';
          who_can_upload?: 'attendees' | 'hosts';
          reminder_24h?: boolean;
          reminder_1h?: boolean;
          has_agenda?: boolean;
          agenda_items?: Json;
          what_to_bring?: string | null;
          dress_code?: string | null;
          accessibility_notes?: string | null;
          age_restriction?: string | null;
          ticket_type?: 'free' | 'paid';
          ticket_price?: number | null;
          cancellation_policy?: string | null;
          feedback_enabled?: boolean;
          feedback_visibility?: 'public' | 'attendees_only' | 'host_only';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          location?: string | null;
          location_coords?: Json | null;
          visibility?: 'public' | 'private' | 'invite_only';
          public_fields?: Json | null;
          requires_approval?: boolean;
          cover_image_url?: string | null;
          address?: string | null;
          city_region?: string | null;
          category?:
            | 'networking'
            | 'party'
            | 'workshop'
            | 'conference'
            | 'social'
            | 'sports'
            | 'other';
          gallery_for_attendees_only?: boolean;
          show_address_to_invitees?: boolean;
          allow_invite_others?: boolean;
          guest_list_visibility?: 'everyone' | 'attendees' | 'hidden';
          rsvp_required?: boolean;
          capacity_limit?: number | null;
          rsvp_option?: 'three-way' | 'two-way';
          rsvp_deadline?: string | null;
          chat_enabled?: boolean;
          who_can_chat?: 'hosts' | 'attendees';
          who_can_post_media?: 'hosts' | 'attendees' | 'everyone';
          who_can_upload?: 'attendees' | 'hosts';
          reminder_24h?: boolean;
          reminder_1h?: boolean;
          has_agenda?: boolean;
          agenda_items?: Json;
          what_to_bring?: string | null;
          dress_code?: string | null;
          accessibility_notes?: string | null;
          age_restriction?: string | null;
          ticket_type?: 'free' | 'paid';
          ticket_price?: number | null;
          cancellation_policy?: string | null;
          feedback_enabled?: boolean;
          feedback_visibility?: 'public' | 'attendees_only' | 'host_only';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'events_host_id_fkey';
            columns: ['host_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_members: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'invited' | 'pending' | 'joined' | 'declined';
          role: 'host' | 'cohost' | 'member';
          joined_at: string;
          updated_at: string;
          rsvp_status: 'none' | 'interested' | 'going';
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined';
          role?: 'host' | 'cohost' | 'member';
          joined_at?: string;
          updated_at?: string;
          rsvp_status?: 'none' | 'interested' | 'going';
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined';
          role?: 'host' | 'cohost' | 'member';
          joined_at?: string;
          updated_at?: string;
          rsvp_status?: 'none' | 'interested' | 'going';
        };
        Relationships: [
          {
            foreignKeyName: 'event_members_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_messages: {
        Row: {
          id: string;
          event_id: string;
          sender_id: string;
          content: string;
          attachments: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          sender_id: string;
          content: string;
          attachments?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          sender_id?: string;
          content?: string;
          attachments?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_messages_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      private_messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'private_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'private_messages_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_media: {
        Row: {
          id: string;
          event_id: string;
          uploader_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          uploader_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          uploader_id?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_media_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_media_uploader_id_fkey';
            columns: ['uploader_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          data: Json;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          data: Json;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
