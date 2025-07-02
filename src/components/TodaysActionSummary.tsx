
import React from 'react';
import { Pill, Activity, Calendar, ChevronRight } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';

interface TodaysActionSummaryProps {
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  userRole?: 'patient' | 'caregiver';
  onViewAll?: () => void;
}

const TodaysActionSummary: React.FC<TodaysActionSummaryProps> = ({
  medsCount,
  symptomsLogged,
  nextAppointment,
  userRole = 'patient',
  onViewAll
}) => {
  const nextMedStatus = medsCount.taken === medsCount.total ? 'All taken' : `${medsCount.total - medsCount.taken} pending`;
  const nextWellnessStatus = 'Stretching ready';
  const lastSymptomStatus = symptomsLogged ? 'Logged today' : 'No entries yet';

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          {getCopyForRole('todaysActionTitle', userRole)}
        </h3>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 text-ojas-primary hover:text-ojas-primary-hover transition-colors duration-200"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <span className="text-sm font-medium">View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Next Medication */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            medsCount.taken === medsCount.total ? 'bg-ojas-success/20' : 'bg-ojas-alert/20'
          }`}>
            <Pill className={`w-4 h-4 ${
              medsCount.taken === medsCount.total ? 'text-ojas-success' : 'text-ojas-alert'
            }`} />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
              {getCopyForRole('nextMedication', userRole)} 
            </span>
            <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver ml-1">
              {nextMedStatus}
            </span>
          </div>
        </div>

        {/* Next Wellness */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ojas-calming-green/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-ojas-calming-green" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
              {getCopyForRole('nextWellness', userRole)} 
            </span>
            <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver ml-1">
              {nextWellnessStatus}
            </span>
          </div>
        </div>

        {/* Last Symptom */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            symptomsLogged ? 'bg-ojas-success/20' : 'bg-ojas-border/20'
          }`}>
            <Calendar className={`w-4 h-4 ${
              symptomsLogged ? 'text-ojas-success' : 'text-ojas-text-secondary'
            }`} />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
              {getCopyForRole('lastSymptom', userRole)} 
            </span>
            <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver ml-1">
              {lastSymptomStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysActionSummary;
