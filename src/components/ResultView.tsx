import { useState } from 'react';
import { Copy, Download, ExternalLink, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/useToast';
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

  return (
    <div className="space-y-6">
      {/* Description Card */}
      {description && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Description</CardTitle>
              <CardDescription className="text-white/70">Video description ready for YouTube</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(description, 'Description')}
              >
                {copied === 'Description' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadMarkdown(description, 'description.md')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {youtubeUrl && (
                <Button variant="outline" size="sm" onClick={openYouTube}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  YouTube
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p 
            className="whitespace-pre-wrap text-sm text-white/90 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
            onClick={() => copyToClipboard(description, 'Description')}
            title="Click to copy description"
          >
            {description}
          </p>
        </CardContent>
      </Card>
      )}

      {/* Tags Card */}
      {tags.length > 0 && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Tags</CardTitle>
              <CardDescription className="text-white/70">Suggested tags for your video</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(tags.join(', '), 'Tags')}
              >
                {copied === 'Tags' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-md bg-secondary px-2 py-1 text-xs font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
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
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Summary</CardTitle>
              <CardDescription className="text-white/70">Key points and notes</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(summary.join('\n'), 'Summary')}
            >
              {copied === 'Summary' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.map((item, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm text-white/90 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors group"
                onClick={() => copyToClipboard(item, `Summary point ${index + 1}`)}
                title="Click to copy"
              >
                <span className="mt-1 text-pink-400">•</span>
                <span className="flex-1 text-white/90">{item}</span>
                <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      )}

      {/* Social Caption Card */}
      {social_caption && (
      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Social Caption</CardTitle>
              <CardDescription className="text-white/70">Ready-to-post social media caption</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(social_caption, 'Social Caption')}
              >
                {copied === 'Social Caption' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Caption
                  </>
                )}
              </Button>
              {hashtags && hashtags.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(hashtags.map(h => `#${h}`).join(' '), 'Hashtags')}
                >
                  {copied === 'Hashtags' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Hashtags
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p 
            className="whitespace-pre-wrap text-sm text-white/90 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
            onClick={() => copyToClipboard(social_caption, 'Social Caption')}
            title="Click to copy caption"
          >
            {social_caption}
          </p>
          {hashtags && hashtags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <span 
                  key={index} 
                  className="text-xs text-pink-400 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors"
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
  );
}

