import { Check, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free Trial',
    price: '$0',
    description: 'Perfect for trying out KlipKosh',
    features: [
      '5 free generations',
      'Basic AI models',
      'Standard content quality',
      'Community support',
    ],
  },
  {
    name: 'Starter',
    price: '$3',
    description: 'For content creators getting started',
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
    price: '$5',
    description: 'For professional content creators',
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="container max-w-6xl py-16 px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include our AI-powered YouTube content generation.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`bg-white/5 border backdrop-blur-sm transition-all ${
                  plan.popular
                    ? 'border-purple-400/50 shadow-lg shadow-purple-500/10 md:scale-105'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-white/60 text-base">/month</span>
                    )}
                  </div>
                  <CardDescription className="text-white/70 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    className={`w-full h-12 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                        : plan.price === '$0'
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-white text-gray-900 hover:bg-white/90'
                    }`}
                  >
                    {plan.price === '$0' ? 'Get Started' : 'Subscribe Now'}
                    {plan.price !== '$0' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                      Features
                    </h3>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-white/80">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <h3 className="font-semibold text-white">Secure Payment</h3>
                </div>
                <p className="text-sm text-white/70">
                  All payments are processed securely through encrypted channels.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Cancel Anytime</h3>
                </div>
                <p className="text-sm text-white/70">
                  No long-term commitments. Cancel your subscription at any time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Check className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold text-white">7-Day Guarantee</h3>
                </div>
                <p className="text-sm text-white/70">
                  Try any plan risk-free with our 7-day money-back guarantee.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm text-left">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-2">Can I change plans later?</h3>
                  <p className="text-sm text-white/70">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm text-left">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-white/70">
                    We accept all major credit cards, debit cards, and PayPal for your convenience.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm text-left">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
                  <p className="text-sm text-white/70">
                    Yes, the Free Trial plan includes 5 generations so you can test our service before committing.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm text-left">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-2">How does billing work?</h3>
                  <p className="text-sm text-white/70">
                    All plans are billed monthly. You'll be charged on the same date each month.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
