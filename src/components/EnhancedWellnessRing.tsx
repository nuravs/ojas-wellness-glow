
import React, { useState } from 'react';
import { Check, Clock, AlertTriangle, CheckCircle, AlertCircle, Clock3, Info } from 'lucide-react';
import WellnessRingCenter from './WellnessRingCenter';
import TodaysActionSummary from './TodaysActionSummary';

interface EnhancedWellnessRingProps {
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  score: number;
  onExpand?: () => void;
}

const EnhancedWellnessRing: React.FC<EnhancedWellnessRingProps> = ({ 
  status, 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  score,
  onExpand 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    onExpand?.();
  };

  const getScoreZone = (score: number) => {
    if (score >= 80) return { zone: 'good', color: '#00B488', label: 'Good' };
    if (score >= 60) return { zone: 'attention', color: '#FFC300', label: 'Fair' };
    return { zone: 'urgent', color: '#FF4E4E', label: 'Needs Attention' };
  };

  const scoreZone = getScoreZone(score);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Progress Ring */}
      <button
        onClick={handleTap}
        className="relative w-72 h-72 mx-auto flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 rounded-full transition-all duration-300"
        aria-label={`Health status: ${score} - ${scoreZone.label}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
        style={{
          boxShadow: `0 0 30px ${scoreZone.color}30`
        }}
      >
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          {/* Background circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="rgba(225, 228, 234, 0.3)"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={scoreZone.color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${scoreZone.color}40)`
            }}
          />
        </svg>

        {/* Center Content - Single Line Score */}
        <div className="relative z-10 text-center bg-white dark:bg-ojas-charcoal-gray rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white dark:border-ojas-slate-gray">
          <div className="text-4xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            {score} – {scoreZone.label}
          </div>
          <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver font-medium">
            Health Score
          </div>
        </div>
      </button>

      {/* Info Icon - Outside Ring */}
      <div className="flex items-center justify-center mt-4 mb-6">
        <button
          onClick={handleTap}
          className="flex items-center gap-2 text-ojas-text-secondary hover:text-ojas-primary transition-colors duration-200"
          aria-label={isExpanded ? 'Hide details' : 'Show details'}
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isExpanded ? 'Hide details' : 'Tap for details'}
          </span>
        </button>
      </div>

      {/* Score Legend */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mb-6">
        <h4 className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-3 text-center">
          Health Score Zones
        </h4>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ojas-success"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">80-100 Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ojas-alert"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">60-79 Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ojas-error"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">&lt;60 Attention</span>
          </div>
        </div>
      </div>

      {/* Today's Action Summary - Compact */}
      <TodaysActionSummary 
        medsCount={medsCount}
        symptomsLogged={symptomsLogged}
        nextAppointment={nextAppointment}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default EnhancedWellnessRing;
