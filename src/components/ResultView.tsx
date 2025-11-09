import { useState } from 'react';
import { Copy, Download, ExternalLink, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/useToast';
import { extractYouTubeVideoId } from '@/utils/validation';
import type { Job } from '@/lib/types';

interface ResultViewProps {
  job: Job;
  youtubeUrl?: string;
}

export function ResultView({ job, youtubeUrl }: ResultViewProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  if (!job.result) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">No results available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const result = job.result;
  // Safely extract fields with fallbacks
  const description = result.description || '';
  const tags = Array.isArray(result.tags) ? result.tags : (result.tags ? [result.tags] : []);
  const summary = Array.isArray(result.summary) ? result.summary : (result.summary ? [result.summary] : []);
  const social_caption = result.social_caption || '';
  const hashtags = Array.isArray(result.hashtags) ? result.hashtags : (result.hashtags ? [result.hashtags] : []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast({
        title: 'Copied to clipboard',
        description: `${label} copied successfully`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: `${filename} downloaded successfully`,
    });
  };

  const openYouTube = () => {
    if (youtubeUrl) {
      window.open(youtubeUrl, '_blank');
    }
  };

  const videoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="space-y-6">
      {/* YouTube Video Preview */}
      {embedUrl && (
        <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <CardHeader className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <CardTitle className="text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent text-base sm:text-lg">Video Preview</CardTitle>
                <CardDescription className="text-white/70 text-xs sm:text-sm">YouTube video preview</CardDescription>
              </div>
              {youtubeUrl && (
                <Button variant="outline" size="sm" onClick={openYouTube} className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                  <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Open on YouTube</span>
                  <span className="sm:hidden">YouTube</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg border border-purple-300/20"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description Card - Full Width */}
      {description && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all relative overflow-hidden group">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <CardTitle className="text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent text-base sm:text-lg">Description</CardTitle>
              <CardDescription className="text-white/70 text-xs sm:text-sm">Video description ready for YouTube</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(description, 'Description')}
                className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                {copied === 'Description' ? (
                  <>
                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copy</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadMarkdown(description, 'description.md')}
                className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">DL</span>
              </Button>
              {youtubeUrl && (
                <Button variant="outline" size="sm" onClick={openYouTube} className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                  <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">YouTube</span>
                  <span className="sm:hidden">YT</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div 
            className="whitespace-pre-wrap text-sm text-white/90 cursor-pointer hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10 p-4 rounded-lg transition-all border border-transparent hover:border-pink-300/20 max-h-64 overflow-y-auto"
            onClick={() => copyToClipboard(description, 'Description')}
            title="Click to copy description"
          >
            {description}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Results Grid - More Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tags Card */}
      {tags.length > 0 && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-pink-500/20 transition-all relative overflow-hidden group">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <CardTitle className="text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base sm:text-lg">Tags</CardTitle>
              <CardDescription className="text-white/70 text-xs sm:text-sm">Suggested tags for your video</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(tags.join(', '), 'Tags')}
                className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                {copied === 'Tags' ? (
                  <>
                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copy All</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-lg bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-purple-300/30 px-3 py-1.5 text-xs font-medium cursor-pointer hover:from-pink-500/30 hover:via-purple-500/30 hover:to-blue-500/30 hover:border-pink-300/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all text-white/90"
                onClick={() => copyToClipboard(tag, `Tag: ${tag}`)}
                title="Click to copy"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Summary Card */}
      {summary.length > 0 && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all relative overflow-hidden group">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <CardTitle className="text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent text-base sm:text-lg">Summary</CardTitle>
              <CardDescription className="text-white/70 text-xs sm:text-sm">Key points and notes</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(summary.join('\n'), 'Summary')}
              className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            >
              {copied === 'Summary' ? (
                <>
                  <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Copied!</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Copy</span>
                  <span className="sm:hidden">Copy</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <ul className="space-y-3">
            {summary.map((item, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 text-sm text-white/90 cursor-pointer hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10 p-3 rounded-lg transition-all border border-transparent hover:border-pink-300/20 group relative"
                onClick={() => copyToClipboard(item, `Summary point ${index + 1}`)}
                title="Click to copy"
              >
                <span className="mt-1 text-pink-400 text-lg font-bold drop-shadow-lg">•</span>
                <span className="flex-1 text-white/90">{item}</span>
                <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 transition-opacity text-purple-300" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      )}

      {/* Social Caption Card */}
      {social_caption && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-pink-500/20 transition-all relative overflow-hidden group">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <CardTitle className="text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base sm:text-lg">Social Caption</CardTitle>
              <CardDescription className="text-white/70 text-xs sm:text-sm">Ready-to-post social media caption</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(social_caption, 'Social Caption')}
                className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                {copied === 'Social Caption' ? (
                  <>
                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Copy Caption</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>
              {hashtags && hashtags.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(hashtags.map(h => `#${h}`).join(' '), 'Hashtags')}
                  className="border-purple-300/30 hover:border-pink-300/50 hover:bg-white/10 text-white transition-all text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  {copied === 'Hashtags' ? (
                    <>
                      <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Copied!</span>
                      <span className="sm:hidden">✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Copy Hashtags</span>
                      <span className="sm:hidden">Tags</span>
                  </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div 
            className="whitespace-pre-wrap text-sm text-white/90 cursor-pointer hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10 p-4 rounded-lg transition-all border border-transparent hover:border-pink-300/20 max-h-48 overflow-y-auto"
            onClick={() => copyToClipboard(social_caption, 'Social Caption')}
            title="Click to copy caption"
          >
            {social_caption}
          </div>
          {hashtags && hashtags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-purple-300/30 text-pink-300 cursor-pointer hover:from-pink-500/30 hover:via-purple-500/30 hover:to-blue-500/30 hover:border-pink-300/50 hover:shadow-lg hover:shadow-pink-500/20 px-3 py-1.5 rounded-lg transition-all font-medium"
                  onClick={() => copyToClipboard(`#${hashtag}`, `Hashtag: #${hashtag}`)}
                  title="Click to copy"
                >
                  #{hashtag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      )}
      </div>
    </div>
  );
}

