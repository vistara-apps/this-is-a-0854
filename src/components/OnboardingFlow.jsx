import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ArrowRight, ArrowLeft, Check, Wallet, Scan, BarChart2, Shield } from 'lucide-react';
import CollateralScanner from './CollateralScanner';

const OnboardingFlow = ({ onComplete }) => {
  const { isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [collateralAccounts, setCollateralAccounts] = useState([]);
  const [yieldPreferences, setYieldPreferences] = useState({
    autoRebalance: false,
    riskTolerance: 'medium',
    notifyOnOpportunities: true,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      if (onComplete) {
        onComplete({
          collateralAccounts,
          yieldPreferences,
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleScanComplete = (accounts) => {
    setCollateralAccounts(accounts);
    // Automatically go to next step after scan completes
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleYieldPreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setYieldPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">Welcome to LighterYield</h2>
              <p className="text-dark-textSecondary max-w-md mx-auto">
                Let's set up your account to start earning yield on your L1 collateral and access margin for trading.
              </p>
            </div>
            
            <div className="p-6 bg-dark-surfaceHover rounded-lg">
              <h3 className="font-semibold text-dark-text mb-4">What you'll need:</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-500/20 text-green-500' : 'bg-dark-border text-dark-textSecondary'}`}>
                    {isConnected ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span className={isConnected ? 'text-dark-text' : 'text-dark-textSecondary'}>
                    Connect your wallet {isConnected && '(Completed)'}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-dark-border text-dark-textSecondary flex items-center justify-center">
                    2
                  </div>
                  <span className="text-dark-textSecondary">Scan for yield-bearing assets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-dark-border text-dark-textSecondary flex items-center justify-center">
                    3
                  </div>
                  <span className="text-dark-textSecondary">Set your yield preferences</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-dark-border text-dark-textSecondary flex items-center justify-center">
                    4
                  </div>
                  <span className="text-dark-textSecondary">Generate your first zk-proof</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">Scan for Collateral</h2>
              <p className="text-dark-textSecondary max-w-md mx-auto">
                Let's scan your wallet for yield-bearing assets that can be used as collateral.
              </p>
            </div>
            
            <CollateralScanner onScanComplete={handleScanComplete} />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">Yield Preferences</h2>
              <p className="text-dark-textSecondary max-w-md mx-auto">
                Set your preferences for yield optimization and rebalancing.
              </p>
            </div>
            
            <div className="glass-effect rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="autoRebalance"
                      checked={yieldPreferences.autoRebalance}
                      onChange={handleYieldPreferenceChange}
                      className="w-5 h-5 rounded border-dark-border text-accent focus:ring-accent"
                    />
                    <span className="text-dark-text font-medium">Automatically rebalance for optimal yield</span>
                  </label>
                  <p className="text-dark-textSecondary text-sm mt-1 ml-8">
                    Allow LighterYield to automatically move your assets to the highest-yielding vaults.
                  </p>
                </div>
                
                <div>
                  <label className="block text-dark-text font-medium mb-2">Risk Tolerance</label>
                  <select
                    name="riskTolerance"
                    value={yieldPreferences.riskTolerance}
                    onChange={handleYieldPreferenceChange}
                    className="w-full bg-dark-surfaceHover border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent"
                  >
                    <option value="low">Low - Prioritize safety over yield</option>
                    <option value="medium">Medium - Balanced approach</option>
                    <option value="high">High - Maximize yield</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifyOnOpportunities"
                      checked={yieldPreferences.notifyOnOpportunities}
                      onChange={handleYieldPreferenceChange}
                      className="w-5 h-5 rounded border-dark-border text-accent focus:ring-accent"
                    />
                    <span className="text-dark-text font-medium">Notify me about yield opportunities</span>
                  </label>
                  <p className="text-dark-textSecondary text-sm mt-1 ml-8">
                    Receive notifications when better yield opportunities are available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">Ready to Go!</h2>
              <p className="text-dark-textSecondary max-w-md mx-auto">
                Your account is set up and ready to use. You can now start earning yield on your L1 collateral and access margin for trading.
              </p>
            </div>
            
            <div className="glass-effect rounded-lg p-6">
              <h3 className="font-semibold text-dark-text mb-4">Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-dark-textSecondary mb-1">Collateral Assets</div>
                  <div className="text-dark-text">
                    {collateralAccounts.length} assets worth ${collateralAccounts.reduce((sum, acc) => sum + acc.currentValue, 0).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-dark-textSecondary mb-1">Yield Preferences</div>
                  <div className="text-dark-text">
                    {yieldPreferences.autoRebalance ? 'Automatic' : 'Manual'} rebalancing with {yieldPreferences.riskTolerance} risk tolerance
                  </div>
                </div>
                
                <div>
                  <div className="text-dark-textSecondary mb-1">Next Steps</div>
                  <ul className="list-disc list-inside text-dark-text space-y-1">
                    <li>Generate zk-proofs for your collateral</li>
                    <li>Explore yield optimization opportunities</li>
                    <li>Access margin for trading</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-textSecondary">Step {step} of {totalSteps}</span>
          <span className="text-sm text-dark-textSecondary">{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-dark-border rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      {renderStepContent()}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed text-dark-text rounded-lg transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={step === 2 && collateralAccounts.length === 0}
          className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {step === totalSteps ? (
            <>
              <span>Complete Setup</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
