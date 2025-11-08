import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { useJobPoll } from '@/hooks/useJobPoll';
import { useRecentJobs } from '@/hooks/useRecentJobs';
import { useUsageStats } from '@/hooks/useUsageStats';
import { useToast } from '@/hooks/useToast';
import { isValidYouTubeUrl } from '@/utils/validation';
import { JobCard } from '@/components/JobCard';
import { ResultView } from '@/components/ResultView';
import { ToneSelector } from '@/components/ToneSelector';
import { ProviderSelector } from '@/components/ProviderSelector';
import type { GenerateRequest, Tone, Provider } from '@/lib/types';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const generateMutation = useGenerate();
  const usageStats = useUsageStats();
  const recentJobs = useRecentJobs();

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [titleOverride, setTitleOverride] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [provider, setProvider] = useState<Provider>('openrouter');
  const [model, setModel] = useState<string>('openai/gpt-4-turbo-preview');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Handle URL passed from landing page
  useEffect(() => {
    const state = location.state as { youtubeUrl?: string } | null;
    if (state?.youtubeUrl) {
      setYoutubeUrl(state.youtubeUrl);
    }
  }, [location]);

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
  const { job: selectedJobData } = useJobPoll(selectedJob);

  const handleGenerate = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: 'YouTube URL required',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: 'Invalid YouTube URL',
        description: 'Please enter a valid YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    const request: GenerateRequest = {
      youtube_url: youtubeUrl,
      ...(titleOverride && { title_override: titleOverride }),
      tone,
      provider,
      model,
    };

    try {
      const result = await generateMutation.mutateAsync(request);
      setCurrentJobId(result.job_id);
      setSelectedJob(null); // Clear selected job when starting new generation
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRegenerate = () => {
    setCurrentJobId(null);
    // Keep the same input and allow user to adjust settings
  };

  const canGenerate = youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl);

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
          document.getElementById('youtube-url')?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <main className="container flex-1 py-12 space-y-8 max-w-4xl px-4">
        {/* Usage Stats */}
        {usageStats.data && (
          <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-white/70 mb-1">Free Credits Remaining</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{usageStats.data.free_credits_remaining}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Total Generations</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{usageStats.data.total_generations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Form */}
        <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-white">Generate Content</CardTitle>
            <CardDescription className="text-base mt-2 text-white/70">
              Paste a YouTube URL to generate descriptions, tags, and captions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-white">YouTube URL</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="Enter YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="h-14 text-base bg-white/10 border-purple-300/30 text-white placeholder:text-white/60 focus:border-purple-400/50 focus:ring-purple-400/50"
              />
            </div>

            {/* Optional Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title-override" className="text-white">Title Override (Optional)</Label>
                <Input
                  id="title-override"
                  placeholder="Custom title for the video"
                  value={titleOverride}
                  onChange={(e) => setTitleOverride(e.target.value)}
                  className="bg-white/10 border-purple-300/30 text-white placeholder:text-white/60 focus:border-purple-400/50"
                />
              </div>
              <ToneSelector value={tone} onValueChange={setTone} />
            </div>

            <ProviderSelector value={provider} onValueChange={setProvider} model={model} onModelChange={setModel} />

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || generateMutation.isPending || isPolling}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-semibold hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center"
            >
              {generateMutation.isPending || isPolling ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get Video Transcript'
              )}
            </button>
          </CardContent>
        </Card>

        {/* Current Job Result */}
        {currentJob && (currentJob.status === 'completed' || currentJob.status === 'done') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Results</h2>
              <Button variant="outline" onClick={handleRegenerate} className="text-white border-purple-300/30 hover:bg-white/10">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            {currentJob.result ? (
              <ResultView job={currentJob} youtubeUrl={youtubeUrl || undefined} />
            ) : (
              <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                <CardContent className="py-8 text-center">
                  <p className="text-white/70">Loading results...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Selected Job Result (from clicking on a job card) */}
        {selectedJob && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Job Details</h2>
              <Button variant="outline" onClick={() => setSelectedJob(null)} className="text-white border-purple-300/30 hover:bg-white/10">
                Close
              </Button>
            </div>
            {selectedJobData ? (
              selectedJobData.status === 'completed' || selectedJobData.status === 'done' ? (
                selectedJobData.result ? (
                  <ResultView job={selectedJobData} />
                ) : (
                  <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                    <CardContent className="py-8 text-center">
                      <p className="text-white/70">Loading results...</p>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                  <CardContent className="py-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                        <p className="text-white">Job Status: {selectedJobData.status}</p>
                      </div>
                      <p className="text-sm text-white/70">Job is still processing. Results will appear here when complete.</p>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                <CardContent className="py-8 text-center">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-2" />
                  <p className="text-white/70">Loading job details...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recent Jobs */}
        {recentJobs.data && recentJobs.data.length > 0 && (
          <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Recent Jobs</CardTitle>
              <CardDescription className="text-base text-white/70">Your recent content generation jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.data.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={() => {
                    setSelectedJob(job.id);
                    setCurrentJobId(null); // Clear current job when viewing a different one
                  }}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </main>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

