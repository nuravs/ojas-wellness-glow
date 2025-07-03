
import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';

interface EnhancedWellnessRingProps {
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  score: number;
  userRole?: 'patient' | 'caregiver';
  onExpand?: () => void;
}

const EnhancedWellnessRing: React.FC<EnhancedWellnessRingProps> = ({ 
  status, 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  score,
  userRole = 'patient',
  onExpand 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getScoreZone = (score: number) => {
    if (score >= 80) return { zone: 'good', color: '#00B488', label: 'Good' };
    if (score >= 60) return { zone: 'attention', color: '#FFC300', label: 'Fair' };
    return { zone: 'urgent', color: '#FF4E4E', label: 'Needs Attention' };
  };

  const scoreZone = getScoreZone(score);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  const handleRingTap = () => {
    setShowTooltip(!showTooltip);
  };

  const handleDetailsClick = () => {
    onExpand?.();
    setShowTooltip(false);
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowTooltip(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* Progress Ring */}
      <div className="relative">
        <button
          onClick={handleRingTap}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`relative w-72 h-72 mx-auto flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 rounded-full transition-all duration-200 ${
            isPressed ? 'scale-95' : 'scale-100'
          } active:scale-95`}
          aria-label={`Health status: ${score} - ${scoreZone.label}. Tap for details.`}
          style={{
            boxShadow: `0 0 30px ${scoreZone.color}30`,
            minWidth: '44px',
            minHeight: '44px'
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

          {/* Center Content */}
          <div className="relative z-10 text-center bg-white dark:bg-ojas-charcoal-gray rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white dark:border-ojas-slate-gray">
            <div className="text-3xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
              {score} – {scoreZone.label}
            </div>
            <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver font-medium">
              Health Score
            </div>
          </div>
        </button>

        {/* Tooltip Overlay */}
        {showTooltip && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-gentle-fade-in"
            onClick={handleOutsideClick}
          >
            <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong max-w-xs mx-4 relative">
              <button
                onClick={handleCloseTooltip}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close details"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6 pt-12">
                <p className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
                  {getCopyForRole('wellnessRingTooltip', userRole)}
                </p>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-4">
                  {score}/100 – {scoreZone.label}
                </p>
                <button
                  onClick={handleDetailsClick}
                  className="w-full px-4 py-3 bg-ojas-primary text-white rounded-xl text-sm font-medium hover:bg-ojas-primary-hover transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ minHeight: '44px' }}
                >
                  <TrendingUp className="w-4 h-4" />
                  View Trends & Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Score Legend */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mt-6">
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
    </div>
  );
};

export default EnhancedWellnessRing;
