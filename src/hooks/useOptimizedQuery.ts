
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../stores/appStore';
import { useHealthStore } from '../stores/healthStore';

interface OptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const useOptimizedQuery = <T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus = false,
  onSuccess,
  onError,
}: OptimizedQueryOptions<T>) => {
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  const clearError = useAppStore((state) => state.clearError);
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      setLoading(true);
      clearError();
      try {
        const data = await queryFn();
        onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        onError?.(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled,
    staleTime,
    refetchOnWindowFocus,
    retry: 1,
  });

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const refetchQuery = () => {
    return result.refetch();
  };

  return {
    ...result,
    invalidateQuery,
    refetchQuery,
  };
};
