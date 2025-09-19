export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      providers: {
        Row: {
          id: string
          provider_id: string
          name: string
          short_description: string
          website_url: string
          cover_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          name: string
          short_description: string
          website_url: string
          cover_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          name?: string
          short_description?: string
          website_url?: string
          cover_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_categories: {
        Row: {
          id: string
          name: string
          name_translations: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_translations?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_translations?: Json
          created_at?: string
          updated_at?: string
        }
      }
      event: {
        Row: {
          id: string
          provider_id: string
          category_id: string | null
          event_type: 'event' | 'recurrent'
          title: string
          details: Json
          hash: string | null
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          category_id?: string | null
          event_type: 'event' | 'recurrent'
          title: string
          details?: Json
          hash?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          category_id?: string | null
          event_type?: 'event' | 'recurrent'
          title?: string
          details?: Json
          hash?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_metrics: {
        Row: {
          id: string
          event_id: string
          views: number
          shares: number
          potential_participants: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          views?: number
          shares?: number
          potential_participants?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          views?: number
          shares?: number
          potential_participants?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          clerk_id: string
          interest_ids: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          interest_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          interest_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          profile_id: string
          event_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          event_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          event_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
