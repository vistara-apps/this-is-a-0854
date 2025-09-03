import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

const ProofStatusIndicator = ({ status, variant = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-accent',
          bg: 'bg-accent/20',
          label: 'Verified',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/20',
          label: 'Pending',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-400/20',
          label: 'Failed',
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-dark-textSecondary',
          bg: 'bg-dark-border',
          label: 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 ${config.bg} rounded-lg`}>
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className={`font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};

export default ProofStatusIndicator;