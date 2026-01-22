import { apiClient } from '../lib/api-client';
import { PaginatedResponse } from '../types/api';

export interface EventData {
  id: number;
  type: string;
  title: string;
  description: string;
  language?: string;
  start_date?: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cover_url?: string | null;
  is_free?: boolean;
  price?: string | null;
  provider: number; // Backend returns number
  provider_id: number; // Duplicate field from backend
  location: number; // Backend returns number
  location_id?: number;
  currency?: number;
  details?: any;
  created_at?: string;
  updated_at?: string;
  // Recurring event fields
  recurring_type?: string | null;
  recurring_days?: any[];
  recurring_start_date?: string | null;
  recurring_end_date?: string | null;
  recurring_start_time?: string | null;
  recurring_end_time?: string | null;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  page_size?: number;
}

export interface SearchResult {
  events: EventData[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  page_size: number;
}

/**
 * Search/List events with filters and pagination
 */
export const searchEvents = async (
  filters: SearchFilters = {}
): Promise<SearchResult> => {
  try {
    const params: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 25,
    };

    // Add search query if provided
    if (filters.query) {
      params.search = filters.query;
    }

    // Add date filters if provided
    if (filters.dateFrom) {
      params.start_date_after = filters.dateFrom;
    }
    if (filters.dateTo) {
      params.start_date_before = filters.dateTo;
    }

    const response = await apiClient.get<PaginatedResponse<EventData>>('/events/', params);

    return {
      events: response.data || [],
      totalCount: response.pagination.total,
      hasMore: response.pagination.next !== null && response.pagination.next !== undefined,
      page: response.pagination.page,
      page_size: response.pagination.page_size,
    };
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (id: string | number): Promise<EventData> => {
  try {
    return await apiClient.get<EventData>(`/events/${id}/`);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData: Partial<EventData>): Promise<EventData> => {
  try {
    return await apiClient.post<EventData>('/events/', eventData);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (
  id: string | number,
  eventData: Partial<EventData>
): Promise<EventData> => {
  try {
    return await apiClient.patch<EventData>(`/events/${id}/`, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/events/${id}/`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Get popular/featured events
 */
export const getPopularEvents = async (limit: number = 8): Promise<EventData[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<EventData>>('/events/', {
      page_size: limit,
      ordering: '-created_at', // Most recent first
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching popular events:', error);
    throw error;
  }
};

/**
 * Get event categories
 * Note: This might need a custom endpoint or be derived from events
 */
export const getEventCategories = async (): Promise<string[]> => {
  try {
    // TODO: Replace with actual API endpoint when available
    // For now, return static categories
    return [
      'All',
      'Music',
      'Food & Drink',
      'Arts',
      'Sports',
      'Technology',
      'Business',
      'Lifestyle',
      'Education',
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All'];
  }
};
