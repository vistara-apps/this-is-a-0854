import React, { useState, useEffect } from 'react';
import { useCollateral } from '../contexts/CollateralContext';
import { useUser } from '../contexts/UserContext';
import proofService from '../services/proofService';
import marginService from '../services/marginService';
import { TrendingUp, Shield, AlertTriangle, Check, RefreshCw, ExternalLink } from 'lucide-react';
import ProofStatusIndicator from './ProofStatusIndicator';

const TradingPreparation = () => {
  const { collateralAccounts, proofs, loading: collateralLoading, generateProof } = useCollateral();
  const { user, loading: userLoading } = useUser();
  const [selectedCollateral, setSelectedCollateral] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [availableMargin, setAvailableMargin] = useState(0);
  const [tradingOpportunities, setTradingOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarginData = async () => {
      if (collateralLoading || userLoading || proofs.length === 0) return;
      
      setLoading(true);
      try {
        // Calculate available margin
        const marginData = await marginService.calculateAvailableMargin(collateralAccounts, proofs);
        setAvailableMargin(marginData.totalAvailableMargin);
        
        // Get trading opportunities
        const opportunities = await marginService.getTradingOpportunities(marginData.totalAvailableMargin);
        setTradingOpportunities(opportunities.opportunities);
      } catch (err) {
        console.error('Error fetching margin data:', err);
        setError('Failed to fetch margin data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarginData();
  }, [collateralAccounts, proofs, collateralLoading, userLoading]);

  const handleGenerateProof = async () => {
    if (!selectedCollateral) return;
    
    setIsGeneratingProof(true);
    setError(null);
    
    try {
      await generateProof(selectedCollateral);
      
      // Refresh margin data after generating proof
      const marginData = await marginService.calculateAvailableMargin(collateralAccounts, proofs);
      setAvailableMargin(marginData.totalAvailableMargin);
      
      // Reset selected collateral
      setSelectedCollateral('');
    } catch (err) {
      console.error('Error generating proof:', err);
      setError('Failed to generate proof. Please try again.');
    } finally {
      setIsGeneratingProof(false);
    }
  };

  if (loading || collateralLoading || userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter for collateral accounts that don't have verified proofs yet
  const accountsWithoutProofs = collateralAccounts.filter(account => {
    return !proofs.some(proof => 
      proof.collateralAddress === account.address && 
      proof.assetType === account.assetType && 
      proof.verificationStatus === 'verified'
    );
  });

  // Get verified proofs
  const verifiedProofs = proofs.filter(proof => proof.verificationStatus === 'verified');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Available Margin */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Available Margin</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-dark-surfaceHover rounded-lg">
            <div className="text-dark-textSecondary mb-2">Total Available Margin</div>
            <div className="text-3xl font-bold text-accent">
              ${availableMargin.toLocaleString()}
            </div>
            <div className="text-sm text-dark-textSecondary mt-1">
              Based on {verifiedProofs.length} verified proof{verifiedProofs.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="p-6 bg-dark-surfaceHover rounded-lg">
            <div className="text-dark-textSecondary mb-2">Collateral Utilization</div>
            <div className="text-3xl font-bold text-primary">
              0%
            </div>
            <div className="text-sm text-dark-textSecondary mt-1">
              No active margin positions
            </div>
          </div>
        </div>
      </div>
      
      {/* Generate Proof */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Generate zk-Proof</h3>
        </div>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-dark-text">{error}</div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Select Collateral Asset
            </label>
            <select
              value={selectedCollateral}
              onChange={(e) => setSelectedCollateral(e.target.value)}
              disabled={accountsWithoutProofs.length === 0 || isGeneratingProof}
              className="w-full bg-dark-surfaceHover border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Choose an asset...</option>
              {accountsWithoutProofs.map(acc => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.assetType} - {acc.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} tokens (${acc.currentValue.toLocaleString()})
                </option>
              ))}
            </select>
            
            {accountsWithoutProofs.length === 0 && (
              <p className="text-sm text-dark-textSecondary mt-2">
                All your collateral assets already have verified proofs.
              </p>
            )}
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleGenerateProof}
              disabled={!selectedCollateral || isGeneratingProof}
              className="w-full py-3 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGeneratingProof ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Proof...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Generate Proof</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Existing Proofs */}
        <div>
          <h4 className="font-semibold text-dark-text mb-4">Your Proofs</h4>
          
          {proofs.length === 0 ? (
            <div className="text-center py-8 bg-dark-surfaceHover rounded-lg">
              <Shield className="w-12 h-12 text-dark-border mx-auto mb-3" />
              <p className="text-dark-textSecondary">
                No proofs generated yet. Generate your first proof to start trading.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proofs.map((proof) => (
                <div key={proof.proofId} className="flex items-center justify-between p-4 bg-dark-surfaceHover rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {proof.assetType === 'ETH' ? '⟠' : 
                       proof.assetType === 'stETH' ? '🔷' : 
                       proof.assetType === 'USDC' ? '💵' : '💰'}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-text">{proof.assetType} Proof</div>
                      <div className="text-sm text-dark-textSecondary">
                        {proof.collateralAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} tokens
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <ProofStatusIndicator status={proof.verificationStatus} />
                    
                    {proof.verificationStatus === 'verified' && (
                      <button className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Trade</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Trading Opportunities */}
      {tradingOpportunities.length > 0 && (
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text">Trading Opportunities</h3>
            </div>
            
            <button className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-border text-dark-textSecondary rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {tradingOpportunities.map((opportunity, index) => (
              <div key={index} className="border border-dark-border rounded-lg p-4 hover:bg-dark-surfaceHover transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {opportunity.asset === 'BTC' ? '₿' : 
                       opportunity.asset === 'ETH' ? '⟠' : '📈'}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-text">
                        {opportunity.position.toUpperCase()} {opportunity.asset}
                      </div>
                      <div className="text-sm text-dark-textSecondary">
                        {opportunity.timeframe} timeframe
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-accent">
                      +{opportunity.potentialReturn.toFixed(1)}% potential return
                    </div>
                    <div className="text-sm text-dark-textSecondary">
                      {opportunity.confidence} confidence
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-dark-textSecondary mb-3">
                  {opportunity.reasoning}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-dark-textSecondary">
                    Required margin: ${opportunity.marginRequired.toLocaleString()}
                  </div>
                  
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Trade Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingPreparation;

