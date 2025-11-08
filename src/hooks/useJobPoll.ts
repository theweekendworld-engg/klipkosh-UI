import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import type { Job } from '@/lib/types';

const INITIAL_DELAY = 10000; // Minimum 10 seconds between polls
const MAX_DELAY = 30000; // Max 30 seconds
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
  const isPollingRef = useRef(false);
  const jobIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Store current jobId in ref
    jobIdRef.current = jobId;

    // Cleanup on unmount or jobId change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPollingRef.current = false;

    if (!jobId || !isValidJobId(jobId)) {
      setIsPolling(false);
      setJob(null);
      setError(null);
      return;
    }

    setIsPolling(true);
    delayRef.current = INITIAL_DELAY;
    consecutiveErrorsRef.current = 0;
    isPollingRef.current = true;

    const poll = async () => {
      // Don't poll if we're already stopped or jobId changed
      if (!isPollingRef.current || jobIdRef.current !== jobId) {
        return;
      }
      
      try {
        const token = await getAuthToken();
        const jobData = await api.getJob(jobId, token || undefined);
        
        // Check again if jobId changed during async operation
        if (jobIdRef.current !== jobId) {
          return;
        }
        
        setJob(jobData);
        setError(null);
        consecutiveErrorsRef.current = 0; // Reset error count on success

        // Stop polling if job is done (completed, failed, or done status)
        // OR if the job has results (meaning it's successfully completed)
        // Check for any result data, not just non-empty object
        const hasResults = jobData.result && (
          (typeof jobData.result === 'object' && 
           jobData.result !== null &&
           !Array.isArray(jobData.result) &&
           Object.keys(jobData.result).length > 0) ||
          (Array.isArray(jobData.result) && jobData.result.length > 0)
        );
        
        const isJobComplete = 
          jobData.status === 'completed' || 
          jobData.status === 'failed' || 
          jobData.status === 'done' ||
          hasResults;
        
        // Debug logging
        if (isJobComplete) {
          console.log('Job complete check:', {
            status: jobData.status,
            hasResult: !!jobData.result,
            resultKeys: jobData.result ? Object.keys(jobData.result) : [],
            isJobComplete
          });
        }

        if (isJobComplete) {
          console.log('Job complete, stopping polling:', { status: jobData.status, hasResults });
          setIsPolling(false);
          isPollingRef.current = false;
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return;
        }

        // Only continue polling if job is still in progress and we're still supposed to poll
        if (!isPollingRef.current || jobIdRef.current !== jobId) {
          return;
        }

        // Use minimum 10 seconds delay
        delayRef.current = Math.max(
          INITIAL_DELAY,
          Math.min(delayRef.current * BACKOFF_MULTIPLIER, MAX_DELAY)
        );

        timeoutRef.current = setTimeout(() => {
          // Double check before polling again
          if (isPollingRef.current && jobIdRef.current === jobId) {
            poll();
          }
        }, delayRef.current);
      } catch (err) {
        // Check if jobId changed during async operation
        if (jobIdRef.current !== jobId) {
          return;
        }
        
        const error = err instanceof Error ? err : new Error('Unknown error');
        const status = (error as any).status;
        consecutiveErrorsRef.current += 1;
        
        setError(error);

        // Stop polling on 404 (job not found) or too many consecutive errors
        if (status === 404 || consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          console.log('Stopping polling due to error:', { status, consecutiveErrors: consecutiveErrorsRef.current });
          setIsPolling(false);
          isPollingRef.current = false;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return;
        }

        // Only continue if we're still supposed to poll
        if (!isPollingRef.current || jobIdRef.current !== jobId) {
          return;
        }

        // Continue polling on other errors, but with minimum 10 seconds delay
        delayRef.current = Math.max(
          INITIAL_DELAY,
          Math.min(delayRef.current * BACKOFF_MULTIPLIER, MAX_DELAY)
        );
        timeoutRef.current = setTimeout(() => {
          // Double check before polling again
          if (isPollingRef.current && jobIdRef.current === jobId) {
            poll();
          }
        }, delayRef.current);
      }
    };

    // Start polling immediately
    poll();

    return () => {
      isPollingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [jobId]); // Removed getAuthToken from dependencies

  return { job, isPolling, error };
}

