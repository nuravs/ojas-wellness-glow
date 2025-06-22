
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
  isPriority?: boolean;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone,
  isPriority = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTaken = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        onToggle(medication.id);
        setIsAnimating(false);
        setShowSuccess(false);
      }, 500);
    }, 200);
  };

  const handlePostpone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPostpone?.(medication.id);
  };

  // Completed medication state with enhanced styling
  if (medication.taken) {
    return (
      <div className="ojas-card bg-ojas-success/5 border-2 border-ojas-success/30 animate-gentle-fade-in">
        <div className="flex items-center gap-6">
          <div className="w-18 h-18 bg-ojas-success/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-10 h-10 text-ojas-success animate-success-check" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="text-2xl font-semibold text-ojas-success">
                {medication.name}
              </h3>
              <div className="flex items-center gap-2 status-indicator status-good">
                <Check className="w-5 h-5" />
                <span className="text-base font-medium">Taken</span>
              </div>
            </div>
            <p className="text-ojas-text-secondary font-medium mb-2 text-lg">
              {medication.dosage}
            </p>
            <div className="flex items-center gap-3 text-ojas-text-secondary">
              <Clock className="w-5 h-5" />
              <span className="text-base">Completed at {medication.time}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending medication state with priority support and enhanced interactions
  return (
    <div className={`ojas-card hover:shadow-ojas-medium cursor-pointer transition-all duration-300 ${
      isPriority ? 'priority-high' : ''
    } ${isAnimating ? 'animate-pulse-gentle' : ''}`}>
      <div className="flex items-start gap-6">
        <div className="w-18 h-18 bg-ojas-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Pill className="w-10 h-10 text-ojas-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-2xl font-semibold text-ojas-text-main">
              {medication.name}
            </h3>
            <div className="flex items-center gap-2 status-indicator status-attention">
              <AlertCircle className="w-5 h-5" />
              <span className="text-base font-medium">Pending</span>
            </div>
          </div>
          
          <p className="text-ojas-text-secondary font-medium mb-3 text-lg">
            {medication.dosage}
          </p>
          
          <div className="flex items-center gap-3 mb-8 text-ojas-text-secondary">
            <Clock className="w-5 h-5" />
            <span className="text-base font-medium">Scheduled for {medication.time}</span>
          </div>
          
          {/* Enhanced action buttons with success animation */}
          <div className="flex gap-5">
            <button
              onClick={handleTaken}
              className="medication-taken-button relative overflow-hidden"
              aria-label={`Mark ${medication.name} as taken`}
              disabled={isAnimating}
            >
              {showSuccess ? (
                <>
                  <CheckCircle className="w-7 h-7 animate-success-check" />
                  <span>✓ Success!</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-7 h-7" />
                  <span>✓ Taken</span>
                </>
              )}
            </button>
            
            {onPostpone && (
              <button
                onClick={handlePostpone}
                className="medication-postpone-button"
                aria-label={`Postpone ${medication.name} for 30 minutes`}
              >
                <Calendar className="w-7 h-7" />
                <span>⏰ Postpone</span>
              </button>
            )}
          </div>

          {/* Enhanced accessibility helper text */}
          <p className="text-sm text-ojas-text-secondary mt-4 text-center">
            Tap medication name for details, or use buttons above to log dose
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
