import React, { useState, useEffect } from 'react';
import { useCollateral } from '../contexts/CollateralContext';
import { useUser } from '../contexts/UserContext';
import yieldRebalancingService from '../services/yieldRebalancingService';
import { ArrowUpDown, TrendingUp, AlertTriangle, Check, RefreshCw } from 'lucide-react';

const YieldRebalancer = () => {
  const { collateralAccounts, loading: collateralLoading, rebalanceYield } = useCollateral();
  const { hasFeature } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState('');
  const [availableVaults, setAvailableVaults] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedVault, setSelectedVault] = useState(null);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check if user has access to auto-rebalancing
  const hasAutoRebalancing = hasFeature('auto-rebalancing');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (collateralAccounts.length === 0 || collateralLoading) return;
      
      setLoading(true);
      try {
        const result = await yieldRebalancingService.getYieldOptimizationRecommendations(collateralAccounts);
        setRecommendations(result.recommendations);
        setAiInsights(result.aiInsights);
        
        // Get available vaults for all asset types
        const vaults = await yieldRebalancingService.getAvailableYieldVaults();
        setAvailableVaults(vaults);
      } catch (error) {
        console.error('Error fetching yield recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [collateralAccounts, collateralLoading]);

  const handleRebalance = async (accountId, vaultId) => {
    setIsRebalancing(true);
    try {
      await rebalanceYield(accountId, { id: vaultId });
      // Refresh recommendations after rebalancing
      const result = await yieldRebalancingService.getYieldOptimizationRecommendations(collateralAccounts);
      setRecommendations(result.recommendations);
      setAiInsights(result.aiInsights);
    } catch (error) {
      console.error('Error rebalancing yield:', error);
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleSelectAccount = (accountId) => {
    const account = collateralAccounts.find(acc => acc.accountId === accountId);
    setSelectedAccount(account);
    setSelectedVault(null);
  };

  const handleSelectVault = (vaultId) => {
    const vault = availableVaults.find(v => v.vaultId === vaultId);
    setSelectedVault(vault);
  };

  const handleManualRebalance = async () => {
    if (!selectedAccount || !selectedVault) return;
    
    setIsRebalancing(true);
    try {
      await rebalanceYield(selectedAccount.accountId, { id: selectedVault.vaultId });
      // Reset selection
      setSelectedAccount(null);
      setSelectedVault(null);
      // Refresh recommendations
      const result = await yieldRebalancingService.getYieldOptimizationRecommendations(collateralAccounts);
      setRecommendations(result.recommendations);
      setAiInsights(result.aiInsights);
    } catch (error) {
      console.error('Error manually rebalancing yield:', error);
    } finally {
      setIsRebalancing(false);
    }
  };

  if (loading || collateralLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Yield Optimization Recommendations */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Yield Optimization Recommendations</h3>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-dark-textSecondary">No yield optimization recommendations available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.accountId} className="border border-dark-border rounded-lg p-4 hover:bg-dark-surfaceHover transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {rec.assetType === 'ETH' ? '⟠' : 
                       rec.assetType === 'stETH' ? '🔷' : 
                       rec.assetType === 'USDC' ? '💵' : '💰'}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-text">{rec.assetType}</div>
                      <div className="text-sm text-dark-textSecondary">Current yield: {rec.currentYield.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-dark-text">{rec.recommendedAggregator}</div>
                    <div className="text-sm text-accent">Potential yield: {rec.potentialYield.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs ${
                      rec.riskLevel === 'low' ? 'bg-green-500/20 text-green-500' :
                      rec.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {rec.riskLevel.toUpperCase()} RISK
                    </div>
                    
                    {rec.yieldIncrease > 0 && (
                      <div className="text-xs text-accent">
                        +{rec.yieldIncrease.toFixed(1)}% increase
                      </div>
                    )}
                  </div>
                  
                  {rec.yieldIncrease > 0 ? (
                    <button
                      onClick={() => handleRebalance(rec.accountId, rec.aggregatorId)}
                      disabled={isRebalancing}
                      className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isRebalancing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Rebalancing...</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpDown className="w-4 h-4" />
                          <span>Rebalance</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-dark-surfaceHover text-dark-textSecondary rounded-lg flex items-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Optimized</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insights */}
        {aiInsights && (
          <div className="mt-6 p-4 bg-dark-surfaceHover rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h4 className="font-semibold text-dark-text">AI Yield Insights</h4>
            </div>
            <p className="text-sm text-dark-textSecondary">{aiInsights}</p>
          </div>
        )}
      </div>

      {/* Manual Rebalancing (Pro feature) */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text">Manual Yield Rebalancing</h3>
          </div>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-border text-dark-textSecondary rounded-lg transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {!hasAutoRebalancing && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-dark-text">Pro Feature</h4>
              <p className="text-sm text-dark-textSecondary">
                Automatic yield rebalancing is available with the Pro subscription.
                Upgrade to automatically optimize your yield across different protocols.
              </p>
            </div>
          </div>
        )}

        {showAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Select Asset to Rebalance
                </label>
                <select
                  value={selectedAccount ? selectedAccount.accountId : ''}
                  onChange={(e) => handleSelectAccount(e.target.value)}
                  className="w-full bg-dark-surfaceHover border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent"
                >
                  <option value="">Choose an asset...</option>
                  {collateralAccounts.map(acc => (
                    <option key={acc.accountId} value={acc.accountId}>
                      {acc.assetType} - {acc.amount} tokens ({acc.yieldRate.toFixed(1)}% APY)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Select Target Vault
                </label>
                <select
                  value={selectedVault ? selectedVault.vaultId : ''}
                  onChange={(e) => handleSelectVault(e.target.value)}
                  disabled={!selectedAccount}
                  className="w-full bg-dark-surfaceHover border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a vault...</option>
                  {availableVaults
                    .filter(vault => !selectedAccount || vault.asset === selectedAccount.assetType || vault.asset === 'Multiple')
                    .map(vault => (
                      <option key={vault.vaultId} value={vault.vaultId}>
                        {vault.name} - {vault.apy.toFixed(1)}% APY ({vault.riskLevel} risk)
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {selectedAccount && selectedVault && (
              <div className="p-4 bg-dark-surfaceHover rounded-lg">
                <h4 className="font-semibold text-dark-text mb-2">Rebalance Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-dark-textSecondary">Current Yield</div>
                    <div className="text-dark-text">{selectedAccount.yieldRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-dark-textSecondary">New Yield</div>
                    <div className="text-accent">{selectedVault.apy.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-dark-textSecondary">Yield Increase</div>
                    <div className="text-accent">
                      {(selectedVault.apy - selectedAccount.yieldRate).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-dark-textSecondary">Risk Level</div>
                    <div className={`${
                      selectedVault.riskLevel === 'low' ? 'text-green-500' :
                      selectedVault.riskLevel === 'medium' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {selectedVault.riskLevel.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleManualRebalance}
                disabled={!selectedAccount || !selectedVault || isRebalancing}
                className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isRebalancing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rebalancing...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Execute Rebalance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldRebalancer;

