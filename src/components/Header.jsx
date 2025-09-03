import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Header = () => {
  const { subscription } = useUser();

  return (
    <header className="glass-effect border-b border-dark-border p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">Dashboard</h2>
          <p className="text-dark-textSecondary">
            {subscription?.tier === 'pro' ? 'Pro' : 'Basic'} Plan • 
            {subscription?.status === 'active' ? ' Active' : ' Inactive'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-dark-textSecondary hover:text-dark-text transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-dark-textSecondary hover:text-dark-text transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;