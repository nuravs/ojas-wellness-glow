
import React, { useState } from 'react';
import { TrendingUp, Heart, Pill, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface WellnessSectionProps {
  score: number;
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  vitalsCount?: number;
}

const WellnessSection: React.FC<WellnessSectionProps> = ({ 
  score, 
  status, 
  medsCount, 
  symptomsLogged,
  vitalsCount = 72
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

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

  // Calculate individual scores
  const vitalsScore = vitalsCount;
  const medsScore = medsCount.total > 0 ? Math.round((medsCount.taken / medsCount.total) * 100) : 100;
  const symptomsScore = symptomsLogged ? 85 : 65;

  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };

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

        <button 
          onClick={toggleBreakdown}
          className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors flex items-center gap-2 mx-auto"
        >
          {showBreakdown ? 'Hide Details' : 'View Breakdown'}
          {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Breakdown Section */}
        {showBreakdown && (
          <div className="mt-8 pt-6 border-t border-ojas-border">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{vitalsScore}</div>
                <div className="text-sm text-ojas-text-secondary">Vitals</div>
              </div>
              
              <div className="text-center">
                <Pill className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{medsScore}</div>
                <div className="text-sm text-ojas-text-secondary">Meds</div>
              </div>
              
              <div className="text-center">
                <Activity className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{symptomsScore}</div>
                <div className="text-sm text-ojas-text-secondary">Symptoms</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessSection;
