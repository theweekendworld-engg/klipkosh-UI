import { Clock, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/utils/cn';
import type { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-white/60" />;
    }
  };

  const getStatusLabel = () => {
    switch (job.status) {
      case 'completed':
      case 'done':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };

  const isClickable = !!onClick;

  // Get video URL directly from job response
  const videoUrl = job.video_url;
  
  // Extract video ID from URL for display
  const getVideoIdFromUrl = (url: string) => {
    if (!url) return null;
    // Match YouTube URL patterns
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = videoUrl ? getVideoIdFromUrl(videoUrl) : null;
  const displayText = videoId ? `YouTube: ${videoId}` : `Job ${job.id.slice(0, 8)}`;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <Card 
      className={cn(
        'bg-white/5 border border-purple-300/20 backdrop-blur-sm transition-all',
        isClickable && 'cursor-pointer hover:bg-white/10 hover:border-purple-400/50'
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {getStatusIcon()}
          {videoUrl ? (
            <div className="flex items-center gap-2 group">
              <span className="hover:text-pink-400 transition-colors">{displayText}</span>
              <button
                onClick={handleVideoClick}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                title="Open YouTube video"
              >
                <ExternalLink className="h-4 w-4 text-pink-400 hover:text-pink-300" />
              </button>
            </div>
          ) : (
            <span>{displayText}</span>
          )}
          <span
            className={cn(
              'ml-auto text-sm font-normal',
              job.status === 'completed' && 'text-green-400',
              job.status === 'done' && 'text-green-400',
              job.status === 'failed' && 'text-red-400',
              job.status === 'processing' && 'text-blue-400',
              job.status === 'pending' && 'text-white/60'
            )}
          >
            {getStatusLabel()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-white/70">
          {videoUrl && (
            <p className="text-xs text-pink-400/80 truncate">
              {videoUrl}
            </p>
          )}
          <p>Created: {new Date(job.created_at).toLocaleString()}</p>
          {job.updated_at && (
            <p>Updated: {new Date(job.updated_at).toLocaleString()}</p>
          )}
          {job.error && (
            <p className="text-red-400">Error: {job.error}</p>
          )}
          {isClickable && (
            <p className="text-pink-400 text-xs mt-2">
              {job.status === 'completed' || job.status === 'done' 
                ? 'Click to view results' 
                : 'Click to view details'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

