
import React from 'react';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { Comorbidity } from '../hooks/useComorbidities';
import { getCopyForRole } from '../utils/roleBasedCopy';

interface ComorbidityStatusSummaryProps {
  comorbidities: Comorbidity[];
  userRole: 'patient' | 'caregiver';
}

const ComorbidityStatusSummary: React.FC<ComorbidityStatusSummaryProps> = ({ 
  comorbidities, 
  userRole 
}) => {
  const controlled = comorbidities.filter(c => c.status === 'controlled').length;
  const needsAttention = comorbidities.filter(c => c.status === 'active' || c.status === 'monitoring').length;
  const inactive = comorbidities.filter(c => c.status === 'inactive').length;

  // Check for conditions that haven't been updated in 30+ days
  const outdatedConditions = comorbidities.filter(condition => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(condition.updated_at) < thirtyDaysAgo;
  }).length;

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Health Conditions
        </h3>
        <Activity className="w-5 h-5 text-ojas-text-secondary dark:text-ojas-cloud-silver" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Controlled Conditions */}
        <div className="flex items-center gap-3 p-3 bg-ojas-success/10 rounded-lg">
          <CheckCircle className="w-6 h-6 text-ojas-success flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
              {controlled}
            </p>
            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Controlled
            </p>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="flex items-center gap-3 p-3 bg-ojas-alert/10 rounded-lg">
          <AlertCircle className="w-6 h-6 text-ojas-alert flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
              {needsAttention}
            </p>
            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Need Attention
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary Text */}
      <div className="text-center">
        <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
          {controlled > 0 && needsAttention === 0 && (
            <>All {controlled} condition{controlled !== 1 ? 's' : ''} well managed</>
          )}
          {controlled > 0 && needsAttention > 0 && (
            <>{controlled} controlled, {needsAttention} need{needsAttention !== 1 ? '' : 's'} attention</>
          )}
          {controlled === 0 && needsAttention > 0 && (
            <>{needsAttention} condition{needsAttention !== 1 ? 's' : ''} need{needsAttention !== 1 ? '' : 's'} attention</>
          )}
          {comorbidities.length === 0 && (
            <>No conditions tracked yet</>
          )}
        </p>
      </div>

      {/* Alert for outdated conditions */}
      {outdatedConditions > 0 && (
        <div className="mt-4 p-3 bg-ojas-alert/10 rounded-lg border border-ojas-alert/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ojas-alert" />
            <p className="text-sm text-ojas-alert font-medium">
              {outdatedConditions} condition{outdatedConditions !== 1 ? 's' : ''} haven't been updated in 30+ days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComorbidityStatusSummary;
