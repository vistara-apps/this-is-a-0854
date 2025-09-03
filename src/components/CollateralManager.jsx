import React from 'react';
import { useCollateral } from '../contexts/CollateralContext';
import CollateralTable from './CollateralTable';
import { Layers, Plus, RefreshCw } from 'lucide-react';

const CollateralManager = () => {
  const { collateralAccounts, loading } = useCollateral();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-text">Collateral Management</h2>
            <p className="text-dark-textSecondary">Manage your L1 assets and yield optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-surfaceHover text-dark-textSecondary hover:text-dark-text rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Collateral Table */}
      <div className="glass-effect rounded-lg p-6">
        <CollateralTable accounts={collateralAccounts} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Auto-Rebalancing</h3>
          <p className="text-dark-textSecondary mb-4">
            Automatically move assets to highest-yielding vaults when better opportunities arise.
          </p>
          <button className="w-full py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors">
            Enable Auto-Rebalancing
          </button>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Yield Optimization</h3>
          <p className="text-dark-textSecondary mb-4">
            Get personalized recommendations for maximizing your yield across different protocols.
          </p>
          <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
            View Recommendations
          </button>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Risk Assessment</h3>
          <p className="text-dark-textSecondary mb-4">
            Analyze the risk profile of your collateral portfolio and get insights.
          </p>
          <button className="w-full py-2 bg-dark-surfaceHover text-dark-text hover:bg-dark-border rounded-lg transition-colors">
            Analyze Risk
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollateralManager;