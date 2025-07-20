
import React from 'react';
import { Activity, Heart, Droplets, Scale, Plus } from 'lucide-react';

interface LatestVitalsSectionProps {
  vitals: any[];
  userRole: 'patient' | 'caregiver';
}

const LatestVitalsSection: React.FC<LatestVitalsSectionProps> = ({ vitals, userRole }) => {
  const vitalsData = [
    {
      id: 1,
      icon: Heart,
      label: 'Blood Pressure',
      value: '142/88',
      unit: 'mmHg',
      status: 'attention',
      time: '551d ago'
    },
    {
      id: 2,
      icon: Activity,
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      time: '551d ago'
    },
    {
      id: 3,
      icon: Scale,
      label: 'Weight',
      value: '165.2',
      unit: 'lbs',
      status: 'normal',
      time: '552d ago'
    },
    {
      id: 4,
      icon: Droplets,
      label: 'Blood Sugar',
      value: '118',
      unit: 'mg/dL',
      status: 'normal',
      time: '552d ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-ojas-success text-white';
      case 'attention': return 'bg-ojas-alert text-ojas-text-main';
      case 'urgent': return 'bg-ojas-error text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-ojas-primary" />
          <h2 className="text-lg font-semibold text-ojas-text-main">
            Latest Vitals
          </h2>
        </div>
        <button className="text-ojas-primary text-sm font-medium hover:text-ojas-primary-hover transition-colors">
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
                  <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-ojas-primary" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ojas-text-main text-sm">
                        {vital.label}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                        {vital.status}
                      </span>
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
                  
                  <button className="w-8 h-8 rounded-full bg-ojas-primary/10 text-ojas-primary hover:bg-ojas-primary/20 transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-ojas-primary/10 text-ojas-primary rounded-xl font-medium hover:bg-ojas-primary/20 transition-colors">
          + Quick Add Vital
        </button>
      </div>
    </div>
  );
};

export default LatestVitalsSection;
