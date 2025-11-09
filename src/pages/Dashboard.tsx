import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Loader2, History, Sparkles, Settings as SettingsIcon } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'generate' | 'results' | 'history'>('generate');

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
    const saved = localStorage.getItem('klipkosh_preferences');
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

  // Switch to results tab when job completes
  useEffect(() => {
    if (currentJob && (currentJob.status === 'completed' || currentJob.status === 'done')) {
      setActiveTab('results');
    }
  }, [currentJob]);

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
      setSelectedJob(null);
      setActiveTab('results');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRegenerate = () => {
    setCurrentJobId(null);
    setActiveTab('generate');
  };

  const canGenerate = youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - History (Desktop) */}
        {recentJobs.data && recentJobs.data.length > 0 && (
          <>
            <aside className="hidden md:flex flex-col w-64 border-r border-blue-300/20 bg-black/40 backdrop-blur-sm">
              <div className="p-4 border-b border-blue-300/20">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  History
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {recentJobs.data.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => {
                      setSelectedJob(job.id);
                      setCurrentJobId(null);
                      setActiveTab('results');
                    }}
                  />
                ))}
              </div>
            </aside>

            {/* Mobile History Button */}
            <button
              onClick={() => setActiveTab('history')}
              className="md:hidden fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              aria-label="Open History"
            >
              <History className="h-6 w-6" />
            </button>

            {/* Mobile History Overlay */}
            {activeTab === 'history' && (
              <div
                className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={() => setActiveTab('generate')}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-black/95 backdrop-blur-md shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-blue-300/20 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <History className="h-5 w-5" />
                      History
                    </h2>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 h-[calc(100vh-73px)]">
                    {recentJobs.data.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => {
                          setSelectedJob(job.id);
                          setCurrentJobId(null);
                          setActiveTab('results');
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-purple-300/20 bg-black/20 backdrop-blur-sm">
            <div className="container flex items-center gap-1 px-4">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'generate'
                    ? 'text-white border-b-2 border-b-pink-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Generate
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'text-white border-b-2 border-b-pink-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Results
              </button>
            </div>
          </div>

          {/* History Tab Content (Mobile) */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto">
              <div className="container max-w-4xl py-8 px-4">
                <div className="text-center py-12">
                  <p className="text-white/70">Select a job from the sidebar</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'generate' && (
              <div className="container max-w-4xl py-8 px-4">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column - Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Generate Content</CardTitle>
                        <CardDescription className="text-sm text-white/70">
                          Paste a YouTube URL to generate descriptions, tags, and captions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="youtube-url" className="text-white">YouTube URL</Label>
                          <Input
                            id="youtube-url"
                            type="url"
                            placeholder="Enter YouTube URL..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="h-12 text-base bg-white/10 border-purple-300/30 text-white placeholder:text-white/60 focus:border-pink-400/50 focus:ring-pink-400/50"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="title-override" className="text-white">Title Override (Optional)</Label>
                            <Input
                              id="title-override"
                              placeholder="Custom title"
                              value={titleOverride}
                              onChange={(e) => setTitleOverride(e.target.value)}
                              className="bg-white/10 border-purple-300/30 text-white placeholder:text-white/60 focus:border-pink-400/50"
                            />
                          </div>
                          <ToneSelector value={tone} onValueChange={setTone} />
                        </div>

                        <ProviderSelector value={provider} onValueChange={setProvider} model={model} onModelChange={setModel} />

                        <button
                          onClick={handleGenerate}
                          disabled={!canGenerate || generateMutation.isPending || isPolling}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold hover:from-purple-500 hover:via-pink-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center"
                        >
                          {generateMutation.isPending || isPolling ? (
                            <>
                              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            'Generate'
                          )}
                        </button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Usage Stats */}
                  <div className="space-y-4">
                    {usageStats.data && (
                    <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-white">Usage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Credits</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {usageStats.data.free_credits_remaining}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Total</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {usageStats.data.total_generations}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    )}
                    <Card className="bg-white/5 border border-pink-300/20 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4" />
                          Quick Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => setSettingsOpen(true)}
                          className="w-full text-white border-purple-300/30 hover:bg-white/10"
                        >
                          Open Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="container max-w-4xl py-8 px-4">
                {selectedJob ? (
                  // Selected job from history
                  selectedJobData ? (
                    selectedJobData.status === 'completed' || selectedJobData.status === 'done' ? (
                      selectedJobData.result ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Results</h2>
                            <Button variant="outline" onClick={() => setSelectedJob(null)} className="text-white border-blue-300/30 hover:bg-white/10">
                              Close
                            </Button>
                          </div>
                          <ResultView job={selectedJobData} />
                        </div>
                      ) : (
                        <Card className="bg-white/5 border border-blue-300/20 backdrop-blur-sm">
                          <CardContent className="py-8 text-center">
                            <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-2" />
                            <p className="text-white/70">Loading results...</p>
                          </CardContent>
                        </Card>
                      )
                    ) : (
                      <Card className="bg-white/5 border border-blue-300/20 backdrop-blur-sm">
                        <CardContent className="py-8">
                          <div className="flex items-center gap-2 justify-center">
                            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                            <p className="text-white">Processing...</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ) : (
                    <Card className="bg-white/5 border border-blue-300/20 backdrop-blur-sm">
                      <CardContent className="py-8 text-center">
                        <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-2" />
                        <p className="text-white/70">Loading...</p>
                      </CardContent>
                    </Card>
                  )
                ) : currentJob && (currentJob.status === 'completed' || currentJob.status === 'done') ? (
                  // Current job results
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Results</h2>
                      <Button variant="outline" onClick={handleRegenerate} className="text-white border-blue-300/30 hover:bg-white/10">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                    {currentJob.result ? (
                      <ResultView job={currentJob} youtubeUrl={youtubeUrl || undefined} />
                    ) : (
                      <Card className="bg-white/5 border border-blue-300/20 backdrop-blur-sm">
                        <CardContent className="py-8 text-center">
                          <p className="text-white/70">Loading results...</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  // No results
                  <div className="text-center py-12">
                    <p className="text-white/70">No results yet. Generate content to see results here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
