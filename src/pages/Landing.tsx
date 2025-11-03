import { Link } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-20 md:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Transform YouTube Videos into
            <span className="text-primary"> Engaging Content</span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            PostPilot uses AI to generate YouTube descriptions, tags, summaries, and social media
            captions from your video content. Save time and boost engagement.
          </p>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </SignInButton>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Sparkles className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>AI-Powered Generation</CardTitle>
              <CardDescription>
                Advanced AI models generate high-quality descriptions, tags, and captions tailored
                to your content.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Get your content generated in minutes. No more spending hours writing descriptions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your content is processed securely. We never share your data with third parties.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold md:text-4xl">Ready to get started?</h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Sign in to start generating content for your YouTube videos today.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="gap-2">
              Sign In to Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </SignInButton>
        </div>
      </section>
    </div>
  );
}

