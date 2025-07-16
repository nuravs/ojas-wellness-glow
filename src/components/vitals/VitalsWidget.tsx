
import React from 'react';
import { Heart, Droplets, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { useVitals } from '../../hooks/useVitals';

interface VitalsWidgetProps {
  userRole: 'patient' | 'caregiver';
  onNavigateToVitals?: () => void;
}

const VitalsWidget: React.FC<VitalsWidgetProps> = ({ 
  userRole,
  onNavigateToVitals 
}) => {
  const { vitals, getVitalRangeStatus } = useVitals();

  const getLatestVitals = () => {
    const types = ['blood_pressure', 'blood_sugar', 'pulse'];
    return types.map(type => {
      const latest = vitals.find(v => v.vital_type === type);
      return { type, vital: latest };
    }).filter(item => item.vital);
  };

  const formatVitalValue = (vital: any) => {
    switch (vital.vital_type) {
      case 'blood_pressure':
        return `${vital.values.systolic}/${vital.values.diastolic}`;
      case 'blood_sugar':
        return `${vital.values.value}`;
      case 'pulse':
        return `${vital.values.value}`;
      default:
        return 'N/A';
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'blood_sugar': return Droplets;
      case 'pulse': return Activity;
      default: return Activity;
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'BP';
      case 'blood_sugar': return 'Sugar';
      case 'pulse': return 'Pulse';
      default: return type;
    }
  };

  const latestVitals = getLatestVitals();
  const outOfRangeCount = vitals.filter(v => v.out_of_range).length;

  if (latestVitals.length === 0) {
    return (
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            Latest Vitals
          </h3>
          <TrendingUp className="w-5 h-5 text-ojas-text-secondary dark:text-ojas-cloud-silver" />
        </div>
        
        <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver text-center py-4">
          No vitals recorded yet
        </p>
        
        {onNavigateToVitals && (
          <button
            onClick={onNavigateToVitals}
            className="w-full px-4 py-2 bg-ojas-primary/10 text-ojas-primary rounded-lg text-sm font-medium hover:bg-ojas-primary/20 transition-colors"
            style={{ minHeight: '36px' }}
          >
            Add First Reading
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            Latest Vitals
          </h3>
          {outOfRangeCount > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-ojas-error" />
              <span className="text-xs text-ojas-error font-medium">
                {outOfRangeCount} reading{outOfRangeCount !== 1 ? 's' : ''} need attention
              </span>
            </div>
          )}
        </div>
        <TrendingUp className="w-5 h-5 text-ojas-text-secondary dark:text-ojas-cloud-silver" />
      </div>

      <div className="space-y-3">
        {latestVitals.slice(0, 3).map(({ type, vital }) => {
          const Icon = getVitalIcon(type);
          const status = getVitalRangeStatus(vital.vital_type, vital.values);
          const statusColor = status === 'good' ? 'text-ojas-success' : 
                             status === 'attention' ? 'text-ojas-alert' : 'text-ojas-error';
          
          return (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-ojas-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    {getVitalLabel(type)}
                  </p>
                  <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    {new Date(vital.measured_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-semibold ${statusColor}`}>
                  {formatVitalValue(vital)}
                </p>
                {type === 'blood_pressure' && (
                  <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    mmHg
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {onNavigateToVitals && (
        <button
          onClick={onNavigateToVitals}
          className="w-full mt-4 px-4 py-2 bg-ojas-primary/10 text-ojas-primary rounded-lg text-sm font-medium hover:bg-ojas-primary/20 transition-colors"
          style={{ minHeight: '36px' }}
        >
          View All Vitals
        </button>
      )}
    </div>
  );
};

export default VitalsWidget;
