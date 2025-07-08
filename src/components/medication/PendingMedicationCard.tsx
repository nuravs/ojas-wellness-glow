
import React, { useState } from 'react';
import { Pill, Clock, CheckCircle, AlertCircle, Calendar, MoreHorizontal } from 'lucide-react';
import { getCopyForRole } from '../../utils/roleBasedCopy';
import { isOverdue } from '../../utils/medicationUtils';
import MedicationLoggedBy from './MedicationLoggedBy';
import CaregiverVisibilityToggle from './CaregiverVisibilityToggle';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  caregiver_visible?: boolean;
  logged_by_role?: 'patient' | 'caregiver';
}

interface PendingMedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  isPriority?: boolean;
  userRole?: 'patient' | 'caregiver';
}

const PendingMedicationCard: React.FC<PendingMedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone,
  onToggleVisibility,
  isPriority = false,
  userRole = 'patient'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const overdueStatus = isOverdue(medication.time);

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

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.(medication.id);
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border overflow-hidden transition-all duration-300 hover:shadow-ojas-medium ${
      isPriority ? 'scale-105 shadow-ojas-medium' : ''
    } ${isAnimating ? 'animate-pulse-gentle' : ''} ${
      overdueStatus ? 'animate-pulse-urgent' : ''
    }`} style={{ minHeight: '120px' }}>
      {/* Left sidebar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        overdueStatus ? 'bg-ojas-error' : 'bg-ojas-primary'
      }`}></div>
      
      {/* Overdue badge - Only show "Missed" if time window elapsed */}
      {overdueStatus && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-ojas-error/10 rounded-full">
          <AlertCircle className="w-3 h-3 text-ojas-error" />
          <span className="text-xs font-medium text-ojas-error">Missed</span>
        </div>
      )}

      {/* Options menu button for patients */}
      {userRole === 'patient' && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="absolute top-4 right-12 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          style={{ minHeight: '44px', minWidth: '44px' }}
          aria-label="Medication options"
        >
          <MoreHorizontal className="w-4 h-4 text-ojas-text-secondary" />
        </button>
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
            {!overdueStatus && (
              <div className="flex items-center gap-2 px-3 py-1 bg-ojas-alert/10 rounded-full">
                <Clock className="w-4 h-4 text-ojas-alert" />
                <span className="text-sm font-medium text-ojas-alert">Pending</span>
              </div>
            )}
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

          {/* Privacy options dropdown */}
          {showOptions && userRole === 'patient' && onToggleVisibility && (
            <div className="mb-4 p-3 bg-ojas-bg-light rounded-lg border">
              <CaregiverVisibilityToggle
                isVisible={medication.caregiver_visible ?? true}
                onToggle={handleToggleVisibility}
                medicationName={medication.name}
                userRole={userRole}
              />
            </div>
          )}
          
          {/* Action buttons with role-based copy */}
          <div className="flex gap-4">
            <button
              onClick={handleTaken}
              className="flex-1 min-h-[44px] bg-ojas-primary text-white rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 hover:bg-ojas-primary-hover active:scale-95 shadow-ojas-medium"
              aria-label={`Mark ${medication.name} as taken`}
              disabled={isAnimating}
            >
              {showSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 animate-success-check" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{getCopyForRole('medicationMarkTaken', userRole)}</span>
                </>
              )}
            </button>
            
            {onPostpone && (
              <button
                onClick={handleSkip}
                className="flex-1 min-h-[44px] bg-ojas-alert text-ojas-text-main rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 hover:bg-ojas-alert-hover active:scale-95 shadow-ojas-medium"
                aria-label={`Postpone ${medication.name}`}
              >
                <Calendar className="w-5 h-5" />
                <span>{getCopyForRole('medicationPostpone', userRole)}</span>
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

export default PendingMedicationCard;
