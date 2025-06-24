
import React, { useState } from 'react';
import { Check, Clock, AlertTriangle, CheckCircle, AlertCircle, Clock3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WellnessRingProps {
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  onExpand?: () => void;
}

const WellnessRing: React.FC<WellnessRingProps> = ({ 
  status, 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  onExpand 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    onExpand?.();
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'good': 
        return { 
          icon: <CheckCircle className="w-16 h-16 text-ojas-success" />, 
          label: 'Excellent',
          description: 'All systems looking great',
          accessibilityLabel: 'Excellent health status - Everything is on track',
          statusIcon: <Check className="w-6 h-6" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 100,
          glowColor: 'shadow-ojas-success/30',
          ringColor: 'border-ojas-success'
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-16 h-16 text-ojas-alert" />, 
          label: 'Good',
          description: 'Minor attention needed',
          accessibilityLabel: 'Good health status - Small reminders pending',
          statusIcon: <Clock className="w-6 h-6" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 75,
          glowColor: 'shadow-ojas-alert/30',
          ringColor: 'border-ojas-alert'
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-16 h-16 text-ojas-error" />, 
          label: 'Needs Attention',
          description: 'Important items require action',
          accessibilityLabel: 'Health status needs attention - Action required',
          statusIcon: <AlertTriangle className="w-6 h-6" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 50,
          glowColor: 'shadow-ojas-error/30',
          ringColor: 'border-ojas-error'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Calculate progress percentage for the animated ring
  const progressPercentage = statusConfig.score;
  const circumference = 2 * Math.PI * 120; // radius of 120px
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const getSummaryItems = () => {
    return [
      {
        label: 'Medications',
        value: `${medsCount.taken}/${medsCount.total} taken`,
        status: medsCount.taken === medsCount.total ? 'good' : 'attention',
        icon: medsCount.taken === medsCount.total ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
        textStatus: medsCount.taken === medsCount.total ? 'Complete' : 'Pending'
      },
      {
        label: 'Symptoms',
        value: symptomsLogged ? 'Logged today' : 'No entries yet',
        status: symptomsLogged ? 'good' : 'neutral',
        icon: symptomsLogged ? <Check className="w-5 h-5" /> : <Minus className="w-5 h-5" />,
        textStatus: symptomsLogged ? 'Logged' : 'None'
      },
      {
        label: 'Next Appointment',
        value: nextAppointment || 'None scheduled',
        status: 'neutral',
        icon: <Clock className="w-5 h-5" />,
        textStatus: nextAppointment ? 'Upcoming' : 'None'
      }
    ];
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Enhanced Animated Halo Ring */}
      <button
        onClick={handleTap}
        className={`relative w-80 h-80 mx-auto flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 rounded-full transition-all duration-300 ${
          status === 'attention' ? 'animate-pulse-glow' : ''
        }`}
        aria-label={`Health status: ${statusConfig.accessibilityLabel}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
      >
        {/* Outer Glow Ring */}
        <div className={`absolute inset-0 rounded-full ${statusConfig.glowColor} ${
          status !== 'good' ? 'animate-pulse' : ''
        }`} 
        style={{
          boxShadow: `0 0 40px rgba(${
            status === 'good' ? '76, 175, 80' : 
            status === 'attention' ? '255, 193, 7' : 
            '244, 67, 54'
          }, 0.4)`
        }} />
        
        {/* Animated Progress Ring */}
        <svg className="absolute inset-4 w-72 h-72 transform -rotate-90" viewBox="0 0 240 240">
          {/* Background Circle */}
          <circle
            cx="120"
            cy="120"
            r="120"
            stroke="rgba(225, 228, 234, 0.3)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="120"
            cy="120"
            r="120"
            stroke={status === 'good' ? '#4CAF50' : status === 'attention' ? '#FFC107' : '#F44336'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="relative z-10 text-center bg-white rounded-full w-56 h-56 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white">
          {/* Ojas Logo/Mascot Placeholder */}
          <div className="mb-2">
            <div className="w-12 h-12 bg-ojas-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-ojas-primary">O</span>
            </div>
          </div>
          
          {statusConfig.icon}
          
          {/* Health Score */}
          <div className="mt-4 mb-2">
            <div className="text-4xl font-bold text-ojas-text-main">
              {statusConfig.score}
            </div>
            <div className="text-sm text-ojas-text-secondary font-medium">
              Health Score
            </div>
          </div>
          
          {/* Status Label */}
          <p className="text-xl font-semibold text-ojas-text-main mb-2">
            {statusConfig.label}
          </p>
          
          {/* Status Details */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {statusConfig.statusIcon}
            <p className="text-base font-medium text-ojas-text-secondary">
              {statusConfig.accessibilityLabel.split(' - ')[0]}
            </p>
          </div>
          
          <p className="text-sm text-ojas-text-secondary">
            {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
          </p>
        </div>
      </button>

      {/* Status Summary */}
      <p className="text-center mt-8 text-ojas-text-secondary text-xl font-medium">
        {statusConfig.description}
      </p>

      {/* Enhanced Expanded Interactive Summary */}
      {isExpanded && (
        <div className="mt-10 animate-gentle-fade-in">
          <div className="ojas-card">
            <h3 className="text-2xl font-semibold text-ojas-text-main mb-8 text-center">Today's Overview</h3>
            
            <div className="space-y-6">
              {getSummaryItems().map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-ojas-bg-light transition-colors duration-200">
                  <div className="flex items-center gap-5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.status === 'good' ? 'bg-ojas-success' : 
                      item.status === 'attention' ? 'bg-ojas-alert' : 
                      'bg-ojas-text-secondary'
                    }`}>
                      {item.status !== 'neutral' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-ojas-text-main font-medium text-lg">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        item.status === 'good' 
                          ? 'bg-ojas-success/20 text-ojas-success' 
                          : item.status === 'attention'
                          ? 'bg-ojas-alert/20 text-ojas-alert'
                          : 'bg-ojas-border text-ojas-text-secondary'
                      }`}>
                        {item.textStatus}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-ojas-text-main text-right text-lg">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-ojas-border">
              <p className="text-center text-ojas-text-secondary text-base">
                Your wellness summary updates throughout the day
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessRing;
