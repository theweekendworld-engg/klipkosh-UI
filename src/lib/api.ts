import type {
  GenerateRequest,
  Job,
  JobResult,
  UsageStats,
  UserPreferences,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}

export const api = {
  async generate(request: GenerateRequest, token?: string | null): Promise<{ job_id: string }> {
    const response = await fetchWithAuth(
      '/api/v1/generate',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      token
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  async getJob(jobId: string, token?: string): Promise<Job> {
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}/api/v1/jobs/${jobId}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      const apiError = new Error(error.message || `HTTP ${response.status}`);
      (apiError as any).status = response.status;
      throw apiError;
    }

    const data = await response.json();
    return {
      id: data.job_id || data.id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      error: data.error,
      result: data.outputs,
    };
  },

  async getRecentJobs(token?: string): Promise<Job[]> {
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}/api/v1/jobs`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.jobs || [];
  },

  async getUsageStats(token?: string): Promise<UsageStats> {
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}/api/v1/usage`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  async uploadTranscript(file: File, token?: string): Promise<{ transcript: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}/api/v1/upload-transcript`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  async savePreferences(preferences: UserPreferences, token?: string): Promise<void> {
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}/api/v1/preferences`, {
      method: 'POST',
      headers,
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
  },
};

