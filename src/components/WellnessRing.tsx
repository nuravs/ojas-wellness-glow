
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
          icon: <CheckCircle className="w-10 h-10 text-wellness-green" />, 
          label: 'All Good',
          description: 'Everything looks good today',
          accessibilityLabel: 'Normal - Everything is on track',
          statusIcon: <Check className="w-4 h-4" />
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-10 h-10 text-wellness-yellow" />, 
          label: 'Gentle Reminder',
          description: 'A gentle reminder is waiting',
          accessibilityLabel: 'Attention - Check your reminders',
          statusIcon: <Clock className="w-4 h-4" />
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-10 h-10 text-wellness-red" />, 
          label: 'Important Alert',
          description: 'Please check your important alerts',
          accessibilityLabel: 'Alert - Action required',
          statusIcon: <AlertTriangle className="w-4 h-4" />
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
      {/* Main Interactive Ring */}
      <button
        onClick={handleTap}
        className={`w-56 h-56 mx-auto wellness-ring status-${status} flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-wellness-blue/50`}
        aria-label={`Wellness status: ${statusConfig.accessibilityLabel}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
      >
        <div className="text-center">
          {statusConfig.icon}
          <p className="mt-3 text-lg font-semibold text-calm-700">
            {statusConfig.label}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {statusConfig.statusIcon}
            <p className="text-sm font-medium text-calm-600">
              {statusConfig.accessibilityLabel.split(' - ')[0]}
            </p>
          </div>
          <p className="text-xs text-calm-500 mt-2">
            {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
          </p>
        </div>
      </button>

      {/* Status Summary */}
      <p className="text-center mt-6 text-calm-600 text-lg font-medium">
        {statusConfig.description}
      </p>

      {/* Expanded Interactive Summary */}
      {isExpanded && (
        <div className="mt-8 animate-gentle-fade-in">
          <div className="ojas-card">
            <h3 className="text-xl font-semibold text-calm-800 mb-6 text-center">Today's Overview</h3>
            
            <div className="space-y-4">
              {getSummaryItems().map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-calm-50 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      item.status === 'good' ? 'bg-wellness-green' : 
                      item.status === 'attention' ? 'bg-wellness-yellow' : 
                      'bg-calm-300'
                    }`}>
                      {item.status !== 'neutral' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-calm-700 font-medium">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.icon}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === 'good' 
                          ? 'bg-wellness-green/20 text-wellness-green' 
                          : item.status === 'attention'
                          ? 'bg-wellness-yellow/20 text-wellness-yellow'
                          : 'bg-calm-200 text-calm-600'
                      }`}>
                        {item.textStatus}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-calm-800 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-calm-200">
              <p className="text-center text-calm-600 text-sm">
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
