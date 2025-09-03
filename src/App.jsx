import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import DashboardLayout from './components/DashboardLayout';
import WelcomeScreen from './components/WelcomeScreen';
import { UserProvider } from './contexts/UserContext';
import { CollateralProvider } from './contexts/CollateralContext';

function App() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dark-text">Loading LighterYield...</h2>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return <WelcomeScreen />;
  }

  return (
    <UserProvider>
      <CollateralProvider>
        <DashboardLayout />
      </CollateralProvider>
    </UserProvider>
  );
}

export default App;