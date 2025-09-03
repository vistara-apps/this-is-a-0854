import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Target } from 'lucide-react';

const CollateralTable = ({ accounts }) => {
  const [sortBy, setSortBy] = useState('currentValue');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const getAssetIcon = (type) => {
    const icons = {
      'ETH': '⟠',
      'stETH': '🔷',
      'USDC': '💰',
    };
    return icons[type] || '🪙';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-4 px-2">
              <button
                onClick={() => handleSort('assetType')}
                className="flex items-center space-x-1 text-dark-textSecondary hover:text-dark-text transition-colors"
              >
                <span>Asset</span>
                <SortIcon column="assetType" />
              </button>
            </th>
            <th className="text-left py-4 px-2">
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center space-x-1 text-dark-textSecondary hover:text-dark-text transition-colors"
              >
                <span>Amount</span>
                <SortIcon column="amount" />
              </button>
            </th>
            <th className="text-left py-4 px-2">
              <button
                onClick={() => handleSort('currentValue')}
                className="flex items-center space-x-1 text-dark-textSecondary hover:text-dark-text transition-colors"
              >
                <span>Value</span>
                <SortIcon column="currentValue" />
              </button>
            </th>
            <th className="text-left py-4 px-2">
              <button
                onClick={() => handleSort('yieldRate')}
                className="flex items-center space-x-1 text-dark-textSecondary hover:text-dark-text transition-colors"
              >
                <span>APY</span>
                <SortIcon column="yieldRate" />
              </button>
            </th>
            <th className="text-left py-4 px-2">
              <button
                onClick={() => handleSort('yieldAccrued')}
                className="flex items-center space-x-1 text-dark-textSecondary hover:text-dark-text transition-colors"
              >
                <span>Yield Earned</span>
                <SortIcon column="yieldAccrued" />
              </button>
            </th>
            <th className="text-left py-4 px-2">
              <span className="text-dark-textSecondary">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.map((account) => (
            <tr key={account.accountId} className="border-b border-dark-border hover:bg-dark-surfaceHover transition-colors">
              <td className="py-4 px-2">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getAssetIcon(account.assetType)}</div>
                  <div>
                    <div className="font-semibold text-dark-text">{account.assetType}</div>
                    <div className="text-sm text-dark-textSecondary">{account.network}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="font-semibold text-dark-text">
                  {account.amount.toLocaleString(undefined, { 
                    minimumFractionDigits: account.assetType === 'USDC' ? 0 : 2 
                  })}
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="font-semibold text-dark-text">
                  ${account.currentValue.toLocaleString()}
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-accent">{account.yieldRate}%</span>
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="font-semibold text-accent">
                  +${account.yieldAccrued.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-accent hover:bg-accent/20 rounded-lg transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors">
                    <Target className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollateralTable;