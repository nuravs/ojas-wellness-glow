
import React from 'react';
import { Clock, Pill, Heart, Activity } from 'lucide-react';

interface TodaysActionsSectionProps {
  medications: any[];
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  onMedicationAction: (id: string) => void;
  onLogSymptom: () => void;
  onViewMedications: () => void;
}

const TodaysActionsSection: React.FC<TodaysActionsSectionProps> = ({ 
  medications, 
  medsCount, 
  symptomsLogged,
  onMedicationAction,
  onLogSymptom,
  onViewMedications
}) => {
  // Generate dynamic actions based on real data
  const generateActions = () => {
    const actions = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Find pending medications
    const pendingMeds = medications.filter(med => !med.taken);
    
    if (pendingMeds.length > 0) {
      const nextMed = pendingMeds[0]; // Get the first pending medication
      actions.push({
        id: `med-${nextMed.id}`,
        icon: Pill,
        title: `Take ${nextMed.name}`,
        description: `${nextMed.dosage} - Due at ${nextMed.time}`,
        time: nextMed.time,
        priority: 'high',
        completed: false,
        action: () => onMedicationAction(nextMed.id)
      });
    }

    // Suggest symptom logging if not done today
    if (!symptomsLogged) {
      actions.push({
        id: 'log-symptoms',
        icon: Activity,
        title: 'Log Today\'s Symptoms',
        description: 'Track how you\'re feeling today',
        time: 'Anytime',
        priority: 'medium',
        completed: false,
        action: onLogSymptom
      });
    }

    // Evening vital check
    if (currentHour >= 18) {
      actions.push({
        id: 'evening-vitals',
        icon: Heart,
        title: 'Log Evening Vitals',
        description: 'Blood pressure and heart rate',
        time: '7:00 PM',
        priority: 'medium',
        completed: false,
        action: () => window.location.href = '/vitals?action=add&type=blood_pressure'
      });
    }

    return actions.slice(0, 3); // Limit to 3 actions
  };

  const actions = generateActions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-ojas-error text-white';
      case 'medium': return 'bg-ojas-alert text-ojas-text-main';
      case 'low': return 'bg-ojas-success text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  const completedCount = medsCount.taken + (symptomsLogged ? 1 : 0);
  const totalCount = medsCount.total + 1; // +1 for symptoms

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
            {completedCount}/{totalCount} done
          </div>
        </div>

        <div className="space-y-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.id} className="flex items-center justify-between p-4 bg-ojas-bg-light rounded-xl border border-ojas-border">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-ojas-border flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-ojas-primary" />
                  </div>
                  
                  <div className="flex-1">
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
                  <button 
                    onClick={action.action}
                    className="w-8 h-8 border-2 border-ojas-primary rounded-full hover:bg-ojas-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <span className="text-xs">✓</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {actions.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-ojas-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-ojas-success" />
            </div>
            <h3 className="font-semibold text-ojas-text-main mb-2">All caught up!</h3>
            <p className="text-sm text-ojas-text-secondary mb-4">You've completed all your tasks for today.</p>
            <button 
              onClick={onViewMedications}
              className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors"
            >
              View Medications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysActionsSection;
