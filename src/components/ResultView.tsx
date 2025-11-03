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
    return null;
  }

  const { description, tags, summary, social_caption, hashtags } = job.result;

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Description</CardTitle>
              <CardDescription>Video description ready for YouTube</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(description, 'Description')}
              >
                {copied === 'Description' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadMarkdown(description, 'description.md')}
              >
                <Download className="h-4 w-4" />
              </Button>
              {youtubeUrl && (
                <Button variant="outline" size="sm" onClick={openYouTube}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{description}</p>
        </CardContent>
      </Card>

      {/* Tags Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Suggested tags for your video</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(tags.join(', '), 'Tags')}
              >
                {copied === 'Tags' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
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
                className="rounded-md bg-secondary px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Key points and notes</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(summary.join('\n'), 'Summary')}
            >
              {copied === 'Summary' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="mt-1 text-primary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Social Caption Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Caption</CardTitle>
              <CardDescription>Ready-to-post social media caption</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(social_caption, 'Social Caption')}
            >
              {copied === 'Social Caption' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{social_caption}</p>
          {hashtags && hashtags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <span key={index} className="text-xs text-primary">
                  #{hashtag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

