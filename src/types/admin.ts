/**
 * Admin-specific type definitions
 */

export interface AdminEvent {
  id: number | string;
  title: string;
  event_type?: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  provider_name?: string;
  provider?: {
    id: number;
    name: string;
  };
  views?: number;
  participants?: number;
}

export interface AdminProvider {
  id: number | string;
  name: string;
  website?: string;
  website_url?: string;
  eventsCount?: number;
  event_count?: number;
  created_at?: string;
  [key: string]: any;
}

export interface EventStatus {
  label: string;
  color: string;
}

export type EventType = 'event' | 'recurrent' | 'one_time' | string;
