
import React, { useState } from 'react';
import { Check, Clock, AlertTriangle, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';

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
          icon: <CheckCircle className="w-8 h-8 text-wellness-green" />, 
          label: 'All Good',
          description: 'Everything looks good today',
          accessibilityLabel: 'Normal - Everything is on track'
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-8 h-8 text-wellness-yellow" />, 
          label: 'Gentle Reminder',
          description: 'A gentle reminder is waiting',
          accessibilityLabel: 'Attention - Check your reminders'
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-8 h-8 text-wellness-red" />, 
          label: 'Important Alert',
          description: 'Please check your important alerts',
          accessibilityLabel: 'Alert - Action required'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getMedicationStatusText = () => {
    if (medsCount.taken === medsCount.total) return 'All medications taken ✓';
    return `${medsCount.taken}/${medsCount.total} medications taken`;
  };

  const getMedicationStatusLabel = () => {
    if (medsCount.taken === medsCount.total) return 'Complete';
    return 'Pending';
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Main Ring */}
      <button
        onClick={handleTap}
        className={`w-48 h-48 mx-auto wellness-ring status-${status} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-wellness-blue/50`}
        aria-label={`Wellness status: ${statusConfig.accessibilityLabel}. Tap to view details.`}
      >
        <div className="text-center">
          {statusConfig.icon}
          <p className="mt-2 text-sm font-medium text-wellness-calm-700">
            {statusConfig.label}
          </p>
          {/* Accessibility text label */}
          <p className="text-xs text-wellness-calm-600 mt-1">
            {statusConfig.accessibilityLabel.split(' - ')[0]}
          </p>
        </div>
      </button>

      {/* Status Summary */}
      <p className="text-center mt-4 text-wellness-calm-600 text-lg">
        {statusConfig.description}
      </p>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 animate-gentle-fade-in">
          <div className="ojas-card">
            <h3 className="text-xl font-semibold text-wellness-calm-800 mb-4">Today's Overview</h3>
            
            <div className="space-y-3">
              {/* Medications */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${medsCount.taken === medsCount.total ? 'bg-wellness-green' : 'bg-wellness-yellow'}`} />
                  <span className="text-wellness-calm-700">Medications</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    medsCount.taken === medsCount.total 
                      ? 'bg-wellness-green/20 text-wellness-green' 
                      : 'bg-wellness-yellow/20 text-wellness-yellow'
                  }`}>
                    {getMedicationStatusLabel()}
                  </span>
                </div>
                <span className="font-medium text-wellness-calm-800">
                  {medsCount.taken}/{medsCount.total} taken
                </span>
              </div>

              {/* Symptoms */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${symptomsLogged ? 'bg-wellness-green' : 'bg-wellness-calm-300'}`} />
                  <span className="text-wellness-calm-700">Symptoms</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    symptomsLogged 
                      ? 'bg-wellness-green/20 text-wellness-green' 
                      : 'bg-wellness-calm-200 text-wellness-calm-600'
                  }`}>
                    {symptomsLogged ? 'Logged' : 'None'}
                  </span>
                </div>
                <span className="font-medium text-wellness-calm-800">
                  {symptomsLogged ? 'Logged today' : 'No entries today'}
                </span>
              </div>

              {/* Next Appointment */}
              {nextAppointment && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-wellness-blue" />
                    <span className="text-wellness-calm-700">Next Appointment</span>
                    <span className="text-xs bg-wellness-blue/20 text-wellness-blue px-2 py-1 rounded-full">
                      Upcoming
                    </span>
                  </div>
                  <span className="font-medium text-wellness-calm-800">
                    {nextAppointment}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessRing;
