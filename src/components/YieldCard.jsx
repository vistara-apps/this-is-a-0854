import React from 'react';
import { TrendingUp, MoreHorizontal } from 'lucide-react';

const YieldCard = ({ account, variant = 'detailed' }) => {
  const { assetType, amount, yieldRate, yieldAccrued, currentValue } = account;

  const getAssetIcon = (type) => {
    const icons = {
      'ETH': '⟠',
      'stETH': '🔷',
      'USDC': '💰',
    };
    return icons[type] || '🪙';
  };

  if (variant === 'compact') {
    return (
      <div className="glass-effect rounded-lg p-4 hover:bg-dark-surfaceHover transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getAssetIcon(assetType)}</div>
            <div>
              <div className="font-semibold text-dark-text">{assetType}</div>
              <div className="text-sm text-dark-textSecondary">{amount} tokens</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-accent">{yieldRate}% APY</div>
            <div className="text-sm text-dark-textSecondary">+{yieldAccrued.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-lg p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getAssetIcon(assetType)}</div>
          <div>
            <h4 className="text-lg font-semibold text-dark-text">{assetType}</h4>
            <p className="text-dark-textSecondary">{amount} tokens</p>
          </div>
        </div>
        <button className="p-2 text-dark-textSecondary hover:text-dark-text transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-dark-textSecondary">Current Value</span>
          <span className="font-semibold text-dark-text">
            ${currentValue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-dark-textSecondary">Yield Earned</span>
          <span className="font-semibold text-accent">
            +${yieldAccrued.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-dark-textSecondary">Current APY</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-accent">{yieldRate}%</span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
        </div>

        <div className="pt-4 border-t border-dark-border">
          <button className="w-full py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors">
            Optimize Yield
          </button>
        </div>
      </div>
    </div>
  );
};

export default YieldCard;