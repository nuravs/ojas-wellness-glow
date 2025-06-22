
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
          icon: <CheckCircle className="w-12 h-12 text-ojas-success" />, 
          label: 'All Good',
          description: 'Everything looks good today',
          accessibilityLabel: 'Normal - Everything is on track',
          statusIcon: <Check className="w-5 h-5" />
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-12 h-12 text-ojas-alert" />, 
          label: 'Gentle Reminder',
          description: 'A gentle reminder is waiting',
          accessibilityLabel: 'Attention - Check your reminders',
          statusIcon: <Clock className="w-5 h-5" />
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-12 h-12 text-ojas-error" />, 
          label: 'Important Alert',
          description: 'Please check your important alerts',
          accessibilityLabel: 'Alert - Action required',
          statusIcon: <AlertTriangle className="w-5 h-5" />
        };
    }
  };

  const statusConfig = getStatusConfig();

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
      {/* Enhanced Interactive Ring with Priority Glow */}
      <button
        onClick={handleTap}
        className={`w-64 h-64 mx-auto ojas-wellness-ring status-${status} flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 ${
          status === 'attention' ? 'animate-pulse-glow' : ''
        }`}
        aria-label={`Wellness status: ${statusConfig.accessibilityLabel}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
      >
        <div className="text-center">
          {statusConfig.icon}
          <p className="mt-4 text-xl font-semibold text-ojas-text-main">
            {statusConfig.label}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            {statusConfig.statusIcon}
            <p className="text-base font-medium text-ojas-text-secondary">
              {statusConfig.accessibilityLabel.split(' - ')[0]}
            </p>
          </div>
          <p className="text-sm text-ojas-text-secondary mt-3">
            {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
          </p>
        </div>
      </button>

      {/* Enhanced Status Summary */}
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
