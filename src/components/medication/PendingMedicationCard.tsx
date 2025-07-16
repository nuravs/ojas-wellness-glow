
import React from 'react';
import { Clock, Eye, EyeOff, MoreVertical } from 'lucide-react';
import { useComorbidities } from '../../hooks/useComorbidities';
import { useMedicationConditions } from '../../hooks/useMedicationConditions';
import MedicationConditionTags from './MedicationConditionTags';

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
  const { comorbidities } = useComorbidities();
  const { getConditionsForMedication } = useMedicationConditions();
  
  // Get linked conditions for this medication
  const medicationConditions = getConditionsForMedication(medication.id);
  const linkedConditions = comorbidities.filter(c => 
    medicationConditions.some(mc => mc.comorbidity_id === c.id)
  );

  return (
    <div className={`bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border-2 p-6 transition-all duration-200 hover:shadow-ojas-medium ${
      isPriority 
        ? 'border-ojas-alert shadow-ojas-alert/20' 
        : 'border-ojas-border dark:border-ojas-slate-gray hover:border-ojas-primary/30'
    }`}>
      {/* Priority Indicator */}
      {isPriority && (
        <div className="flex items-center gap-2 mb-4 text-ojas-alert">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Overdue</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            {medication.name}
          </h3>
          <div className="space-y-1">
            <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
              <span className="font-medium">{medication.dosage}</span> • {medication.time}
            </p>
          </div>

          {/* Condition Tags */}
          <MedicationConditionTags 
            conditions={linkedConditions}
            showAddButton={userRole === 'patient'}
            onLinkCondition={() => console.log('Link condition to medication')}
          />
        </div>

        {/* Action Menu */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-5 h-5 text-ojas-text-secondary dark:text-ojas-cloud-silver" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onToggle(medication.id)}
          className="flex-1 px-6 py-3 bg-ojas-primary text-white rounded-xl text-lg font-semibold hover:bg-ojas-primary-hover transition-all duration-200 active:scale-95 shadow-ojas-soft"
          style={{ minHeight: '44px' }}
        >
          Mark as Taken
        </button>
        
        {onPostpone && (
          <button
            onClick={() => onPostpone(medication.id)}
            className="px-6 py-3 border-2 border-ojas-border dark:border-ojas-slate-gray text-ojas-text-main dark:text-ojas-mist-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
            style={{ minHeight: '44px' }}
          >
            Postpone
          </button>
        )}
      </div>

      {/* Caregiver Controls */}
      {userRole === 'caregiver' && onToggleVisibility && (
        <div className="mt-4 pt-4 border-t border-ojas-border dark:border-ojas-slate-gray">
          <button
            onClick={() => onToggleVisibility(medication.id)}
            className="flex items-center gap-2 text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver hover:text-ojas-primary transition-colors"
            style={{ minHeight: '32px' }}
          >
            {medication.caregiver_visible ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Visible to caregiver</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hidden from caregiver</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingMedicationCard;
