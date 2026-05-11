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
          first_name: string;
          last_name: string | null;
          username: string | null;
          tagline: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          is_verified: boolean;
          user_data: Json;
          privacy_settings: Json;
          created_at: string;
          updated_at: string;
          last_active_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          first_name: string;
          last_name?: string | null;
          username?: string | null;
          tagline?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          is_verified?: boolean;
          user_data?: Json;
          privacy_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          first_name?: string;
          last_name?: string | null;
          username?: string | null;
          tagline?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          is_verified?: boolean;
          user_data?: Json;
          privacy_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string | null;
          description: string | null;
          category: string | null;
          cover_image_url: string | null;
          city: string | null;
          visibility: 'public' | 'private';
          is_discoverable: boolean;
          member_count: number;
          settings: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug?: string | null;
          description?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          city?: string | null;
          visibility?: 'public' | 'private';
          is_discoverable?: boolean;
          member_count?: number;
          settings?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string | null;
          description?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          city?: string | null;
          visibility?: 'public' | 'private';
          is_discoverable?: boolean;
          member_count?: number;
          settings?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'communities_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          status: 'active' | 'pending' | 'banned' | 'left' | 'removed';
          invited_by: string | null;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          status?: 'active' | 'pending' | 'banned' | 'left' | 'removed';
          invited_by?: string | null;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          status?: 'active' | 'pending' | 'banned' | 'left' | 'removed';
          invited_by?: string | null;
          joined_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'community_members_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_members_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_series: {
        Row: {
          id: string;
          organizer_type: 'user' | 'community';
          host_id: string;
          community_id: string | null;
          title: string;
          slug: string | null;
          description: string | null;
          cover_image_url: string | null;
          category: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          visibility: 'public' | 'private';
          recurrence_hint: 'weekly' | 'biweekly' | 'monthly' | 'custom' | null;
          settings: Json;
          subscriber_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organizer_type?: 'user' | 'community';
          host_id: string;
          community_id?: string | null;
          title: string;
          slug?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          category?: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          visibility?: 'public' | 'private';
          recurrence_hint?: 'weekly' | 'biweekly' | 'monthly' | 'custom' | null;
          settings?: Json;
          subscriber_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organizer_type?: 'user' | 'community';
          host_id?: string;
          community_id?: string | null;
          title?: string;
          slug?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          category?: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          visibility?: 'public' | 'private';
          recurrence_hint?: 'weekly' | 'biweekly' | 'monthly' | 'custom' | null;
          settings?: Json;
          subscriber_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_series_host_id_fkey';
            columns: ['host_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_series_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          }
        ];
      };
      event_series_subscriptions: {
        Row: {
          id: string;
          series_id: string;
          user_id: string;
          notify: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          series_id: string;
          user_id: string;
          notify?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          series_id?: string;
          user_id?: string;
          notify?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_series_subscriptions_series_id_fkey';
            columns: ['series_id'];
            isOneToOne: false;
            referencedRelation: 'event_series';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_series_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      community_follows: {
        Row: {
          follower_id: string;
          community_id: string;
          notify: boolean;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          community_id: string;
          notify?: boolean;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          community_id?: string;
          notify?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'community_follows_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_follows_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: {
          id: string;
          host_id: string;
          community_id: string | null;
          series_id: string | null;
          organizer_type: 'user' | 'community';
          title: string;
          tagline: string | null;
          description: string | null;
          start_time: string;
          end_time: string | null;
          timezone: string;
          status: 'draft' | 'published' | 'cancelled' | 'completed';
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          address: string | null;
          city_region: string | null;
          is_online: boolean;
          virtual_link: string | null;
          visibility: 'public' | 'private' | 'invite_only';
          category: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          cover_image_url: string | null;
          capacity_limit: number | null;
          settings: Json;
          published_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          community_id?: string | null;
          series_id?: string | null;
          organizer_type?: 'user' | 'community';
          title: string;
          tagline?: string | null;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          timezone?: string;
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address?: string | null;
          city_region?: string | null;
          is_online?: boolean;
          virtual_link?: string | null;
          visibility?: 'public' | 'private' | 'invite_only';
          category?: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          cover_image_url?: string | null;
          capacity_limit?: number | null;
          settings?: Json;
          published_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          community_id?: string | null;
          series_id?: string | null;
          organizer_type?: 'user' | 'community';
          title?: string;
          tagline?: string | null;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          timezone?: string;
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address?: string | null;
          city_region?: string | null;
          is_online?: boolean;
          virtual_link?: string | null;
          visibility?: 'public' | 'private' | 'invite_only';
          category?: 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
          cover_image_url?: string | null;
          capacity_limit?: number | null;
          settings?: Json;
          published_at?: string | null;
          deleted_at?: string | null;
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
          },
          {
            foreignKeyName: 'events_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_series_id_fkey';
            columns: ['series_id'];
            isOneToOne: false;
            referencedRelation: 'event_series';
            referencedColumns: ['id'];
          }
        ];
      };
      event_members: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'invited' | 'pending' | 'joined' | 'declined' | 'removed';
          role: 'host' | 'cohost' | 'member';
          rsvp_status: 'none' | 'interested' | 'going';
          invited_by: string | null;
          last_read_message_id: string | null;
          muted_until: string | null;
          rsvp_at: string | null;
          checked_in_at: string | null;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined' | 'removed';
          role?: 'host' | 'cohost' | 'member';
          rsvp_status?: 'none' | 'interested' | 'going';
          invited_by?: string | null;
          last_read_message_id?: string | null;
          muted_until?: string | null;
          rsvp_at?: string | null;
          checked_in_at?: string | null;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined' | 'removed';
          role?: 'host' | 'cohost' | 'member';
          rsvp_status?: 'none' | 'interested' | 'going';
          invited_by?: string | null;
          last_read_message_id?: string | null;
          muted_until?: string | null;
          rsvp_at?: string | null;
          checked_in_at?: string | null;
          joined_at?: string;
          updated_at?: string;
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
          },
          {
            foreignKeyName: 'event_members_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_message: {
        Row: {
          id: string;
          event_id: string;
          sender_id: string;
          message_type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
          content: string | null;
          attachments: Json | null;
          reply_to_message_id: string | null;
          edited_at: string | null;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          sender_id: string;
          message_type?: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
          content?: string | null;
          attachments?: Json | null;
          reply_to_message_id?: string | null;
          edited_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          sender_id?: string;
          message_type?: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
          content?: string | null;
          attachments?: Json | null;
          reply_to_message_id?: string | null;
          edited_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_message_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_message_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      private_message: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          message_type: 'text' | 'image' | 'video' | 'file' | 'voice';
          content: string | null;
          attachments: Json | null;
          reply_to_message_id: string | null;
          read: boolean;
          edited_at: string | null;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          message_type?: 'text' | 'image' | 'video' | 'file' | 'voice';
          content?: string | null;
          attachments?: Json | null;
          reply_to_message_id?: string | null;
          read?: boolean;
          edited_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          message_type?: 'text' | 'image' | 'video' | 'file' | 'voice';
          content?: string | null;
          attachments?: Json | null;
          reply_to_message_id?: string | null;
          read?: boolean;
          edited_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'private_message_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'private_message_recipient_id_fkey';
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
          caption: string | null;
          thumbnail_url: string | null;
          metadata: Json;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          uploader_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          caption?: string | null;
          thumbnail_url?: string | null;
          metadata?: Json;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          uploader_id?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          caption?: string | null;
          thumbnail_url?: string | null;
          metadata?: Json;
          created_at?: string;
          deleted_at?: string | null;
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
      event_review: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_review_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_review_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      message_reaction: {
        Row: {
          id: string;
          message_id: string;
          message_type: 'event' | 'private';
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          message_type: 'event' | 'private';
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          message_type?: 'event' | 'private';
          user_id?: string;
          emoji?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'message_reaction_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      notification: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string | null;
          type: string;
          entity_type: string | null;
          entity_id: string | null;
          data: Json;
          read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          actor_id?: string | null;
          type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          data?: Json;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          actor_id?: string | null;
          type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          data?: Json;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notification_actor_id_fkey';
            columns: ['actor_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_follows_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_follows_following_id_fkey';
            columns: ['following_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      event_invitations: {
        Row: {
          id: string;
          event_id: string;
          invited_user_id: string | null;
          invited_email: string | null;
          invited_phone: string | null;
          invited_by: string;
          status: 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';
          token: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          invited_user_id?: string | null;
          invited_email?: string | null;
          invited_phone?: string | null;
          invited_by: string;
          status?: 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';
          token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          invited_user_id?: string | null;
          invited_email?: string | null;
          invited_phone?: string | null;
          invited_by?: string;
          status?: 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';
          token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_invitations_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_invitations_invited_user_id_fkey';
            columns: ['invited_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_invitations_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      saved_events: {
        Row: {
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_events_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      blocked_users: {
        Row: {
          blocker_id: string;
          blocked_user_id: string;
          created_at: string;
        };
        Insert: {
          blocker_id: string;
          blocked_user_id: string;
          created_at?: string;
        };
        Update: {
          blocker_id?: string;
          blocked_user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blocked_users_blocker_id_fkey';
            columns: ['blocker_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blocked_users_blocked_user_id_fkey';
            columns: ['blocked_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: 'user' | 'event' | 'community' | 'message' | 'media';
          target_id: string;
          reason: string;
          details: string | null;
          status: 'open' | 'reviewed' | 'dismissed' | 'action_taken';
          reviewed_by: string | null;
          created_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: 'user' | 'event' | 'community' | 'message' | 'media';
          target_id: string;
          reason: string;
          details?: string | null;
          status?: 'open' | 'reviewed' | 'dismissed' | 'action_taken';
          reviewed_by?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: 'user' | 'event' | 'community' | 'message' | 'media';
          target_id?: string;
          reason?: string;
          details?: string | null;
          status?: 'open' | 'reviewed' | 'dismissed' | 'action_taken';
          reviewed_by?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_log_actor_id_fkey';
            columns: ['actor_id'];
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
