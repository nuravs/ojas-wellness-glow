
import React, { useState } from 'react';
import { TrendingUp, Activity, ChevronRight, Plus } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';
import GoodDayPrompt from './GoodDayPrompt';
import WellnessInsightsModal from './WellnessInsightsModal';
import { usePositiveFactors } from '../hooks/usePositiveFactors';
import { useNavigate } from 'react-router-dom';

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
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showGoodDayPrompt, setShowGoodDayPrompt] = useState(false);
  const { hasLoggedToday } = usePositiveFactors();
  const navigate = useNavigate();

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
    // Good Day Protocol: Show prompt if score >= 80 and hasn't logged today
    if (score >= 80 && !hasLoggedToday()) {
      setShowGoodDayPrompt(true);
    } else {
      setShowInsightsModal(true);
    }
  };

  const handleQuickAction = (action: 'medications' | 'symptoms' | 'vitals') => {
    switch (action) {
      case 'medications':
        navigate('/?tab=medications');
        break;
      case 'symptoms':
        navigate('/symptoms');
        break;
      case 'vitals':
        navigate('/vitals');
        break;
    }
  };

  const wellnessFactors = [
    {
      label: 'Medications',
      value: Math.round((medsCount.taken / Math.max(medsCount.total, 1)) * 100),
      weight: 40,
      color: medsCount.taken === medsCount.total ? 'text-ojas-success' : 'text-ojas-alert'
    },
    {
      label: 'Symptoms',
      value: symptomsLogged ? 100 : 80,
      weight: 25,
      color: symptomsLogged ? 'text-ojas-success' : 'text-ojas-text-secondary'
    },
    {
      label: 'Conditions',
      value: comorbidityStatus ? Math.round((comorbidityStatus.controlled / Math.max(comorbidityStatus.total, 1)) * 100) : 100,
      weight: 20,
      color: 'text-ojas-success'
    },
    {
      label: 'Activity',
      value: 85,
      weight: 15,
      color: 'text-ojas-success'
    }
  ];

  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* Progress Ring with Touch Feedback */}
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
          aria-label={`Health status: ${score} - ${scoreZone.label}. Tap for insights.`}
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
              className="transition-all duration-1000 ease-out animate-pulse-glow"
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
              Tap for insights
            </div>
          </div>
        </button>

        {/* Enhanced Insights Modal */}
        <WellnessInsightsModal
          isOpen={showInsightsModal}
          onClose={() => setShowInsightsModal(false)}
          wellnessScore={score}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
          userRole={userRole}
        />

        {/* Good Day Prompt */}
        {showGoodDayPrompt && (
          <GoodDayPrompt 
            wellnessScore={score}
            onClose={() => setShowGoodDayPrompt(false)}
          />
        )}
      </div>

      {/* Interactive Quick Actions Summary */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mt-6">
        <h4 className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4 text-center">
          Today's Health Summary
        </h4>
        
        <div className="space-y-3">
          {/* Medications Quick Action */}
          <button
            onClick={() => handleQuickAction('medications')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-ojas-bg-light dark:hover:bg-ojas-slate-gray/20 transition-colors duration-200 text-left"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                medsCount.taken === medsCount.total ? 'bg-ojas-success' : 'bg-ojas-alert'
              }`} />
              <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                Medications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                {medsCount.taken}/{medsCount.total}
              </span>
              <ChevronRight className="w-4 h-4 text-ojas-text-secondary" />
            </div>
          </button>

          {/* Symptoms Quick Action */}
          <button
            onClick={() => handleQuickAction('symptoms')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-ojas-bg-light dark:hover:bg-ojas-slate-gray/20 transition-colors duration-200 text-left"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                symptomsLogged ? 'bg-ojas-success' : 'bg-ojas-text-secondary'
              }`} />
              <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                Symptoms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                {symptomsLogged ? 'Logged' : 'Not logged'}
              </span>
              {!symptomsLogged && <Plus className="w-4 h-4 text-ojas-primary" />}
              <ChevronRight className="w-4 h-4 text-ojas-text-secondary" />
            </div>
          </button>
        </div>
      </div>

      {/* Wellness Score Factors */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mt-4">
        <h4 className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-3 text-center">
          Score Breakdown
        </h4>
        <div className="space-y-2">
          {wellnessFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {factor.label}
                </span>
                <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  ({factor.weight}%)
                </span>
              </div>
              <span className={`font-medium ${factor.color}`}>
                {factor.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedWellnessRing;
