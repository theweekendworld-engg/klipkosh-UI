import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultView } from '../ResultView';
import type { Job } from '@/lib/types';

const mockJob: Job = {
  id: 'test-job',
  status: 'completed',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:01:00Z',
  result: {
    description: 'Test description',
    tags: ['tag1', 'tag2'],
    summary: ['Summary point 1', 'Summary point 2'],
    social_caption: 'Test social caption',
    hashtags: ['test', 'example'],
  },
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('ResultView', () => {
  it('renders all result sections', () => {
    render(<ResultView job={mockJob} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Social Caption')).toBeInTheDocument();
  });

  it('displays description content', () => {
    render(<ResultView job={mockJob} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays tags', () => {
    render(<ResultView job={mockJob} />);
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('does not render when job has no result', () => {
    const jobWithoutResult: Job = {
      ...mockJob,
      result: undefined,
    };
    const { container } = render(<ResultView job={jobWithoutResult} />);
    expect(container.firstChild).toBeNull();
  });
});

