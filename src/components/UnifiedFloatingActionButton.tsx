
import React, { useState } from 'react';
import { Plus, Heart, Activity, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventLoggerModal from './events/EventLoggerModal';

interface UnifiedFloatingActionButtonProps {
  onVitalAdd?: () => void;
  onSymptomAdd?: () => void;
  onEventLogged?: () => void;
  showVitals?: boolean;
  showSymptoms?: boolean;
  showEvents?: boolean;
}

const UnifiedFloatingActionButton: React.FC<UnifiedFloatingActionButtonProps> = ({
  onVitalAdd,
  onSymptomAdd,
  onEventLogged,
  showVitals = true,
  showSymptoms = true,
  showEvents = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-28 right-6 z-50">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action Options */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {showEvents && (
            <EventLoggerModal onEventLogged={(event) => {
              onEventLogged?.();
              setIsExpanded(false);
            }}>
              <Button
                className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full shadow-ojas-strong flex items-center justify-center text-white transform transition-all duration-200 hover:scale-110"
                style={{ minWidth: '48px', minHeight: '48px' }}
                aria-label="Log Event"
              >
                <AlertTriangle className="w-5 h-5" />
              </Button>
            </EventLoggerModal>
          )}
          
          {showSymptoms && onSymptomAdd && (
            <Button
              onClick={() => handleOptionClick(onSymptomAdd)}
              className="w-12 h-12 bg-orange-600 hover:bg-orange-700 rounded-full shadow-ojas-strong flex items-center justify-center text-white transform transition-all duration-200 hover:scale-110"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Log Symptom"
            >
              <Activity className="w-5 h-5" />
            </Button>
          )}
          
          {showVitals && onVitalAdd && (
            <Button
              onClick={() => handleOptionClick(onVitalAdd)}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-ojas-strong flex items-center justify-center text-white transform transition-all duration-200 hover:scale-110"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Add Vital"
            >
              <Heart className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={handleMainClick}
        className={`w-14 h-14 rounded-full shadow-ojas-strong flex items-center justify-center text-white transition-all duration-200 ${
          isExpanded 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-ojas-primary hover:bg-ojas-primary-hover'
        }`}
        style={{ minWidth: '56px', minHeight: '56px' }}
        aria-label={isExpanded ? "Close menu" : "Quick add"}
      >
        <Plus className="w-7 h-7" />
      </Button>
    </div>
  );
};

export default UnifiedFloatingActionButton;
