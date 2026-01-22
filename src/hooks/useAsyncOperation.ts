import { useState, useCallback } from 'react';

export interface AsyncOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UseAsyncOperationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: string) => void;
}

/**
 * Reusable hook for async operations (create, update, delete)
 */
export function useAsyncOperation<T = any>(
  operation: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<AsyncOperationResult<T>> => {
      try {
        setLoading(true);
        setError(null);
        const data = await operation(...args);
        options.onSuccess?.(data);
        return { success: true, data };
      } catch (err: any) {
        const errorMessage = err?.message || 'Operation failed';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [operation, options]
  );

  return {
    execute,
    loading,
    error,
  };
}
