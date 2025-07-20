
import React from 'react';
import { Clock, Pill, Heart } from 'lucide-react';

interface TodaysActionsSectionProps {
  medications: any[];
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  onMedicationAction: (id: string) => void;
}

const TodaysActionsSection: React.FC<TodaysActionsSectionProps> = ({ 
  medications, 
  medsCount, 
  symptomsLogged,
  onMedicationAction 
}) => {
  const actions = [
    {
      id: 1,
      icon: Pill,
      title: 'Take Evening Medications',
      description: '2 medications due at 8:00 PM',
      time: '8:00 PM',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      icon: Heart,
      title: 'Log Blood Pressure',
      description: 'Evening reading recommended',
      time: '7:00 PM',
      priority: 'medium',
      completed: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-ojas-error text-white';
      case 'medium': return 'bg-ojas-alert text-ojas-text-main';
      case 'low': return 'bg-ojas-success text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-ojas-soft border border-ojas-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-ojas-primary" />
            <h2 className="text-lg font-semibold text-ojas-text-main">
              Today's Actions
            </h2>
          </div>
          <div className="px-3 py-1 bg-ojas-success/10 text-ojas-success rounded-full text-sm font-medium">
            1/3 done
          </div>
        </div>

        <div className="space-y-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.id} className="flex items-center justify-between p-4 bg-ojas-bg-light rounded-xl border border-ojas-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-ojas-border flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-ojas-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-ojas-text-main text-sm mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-ojas-text-secondary">
                      {action.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-ojas-text-main">
                      {action.time}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <button className="w-3 h-3 border-2 border-ojas-border rounded-full hover:border-ojas-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodaysActionsSection;
