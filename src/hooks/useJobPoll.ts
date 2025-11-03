import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import type { Job } from '@/lib/types';

const INITIAL_DELAY = 1000;
const MAX_DELAY = 10000;
const BACKOFF_MULTIPLIER = 1.5;
const MAX_CONSECUTIVE_ERRORS = 5;

// Check if jobId is a valid UUID (not the zero UUID)
function isValidJobId(jobId: string | null): boolean {
  if (!jobId) return false;
  // Reject the zero UUID pattern
  if (jobId === '00000000-0000-0000-0000-000000000000') return false;
  // Basic UUID format check (8-4-4-4-12 hex characters)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(jobId);
}

export function useJobPoll(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getAuthToken } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayRef = useRef(INITIAL_DELAY);
  const consecutiveErrorsRef = useRef(0);

  useEffect(() => {
    if (!jobId || !isValidJobId(jobId)) {
      setIsPolling(false);
      setJob(null);
      setError(null);
      return;
    }

    setIsPolling(true);
    delayRef.current = INITIAL_DELAY;
    consecutiveErrorsRef.current = 0;

    const poll = async () => {
      try {
        const token = await getAuthToken();
        const jobData = await api.getJob(jobId, token || undefined);
        setJob(jobData);
        setError(null);
        consecutiveErrorsRef.current = 0; // Reset error count on success

        if (jobData.status === 'completed' || jobData.status === 'failed') {
          setIsPolling(false);
          return;
        }

        // Exponential backoff
        delayRef.current = Math.min(
          delayRef.current * BACKOFF_MULTIPLIER,
          MAX_DELAY
        );

        timeoutRef.current = setTimeout(poll, delayRef.current);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        const status = (error as any).status;
        consecutiveErrorsRef.current += 1;
        
        setError(error);

        // Stop polling on 404 (job not found) or too many consecutive errors
        if (status === 404 || consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          setIsPolling(false);
          return;
        }

        // Continue polling on other errors, but with longer delay
        delayRef.current = Math.min(delayRef.current * BACKOFF_MULTIPLIER, MAX_DELAY);
        timeoutRef.current = setTimeout(poll, delayRef.current);
      }
    };

    // Start polling immediately
    poll();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [jobId, getAuthToken]);

  return { job, isPolling, error };
}

