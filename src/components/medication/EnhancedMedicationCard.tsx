
import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { isOverdue } from '../../utils/medicationUtils';
import MedicationConditionTags from './MedicationConditionTags';

interface LinkedCondition {
  id: string;
  condition_name: string;
  status: 'active' | 'controlled' | 'monitoring' | 'inactive';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface Prescription {
  id: string;
  name: string;
  purpose?: string;
  dosage: string;
  time: string;
  taken: boolean;
  doctor?: string;
  note?: string;
  linkedConditions?: LinkedCondition[];
}

interface EnhancedMedicationCardProps {
  prescription: Prescription;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
  userRole?: 'patient' | 'caregiver';
}

const EnhancedMedicationCard: React.FC<EnhancedMedicationCardProps> = ({
  prescription,
  onToggle,
  onPostpone,
  userRole = 'patient'
}) => {
  const [showNote, setShowNote] = useState(false);
  const overdue = isOverdue(prescription.time);

  if (prescription.taken) {
    return (
      <div 
        className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray opacity-75"
        style={{ minHeight: '120px', padding: '12px', margin: '0 16px' }}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-bold text-ojas-text-main dark:text-ojas-mist-white">
                {prescription.name}
              </h3>
              {prescription.purpose && (
                <p className="text-sm italic text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {prescription.purpose}
                </p>
              )}
            </div>
            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
              {prescription.dosage} • Taken at {prescription.time}
            </p>
            <MedicationConditionTags linkedConditions={prescription.linkedConditions || []} />
          </div>
          <div className="text-ojas-success">
            <div className="w-8 h-8 rounded-full bg-ojas-success/20 flex items-center justify-center">
              <span className="text-lg">✓</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border transition-all duration-200 ${
        overdue 
          ? 'border-ojas-error shadow-ojas-urgent animate-pulse-urgent' 
          : 'border-ojas-border dark:border-ojas-slate-gray'
      }`}
      style={{ minHeight: '120px', padding: '12px', margin: '0 16px' }}
    >
      <div className="space-y-3">
        {/* Main medication info */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-bold text-ojas-text-main dark:text-ojas-mist-white">
              {prescription.name}
            </h3>
            {prescription.purpose && (
              <p className="text-sm italic text-ojas-text-secondary dark:text-ojas-cloud-silver">
                {prescription.purpose}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-ojas-text-secondary" />
              <span className={`${overdue ? 'text-ojas-error font-semibold' : 'text-ojas-text-secondary dark:text-ojas-cloud-silver'}`}>
                {overdue ? `Overdue - ${prescription.time}` : `Next dose: ${prescription.time}`}
              </span>
            </div>
          </div>
          
          {overdue && (
            <div className="text-ojas-error text-xs font-semibold bg-ojas-error/10 px-2 py-1 rounded">
              MISSED
            </div>
          )}
        </div>

        {/* Linked conditions */}
        <MedicationConditionTags linkedConditions={prescription.linkedConditions || []} />

        {/* Doctor's note section */}
        {prescription.note && (
          <div>
            <button
              onClick={() => setShowNote(!showNote)}
              className="flex items-center gap-2 text-sm text-ojas-primary hover:text-ojas-primary-hover transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {showNote ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>Doctor's note</span>
            </button>
            
            {showNote && (
              <div className="mt-2 p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-lg animate-gentle-fade-in">
                <p className="text-sm text-ojas-text-main dark:text-ojas-mist-white">
                  {prescription.note}
                </p>
                {prescription.doctor && (
                  <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver mt-1">
                    — Dr. {prescription.doctor}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onToggle(prescription.id)}
            className="flex-1 px-4 py-3 bg-ojas-primary text-white rounded-xl font-semibold transition-all duration-200 hover:bg-ojas-primary-hover active:scale-95"
            style={{ minHeight: '44px' }}
          >
            Mark as Taken
          </button>
          
          {onPostpone && (
            <button
              onClick={() => onPostpone(prescription.id)}
              className="px-4 py-3 bg-ojas-bg-light dark:bg-ojas-slate-gray text-ojas-text-main dark:text-ojas-mist-white rounded-xl font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-ojas-slate-gray/80 active:scale-95 flex items-center gap-2"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Postpone</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMedicationCard;
