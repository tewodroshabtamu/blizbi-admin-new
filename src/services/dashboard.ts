import { apiClient } from '../lib/api-client';
import { PaginatedResponse } from '../types/api';
import { EventData } from './events';
import { ProviderData } from './providers';

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalProviders: number;
  monthlyViews: number;
  userChange?: string;
  eventChange?: string;
  viewChange?: string;
}

export interface ProviderMetrics {
  id: number;
  name: string;
  totalEvents: number;
  activeEvents: number;
  recentEvents: Array<{
    id: number;
    title: string;
    start_date: string;
    category?: string;
  }>;
}

export interface RecentEvent {
  id: number;
  title: string;
  provider_name: string;
  start_date: string;
  category?: string;
}

/**
 * Get dashboard overview statistics
 * Note: This aggregates data from multiple endpoints
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch events and providers in parallel
    const [eventsResponse, providersResponse] = await Promise.all([
      apiClient.get<PaginatedResponse<any>>('/events/', { page_size: 1 }),
      apiClient.get<PaginatedResponse<any>>('/providers/', { page_size: 1 }),
    ]);

    const totalEvents = eventsResponse.pagination?.total || 0;
    const totalProviders = providersResponse.pagination?.total || 0;

    // TODO: Get actual user count and monthly views from backend
    // For now, using placeholder values
    return {
      totalUsers: 0, // TODO: Add user count endpoint
      totalEvents,
      totalProviders,
      monthlyViews: 0, // TODO: Add analytics endpoint
      userChange: '+12.5%',
      eventChange: '+8.2%',
      viewChange: '-2.4%',
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get provider metrics
 */
export const getProviderMetrics = async (): Promise<ProviderMetrics[]> => {
  try {
    // Get all providers
    const providersResponse = await apiClient.get<PaginatedResponse<ProviderData>>('/providers/', {
      page_size: 50,
    });

    const providers = providersResponse.data || [];

    // For each provider, get their events
    const providerMetrics = await Promise.all(
      providers.map(async (provider) => {
        try {
          // Get events for this provider
          const eventsResponse = await apiClient.get<PaginatedResponse<EventData>>(
            '/events/',
            {
              provider_id: provider.id,
              page_size: 3,
            }
          );

          const allEvents = eventsResponse.data || [];
          const totalEvents = eventsResponse.pagination?.total || 0;

          // Count active events (future events)
          const now = new Date().toISOString();
          const activeEvents = allEvents.filter((e) => e.start_date && e.start_date >= now).length;

          return {
            id: provider.id,
            name: provider.name,
            totalEvents,
            activeEvents,
            recentEvents: allEvents
              .filter((event) => event.start_date) // Only include events with start_date
              .slice(0, 3)
              .map((event) => ({
                id: event.id,
                title: event.title,
                start_date: event.start_date!, // Safe to use ! after filter
                category: undefined, // TODO: Add category support
              })),
          };
        } catch (error) {
          return {
            id: provider.id,
            name: provider.name,
            totalEvents: 0,
            activeEvents: 0,
            recentEvents: [],
          };
        }
      })
    );

    return providerMetrics;
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent events across all providers
 */
export const getRecentEvents = async (limit: number = 10): Promise<RecentEvent[]> => {
  try {
    // Fetch events and providers in parallel
    const [eventsResponse, providersResponse] = await Promise.all([
      apiClient.get<PaginatedResponse<EventData>>('/events/', {
        page_size: limit,
        ordering: '-created_at', // Most recent first
      }),
      apiClient.get<PaginatedResponse<ProviderData>>('/providers/', {
        page_size: 100, // Get enough providers to match
      }),
    ]);

    const events = eventsResponse.data || [];
    const providers = providersResponse.data || [];

    // Create a map of provider_id -> provider name for quick lookup
    const providerMap = new Map<number, string>();
    providers.forEach((provider) => {
      providerMap.set(provider.id, provider.name);
    });

    return events.map((event) => {
      // Backend returns provider as a number (provider_id)
      const providerId = typeof event.provider === 'number' 
        ? event.provider 
        : event.provider_id;
      
      const providerName = providerId 
        ? providerMap.get(providerId) || `Provider ${providerId}`
        : 'Unknown';

      // Handle title which can be string or object with 'en' property
      const eventTitle = typeof event.title === 'string' 
        ? event.title 
        : (typeof event.title === 'object' && event.title !== null && 'en' in event.title
          ? (event.title as { en: string }).en 
          : 'Untitled Event');

      return {
        id: event.id,
        title: eventTitle,
        start_date: event.start_date || '',
        provider_name: providerName,
        category: undefined, // TODO: Add category support
      };
    });
  } catch (error) {
    throw error;
  }
};