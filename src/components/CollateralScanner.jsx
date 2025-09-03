import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Scan, Check, AlertTriangle, RefreshCw, Plus } from 'lucide-react';
import alchemyService from '../services/alchemyService';

const CollateralScanner = ({ onScanComplete }) => {
  const { address, isConnected } = useAccount();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedAssets, setScannedAssets] = useState([]);
  const [error, setError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanProgress(0);
    setScannedAssets([]);
    
    try {
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Get token balances from Alchemy
      const balances = await alchemyService.getTokenBalances(address);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      setScanProgress(100);
      
      // Process the balances
      const assets = [];
      
      // Process ETH balance (if available)
      if (balances.tokenBalances) {
        // Find ETH (WETH) balance
        const wethBalance = balances.tokenBalances.find(
          token => token.contractAddress.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        );
        
        if (wethBalance && wethBalance.tokenBalance) {
          const ethAmount = parseInt(wethBalance.tokenBalance, 16) / 10**18;
          if (ethAmount > 0) {
            assets.push({
              assetType: 'ETH',
              amount: ethAmount,
              address,
              network: 'ethereum',
              yieldRate: 4.2, // Mock yield rate
              yieldAccrued: ethAmount * 0.042 * Math.random(), // Mock yield accrued
              lastYieldUpdate: new Date().toISOString(),
              currentValue: ethAmount * 2500, // Assuming ETH price of $2,500
            });
          }
        }
        
        // Find stETH balance
        const stethBalance = balances.tokenBalances.find(
          token => token.contractAddress.toLowerCase() === '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
        );
        
        if (stethBalance && stethBalance.tokenBalance) {
          const stethAmount = parseInt(stethBalance.tokenBalance, 16) / 10**18;
          if (stethAmount > 0) {
            assets.push({
              assetType: 'stETH',
              amount: stethAmount,
              address,
              network: 'ethereum',
              yieldRate: 5.1, // Mock yield rate
              yieldAccrued: stethAmount * 0.051 * Math.random(), // Mock yield accrued
              lastYieldUpdate: new Date().toISOString(),
              currentValue: stethAmount * 2500, // Assuming stETH price of $2,500
            });
          }
        }
        
        // Find USDC balance
        const usdcBalance = balances.tokenBalances.find(
          token => token.contractAddress.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        );
        
        if (usdcBalance && usdcBalance.tokenBalance) {
          const usdcAmount = parseInt(usdcBalance.tokenBalance, 16) / 10**6;
          if (usdcAmount > 0) {
            assets.push({
              assetType: 'USDC',
              amount: usdcAmount,
              address,
              network: 'ethereum',
              yieldRate: 3.8, // Mock yield rate
              yieldAccrued: usdcAmount * 0.038 * Math.random(), // Mock yield accrued
              lastYieldUpdate: new Date().toISOString(),
              currentValue: usdcAmount, // USDC is pegged to USD
            });
          }
        }
      }
      
      // If no assets found, use mock data for development
      if (assets.length === 0) {
        assets.push(
          {
            assetType: 'ETH',
            amount: 12.5,
            address,
            network: 'ethereum',
            yieldRate: 4.2,
            yieldAccrued: 2.45,
            lastYieldUpdate: new Date().toISOString(),
            currentValue: 31250, // Assuming ETH price of $2,500
          },
          {
            assetType: 'stETH',
            amount: 8.3,
            address,
            network: 'ethereum',
            yieldRate: 5.1,
            yieldAccrued: 1.87,
            lastYieldUpdate: new Date().toISOString(),
            currentValue: 20750, // Assuming stETH price of $2,500
          },
          {
            assetType: 'USDC',
            amount: 15000,
            address,
            network: 'ethereum',
            yieldRate: 3.8,
            yieldAccrued: 342.5,
            lastYieldUpdate: new Date().toISOString(),
            currentValue: 15000, // USDC is pegged to USD
          }
        );
      }
      
      // Add account IDs to the assets
      const assetsWithIds = assets.map((asset, index) => ({
        ...asset,
        accountId: `acc_${Date.now()}_${index}`,
      }));
      
      setScannedAssets(assetsWithIds);
      
      // Call the onScanComplete callback if provided
      if (onScanComplete) {
        onScanComplete(assetsWithIds);
      }
    } catch (err) {
      console.error('Error scanning for collateral:', err);
      setError('Failed to scan for collateral. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="glass-effect rounded-lg p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Scan className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text">Collateral Scanner</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-dark-textSecondary">
          Scan your connected wallet for yield-bearing assets that can be used as collateral.
          LighterYield will automatically detect ETH, stETH, and other supported assets.
        </p>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-dark-text">{error}</div>
          </div>
        )}
        
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-textSecondary">Scanning for collateral...</span>
              <span className="text-dark-text">{Math.round(scanProgress)}%</span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {scannedAssets.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-dark-text">Detected Assets</h4>
            
            <div className="space-y-2">
              {scannedAssets.map((asset) => (
                <div key={asset.accountId} className="flex items-center justify-between p-4 bg-dark-surfaceHover rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {asset.assetType === 'ETH' ? '⟠' : 
                       asset.assetType === 'stETH' ? '🔷' : 
                       asset.assetType === 'USDC' ? '💵' : '💰'}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-text">{asset.assetType}</div>
                      <div className="text-sm text-dark-textSecondary">
                        {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} tokens
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-dark-text">
                      ${asset.currentValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-accent">{asset.yieldRate.toFixed(1)}% APY</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-lg">
              <div className="font-semibold text-dark-text">Total Value</div>
              <div className="text-xl font-bold text-accent">
                ${scannedAssets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleScan}
            disabled={isScanning || !isConnected}
            className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : scannedAssets.length > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Rescan</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Scan for Collateral</span>
              </>
            )}
          </button>
          
          {scannedAssets.length > 0 && (
            <button className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-border text-dark-text rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Manual Asset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollateralScanner;

