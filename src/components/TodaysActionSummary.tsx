
import React from 'react';
import { Check, Clock, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';

interface ComorbidityStatus {
  controlled: number;
  needsAttention: number;
  total: number;
}

interface TodaysActionSummaryProps {
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  userRole: 'patient' | 'caregiver';
  onViewAll: () => void;
  comorbidityStatus?: ComorbidityStatus;
}

const TodaysActionSummary: React.FC<TodaysActionSummaryProps> = ({
  medsCount,
  symptomsLogged,
  nextAppointment,
  userRole,
  onViewAll,
  comorbidityStatus
}) => {
  const getTotalPendingActions = () => {
    let pending = medsCount.total - medsCount.taken;
    if (!symptomsLogged) pending += 1;
    if (comorbidityStatus) {
      pending += comorbidityStatus.needsAttention;
    }
    return pending;
  };

  const pendingActions = getTotalPendingActions();

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          {getCopyForRole('todaysActions', userRole)}
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-ojas-primary hover:text-ojas-primary-hover font-medium transition-colors"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          View All
        </button>
      </div>

      {pendingActions === 0 ? (
        <div className="text-center py-4">
          <Check className="w-12 h-12 text-ojas-success mx-auto mb-3" />
          <p className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-1">
            All caught up! 🎉
          </p>
          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
            {getCopyForRole('allTasksComplete', userRole)}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Medication Summary */}
          {medsCount.total > 0 && (
            <div className="flex items-center justify-between p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray rounded-lg">
              <div className="flex items-center gap-3">
                {medsCount.taken === medsCount.total ? (
                  <Check className="w-5 h-5 text-ojas-success" />
                ) : (
                  <Clock className="w-5 h-5 text-ojas-alert" />
                )}
                <div>
                  <p className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    Medications
                  </p>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    {medsCount.taken}/{medsCount.total} completed
                  </p>
                </div>
              </div>
              {medsCount.taken < medsCount.total && (
                <span className="text-sm font-semibold text-ojas-alert">
                  {medsCount.total - medsCount.taken} pending
                </span>
              )}
            </div>
          )}

          {/* Comorbidity Status Summary */}
          {comorbidityStatus && comorbidityStatus.total > 0 && (
            <div className="flex items-center justify-between p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray rounded-lg">
              <div className="flex items-center gap-3">
                {comorbidityStatus.needsAttention === 0 ? (
                  <Check className="w-5 h-5 text-ojas-success" />
                ) : (
                  <Activity className="w-5 h-5 text-ojas-alert" />
                )}
                <div>
                  <p className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    Health Conditions
                  </p>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    {comorbidityStatus.controlled} controlled, {comorbidityStatus.needsAttention} need attention
                  </p>
                </div>
              </div>
              {comorbidityStatus.needsAttention > 0 && (
                <span className="text-sm font-semibold text-ojas-alert">
                  Review needed
                </span>
              )}
            </div>
          )}

          {/* Symptoms Summary */}
          <div className="flex items-center justify-between p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray rounded-lg">
            <div className="flex items-center gap-3">
              {symptomsLogged ? (
                <Check className="w-5 h-5 text-ojas-success" />
              ) : (
                <Clock className="w-5 h-5 text-ojas-alert" />
              )}
              <div>
                <p className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                  Symptoms
                </p>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {symptomsLogged ? 'Logged today' : 'No entries yet'}
                </p>
              </div>
            </div>
            {!symptomsLogged && (
              <span className="text-sm font-semibold text-ojas-alert">
                Track today
              </span>
            )}
          </div>

          {/* Next Appointment */}
          {nextAppointment && (
            <div className="flex items-center justify-between p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-ojas-primary" />
                <div>
                  <p className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    Next Appointment
                  </p>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    {nextAppointment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodaysActionSummary;
