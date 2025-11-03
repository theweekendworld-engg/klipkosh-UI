import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/utils/cn';
import type { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = () => {
    switch (job.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          <span>Job {job.id.slice(0, 8)}</span>
          <span
            className={cn(
              'ml-auto text-sm font-normal',
              job.status === 'completed' && 'text-green-600',
              job.status === 'failed' && 'text-red-600',
              job.status === 'processing' && 'text-blue-600',
              job.status === 'pending' && 'text-gray-600'
            )}
          >
            {getStatusLabel()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Created: {new Date(job.created_at).toLocaleString()}</p>
          {job.updated_at && (
            <p>Updated: {new Date(job.updated_at).toLocaleString()}</p>
          )}
          {job.error && (
            <p className="text-destructive">Error: {job.error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

