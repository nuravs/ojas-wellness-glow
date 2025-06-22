
import React, { useState } from 'react';
import { Pill, Clock, Check, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTaken = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card tap navigation
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(medication.id);
      setIsAnimating(false);
    }, 300);
  };

  const handlePostpone = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card tap navigation
    onPostpone?.(medication.id);
  };

  // Completed medication state
  if (medication.taken) {
    return (
      <div className="ojas-card bg-wellness-green/5 border-2 border-wellness-green/30 animate-gentle-fade-in">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-wellness-green/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-8 h-8 text-wellness-green animate-check-mark" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-wellness-green">
                {medication.name}
              </h3>
              <div className="flex items-center gap-1 status-indicator status-good">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Taken</span>
              </div>
            </div>
            <p className="text-calm-600 font-medium mb-1">
              {medication.dosage}
            </p>
            <div className="flex items-center gap-2 text-calm-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Completed at {medication.time}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending medication state - tap-first design
  return (
    <div className={`ojas-card hover:shadow-wellness-medium cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-pulse-gentle' : ''}`}>
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-wellness-blue/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Pill className="w-8 h-8 text-wellness-blue" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-calm-800">
              {medication.name}
            </h3>
            <div className="flex items-center gap-1 status-indicator status-attention">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
          </div>
          
          <p className="text-calm-600 font-medium mb-2">
            {medication.dosage}
          </p>
          
          <div className="flex items-center gap-2 mb-6 text-calm-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Scheduled for {medication.time}</span>
          </div>
          
          {/* Large, accessible action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleTaken}
              className="medication-taken-button"
              aria-label={`Mark ${medication.name} as taken`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>✓ Taken</span>
            </button>
            
            {onPostpone && (
              <button
                onClick={handlePostpone}
                className="medication-postpone-button"
                aria-label={`Postpone ${medication.name} for 30 minutes`}
              >
                <Calendar className="w-6 h-6" />
                <span>⏰ Postpone</span>
              </button>
            )}
          </div>

          {/* Accessibility helper text */}
          <p className="text-xs text-calm-500 mt-3 text-center">
            Tap medication name for details, or use buttons above to log dose
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
