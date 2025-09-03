import React from 'react';
import { TrendingUp, Target, Shield, Layers, CreditCard, Zap } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'yield', label: 'Yield Dashboard', icon: TrendingUp },
    { id: 'margin', label: 'Margin Trading', icon: Target },
    { id: 'proofs', label: 'zk-Proofs', icon: Shield },
    { id: 'collateral', label: 'Collateral', icon: Layers },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="w-64 h-screen glass-effect border-r border-dark-border">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-dark-text">LighterYield</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-accent text-white'
                    : 'text-dark-textSecondary hover:text-dark-text hover:bg-dark-surfaceHover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;