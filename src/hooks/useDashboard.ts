import { useState, useEffect } from "react";
import { 
  getDashboardStats, 
  getProviderMetrics, 
  getRecentEvents,
  type DashboardStats,
  type ProviderMetrics,
  type RecentEvent 
} from "@/api/dashboard";

interface UseDashboardReturn {
  dashboardStats: DashboardStats | null;
  providerMetrics: ProviderMetrics[];
  recentEvents: RecentEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (selectedTimePeriod: string): UseDashboardReturn => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [providerMetrics, setProviderMetrics] = useState<ProviderMetrics[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, providers, events] = await Promise.all([
        getDashboardStats(),
        getProviderMetrics(),
        getRecentEvents(10)
      ]);

      setDashboardStats(stats);
      setProviderMetrics(providers);
      setRecentEvents(events);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimePeriod]); // Reload when time period changes

  return {
    dashboardStats,
    providerMetrics,
    recentEvents,
    loading,
    error,
    refetch: loadDashboardData,
  };
}; 