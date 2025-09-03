import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, TrendingUp, Zap, ChevronRight } from 'lucide-react';

const WelcomeScreen = () => {
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
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                );
              }}
            </ConnectButton.Custom>
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