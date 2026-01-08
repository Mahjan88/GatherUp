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
          visibility: 'public' | 'private';
          public_fields: Json | null;
          requires_approval: boolean;
          cover_image_url: string | null;
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
          visibility?: 'public' | 'private';
          public_fields?: Json | null;
          requires_approval?: boolean;
          cover_image_url?: string | null;
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
          visibility?: 'public' | 'private';
          public_fields?: Json | null;
          requires_approval?: boolean;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_members: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'invited' | 'pending' | 'joined' | 'declined';
          role: 'host' | 'member';
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined';
          role?: 'host' | 'member';
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: 'invited' | 'pending' | 'joined' | 'declined';
          role?: 'host' | 'member';
          joined_at?: string;
          updated_at?: string;
        };
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
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
