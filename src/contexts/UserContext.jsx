import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      // Simulate user data loading
      const mockUser = {
        userId: address,
        email: `user@${address.slice(0, 6)}.eth`,
        subscriptionTier: 'basic', // basic, pro, none
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockSubscription = {
        tier: 'basic',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: ['yield-aggregation', 'basic-analytics'],
      };

      setUser(mockUser);
      setSubscription(mockSubscription);
      setLoading(false);
    }
  }, [address, isConnected]);

  const upgradeSubscription = (tier) => {
    const features = tier === 'pro' 
      ? ['yield-aggregation', 'basic-analytics', 'advanced-analytics', 'priority-support', 'auto-rebalancing']
      : ['yield-aggregation', 'basic-analytics'];

    setSubscription({
      tier,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features,
    });
  };

  const hasFeature = (feature) => {
    return subscription?.features?.includes(feature) || false;
  };

  return (
    <UserContext.Provider value={{
      user,
      subscription,
      loading,
      upgradeSubscription,
      hasFeature,
    }}>
      {children}
    </UserContext.Provider>
  );
};