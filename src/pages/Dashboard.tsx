import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Loader2, History, Sparkles, Settings as SettingsIcon, X } from 'lucide-react';
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
  const [provider, setProvider] = useState<Provider>('openai');
  const [model, setModel] = useState<string>('gpt-5-nano');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'results' | 'history'>('generate');
  // History drawer state: open by default on desktop, closed on mobile
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(() => {
    // Check if we're on mobile (window width < 768px)
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true; // Default to open for SSR
  });

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

  // Handle window resize to adjust drawer state
  useEffect(() => {
    const handleResize = () => {
      // On mobile, close drawer; on desktop, open if there are jobs
      if (window.innerWidth < 768) {
        setHistoryDrawerOpen(false);
      } else if (recentJobs.data && recentJobs.data.length > 0) {
        setHistoryDrawerOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recentJobs.data]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('klipkosh_preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setProvider(prefs.provider || 'openai');
        setModel(prefs.default_model || 'gpt-5-nano');
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

  // Auto-select latest job when results tab is opened and no job is selected
  useEffect(() => {
    if (activeTab === 'results' && !currentJob && !selectedJob && recentJobs.data && recentJobs.data.length > 0) {
      // Get the latest job (first in the array, assuming sorted by most recent)
      const latestJob = recentJobs.data[0];
      if (latestJob) {
        setSelectedJob(latestJob.id);
      }
    }
  }, [activeTab, currentJob, selectedJob, recentJobs.data]);

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
        {/* History Drawer Toggle Button (when drawer is closed) */}
        {recentJobs.data && recentJobs.data.length > 0 && !historyDrawerOpen && (
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="fixed bottom-6 right-6 md:left-2 md:top-24 md:bottom-auto z-30 h-14 w-14 md:h-12 md:w-12 rounded-full md:rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all flex items-center justify-center group"
            aria-label="Open History"
          >
            <History className="h-6 w-6 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full border-2 border-black/20 flex items-center justify-center text-[10px] font-bold">
              {recentJobs.data.length}
            </span>
          </button>
        )}

        {/* History Drawer */}
        {recentJobs.data && recentJobs.data.length > 0 && (
          <>
            {/* Desktop Drawer */}
            <aside
              className={`hidden md:flex flex-col border-r border-blue-300/20 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-in-out ${
                historyDrawerOpen ? 'w-72' : 'w-0 overflow-hidden'
              }`}
            >
              <div className="p-4 border-b border-blue-300/20 flex items-center justify-between min-w-[288px] bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-pink-400" />
                  History
                  {recentJobs.data && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-500/20 text-xs text-pink-300 font-medium">
                      {recentJobs.data.length}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setHistoryDrawerOpen(false)}
                  className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                  aria-label="Close History"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-w-[288px]">
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

            {/* Mobile Drawer Overlay */}
            {historyDrawerOpen && (
              <div
                className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => setHistoryDrawerOpen(false)}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-black/95 backdrop-blur-md shadow-xl transform transition-transform"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-blue-300/20 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-pink-400" />
                      History
                      {recentJobs.data && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-500/20 text-xs text-pink-300 font-medium">
                          {recentJobs.data.length}
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={() => setHistoryDrawerOpen(false)}
                      className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                      aria-label="Close History"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100vh-73px)]">
                    {recentJobs.data.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => {
                          setSelectedJob(job.id);
                          setCurrentJobId(null);
                          setActiveTab('results');
                          setHistoryDrawerOpen(false); // Close drawer on mobile when selecting a job
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
            <div className="container flex items-center gap-0 sm:gap-1 px-2 sm:px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeTab === 'generate'
                    ? 'text-white border-b-2 border-b-pink-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Generate
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'results'
                    ? 'text-white border-b-2 border-b-pink-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Results
              </button>
            </div>
          </div>


          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'generate' && (
              <div className="container max-w-4xl py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Left Column - Form */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
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
          <div className="space-y-4 sm:space-y-4">
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
              <div className="container max-w-4xl py-4 sm:py-6 md:py-8 px-3 sm:px-4 relative overflow-hidden">
                {/* Animated background lines */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full">
                    {/* Moving vertical lines */}
                    <div className="absolute top-20 left-0 w-1 h-64 bg-gradient-to-b from-pink-500/20 via-purple-500/30 to-transparent animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-1 h-48 bg-gradient-to-b from-purple-500/20 via-pink-500/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-1/4 w-1 h-56 bg-gradient-to-b from-transparent via-pink-500/20 to-purple-500/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Moving horizontal shimmer lines */}
                    <div 
                      className="absolute top-1/4 left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.5), rgba(168, 85, 247, 0.5), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s ease-in-out infinite'
                      }}
                    ></div>
                    <div 
                      className="absolute top-1/2 left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s ease-in-out infinite',
                        animationDelay: '1.3s'
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-1/4 left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.4), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s ease-in-out infinite',
                        animationDelay: '2.6s'
                      }}
                    ></div>
                  </div>
                  {/* Moving gradient orbs */}
                  <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
                  <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {selectedJob ? (
                  // Selected job from history
                  selectedJobData ? (
                    selectedJobData.status === 'completed' || selectedJobData.status === 'done' ? (
                      selectedJobData.result ? (
                        <div className="space-y-4 sm:space-y-6 relative z-10">
                          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                              Results
                            </h2>
                            <Button variant="outline" onClick={() => setSelectedJob(null)} className="text-white border-purple-300/30 hover:bg-white/10 hover:border-pink-300/50 transition-all text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                Close
              </Button>
            </div>
                          <ResultView job={selectedJobData} youtubeUrl={selectedJobData.video_url} />
                        </div>
                      ) : (
                        <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10 relative z-10">
                    <CardContent className="py-8 text-center">
                            <Loader2 className="h-6 w-6 text-pink-400 animate-spin mx-auto mb-2" />
                      <p className="text-white/70">Loading results...</p>
                    </CardContent>
                  </Card>
                )
              ) : (
                      <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-purple-500/10 relative z-10">
                  <CardContent className="py-8">
                          <div className="flex items-center gap-2 justify-center">
                            <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
                            <p className="text-white">Processing...</p>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
                    <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10 relative z-10">
                      <CardContent className="py-8 text-center">
                        <Loader2 className="h-6 w-6 text-pink-400 animate-spin mx-auto mb-2" />
                        <p className="text-white/70">Loading...</p>
                      </CardContent>
                    </Card>
                  )
                ) : currentJob ? (
                  // Current job - check status
                  currentJob.status === 'completed' || currentJob.status === 'done' ? (
                    // Current job results
                    <div className="space-y-4 sm:space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                          Results
                        </h2>
                        <Button variant="outline" onClick={handleRegenerate} className="text-white border-purple-300/30 hover:bg-white/10 hover:border-pink-300/50 transition-all text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                          <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Regenerate</span>
                          <span className="sm:hidden">Regen</span>
                        </Button>
                      </div>
                      {currentJob.result ? (
                        <ResultView job={currentJob} youtubeUrl={youtubeUrl || undefined} />
                      ) : (
                        <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10">
                <CardContent className="py-8 text-center">
                            <Loader2 className="h-6 w-6 text-pink-400 animate-spin mx-auto mb-2" />
                            <p className="text-white/70">Loading results...</p>
                </CardContent>
              </Card>
            )}
          </div>
                  ) : (
                    // Current job is processing
                    <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-purple-500/10 relative z-10">
                      <CardContent className="py-8">
                        <div className="flex items-center gap-2 justify-center">
                          <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
                          <p className="text-white">Processing...</p>
                        </div>
            </CardContent>
          </Card>
                  )
                ) : (
                  // No results
                  <div className="text-center py-12 relative z-10">
                    <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-purple-300/20 backdrop-blur-sm shadow-lg shadow-pink-500/10">
                      <p className="text-white/70 text-lg">No results yet. Generate content to see results here.</p>
                    </div>
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
