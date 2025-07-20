
import React from 'react';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

interface Symptom {
  id: string;
  symptom_type: string;
  severity: number;
  notes?: string;
  logged_at: string;
}

interface SymptomsListProps {
  symptoms: Symptom[];
  userRole?: 'patient' | 'caregiver';
}

const SymptomsList: React.FC<SymptomsListProps> = ({ 
  symptoms, 
  userRole = 'patient' 
}) => {
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-ojas-calming-green';
    if (severity <= 6) return 'bg-ojas-soft-gold';
    return 'bg-ojas-vibrant-coral';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return 'Very Mild';
    if (severity <= 4) return 'Mild';
    if (severity <= 6) return 'Moderate';
    if (severity <= 8) return 'Severe';
    return 'Very Severe';
  };

  if (symptoms.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-ojas-text-tertiary dark:text-ojas-slate-gray mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
          No Symptoms Logged Yet
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
          {userRole === 'caregiver' 
            ? "No symptoms have been logged by the patient yet." 
            : "Start tracking your symptoms to monitor your health patterns."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
        Recent Symptoms
      </h3>
      
      {symptoms.slice(0, 10).map((symptom) => (
        <div
          key={symptom.id}
          className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-4 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray"
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${getSeverityColor(symptom.severity)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              {symptom.severity}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  {symptom.symptom_type}
                </h4>
                <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {format(new Date(symptom.logged_at), 'MMM d, h:mm a')}
                </span>
              </div>
              
              <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-2">
                {getSeverityLabel(symptom.severity)} (Level {symptom.severity}/10)
              </p>
              
              {symptom.notes && (
                <p className="text-sm text-ojas-text-main dark:text-ojas-mist-white bg-ojas-bg-light dark:bg-ojas-soft-midnight p-2 rounded-lg">
                  {symptom.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {symptoms.length > 10 && (
        <div className="text-center py-4">
          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Showing 10 most recent symptoms
          </p>
        </div>
      )}
    </div>
  );
};

export default SymptomsList;
