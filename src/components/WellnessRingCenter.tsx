
import React from 'react';
import { CheckCircle, AlertCircle, Clock3, Check, Clock, AlertTriangle } from 'lucide-react';

interface StatusConfig {
  icon: JSX.Element;
  label: string;
  description: string;
  accessibilityLabel: string;
  statusIcon: JSX.Element;
  score: number;
  ringColor: string;
  glowColor: string;
}

interface WellnessRingCenterProps {
  statusConfig: StatusConfig;
  isExpanded: boolean;
}

const WellnessRingCenter: React.FC<WellnessRingCenterProps> = ({ statusConfig, isExpanded }) => {
  return (
    <div className="relative z-10 text-center bg-white dark:bg-ojas-charcoal-gray rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white dark:border-ojas-slate-gray">
      
      {/* Status Icon */}
      <div className="mb-3">
        {statusConfig.icon}
      </div>
      
      {/* Health Score */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
          {statusConfig.score}
        </div>
        <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver font-medium">
          Health Score
        </div>
      </div>
      
      {/* Status Label */}
      <div className="mb-2">
        <p className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          {statusConfig.label}
        </p>
      </div>
      
      {/* Status Details */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {statusConfig.statusIcon}
        <p className="text-sm font-medium text-ojas-text-secondary dark:text-ojas-cloud-silver">
          {statusConfig.accessibilityLabel.split(' - ')[0]}
        </p>
      </div>
      
      <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
        {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
      </p>
    </div>
  );
};

export default WellnessRingCenter;
