
import React, { useState } from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';

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

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <Check className="w-8 h-8 text-wellness-green" />;
      case 'attention': return <Clock className="w-8 h-8 text-wellness-yellow" />;
      case 'urgent': return <AlertTriangle className="w-8 h-8 text-wellness-red" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'good': return 'Everything looks good today';
      case 'attention': return 'A gentle reminder is waiting';
      case 'urgent': return 'Please check your important alerts';
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Main Ring */}
      <button
        onClick={handleTap}
        className={`w-48 h-48 mx-auto wellness-ring status-${status} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-wellness-blue/50`}
        aria-label={`Wellness status: ${getStatusText()}. Tap to view details.`}
      >
        <div className="text-center">
          {getStatusIcon()}
          <p className="mt-2 text-sm font-medium text-calm-700">
            {status === 'good' ? 'All Good' : status === 'attention' ? 'Reminder' : 'Alert'}
          </p>
        </div>
      </button>

      {/* Status Summary */}
      <p className="text-center mt-4 text-calm-600 text-lg">
        {getStatusText()}
      </p>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 animate-gentle-fade-in">
          <div className="ojas-card">
            <h3 className="text-xl font-semibold text-calm-800 mb-4">Today's Overview</h3>
            
            <div className="space-y-3">
              {/* Medications */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${medsCount.taken === medsCount.total ? 'bg-wellness-green' : 'bg-wellness-yellow'}`} />
                  <span className="text-calm-700">Medications</span>
                </div>
                <span className="font-medium text-calm-800">
                  {medsCount.taken}/{medsCount.total} taken
                </span>
              </div>

              {/* Symptoms */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${symptomsLogged ? 'bg-wellness-green' : 'bg-calm-300'}`} />
                  <span className="text-calm-700">Symptoms</span>
                </div>
                <span className="font-medium text-calm-800">
                  {symptomsLogged ? 'Logged today' : 'No entries today'}
                </span>
              </div>

              {/* Next Appointment */}
              {nextAppointment && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-wellness-blue" />
                    <span className="text-calm-700">Next Appointment</span>
                  </div>
                  <span className="font-medium text-calm-800">
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
