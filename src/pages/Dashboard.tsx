import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { useJobPoll } from '@/hooks/useJobPoll';
import { useRecentJobs } from '@/hooks/useRecentJobs';
import { useUsageStats } from '@/hooks/useUsageStats';
import { useToast } from '@/hooks/useToast';
import { isValidYouTubeUrl, validateTranscriptSize } from '@/utils/validation';
import { JobCard } from '@/components/JobCard';
import { ResultView } from '@/components/ResultView';
import { ToneSelector } from '@/components/ToneSelector';
import { ProviderSelector } from '@/components/ProviderSelector';
import type { GenerateRequest, Tone, Provider } from '@/lib/types';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const EXAMPLE_VIDEOS = [
  {
    title: 'React Tutorial',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    title: 'Python Basics',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { isSignedIn, getAuthToken } = useAuth();
  const { toast } = useToast();
  const generateMutation = useGenerate();
  const usageStats = useUsageStats();
  const recentJobs = useRecentJobs();

  const [inputMode, setInputMode] = useState<'url' | 'transcript'>('url');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [titleOverride, setTitleOverride] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [provider, setProvider] = useState<Provider>('openrouter');
  const [model, setModel] = useState<string>('openai/gpt-4-turbo-preview');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('postpilot_preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setProvider(prefs.provider || 'openrouter');
        setModel(prefs.default_model || 'openai/gpt-4-turbo-preview');
        setTone(prefs.default_tone || 'professional');
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, []);

  const { job: currentJob, isPolling } = useJobPoll(currentJobId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .txt file',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = await getAuthToken();
      const result = await api.uploadTranscript(file, token || undefined);
      setTranscript(result.transcript);
      setInputMode('transcript');
      toast({
        title: 'File uploaded',
        description: 'Transcript loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async () => {
    if (inputMode === 'url' && !youtubeUrl.trim()) {
      toast({
        title: 'YouTube URL required',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    if (inputMode === 'transcript' && !transcript.trim()) {
      toast({
        title: 'Transcript required',
        description: 'Please enter or upload a transcript',
        variant: 'destructive',
      });
      return;
    }

    if (inputMode === 'url' && !isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: 'Invalid YouTube URL',
        description: 'Please enter a valid YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    if (inputMode === 'transcript') {
      const validation = validateTranscriptSize(transcript);
      if (!validation.valid) {
        toast({
          title: 'Transcript too large',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }
    }

    const request: GenerateRequest = {
      ...(inputMode === 'url' ? { youtube_url: youtubeUrl } : { transcript }),
      ...(titleOverride && { title_override: titleOverride }),
      tone,
      provider,
      model,
    };

    try {
      const result = await generateMutation.mutateAsync(request);
      setCurrentJobId(result.job_id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRegenerate = () => {
    setCurrentJobId(null);
    // Keep the same input and allow user to adjust settings
  };

  const canGenerate =
    (inputMode === 'url' && youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl)) ||
    (inputMode === 'transcript' && transcript.trim());

  // Keyboard shortcut: 'g' to focus input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          if (inputMode === 'url') {
            document.getElementById('youtube-url')?.focus();
          } else {
            document.getElementById('transcript')?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputMode]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <main className="container flex-1 py-8 space-y-8">
        {/* Usage Stats */}
        {usageStats.data && (
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Free Credits Remaining</p>
                  <p className="text-2xl font-bold">{usageStats.data.free_credits_remaining}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Generations</p>
                  <p className="text-2xl font-bold">{usageStats.data.total_generations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>
              Paste a YouTube URL or upload a transcript to generate descriptions, tags, and
              captions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={inputMode === 'url' ? 'default' : 'outline'}
                onClick={() => setInputMode('url')}
              >
                <Link2 className="mr-2 h-4 w-4" />
                YouTube URL
              </Button>
              <Button
                variant={inputMode === 'transcript' ? 'default' : 'outline'}
                onClick={() => setInputMode('transcript')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Transcript
              </Button>
            </div>

            {/* URL Input */}
            {inputMode === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <select
                    className="text-xs border rounded px-2 py-1"
                    onChange={(e) => {
                      const example = EXAMPLE_VIDEOS[parseInt(e.target.value)];
                      if (example) setYoutubeUrl(example.url);
                    }}
                    defaultValue=""
                  >
                    <option value="">Try an example...</option>
                    {EXAMPLE_VIDEOS.map((example, idx) => (
                      <option key={idx} value={idx}>
                        {example.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Transcript Input */}
            {inputMode === 'transcript' && (
              <div className="space-y-2">
                <Label htmlFor="transcript">Transcript</Label>
                <Textarea
                  id="transcript"
                  placeholder="Paste your transcript here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={10}
                />
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload .txt file
                  </Button>
                </div>
              </div>
            )}

            {/* Optional Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title-override">Title Override (Optional)</Label>
                <Input
                  id="title-override"
                  placeholder="Custom title for the video"
                  value={titleOverride}
                  onChange={(e) => setTitleOverride(e.target.value)}
                />
              </div>
              <ToneSelector value={tone} onValueChange={setTone} />
            </div>

            <ProviderSelector value={provider} onValueChange={setProvider} model={model} onModelChange={setModel} />

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || generateMutation.isPending || isPolling}
              className="w-full"
            >
              {generateMutation.isPending || isPolling ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Current Job Result */}
        {currentJob && currentJob.status === 'completed' && currentJob.result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Results</h2>
              <Button variant="outline" onClick={handleRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <ResultView job={currentJob} youtubeUrl={youtubeUrl || undefined} />
          </div>
        )}

        {/* Recent Jobs */}
        {recentJobs.data && recentJobs.data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Your recent content generation jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.data.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </CardContent>
          </Card>
        )}
      </main>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

