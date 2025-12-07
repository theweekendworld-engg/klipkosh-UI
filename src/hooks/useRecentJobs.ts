import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';

export function useRecentJobs() {
  const { getAuthToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['jobs', 'recent'],
    queryFn: async () => {
      const token = await getAuthToken();
      return api.getRecentJobs(token || undefined);
    },
    enabled: isSignedIn,
  });
}

