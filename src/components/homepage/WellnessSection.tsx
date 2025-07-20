
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface WellnessSectionProps {
  score: number;
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
}

const WellnessSection: React.FC<WellnessSectionProps> = ({ 
  score, 
  status, 
  medsCount, 
  symptomsLogged 
}) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'good': return 'Excellent';
      case 'attention': return 'Some areas need attention';
      case 'urgent': return 'Needs immediate attention';
      default: return 'Good';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#00B488';
      case 'attention': return '#FFC300';
      case 'urgent': return '#FF4E4E';
      default: return '#00B488';
    }
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-8 shadow-ojas-soft border border-ojas-border text-center">
        <h2 className="text-xl font-semibold text-ojas-text-main mb-2">
          Today's Wellness
        </h2>
        <p className="text-sm text-ojas-text-secondary mb-8">
          {getStatusMessage()}
        </p>

        {/* Wellness Ring */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#E1E4EA"
              strokeWidth="8"
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={getStatusColor()}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-ojas-text-main mb-1">
              {score}
            </div>
            <div className="text-sm text-ojas-text-secondary font-medium uppercase tracking-wide">
              SCORE
            </div>
            <TrendingUp className="w-4 h-4 text-ojas-success mt-1" />
          </div>
        </div>

        <button className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors">
          View Breakdown
        </button>
      </div>
    </div>
  );
};

export default WellnessSection;
