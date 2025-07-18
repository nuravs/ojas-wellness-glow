
import React from 'react';
import { Heart, Droplets, Activity, Weight, Thermometer, TrendingUp } from 'lucide-react';
import { Vital } from '../../hooks/useVitals';

interface VitalsListProps {
  vitals: Vital[];
  userRole: 'patient' | 'caregiver';
  getVitalRangeStatus: (type: string, values: any) => any;
}

const VitalsList: React.FC<VitalsListProps> = ({ 
  vitals, 
  userRole,
  getVitalRangeStatus 
}) => {
  if (!vitals || vitals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-ojas-primary" />
        </div>
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
          No Vitals Yet
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
          Start tracking your health by adding your first vital reading above.
        </p>
      </div>
    );
  }

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
    switch (type) {
      case 'blood_pressure': return 'Blood Pressure';
      case 'blood_sugar': return 'Blood Sugar';
      case 'pulse': return 'Pulse';
      case 'weight': return 'Weight';
      case 'temperature': return 'Temperature';
      default: return type;
    }
  };

  const getVitalColor = (vital: Vital) => {
    if (vital.out_of_range) {
      return 'text-ojas-error';
    }
    return 'text-ojas-success';
  };

  // Group vitals by type and get the most recent for each
  const groupedVitals = vitals.reduce((acc, vital) => {
    if (!acc[vital.vital_type] || new Date(vital.measured_at) > new Date(acc[vital.vital_type].measured_at)) {
      acc[vital.vital_type] = vital;
    }
    return acc;
  }, {} as Record<string, Vital>);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
        Latest Readings
      </h2>
      
      <div className="space-y-3">
        {Object.values(groupedVitals).map((vital) => {
          const Icon = getVitalIcon(vital.vital_type);
          const status = getVitalRangeStatus(vital.vital_type, vital.values);
          
          return (
            <div
              key={vital.id}
              className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ojas-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-ojas-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      {getVitalLabel(vital.vital_type)}
                    </h3>
                    <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      {new Date(vital.measured_at).toLocaleDateString()} at{' '}
                      {new Date(vital.measured_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getVitalColor(vital)}`}>
                    {formatVitalValue(vital)}
                  </p>
                  {status && (
                    <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      {status.label}
                    </p>
                  )}
                </div>
              </div>
              
              {vital.notes && (
                <div className="mt-3 pt-3 border-t border-ojas-border dark:border-ojas-slate-gray">
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    <span className="font-medium">Notes:</span> {vital.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalsList;
