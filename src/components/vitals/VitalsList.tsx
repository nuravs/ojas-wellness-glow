
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
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-ojas-text-secondary dark:text-ojas-cloud-silver mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
          No vitals recorded yet
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
          Tap the + button to add your first vital reading
        </p>
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
        {vitals.map((vital) => {
          const Icon = getVitalIcon(vital.vital_type);
          const status = getVitalRangeStatus(vital.vital_type, vital.values);
          
          return (
            <div
              key={vital.id}
              className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-ojas-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                        {getVitalLabel(vital.vital_type)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                        {status === 'good' ? 'Normal' : status === 'attention' ? 'Attention' : 'High'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className={`text-lg font-semibold ${getStatusColor(status)}`}>
                        {formatVitalValue(vital)}
                      </p>
                      
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
