import React, { useState } from 'react';
import MarginChart from './MarginChart';
import { useCollateral } from '../contexts/CollateralContext';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const MarginDashboard = () => {
  const { totalMargin, collateralAccounts, proofs, loading } = useCollateral();
  const [selectedAsset, setSelectedAsset] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const availableMargin = totalMargin;
  const usedMargin = 0; // Mock data
  const marginUtilization = (usedMargin / availableMargin) * 100;

  const verifiedProofs = proofs.filter(p => p.verificationStatus === 'verified');
  const pendingProofs = proofs.filter(p => p.verificationStatus === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Margin Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-dark-text">Available Margin</h3>
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            ${availableMargin.toLocaleString()}
          </div>
          <div className="text-sm text-dark-textSecondary">
            From {verifiedProofs.length} verified proofs
          </div>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-dark-text">Margin Utilization</h3>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            {marginUtilization.toFixed(1)}%
          </div>
          <div className="w-full bg-dark-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${marginUtilization}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-dark-text">Proof Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-textSecondary">Verified</span>
              <span className="text-accent font-semibold">{verifiedProofs.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-textSecondary">Pending</span>
              <span className="text-yellow-400 font-semibold">{pendingProofs.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Margin Chart */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-text">Real-time Margin Monitoring</h3>
          <select 
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-dark-surfaceHover border border-dark-border rounded-lg px-3 py-2 text-dark-text"
          >
            <option value="all">All Assets</option>
            {collateralAccounts.map(acc => (
              <option key={acc.accountId} value={acc.assetType}>
                {acc.assetType}
              </option>
            ))}
          </select>
        </div>
        <MarginChart variant="realtime" />
      </div>

      {/* Margin Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Trading Opportunities</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-surfaceHover rounded-lg">
              <div>
                <div className="font-semibold text-dark-text">BTC Long Position</div>
                <div className="text-sm text-dark-textSecondary">High confidence signal</div>
              </div>
              <div className="text-right">
                <div className="text-accent font-semibold">+15.2%</div>
                <div className="text-sm text-dark-textSecondary">Potential return</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-dark-surfaceHover rounded-lg">
              <div>
                <div className="font-semibold text-dark-text">ETH Short Position</div>
                <div className="text-sm text-dark-textSecondary">Medium confidence signal</div>
              </div>
              <div className="text-right">
                <div className="text-accent font-semibold">+8.7%</div>
                <div className="text-sm text-dark-textSecondary">Potential return</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Risk Management</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-dark-surfaceHover rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-semibold text-dark-text">Liquidation Risk</div>
                <div className="text-sm text-dark-textSecondary">Low - Monitor closely</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-dark-surfaceHover rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent" />
              <div>
                <div className="font-semibold text-dark-text">Collateral Health</div>
                <div className="text-sm text-dark-textSecondary">Excellent - 85% LTV ratio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarginDashboard;