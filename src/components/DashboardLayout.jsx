import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import YieldDashboard from './YieldDashboard';
import MarginDashboard from './MarginDashboard';
import ProofManager from './ProofManager';
import SubscriptionManager from './SubscriptionManager';
import CollateralManager from './CollateralManager';

const DashboardLayout = () => {
  const [activeView, setActiveView] = useState('yield');

  const renderContent = () => {
    switch (activeView) {
      case 'yield':
        return <YieldDashboard />;
      case 'margin':
        return <MarginDashboard />;
      case 'proofs':
        return <ProofManager />;
      case 'collateral':
        return <CollateralManager />;
      case 'subscription':
        return <SubscriptionManager />;
      default:
        return <YieldDashboard />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;