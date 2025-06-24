
import React from 'react';
import MedicationCard from './MedicationCard';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationSectionProps {
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
}

const MedicationSection: React.FC<MedicationSectionProps> = ({
  medications,
  onToggleMedication,
  onPostponeMedication
}) => {
  const pendingMeds = medications.filter(med => !med.taken);
  const completedMeds = medications.filter(med => med.taken);

  // Determine priority medications (overdue or very urgent)
  const getPriorityMedications = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return pendingMeds.filter(med => {
      const medHour = parseInt(med.time.split(':')[0]);
      // Consider medications priority if they're more than 2 hours overdue
      return currentHour - medHour > 2;
    });
  };

  const priorityMeds = getPriorityMedications();

  return (
    <>
      {/* Priority Medications with Enhanced Visual Hierarchy */}
      {pendingMeds.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
            Medication Reminders
            {priorityMeds.length > 0 && (
              <span className="ml-3 px-3 py-1 bg-ojas-alert/20 text-ojas-alert text-base font-medium rounded-full">
                {priorityMeds.length} urgent
              </span>
            )}
          </h2>
          <div className="space-y-8">
            {pendingMeds.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onToggle={onToggleMedication}
                onPostpone={onPostponeMedication}
                isPriority={priorityMeds.some(pm => pm.id === medication.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Completed Medications */}
      {completedMeds.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
            Completed Today
          </h2>
          <div className="space-y-8">
            {completedMeds.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onToggle={onToggleMedication}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MedicationSection;
