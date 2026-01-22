import { useState, useEffect, useCallback } from "react";
import { getProviders, ProviderData } from "../services/providers";

export const useProviders = () => {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const providersData = await getProviders(1, 1000);
      // Sort by name
      const sortedProviders = [...providersData].sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );

      setProviders(sortedProviders);
    } catch (err: any) {
      console.error('Error fetching providers:', err);
      const errorMessage = err?.message || 'Failed to fetch providers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProviders = useCallback(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    loading,
    error,
    refreshProviders,
  };
}; 