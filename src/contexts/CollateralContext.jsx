import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const CollateralContext = createContext();

export const useCollateral = () => {
  const context = useContext(CollateralContext);
  if (!context) {
    throw new Error('useCollateral must be used within a CollateralProvider');
  }
  return context;
};

export const CollateralProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [collateralAccounts, setCollateralAccounts] = useState([]);
  const [totalYield, setTotalYield] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      // Simulate collateral data loading
      const mockCollateral = [
        {
          accountId: 'acc_1',
          userId: address,
          network: 'ethereum',
          address: address,
          assetType: 'ETH',
          amount: 12.5,
          yieldRate: 4.2,
          yieldAccrued: 2.45,
          lastYieldUpdate: new Date().toISOString(),
          currentValue: 31250,
        },
        {
          accountId: 'acc_2',
          userId: address,
          network: 'ethereum',
          address: address,
          assetType: 'stETH',
          amount: 8.3,
          yieldRate: 5.1,
          yieldAccrued: 1.87,
          lastYieldUpdate: new Date().toISOString(),
          currentValue: 20750,
        },
        {
          accountId: 'acc_3',
          userId: address,
          network: 'ethereum',
          address: address,
          assetType: 'USDC',
          amount: 15000,
          yieldRate: 3.8,
          yieldAccrued: 342.5,
          lastYieldUpdate: new Date().toISOString(),
          currentValue: 15000,
        },
      ];

      const mockProofs = [
        {
          proofId: 'proof_1',
          userId: address,
          collateralAddress: address,
          proofHash: '0x1234...abcd',
          generatedAt: new Date().toISOString(),
          verificationStatus: 'verified',
          collateralAmount: 12.5,
          assetType: 'ETH',
        },
        {
          proofId: 'proof_2',
          userId: address,
          collateralAddress: address,
          proofHash: '0x5678...efgh',
          generatedAt: new Date().toISOString(),
          verificationStatus: 'pending',
          collateralAmount: 8.3,
          assetType: 'stETH',
        },
      ];

      setCollateralAccounts(mockCollateral);
      setProofs(mockProofs);
      
      const totalYieldValue = mockCollateral.reduce((sum, acc) => sum + acc.yieldAccrued, 0);
      const totalMarginValue = mockCollateral.reduce((sum, acc) => sum + (acc.currentValue * 0.7), 0); // 70% LTV
      
      setTotalYield(totalYieldValue);
      setTotalMargin(totalMarginValue);
      setLoading(false);
    }
  }, [address, isConnected]);

  const generateProof = async (collateralId) => {
    const account = collateralAccounts.find(acc => acc.accountId === collateralId);
    if (!account) return null;

    const newProof = {
      proofId: `proof_${Date.now()}`,
      userId: address,
      collateralAddress: address,
      proofHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      generatedAt: new Date().toISOString(),
      verificationStatus: 'pending',
      collateralAmount: account.amount,
      assetType: account.assetType,
    };

    setProofs(prev => [...prev, newProof]);

    // Simulate verification process
    setTimeout(() => {
      setProofs(prev => prev.map(p => 
        p.proofId === newProof.proofId 
          ? { ...p, verificationStatus: 'verified' }
          : p
      ));
    }, 3000);

    return newProof;
  };

  const rebalanceYield = async (fromAccountId, toVault) => {
    // Simulate yield rebalancing
    setCollateralAccounts(prev => prev.map(acc => 
      acc.accountId === fromAccountId 
        ? { ...acc, yieldRate: toVault.apy, lastYieldUpdate: new Date().toISOString() }
        : acc
    ));
  };

  return (
    <CollateralContext.Provider value={{
      collateralAccounts,
      totalYield,
      totalMargin,
      proofs,
      loading,
      generateProof,
      rebalanceYield,
    }}>
      {children}
    </CollateralContext.Provider>
  );
};