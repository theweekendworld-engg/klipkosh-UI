import { CheckCircle2, XCircle, Loader2, Clock, ExternalLink } from 'lucide-react';
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

  const videoUrl = job.video_url;
  const isClickable = !!onClick;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  // Truncate URL for display - shorter on mobile
  const displayUrl = videoUrl 
    ? videoUrl.length > 40 
      ? `${videoUrl.substring(0, 37)}...` 
      : videoUrl
    : 'No URL';

  return (
    <div
      className={cn(
        'p-2 sm:p-3 rounded-lg border border-blue-300/20 bg-white/5 hover:bg-white/10 transition-all',
        isClickable && 'cursor-pointer'
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-start gap-2">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 group">
            <p className="text-xs sm:text-sm text-white/90 truncate">{displayUrl}</p>
            {videoUrl && (
              <button
                onClick={handleVideoClick}
                className="opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                title="Open in YouTube"
              >
                <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

