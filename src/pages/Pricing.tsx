import { Check, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    name: 'Free Trial',
    price: '$0',
    description: 'Perfect for trying out PostPilot',
    features: [
      '5 free generations',
      'Basic AI models',
      'Standard support',
      'YouTube URL processing',
      'Basic content generation',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Starter',
    price: '$5',
    description: 'For content creators getting started',
    features: [
      '100 generations per month',
      'Advanced AI models',
      'Priority support',
      'Custom tone selection',
      'Multiple provider options',
      'Export capabilities',
      'Job history',
    ],
    popular: true,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$10',
    description: 'For power users and agencies',
    features: [
      'Unlimited generations',
      'Premium AI models',
      '24/7 priority support',
      'Advanced customization',
      'All provider options',
      'Bulk processing',
      'API access',
      'White-label options',
      'Custom integrations',
    ],
    cta: 'Go Pro',
  },
];

export function Pricing() {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    // TODO: Implement plan selection logic
    console.log(`Selected plan: ${planName}`);
    // For now, just navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container flex-1 py-12 space-y-12 max-w-6xl px-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="max-w-[750px] mx-auto text-lg text-white/90 sm:text-xl font-light">
            Select the perfect plan for your content generation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-white/5 border backdrop-blur-sm transition-all ${
                plan.popular
                  ? 'border-purple-400/50 shadow-lg shadow-purple-500/20 scale-105'
                  : 'border-purple-300/20 hover:border-purple-300/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-base text-white/70 mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  {plan.price !== '$0' && (
                    <span className="text-white/70 text-sm ml-1">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full h-12 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-purple-300/30'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-2">
          <p className="text-white/70 text-sm">
            All plans include secure processing and data privacy
          </p>
          <p className="text-white/50 text-xs">
            Need a custom plan? <a href="#" className="text-purple-400 hover:text-purple-300 underline">Contact us</a>
          </p>
        </div>
      </main>
    </div>
  );
}

