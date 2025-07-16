
import React from 'react';
import { Heart, Droplets, Activity, Weight, Thermometer } from 'lucide-react';
import { Vital } from '../../hooks/useVitals';

interface VitalsDashboardProps {
  vitals: Vital[];
  userRole: 'patient' | 'caregiver';
  onQuickAdd: (vitalType: string) => void;
}

const VitalsDashboard: React.FC<VitalsDashboardProps> = ({ 
  vitals, 
  userRole,
  onQuickAdd 
}) => {
  const getLatestVital = (type: string) => {
    return vitals.find(v => v.vital_type === type);
  };

  const formatVitalValue = (vital: Vital) => {
    switch (vital.vital_type) {
      case 'blood_pressure':
        return `${vital.values.systolic}/${vital.values.diastolic}`;
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

  const getVitalColor = (vital?: Vital) => {
    if (!vital) return 'text-ojas-text-secondary';
    return vital.out_of_range ? 'text-ojas-error' : 'text-ojas-success';
  };

  const vitalTypes = [
    {
      type: 'blood_pressure',
      label: 'Blood Pressure',
      icon: Heart,
      unit: 'mmHg'
    },
    {
      type: 'blood_sugar',
      label: 'Blood Sugar',
      icon: Droplets,
      unit: 'mg/dL'
    },
    {
      type: 'pulse',
      label: 'Pulse',
      icon: Activity,
      unit: 'bpm'
    },
    {
      type: 'weight',
      label: 'Weight',
      icon: Weight,
      unit: 'lbs'
    },
    {
      type: 'temperature',
      label: 'Temperature',
      icon: Thermometer,
      unit: '°F'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
        Quick Entry
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {vitalTypes.map(({ type, label, icon: Icon, unit }) => {
          const latestVital = getLatestVital(type);
          
          return (
            <button
              key={type}
              onClick={() => onQuickAdd(type)}
              className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 text-left hover:shadow-ojas-medium transition-all duration-200 active:scale-95"
              style={{ minHeight: '44px' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-ojas-primary" />
                <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                  {label}
                </span>
              </div>
              
              {latestVital ? (
                <div>
                  <p className={`text-lg font-semibold ${getVitalColor(latestVital)}`}>
                    {formatVitalValue(latestVital)}
                  </p>
                  <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    {new Date(latestVital.measured_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  Tap to add first reading
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VitalsDashboard;
