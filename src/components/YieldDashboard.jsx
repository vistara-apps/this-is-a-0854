import React from 'react';
import YieldCard from './YieldCard';
import MarginChart from './MarginChart';
import { useCollateral } from '../contexts/CollateralContext';
import { TrendingUp, DollarSign, BarChart3, RefreshCw } from 'lucide-react';

const YieldDashboard = () => {
  const { collateralAccounts, totalYield, loading } = useCollateral();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalValue = collateralAccounts.reduce((sum, acc) => sum + acc.currentValue, 0);
  const avgYieldRate = collateralAccounts.reduce((sum, acc) => sum + acc.yieldRate, 0) / collateralAccounts.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-dark-text">Total Yield Earned</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            ${totalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-dark-textSecondary">+12.3% from last month</div>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-dark-text">Total Value Locked</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-dark-textSecondary">Across {collateralAccounts.length} assets</div>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-dark-text">Average APY</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            {avgYieldRate.toFixed(1)}%
          </div>
          <div className="text-sm text-dark-textSecondary">Optimized automatically</div>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-text">Yield Performance</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-surfaceHover rounded-lg text-dark-textSecondary hover:text-dark-text transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        <MarginChart variant="historical" />
      </div>

      {/* Collateral Assets */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-dark-text">Your Yield-Generating Assets</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collateralAccounts.map((account) => (
            <YieldCard 
              key={account.accountId} 
              account={account} 
              variant="detailed" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default YieldDashboard;