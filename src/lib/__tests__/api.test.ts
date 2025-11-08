import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import type { GenerateRequest } from '../types';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate sends POST request with correct payload', async () => {
    const mockResponse = { job_id: 'test-job-123' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request: GenerateRequest = {
      youtube_url: 'https://www.youtube.com/watch?v=test',
      tone: 'professional',
    };

    const result = await api.generate(request);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/generate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request),
      })
    );
  });

  it('generate includes Authorization header when token provided', async () => {
    const mockResponse = { job_id: 'test-job-123' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await api.generate({ youtube_url: 'https://test.com' }, 'test-token');
    const call = (global.fetch as any).mock.calls[0];
    expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('getJob fetches job by ID', async () => {
    const mockJob = {
      job_id: 'test-job',
      status: 'completed',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      outputs: { description: 'Test' },
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    await api.getJob('test-job');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/jobs/test-job'),
      expect.any(Object)
    );
  });
});

