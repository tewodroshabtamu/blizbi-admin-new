import { supabase } from "@/supabase-client";

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
  id: string;
  name: string;
  totalEvents: number;
  activeEvents: number;
  recentEvents: Array<{
    id: string;
    title: string;
    start_date: string;
    category?: string;
  }>;
}

export interface RecentEvent {
  id: string;
  title: string;
  provider_name: string;
  start_date: string;
  category?: string;
}

// Get dashboard overview statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total counts in parallel
    const [usersResult, eventsResult, providersResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('event').select('*', { count: 'exact', head: true }),
      supabase.from('providers').select('*', { count: 'exact', head: true })
    ]);

    const totalUsers = usersResult.count || 0;
    const totalEvents = eventsResult.count || 0;
    const totalProviders = providersResult.count || 0;

    // Get event metrics for monthly views (if available)
    const { data: metricsData } = await supabase
      .from('event_metrics')
      .select('views')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());
    
    const monthlyViews = metricsData?.reduce((sum, metric) => sum + (metric.views || 0), 0) || 0;

    return {
      totalUsers,
      totalEvents,
      totalProviders,
      monthlyViews,
      // For now, we'll calculate changes later when we have historical data
      userChange: "+12.5%",
      eventChange: "+8.2%", 
      viewChange: "-2.4%"
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get provider metrics
export const getProviderMetrics = async (): Promise<ProviderMetrics[]> => {
  try {
    // Get all providers
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('id, name')
      .order('created_at', { ascending: false });

    if (providersError) throw providersError;

    if (!providers) return [];

    // Get metrics for each provider
    const providerMetrics = await Promise.all(
      providers.map(async (provider) => {
        // Get total events for this provider
        const { count: totalEvents } = await supabase
          .from('event')
          .select('*', { count: 'exact', head: true })
          .eq('provider_id', provider.id);

        // Get active events (future events)
        const { count: activeEvents } = await supabase
          .from('event')
          .select('*', { count: 'exact', head: true })
          .eq('provider_id', provider.id)
          .gte('start_date', new Date().toISOString().split('T')[0]);

        // Get recent events
        const { data: recentEvents } = await supabase
          .from('event')
          .select('id, title, start_date, details')
          .eq('provider_id', provider.id)
          .order('created_at', { ascending: false })
          .limit(3);

        return {
          id: provider.id,
          name: provider.name,
          totalEvents: totalEvents || 0,
          activeEvents: activeEvents || 0,
          recentEvents: (recentEvents || []).map(event => ({
            id: event.id,
            title: event.title,
            start_date: event.start_date,
            category: event.details?.category
          }))
        };
      })
    );

    return providerMetrics;
  } catch (error) {
    console.error('Error fetching provider metrics:', error);
    throw error;
  }
};

// Get recent events across all providers
export const getRecentEvents = async (limit: number = 10): Promise<RecentEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('event')
      .select(`
        id,
        title,
        start_date,
        details,
        providers!provider_id (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      start_date: event.start_date,
      provider_name: Array.isArray(event.providers) ? event.providers[0]?.name : event.providers?.name || 'Unknown',
      category: event.details?.category
    }));
  } catch (error) {
    console.error('Error fetching recent events:', error);
    throw error;
  }
}; 