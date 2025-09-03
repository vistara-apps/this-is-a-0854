import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Shield, TrendingUp, Zap, ChevronRight, Check } from 'lucide-react';
import OnboardingFlow from './OnboardingFlow';

const WelcomeScreen = () => {
  const { isConnected } = useAccount();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleGetStarted = () => {
    if (isConnected) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (data) => {
    console.log('Onboarding completed with data:', data);
    // In a real implementation, this would save the data and redirect to the dashboard
    // For now, we'll rely on the App component to detect the connected wallet and show the dashboard
  };

  // If connected and onboarding is shown, render the onboarding flow
  if (isConnected && showOnboarding) {
    return (
      <div className="min-h-screen gradient-bg py-12">
        <div className="container mx-auto px-6">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-16">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-dark-text">LighterYield</h1>
            </div>
            <ConnectButton />
          </header>
          
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  // Otherwise, render the welcome screen
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-text">LighterYield</h1>
          </div>
          <ConnectButton />
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-dark-text mb-6 leading-tight">
            Your locked collateral,<br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              unlocked margin
            </span>
          </h2>
          <p className="text-xl text-dark-textSecondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Earn yield, trade with confidence. Leverage zk-proofs to access margin 
            without moving your L1 assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <span>Connect Wallet</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  );
                }}
              </ConnectButton.Custom>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-effect rounded-lg p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text mb-4">Yield Aggregation</h3>
            <p className="text-dark-textSecondary leading-relaxed">
              Unified dashboard displaying all accrued yield from L1 collateral 
              with automatic rebalancing to maximize returns.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text mb-4">zk-Proof Generation</h3>
            <p className="text-dark-textSecondary leading-relaxed">
              Securely generate proofs of locked L1 collateral to access 
              margin for trading without transferring your assets.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text mb-4">Real-time Monitoring</h3>
            <p className="text-dark-textSecondary leading-relaxed">
              Dynamic dashboard showing available trading margin based on 
              your collateral and current market conditions.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20 mb-20">
          <h2 className="text-3xl font-bold text-dark-text text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-effect rounded-lg p-8 border border-dark-border hover:border-accent transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-dark-text mb-2">Basic</h3>
                <div className="text-4xl font-bold text-accent mb-2">$10<span className="text-lg text-dark-textSecondary">/month</span></div>
                <p className="text-dark-textSecondary">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Yield Aggregation Dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Basic Analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Manual Yield Rebalancing</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">zk-Proof Generation</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="glass-effect rounded-lg p-8 border-2 border-accent relative">
              <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-dark-text mb-2">Pro</h3>
                <div className="text-4xl font-bold text-accent mb-2">$50<span className="text-lg text-dark-textSecondary">/month</span></div>
                <p className="text-dark-textSecondary">For serious yield optimizers</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Everything in Basic</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Advanced Analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Automatic Yield Rebalancing</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">Priority Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-dark-text">AI-Powered Trading Insights</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 glass-effect rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">$2.4B+</div>
              <div className="text-dark-textSecondary">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15.7%</div>
              <div className="text-dark-textSecondary">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">50K+</div>
              <div className="text-dark-textSecondary">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-dark-textSecondary">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
