import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';

export function useUsageStats() {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['usage', 'stats'],
    queryFn: async () => {
      const token = await getAuthToken();
      return api.getUsageStats(token || undefined);
    },
    enabled: false, // Disabled - not calling usage API
    refetchInterval: false, // No automatic refetching
  });
}

