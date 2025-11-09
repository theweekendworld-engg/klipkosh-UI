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
      <section className="container flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-12 sm:py-20 md:py-32 px-4">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 sm:gap-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter px-2">
            Free{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI YouTube Content
            </span>{' '}
            Generation
          </h1>
          <p className="max-w-[750px] text-base sm:text-lg md:text-xl text-white/90 font-light px-4">
            Instantly, without uploading video files.
          </p>
          <div className="w-full max-w-2xl mt-4 sm:mt-8 px-2">
            <div className="flex flex-col sm:flex-row gap-3">
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
                className="flex-1 h-12 sm:h-14 px-4 sm:px-6 rounded-xl bg-white/10 border border-purple-300/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 text-sm sm:text-base"
              />
              {isSignedIn ? (
                <button
                  onClick={handleGetTranscript}
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-purple-600/90 via-pink-500/90 to-blue-500/90 text-white font-semibold hover:from-purple-500/90 hover:via-pink-400/90 hover:to-blue-400/90 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base whitespace-nowrap group w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Video Transcript
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-purple-600/90 via-purple-500/90 to-pink-500/90 text-white font-semibold hover:from-purple-500/90 hover:via-purple-400/90 hover:to-pink-400/90 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base whitespace-nowrap group w-full sm:w-auto">
                    <span className="flex items-center justify-center gap-2">
                      Get Video Transcript
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </SignInButton>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4">Quick and simple. No catch.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-8 sm:py-12 md:py-24 px-4">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* CTA Section - Only show when not signed in */}
      {!isSignedIn && (
        <section className="container py-8 sm:py-12 md:py-24 px-4">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-3 sm:gap-4 text-center px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">Ready to get started?</h2>
            <p className="max-w-[750px] text-sm sm:text-base md:text-lg text-white/70 px-4">
              Sign in to start generating content for your YouTube videos today.
            </p>
            <SignInButton mode="modal">
              <button 
                type="button"
                className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-purple-600/90 via-pink-500/90 to-blue-500/90 text-white font-semibold hover:from-purple-500/90 hover:via-pink-400/90 hover:to-blue-400/90 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base group"
              >
                <span className="flex items-center gap-2">
                  Sign In to Get Started
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </SignInButton>
          </div>
        </section>
      )}
    </div>
  );
}

