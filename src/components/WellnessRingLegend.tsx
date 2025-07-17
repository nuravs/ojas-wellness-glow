import React from 'react';

const WellnessRingLegend: React.FC = () => {
  const zones = [
    {
      range: '80-100',
      label: 'Good',
      color: 'bg-ojas-success',
      textColor: 'text-ojas-success'
    },
    {
      range: '60-79',
      label: 'Fair',
      color: 'bg-ojas-alert',
      textColor: 'text-ojas-alert'
    },
    {
      range: '<60',
      label: 'Attention',
      color: 'bg-ojas-error',
      textColor: 'text-ojas-error'
    }
  ];

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6 mt-6">
      <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4 text-center">
        Health Score Zones
      </h3>
      
      <div className="flex justify-center items-center gap-6">
        {zones.map((zone, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-4 h-4 ${zone.color} rounded-full shadow-sm`} />
            <div className="text-center">
              <div className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                {zone.range}
              </div>
              <div className={`text-sm font-medium ${zone.textColor}`}>
                {zone.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessRingLegend;