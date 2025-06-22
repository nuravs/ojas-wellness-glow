
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

  // Check if medication is overdue
  const isOverdue = () => {
    if (medication.taken) return false;
    
    const medTime = new Date();
    const [hours, minutes] = medication.time.split(/[:\s]/);
    const isPM = medication.time.toLowerCase().includes('pm');
    const hour24 = isPM && parseInt(hours) !== 12 ? parseInt(hours) + 12 : 
                  !isPM && parseInt(hours) === 12 ? 0 : parseInt(hours);
    
    medTime.setHours(hour24, parseInt(minutes) || 0, 0, 0);
    
    return medTime < new Date();
  };

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

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPostpone?.(medication.id);
  };

  const overdueStatus = isOverdue();

  // Completed medication state
  if (medication.taken) {
    return (
      <div className="relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border overflow-hidden animate-gentle-fade-in">
        {/* Left sidebar - success */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ojas-success"></div>
        
        <div className="flex items-center gap-6 p-6">
          <div className="w-16 h-16 bg-ojas-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-8 h-8 text-ojas-success animate-success-check" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-ojas-success">
                {medication.name}
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-ojas-success/10 rounded-full">
                <Check className="w-4 h-4 text-ojas-success" />
                <span className="text-sm font-medium text-ojas-success">Taken</span>
              </div>
            </div>
            <p className="text-ojas-text-secondary font-medium mb-2">
              {medication.dosage}
            </p>
            <div className="flex items-center gap-2 text-ojas-text-secondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Completed at {medication.time}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending medication state
  return (
    <div className={`relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border overflow-hidden transition-all duration-300 hover:shadow-ojas-medium ${
      isPriority ? 'scale-105 shadow-ojas-medium' : ''
    } ${isAnimating ? 'animate-pulse-gentle' : ''} ${
      overdueStatus ? 'animate-pulse-urgent' : ''
    }`}>
      {/* Left sidebar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        overdueStatus ? 'bg-ojas-error' : 'bg-ojas-primary'
      }`}></div>
      
      {/* Overdue badge */}
      {overdueStatus && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-ojas-error rounded-full animate-pulse-urgent"></div>
      )}
      
      <div className="flex items-start gap-6 p-6">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
          overdueStatus ? 'bg-ojas-error/20' : 'bg-ojas-primary/20'
        }`}>
          <Pill className={`w-8 h-8 ${
            overdueStatus ? 'text-ojas-error' : 'text-ojas-primary'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-ojas-text-main">
              {medication.name}
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              overdueStatus 
                ? 'bg-ojas-error/10' 
                : 'bg-ojas-alert/10'
            }`}>
              <AlertCircle className={`w-4 h-4 ${
                overdueStatus ? 'text-ojas-error' : 'text-ojas-alert'
              }`} />
              <span className={`text-sm font-medium ${
                overdueStatus ? 'text-ojas-error' : 'text-ojas-alert'
              }`}>
                {overdueStatus ? 'Overdue' : 'Pending'}
              </span>
            </div>
          </div>
          
          <p className="text-ojas-text-secondary font-medium mb-3">
            {medication.dosage}
          </p>
          
          <div className="flex items-center gap-2 mb-6 text-ojas-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {overdueStatus ? 'Was due at' : 'Scheduled for'} {medication.time}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleTaken}
              className="flex-1 min-h-[56px] bg-ojas-primary text-white rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 hover:bg-ojas-primary-hover active:scale-95 shadow-ojas-medium"
              aria-label={`Mark ${medication.name} as taken`}
              disabled={isAnimating}
            >
              {showSuccess ? (
                <>
                  <CheckCircle className="w-6 h-6 animate-success-check" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>Taken</span>
                </>
              )}
            </button>
            
            {onPostpone && (
              <button
                onClick={handleSkip}
                className="flex-1 min-h-[56px] bg-ojas-alert text-ojas-text-main rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 hover:bg-ojas-alert-hover active:scale-95 shadow-ojas-medium"
                aria-label={`Skip ${medication.name}`}
              >
                <Calendar className="w-6 h-6" />
                <span>Skip</span>
              </button>
            )}
          </div>

          <p className="text-xs text-ojas-text-secondary mt-3 text-center">
            Tap medication name for details
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
