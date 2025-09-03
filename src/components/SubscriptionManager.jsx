import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { CreditCard, Check, Crown, Zap } from 'lucide-react';

const SubscriptionManager = () => {
  const { subscription, upgradeSubscription } = useUser();
  const { createSession } = usePaymentContext();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 10,
      description: 'Essential features for yield tracking',
      features: [
        'Yield aggregation dashboard',
        'Basic analytics',
        'Email support',
        'Up to 3 collateral assets',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 50,
      description: 'Advanced features for serious traders',
      features: [
        'Everything in Basic',
        'Advanced analytics & insights',
        'Auto-rebalancing',
        'Priority support',
        'Unlimited assets',
        'Custom yield strategies',
        'API access',
      ],
      popular: true,
    },
  ];

  const handleUpgrade = async (planId) => {
    if (planId === subscription?.tier) return;
    
    setSelectedPlan(planId);
    setIsUpgrading(true);

    try {
      const plan = plans.find(p => p.id === planId);
      await createSession(`$${plan.price}`);
      upgradeSubscription(planId);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsUpgrading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Subscription */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Current Subscription</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Plan</div>
            <div className="text-lg font-semibold text-dark-text capitalize">
              {subscription?.tier || 'None'} Plan
            </div>
          </div>
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Status</div>
            <div className={`text-lg font-semibold ${
              subscription?.status === 'active' ? 'text-accent' : 'text-red-400'
            }`}>
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Expires</div>
            <div className="text-lg font-semibold text-dark-text">
              {subscription?.expiresAt 
                ? new Date(subscription.expiresAt).toLocaleDateString()
                : 'N/A'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark-text">Choose Your Plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`glass-effect rounded-lg p-6 relative transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-accent' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-dark-text mb-2">{plan.name}</h4>
                <p className="text-dark-textSecondary mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-accent mb-2">
                  ${plan.price}
                  <span className="text-lg text-dark-textSecondary">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-dark-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === subscription?.tier || (isUpgrading && selectedPlan === plan.id)}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  plan.id === subscription?.tier
                    ? 'bg-dark-border text-dark-textSecondary cursor-not-allowed'
                    : plan.popular
                    ? 'bg-accent hover:bg-accent/90 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {isUpgrading && selectedPlan === plan.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : plan.id === subscription?.tier ? (
                  <span>Current Plan</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Upgrade to {plan.name}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-xl font-semibold text-dark-text mb-6">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 text-dark-textSecondary">Feature</th>
                <th className="text-center py-3 text-dark-textSecondary">Basic</th>
                <th className="text-center py-3 text-dark-textSecondary">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Yield Dashboard', basic: true, pro: true },
                { name: 'Basic Analytics', basic: true, pro: true },
                { name: 'Advanced Analytics', basic: false, pro: true },
                { name: 'Auto-rebalancing', basic: false, pro: true },
                { name: 'Priority Support', basic: false, pro: true },
                { name: 'API Access', basic: false, pro: true },
                { name: 'Custom Strategies', basic: false, pro: true },
              ].map((feature, index) => (
                <tr key={index} className="border-b border-dark-border">
                  <td className="py-3 text-dark-text">{feature.name}</td>
                  <td className="py-3 text-center">
                    {feature.basic ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <span className="text-dark-textSecondary">-</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {feature.pro ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <span className="text-dark-textSecondary">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;