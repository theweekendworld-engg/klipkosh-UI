import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { GenerateRequest } from '@/lib/types';

export function useGenerate() {
  const { getAuthToken } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: GenerateRequest) => {
      const token = await getAuthToken();
      return api.generate(request, token);
    },
    onSuccess: (data) => {
      toast({
        title: 'Job queued',
        description: `Generation started. Job ID: ${data.job_id}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

