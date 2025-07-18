
import React, { useState } from 'react';
import { X, TrendingUp, Activity } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';
import GoodDayPrompt from './GoodDayPrompt';
import { usePositiveFactors } from '../hooks/usePositiveFactors';

interface ComorbidityStatus {
  controlled: number;
  needsAttention: number;
  total: number;
}

interface EnhancedWellnessRingProps {
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  score: number;
  userRole?: 'patient' | 'caregiver';
  onExpand?: () => void;
  comorbidityStatus?: ComorbidityStatus;
}

const EnhancedWellnessRing: React.FC<EnhancedWellnessRingProps> = ({ 
  status, 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  score,
  userRole = 'patient',
  onExpand,
  comorbidityStatus
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [showGoodDayPrompt, setShowGoodDayPrompt] = useState(false);
  const { hasLoggedToday } = usePositiveFactors();

  const getScoreZone = (score: number) => {
    if (score >= 80) return { zone: 'good', color: '#00B488', label: 'Good' };
    if (score >= 60) return { zone: 'attention', color: '#FFC300', label: 'Fair' };
    return { zone: 'urgent', color: '#FF4E4E', label: 'Needs Attention' };
  };

  const scoreZone = getScoreZone(score);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  // Calculate segment data for interactive tooltips
  const getSegmentData = () => {
    const medicationAdherence = medsCount.total > 0 ? (medsCount.taken / medsCount.total) * 100 : 100;
    const comorbidityScore = comorbidityStatus ? 
      (comorbidityStatus.controlled / Math.max(comorbidityStatus.total, 1)) * 100 : 100;
    
    return {
      medication: {
        percentage: Math.round(medicationAdherence),
        label: 'Medication Adherence',
        description: `${medsCount.taken} of ${medsCount.total} medications taken today`
      },
      symptoms: {
        percentage: symptomsLogged ? 85 : 100,
        label: 'Symptom Tracking',
        description: symptomsLogged ? 'Symptoms logged today' : 'No symptoms logged today'
      },
      conditions: {
        percentage: Math.round(comorbidityScore),
        label: 'Health Conditions',
        description: comorbidityStatus ? 
          `${comorbidityStatus.controlled} of ${comorbidityStatus.total} conditions controlled` :
          'No conditions tracked'
      }
    };
  };

  const segmentData = getSegmentData();

  const handleSegmentClick = (segmentKey: string) => {
    setSelectedSegment(segmentKey === selectedSegment ? null : segmentKey);
  };

  const handleRingTap = () => {
    // Good Day Protocol: Show prompt if score >= 80 and hasn't logged today
    if (score >= 80 && !hasLoggedToday()) {
      setShowGoodDayPrompt(true);
    } else {
      setShowTooltip(!showTooltip);
    }
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
      {/* Progress Ring with Touch Feedback and Subtle Pulse Animation */}
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
          } active:scale-95 hover:scale-105 animate-pulse-gentle`}
          aria-label={`Health status: ${score} - ${scoreZone.label}. Tap for details.`}
          style={{
            boxShadow: `0 0 30px ${scoreZone.color}30`,
            minWidth: '44px',
            minHeight: '44px',
            filter: isPressed ? `drop-shadow(0 0 20px ${scoreZone.color}60)` : `drop-shadow(0 0 12px ${scoreZone.color}40)`
          }}
        >
          {/* SVG Progress Ring with Subtle Glow Animation */}
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
            
            {/* Progress circle with gentle glow animation */}
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
              className="transition-all duration-1000 ease-out animate-pulse-glow"
              style={{
                filter: `drop-shadow(0 0 8px ${scoreZone.color}40)`
              }}
            />
          </svg>

          {/* Center Content with Subtle Scale Animation */}
          <div className="relative z-10 text-center bg-white dark:bg-ojas-charcoal-gray rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white dark:border-ojas-slate-gray transition-transform duration-200 hover:scale-105">
            <div className="text-3xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
              {score}
            </div>
            <div className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-1">
              {scoreZone.label}
            </div>
            <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver font-medium">
              Health Score
            </div>
            <div className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver mt-2 opacity-70">
              Tap for details
            </div>
          </div>
        </button>

        {/* Enhanced Tooltip Overlay with Comorbidity Information */}
        {showTooltip && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-gentle-fade-in"
            onClick={handleOutsideClick}
          >
            <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong max-w-sm mx-4 relative">
              <button
                onClick={handleCloseTooltip}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close details"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-6 pt-12">
                <p className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
                  {getCopyForRole('wellnessRingTooltip', userRole)}
                </p>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-4">
                  {score}/100 – {scoreZone.label}
                </p>

                {/* Health Breakdown */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">Medications</span>
                    <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      {medsCount.taken}/{medsCount.total} taken
                    </span>
                  </div>
                  
                  {comorbidityStatus && comorbidityStatus.total > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">Conditions</span>
                      <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                        {comorbidityStatus.controlled} controlled, {comorbidityStatus.needsAttention} need attention
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">Symptoms</span>
                    <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      {symptomsLogged ? 'Logged today' : 'None today'}
                    </span>
                  </div>
                </div>

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

        {/* Good Day Prompt */}
        {showGoodDayPrompt && (
          <GoodDayPrompt 
            wellnessScore={score}
            onClose={() => setShowGoodDayPrompt(false)}
          />
        )}
      </div>

      {/* Score Legend - Updated with better spacing */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mt-6">
        <h4 className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-3 text-center">
          Health Score Zones
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-ojas-success flex-shrink-0"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver whitespace-nowrap">80-100<br/>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-ojas-alert flex-shrink-0"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver whitespace-nowrap">60-79<br/>Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-ojas-error flex-shrink-0"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver whitespace-nowrap">&lt;60<br/>Attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWellnessRing;
