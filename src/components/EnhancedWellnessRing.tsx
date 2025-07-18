import React, { useState } from 'react';
import { X, TrendingUp, Activity, Heart, Pill, Brain } from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);
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

  const handleRingTap = () => {
    if (score >= 80 && !hasLoggedToday()) {
      setShowGoodDayPrompt(true);
    } else {
      setShowDetails(!showDetails);
    }
  };

  const handleDetailsClick = () => {
    onExpand?.();
    setShowDetails(false);
  };

  // Calculate individual scores for details
  const getDetailedScores = () => {
    const medicationScore = medsCount.total > 0 ? Math.round((medsCount.taken / medsCount.total) * 100) : 100;
    const vitalsScore = 72; // Mock data - replace with actual calculation
    const symptomsScore = symptomsLogged ? 85 : 100;
    const conditionsScore = comorbidityStatus ? 
      Math.round((comorbidityStatus.controlled / Math.max(comorbidityStatus.total, 1)) * 100) : 100;

    return {
      vitals: vitalsScore,
      medications: medicationScore,
      symptoms: symptomsScore,
      conditions: conditionsScore
    };
  };

  const detailedScores = getDetailedScores();

  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* Wellness Ring - Same Size as Before */}
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
          } active:scale-95 hover:scale-105`}
          aria-label={`Health status: ${score} - ${scoreZone.label}. Tap for details.`}
          style={{
            boxShadow: `0 0 30px ${scoreZone.color}30`,
            minWidth: '44px',
            minHeight: '44px',
            filter: isPressed ? `drop-shadow(0 0 20px ${scoreZone.color}60)` : `drop-shadow(0 0 12px ${scoreZone.color}40)`
          }}
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(225, 228, 234, 0.3)"
              strokeWidth="8"
              fill="none"
            />
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

        {/* Expandable Details Panel - Slides up from bottom */}
        {showDetails && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong border border-ojas-border dark:border-ojas-slate-gray p-6 animate-gentle-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                Health Details
              </h4>
              <button
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Hide details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Individual Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">Vitals</span>
                </div>
                <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                  {detailedScores.vitals}
                </div>
              </div>

              <div className="bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-ojas-primary" />
                  <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">Meds</span>
                </div>
                <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                  {detailedScores.medications}
                </div>
              </div>

              <div className="bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">Symptoms</span>
                </div>
                <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                  {detailedScores.symptoms}
                </div>
              </div>

              <div className="bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-ojas-calming-green" />
                  <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">Conditions</span>
                </div>
                <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                  {detailedScores.conditions}
                </div>
              </div>
            </div>

            {/* Summary Text */}
            <div className="text-center mb-4">
              <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Your wellness score updates throughout the day based on your health activities.
              </p>
            </div>

            {/* Hide Details Button */}
            <button
              onClick={() => setShowDetails(false)}
              className="w-full py-3 bg-ojas-bg-light dark:bg-ojas-slate-gray/20 text-ojas-text-main dark:text-ojas-mist-white rounded-xl text-sm font-medium hover:bg-ojas-border dark:hover:bg-ojas-slate-gray/30 transition-colors"
            >
              Hide Details
            </button>
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

      {/* Score Legend - Keep existing */}
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
