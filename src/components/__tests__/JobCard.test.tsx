import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobCard } from '../JobCard';
import type { Job } from '@/lib/types';

const mockJob: Job = {
  id: 'test-job-123',
  status: 'completed',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:01:00Z',
  result: {
    description: 'Test description',
    tags: ['tag1', 'tag2'],
    summary: ['Summary point 1'],
    social_caption: 'Test caption',
  },
};

describe('JobCard', () => {
  it('renders job ID', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText(/test-job-123/i)).toBeInTheDocument();
  });

  it('displays completed status', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays pending status', () => {
    const pendingJob: Job = {
      ...mockJob,
      status: 'pending',
    };
    render(<JobCard job={pendingJob} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});

