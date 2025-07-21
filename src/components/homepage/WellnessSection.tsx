
import React, { useState } from 'react';
import { TrendingUp, Heart, Pill, Activity, ChevronDown, ChevronUp, Info, Calculator } from 'lucide-react';

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
  const [showFormula, setShowFormula] = useState(false);

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

  // Only show urgent message for actual health alerts
  const shouldShowUrgentMessage = () => {
    if (status !== 'urgent') return false;
    
    // Show urgent message only if there are actual health concerns
    const overdueMeds = medsCount.total - medsCount.taken;
    const hasHealthConcerns = overdueMeds > 2; // More than 2 overdue meds
    
    return hasHealthConcerns;
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Calculate individual scores with detailed breakdown
  const vitalsScore = vitalsCount;
  const medsScore = medsCount.total > 0 ? Math.round((medsCount.taken / medsCount.total) * 100) : 100;
  const symptomsScore = symptomsLogged ? 85 : 65;

  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };

  const toggleFormula = () => {
    setShowFormula(!showFormula);
  };

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-8 shadow-ojas-soft border border-ojas-border text-center relative">
        <h2 className="text-xl font-semibold text-ojas-text-main mb-2">
          Today's Wellness
        </h2>
        
        {/* Only show urgent message for real health alerts */}
        {shouldShowUrgentMessage() ? (
          <p className="text-sm text-ojas-error mb-8 font-medium">
            {getStatusMessage()}
          </p>
        ) : (
          <p className="text-sm text-ojas-text-secondary mb-8">
            {getStatusMessage()}
          </p>
        )}

        {/* Enhanced Wellness Ring with Animation */}
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
            
            {/* Animated progress circle */}
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
              style={{
                filter: `drop-shadow(0 0 8px ${getStatusColor()}30)`,
                animation: status === 'urgent' ? 'pulse 2s infinite' : 'none'
              }}
            />
            
            {/* Pulse effect for urgent status */}
            {status === 'urgent' && (
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={getStatusColor()}
                strokeWidth="2"
                fill="none"
                opacity="0.3"
                className="animate-ping"
              />
            )}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-ojas-text-main mb-1">
              {score}
            </div>
            <div className="text-sm text-ojas-text-secondary font-medium uppercase tracking-wide">
              SCORE
            </div>
            <TrendingUp className={`w-4 h-4 mt-1 ${
              status === 'good' ? 'text-ojas-success' : 
              status === 'attention' ? 'text-ojas-alert' : 'text-ojas-error'
            }`} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button 
            onClick={toggleBreakdown}
            className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors flex items-center gap-2"
          >
            {showBreakdown ? 'Hide Details' : 'View Breakdown'}
            {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={toggleFormula}
            className="text-ojas-text-secondary font-medium text-sm hover:text-ojas-primary transition-colors flex items-center gap-2"
            title="View calculation formula"
          >
            <Calculator className="w-4 h-4" />
            Formula
          </button>
        </div>

        {/* Formula Explanation */}
        {showFormula && (
          <div className="mt-6 p-4 bg-ojas-bg-light rounded-xl border border-ojas-border">
            <h4 className="font-semibold text-ojas-text-main mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Wellness Score Calculation
            </h4>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-ojas-text-secondary">Medication Adherence (60%)</span>
                <span className="font-medium text-ojas-text-main">{Math.round(medsScore * 0.6)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ojas-text-secondary">Vitals Tracking (25%)</span>
                <span className="font-medium text-ojas-text-main">{Math.round(vitalsScore * 0.25)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ojas-text-secondary">Symptom Logging (15%)</span>
                <span className="font-medium text-ojas-text-main">{Math.round(symptomsScore * 0.15)}</span>
              </div>
              <div className="border-t border-ojas-border pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-ojas-text-main">Total Score</span>
                  <span className="text-ojas-primary">{score}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Section */}
        {showBreakdown && (
          <div className="mt-8 pt-6 border-t border-ojas-border animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{vitalsScore}</div>
                <div className="text-sm text-ojas-text-secondary">Vitals</div>
                <div className="text-xs text-ojas-text-secondary mt-1">Last reading</div>
              </div>
              
              <div className="text-center">
                <Pill className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{medsScore}%</div>
                <div className="text-sm text-ojas-text-secondary">Meds</div>
                <div className="text-xs text-ojas-text-secondary mt-1">
                  {medsCount.taken}/{medsCount.total} today
                </div>
              </div>
              
              <div className="text-center">
                <Activity className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ojas-text-main">{symptomsScore}</div>
                <div className="text-sm text-ojas-text-secondary">Symptoms</div>
                <div className="text-xs text-ojas-text-secondary mt-1">
                  {symptomsLogged ? 'Logged today' : 'Not logged'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessSection;
