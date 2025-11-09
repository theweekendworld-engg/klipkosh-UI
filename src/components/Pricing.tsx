import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free Trial',
    price: '$0',
    description: 'Perfect for trying out KlipKosh',
    icon: <Sparkles className="h-6 w-6" />,
    gradient: 'from-blue-500/20 via-purple-500/20 to-pink-500/20',
    features: [
      '5 free generations',
      'Basic AI models',
      'Standard content quality',
      'Community support',
    ],
  },
  {
    name: 'Starter',
    price: '$9',
    description: 'For content creators getting started',
    icon: <Zap className="h-6 w-6" />,
    gradient: 'from-pink-500/20 via-purple-500/20 to-blue-500/20',
    popular: true,
    features: [
      '50 generations per month',
      'Advanced AI models',
      'High-quality content',
      'Priority support',
      'Custom tone settings',
      'Export to multiple formats',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professional content creators',
    icon: <Crown className="h-6 w-6" />,
    gradient: 'from-purple-500/20 via-pink-500/20 to-blue-500/20',
    features: [
      'Unlimited generations',
      'Premium AI models (GPT-5)',
      'Highest quality content',
      '24/7 priority support',
      'Advanced customization',
      'Bulk processing',
      'API access',
      'White-label options',
    ],
  },
];

export function Pricing() {
  return (
    <div className="container max-w-7xl py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-1 h-64 bg-gradient-to-b from-pink-500/20 via-purple-500/30 to-transparent animate-pulse"></div>
        <div className="absolute top-40 right-10 w-1 h-48 bg-gradient-to-b from-purple-500/20 via-pink-500/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Select the perfect plan for your content creation needs. All plans include our AI-powered YouTube content generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`bg-white/5 border backdrop-blur-sm shadow-lg transition-all relative overflow-hidden group ${
                plan.popular
                  ? 'border-pink-300/40 shadow-pink-500/20 scale-105 md:scale-110'
                  : 'border-purple-300/20 shadow-purple-500/10 hover:border-pink-300/40 hover:shadow-pink-500/20'
              }`}
            >
              {/* Animated gradient lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-pink-300/40 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.gradient} border border-purple-300/30 text-white`}>
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {plan.name}
                    </CardTitle>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.price !== '$0' && (
                      <span className="text-white/60 text-sm">/month</span>
                    )}
                  </div>
                </div>
                <CardDescription className="text-white/70 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <Button
                  className={`w-full h-12 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white hover:from-purple-500 hover:via-pink-400 hover:to-blue-400 shadow-lg hover:shadow-xl hover:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-purple-600/90 via-pink-500/90 to-blue-500/90 text-white hover:from-purple-500/90 hover:via-pink-400/90 hover:to-blue-400/90 shadow-md hover:shadow-lg hover:shadow-purple-500/20'
                  }`}
                >
                  {plan.price === '$0' ? 'Get Started' : 'Subscribe Now'}
                </Button>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white/90 mb-3">Features:</h3>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-sm text-white/80">
                        <div className="mt-0.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-pink-400" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/60">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

