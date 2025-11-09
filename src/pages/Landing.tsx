import { useNavigate } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function Landing() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleGetTranscript = () => {
    if (isSignedIn) {
      // If logged in, navigate to dashboard with the URL if provided
      if (youtubeUrl.trim()) {
        navigate('/dashboard', { state: { youtubeUrl: youtubeUrl.trim() } });
      } else {
        navigate('/dashboard');
      }
    } else {
      // If not logged in, SignInButton will handle showing the modal
      // We need to trigger it programmatically
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-20 md:py-32 px-4">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Free{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI YouTube Content
            </span>{' '}
            Generation
          </h1>
          <p className="max-w-[750px] text-lg text-white/90 sm:text-xl font-light">
            Instantly, without uploading video files.
          </p>
          <div className="w-full max-w-2xl mt-8">
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="Enter YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isSignedIn && youtubeUrl.trim()) {
                    handleGetTranscript();
                  }
                }}
                className="flex-1 h-14 px-6 rounded-xl bg-white/10 border border-purple-300/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 text-base"
              />
              {isSignedIn ? (
                <button
                  onClick={handleGetTranscript}
                  className="h-14 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold hover:from-purple-500 hover:via-pink-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl text-base whitespace-nowrap"
                >
                  Get Video Transcript
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="h-14 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-semibold hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 transition-all shadow-lg hover:shadow-xl text-base whitespace-nowrap">
                    Get Video Transcript
                  </button>
                </SignInButton>
              )}
            </div>
            <p className="text-sm text-white/70 mt-4">Quick and simple. No catch.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 px-4">
        <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm hover:border-pink-300/40 hover:bg-white/10 transition-all">
            <CardHeader>
              <Sparkles className="mb-2 h-8 w-8 text-pink-400" />
              <CardTitle className="text-xl text-white">AI-Powered Generation</CardTitle>
              <CardDescription className="text-base text-white/70">
                Advanced AI models generate high-quality descriptions, tags, and captions tailored
                to your content.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm hover:border-pink-300/40 hover:bg-white/10 transition-all">
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-purple-400" />
              <CardTitle className="text-xl text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-base text-white/70">
                Get your content generated in minutes. No more spending hours writing descriptions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/5 border border-purple-300/20 backdrop-blur-sm hover:border-pink-300/40 hover:bg-white/10 transition-all">
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-blue-400" />
              <CardTitle className="text-xl text-white">Secure & Private</CardTitle>
              <CardDescription className="text-base text-white/70">
                Your content is processed securely. We never share your data with third parties.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 px-4">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold md:text-4xl text-white">Ready to get started?</h2>
          <p className="max-w-[750px] text-lg text-white/70">
            Sign in to start generating content for your YouTube videos today.
          </p>
          <SignInButton mode="modal">
            <button 
              type="button"
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold hover:from-purple-500 hover:via-pink-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl text-base"
            >
              Sign In to Get Started <ArrowRight className="inline h-5 w-5 ml-2" />
            </button>
          </SignInButton>
        </div>
      </section>
    </div>
  );
}

