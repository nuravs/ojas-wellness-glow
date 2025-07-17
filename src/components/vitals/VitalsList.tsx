
import React from 'react';
import { Heart, Droplets, Activity, Weight, Thermometer, Clock } from 'lucide-react';
import { Vital } from '../../hooks/useVitals';

interface VitalsListProps {
  vitals: Vital[];
  userRole: 'patient' | 'caregiver';
  getVitalRangeStatus: (type: Vital['vital_type'], values: any) => string;
}

const VitalsList: React.FC<VitalsListProps> = ({ 
  vitals, 
  userRole,
  getVitalRangeStatus 
}) => {
  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'blood_sugar': return Droplets;
      case 'pulse': return Activity;
      case 'weight': return Weight;
      case 'temperature': return Thermometer;
      default: return Activity;
    }
  };

  const formatVitalValue = (vital: Vital) => {
    switch (vital.vital_type) {
      case 'blood_pressure':
        return `${vital.values.systolic}/${vital.values.diastolic} mmHg`;
      case 'blood_sugar':
        return `${vital.values.value} ${vital.values.unit || 'mg/dL'}`;
      case 'pulse':
        return `${vital.values.value} bpm`;
      case 'weight':
        return `${vital.values.value} ${vital.values.unit || 'lbs'}`;
      case 'temperature':
        return `${vital.values.value}°${vital.values.unit || 'F'}`;
      default:
        return 'N/A';
    }
  };

  const getVitalLabel = (type: string) => {
    const labels = {
      blood_pressure: 'Blood Pressure',
      blood_sugar: 'Blood Sugar',
      pulse: 'Pulse',
      weight: 'Weight',
      temperature: 'Temperature'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-ojas-calming-green bg-ojas-calming-green/10';
      case 'borderline': return 'text-ojas-soft-gold bg-ojas-soft-gold/10';
      case 'high': return 'text-ojas-error bg-ojas-error/10';
      case 'low': return 'text-ojas-primary-blue bg-ojas-primary-blue/10';
      default: return 'text-ojas-charcoal-gray bg-ojas-charcoal-gray/10';
    }
  };

  const getTrendIcon = (vital: Vital, previousVital?: Vital) => {
    if (!previousVital) return null;
    
    let currentValue, previousValue;
    
    switch (vital.vital_type) {
      case 'blood_pressure':
        currentValue = vital.values.systolic;
        previousValue = previousVital.values.systolic;
        break;
      case 'blood_sugar':
      case 'pulse':
      case 'weight':
      case 'temperature':
        currentValue = vital.values.value;
        previousValue = previousVital.values.value;
        break;
      default:
        return null;
    }
    
    if (currentValue > previousValue) {
      return <span className="text-ojas-error">↑</span>;
    } else if (currentValue < previousValue) {
      return <span className="text-ojas-calming-green">↓</span>;
    } else {
      return <span className="text-ojas-slate-gray">→</span>;
    }
  };

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-ojas-success';
      case 'attention': return 'text-ojas-alert';
      case 'high': return 'text-ojas-error';
      default: return 'text-ojas-text-main';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'bg-ojas-success/20 text-ojas-success';
      case 'attention': return 'bg-ojas-alert/20 text-ojas-alert';
      case 'high': return 'bg-ojas-error/20 text-ojas-error';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (vitals.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-ojas-primary" />
        </div>
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
          ✅ Vitals Page Working!
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver mb-6 max-w-sm mx-auto">
          {userRole === 'caregiver' 
            ? "Ready to track Jane's health! Use the dashboard above to record vital signs like blood pressure, heart rate, and weight."
            : "Ready to track your health! Use the dashboard above to record vital signs like blood pressure, heart rate, and weight."
          }
        </p>
        <div className="bg-ojas-bg-light dark:bg-ojas-charcoal-gray rounded-xl p-4 border border-ojas-border dark:border-ojas-slate-gray">
          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
            💡 Tip: Use the quick entry cards above to add your first vital reading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Recent Readings
        </h2>
        <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
          {vitals.length} total
        </span>
      </div>

      <div className="space-y-3">
        {vitals.map((vital, index) => {
          const Icon = getVitalIcon(vital.vital_type);
          const status = getVitalRangeStatus(vital.vital_type, vital.values);
          const previousVital = vitals[index + 1]; // Next item is older
          const trendIcon = getTrendIcon(vital, previousVital);
          
          return (
            <div
              key={vital.id}
              className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                        {getVitalLabel(vital.vital_type)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                        {status === 'normal' ? 'Normal' : 
                         status === 'borderline' ? 'Borderline' : 
                         status === 'high' ? 'High' : 
                         status === 'low' ? 'Low' : status}
                      </span>
                      {vital.out_of_range && (
                        <span className="w-2 h-2 bg-ojas-error rounded-full" title="Out of range"></span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-semibold ${getVitalStatusColor(status)}`}>
                          {formatVitalValue(vital)}
                        </p>
                        {trendIcon && (
                          <span className="text-lg font-bold" title="Trend vs last reading">
                            {trendIcon}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(vital.measured_at).toLocaleDateString()} at{' '}
                          {new Date(vital.measured_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {vital.notes && (
                      <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mt-2">
                        {vital.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalsList;
