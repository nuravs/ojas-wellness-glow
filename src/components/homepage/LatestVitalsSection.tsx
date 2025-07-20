
import React from 'react';
import { Activity, Heart, Droplets, Scale, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

interface LatestVitalsSectionProps {
  vitals: any[];
  userRole: 'patient' | 'caregiver';
  onViewAll: () => void;
  onQuickAdd: () => void;
  onAddReading: (vitalType: string) => void;
}

const LatestVitalsSection: React.FC<LatestVitalsSectionProps> = ({ 
  vitals, 
  userRole,
  onViewAll,
  onQuickAdd,
  onAddReading
}) => {
  // Process vitals data to get latest readings
  const getLatestVitals = () => {
    const vitalTypes = ['blood_pressure', 'heart_rate', 'weight', 'blood_sugar'];
    
    return vitalTypes.map(type => {
      const latestVital = vitals
        .filter(v => v.vital_type === type)
        .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime())[0];

      const getVitalDisplay = (vital: any, type: string) => {
        if (!vital) return { value: '--', unit: '', status: 'normal' };

        switch (type) {
          case 'blood_pressure':
            return {
              value: `${vital.values?.systolic || '--'}/${vital.values?.diastolic || '--'}`,
              unit: 'mmHg',
              status: (vital.values?.systolic > 140 || vital.values?.diastolic > 90) ? 'attention' : 'normal'
            };
          case 'heart_rate':
            return {
              value: vital.values?.bpm || '--',
              unit: 'bpm',
              status: (vital.values?.bpm > 100 || vital.values?.bpm < 60) ? 'attention' : 'normal'
            };
          case 'weight':
            return {
              value: vital.values?.weight || '--',
              unit: 'lbs',
              status: 'normal'
            };
          case 'blood_sugar':
            return {
              value: vital.values?.glucose || '--',
              unit: 'mg/dL',
              status: (vital.values?.glucose > 140) ? 'attention' : 'normal'
            };
          default:
            return { value: '--', unit: '', status: 'normal' };
        }
      };

      const getVitalInfo = (type: string) => {
        switch (type) {
          case 'blood_pressure':
            return { icon: Heart, label: 'Blood Pressure', color: 'text-red-500' };
          case 'heart_rate':
            return { icon: Activity, label: 'Heart Rate', color: 'text-pink-500' };
          case 'weight':
            return { icon: Scale, label: 'Weight', color: 'text-blue-500' };
          case 'blood_sugar':
            return { icon: Droplets, label: 'Blood Sugar', color: 'text-purple-500' };
          default:
            return { icon: Activity, label: 'Vital', color: 'text-gray-500' };
        }
      };

      const vitalInfo = getVitalInfo(type);
      const display = getVitalDisplay(latestVital, type);
      const timeSince = latestVital ? getTimeSince(latestVital.measured_at) : 'No data';

      return {
        id: type,
        ...vitalInfo,
        ...display,
        time: timeSince,
        hasData: !!latestVital
      };
    });
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-ojas-success text-white';
      case 'attention': return 'bg-ojas-alert text-ojas-text-main';
      case 'urgent': return 'bg-ojas-error text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  const vitalsData = getLatestVitals();

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-ojas-primary" />
          <h2 className="text-lg font-semibold text-ojas-text-main">
            Latest Vitals
          </h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-ojas-primary text-sm font-medium hover:text-ojas-primary-hover transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {vitalsData.map((vital) => {
          const IconComponent = vital.icon;
          return (
            <div key={vital.id} className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${vital.color}`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ojas-text-main text-sm">
                        {vital.label}
                      </h3>
                      {vital.hasData && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                          {vital.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ojas-text-secondary">
                      {vital.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-ojas-text-main">
                      {vital.value}
                    </div>
                    <div className="text-xs text-ojas-text-secondary">
                      {vital.unit}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onAddReading(vital.id)}
                    className="w-8 h-8 rounded-full bg-ojas-primary/10 text-ojas-primary hover:bg-ojas-primary/20 transition-colors flex items-center justify-center"
                    title={`Add ${vital.label} reading`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={onQuickAdd}
          className="px-6 py-3 bg-ojas-primary/10 text-ojas-primary rounded-xl font-medium hover:bg-ojas-primary/20 transition-colors"
        >
          + Quick Add Vital
        </button>
      </div>
    </div>
  );
};

export default LatestVitalsSection;
