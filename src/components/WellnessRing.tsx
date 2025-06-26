import React, { useState } from 'react';
import { Check, Clock, AlertTriangle, CheckCircle, AlertCircle, Clock3, Minus } from 'lucide-react';

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
          icon: <CheckCircle className="w-10 h-10 text-ojas-success" />, 
          label: 'Excellent',
          description: 'All systems looking great',
          accessibilityLabel: 'Excellent health status - Everything is on track',
          statusIcon: <Check className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 100,
          ringColor: '#00B488',
          glowColor: 'rgba(0, 180, 136, 0.3)'
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-10 h-10 text-ojas-alert" />, 
          label: 'Good',
          description: 'Minor attention needed',
          accessibilityLabel: 'Good health status - Small reminders pending',
          statusIcon: <Clock className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 75,
          ringColor: '#FFC300',
          glowColor: 'rgba(255, 195, 0, 0.3)'
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-10 h-10 text-ojas-error" />, 
          label: 'Needs Attention',
          description: 'Important items require action',
          accessibilityLabel: 'Health status needs attention - Action required',
          statusIcon: <AlertTriangle className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 50,
          ringColor: '#FF4E4E',
          glowColor: 'rgba(255, 78, 78, 0.4)'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Simplified: Always show a complete circle
  const radius = 110;

  const getSummaryItems = () => {
    return [
      {
        label: 'Medications',
        value: `${medsCount.taken}/${medsCount.total} taken`,
        status: medsCount.taken === medsCount.total ? 'good' : 'attention',
        icon: medsCount.taken === medsCount.total ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
        textStatus: medsCount.taken === medsCount.total ? 'Complete' : 'Pending'
      },
      {
        label: 'Symptoms',
        value: symptomsLogged ? 'Logged today' : 'No entries yet',
        status: symptomsLogged ? 'good' : 'neutral',
        icon: symptomsLogged ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />,
        textStatus: symptomsLogged ? 'Logged' : 'None'
      },
      {
        label: 'Next Appointment',
        value: nextAppointment || 'None scheduled',
        status: 'neutral',
        icon: <Clock className="w-4 h-4" />,
        textStatus: nextAppointment ? 'Upcoming' : 'None'
      }
    ];
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Complete Circle Implementation */}
      <button
        onClick={handleTap}
        className={`relative w-72 h-72 mx-auto flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 rounded-full transition-all duration-300 ${
          status === 'attention' ? 'animate-pulse-glow' : ''
        }`}
        aria-label={`Health status: ${statusConfig.accessibilityLabel}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
        style={{
          boxShadow: `0 0 30px ${statusConfig.glowColor}`
        }}
      >
        {/* Complete SVG Ring - Always Full Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          {/* Background circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="rgba(225, 228, 234, 0.4)"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Always complete colored ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={statusConfig.ringColor}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 12px ${statusConfig.glowColor})`
            }}
          />
        </svg>

        {/* Enhanced Center Content - Improved Layout */}
        <div className="relative z-10 text-center bg-white dark:bg-ojas-charcoal-gray rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-ojas-strong border-4 border-white dark:border-ojas-slate-gray">
          
          {/* Status Icon */}
          <div className="mb-2">
            {statusConfig.icon}
          </div>
          
          {/* Health Score */}
          <div className="mb-2">
            <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
              {statusConfig.score}
            </div>
            <div className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver font-medium">
              Health Score
            </div>
          </div>
          
          {/* Status Label */}
          <div className="mb-2">
            <p className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              {statusConfig.label}
            </p>
          </div>
          
          {/* Status Details */}
          <div className="flex items-center justify-center gap-1 mb-1">
            {statusConfig.statusIcon}
            <p className="text-xs font-medium text-ojas-text-secondary dark:text-ojas-cloud-silver">
              {statusConfig.accessibilityLabel.split(' - ')[0]}
            </p>
          </div>
          
          <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
            {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
          </p>
        </div>
      </button>

      {/* Status Summary */}
      <p className="text-center mt-6 text-ojas-text-secondary dark:text-ojas-cloud-silver text-lg font-medium">
        {statusConfig.description}
      </p>

      {/* Enhanced Expanded Interactive Summary */}
      {isExpanded && (
        <div className="mt-8 animate-gentle-fade-in">
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border-2 border-ojas-border dark:border-ojas-slate-gray p-6">
            <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-6 text-center">Today's Overview</h3>
            
            <div className="space-y-4">
              {getSummaryItems().map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-ojas-bg-light dark:hover:bg-ojas-slate-gray/20 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      item.status === 'good' ? 'bg-ojas-success' : 
                      item.status === 'attention' ? 'bg-ojas-alert' : 
                      'bg-ojas-text-secondary'
                    }`}>
                      {item.status !== 'neutral' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-ojas-text-main dark:text-ojas-mist-white font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
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
                  <span className="font-semibold text-ojas-text-main dark:text-ojas-mist-white text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-ojas-border dark:border-ojas-slate-gray">
              <p className="text-center text-ojas-text-secondary dark:text-ojas-cloud-silver text-sm">
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
