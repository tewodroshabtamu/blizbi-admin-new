import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase-client";
import { Database } from "../types/supabase";

type Provider = Database['public']['Tables']['providers']['Row'];

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: providersData, error: fetchError } = await supabase
        .from('providers')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      setProviders(providersData || []);
    } catch (err) {
      console.error('Error fetching providers:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch providers';
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