import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { ApiError } from '@/lib/apiError';
import type { GenerateRequest } from '@/lib/types';

export function useGenerate() {
  const { getAuthToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const errorMessage = error.message.toLowerCase();
      
      if (error instanceof ApiError) {
        if (error.type === 'token_limit' || errorMessage.includes('token limit')) {
          // Navigate to pricing page on token limit exceeded
          navigate('/pricing');
          toast({
            title: 'Token Limit Exceeded',
            description: 'You have reached your token limit. Please upgrade your plan to continue.',
            variant: 'destructive',
          });
          return;
        }
        
        if (error.type === 'rate_limit' || errorMessage.includes('rate limit')) {
          // Show toast for rate limit
          toast({
            title: 'Rate Limit Exceeded',
            description: error.message || 'Too many requests. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Handle other errors
      toast({
        title: 'Generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

