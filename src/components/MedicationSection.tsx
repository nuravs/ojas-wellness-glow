
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
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return pendingMeds.filter(med => {
      const [hours, minutes] = med.time.split(':').map(Number);
      const medTime = hours * 60 + minutes;
      // Consider medications priority if they're more than 30 minutes overdue
      return currentTime - medTime > 30;
    });
  };

  const priorityMeds = getPriorityMedications();

  const handlePostpone = async (id: string) => {
    try {
      await onPostponeMedication(id);
      // The medication will remain in the list but marked as postponed
      // In a real implementation, you might want to move it to a different section
      // or add a "postponed" status to the medication object
    } catch (error) {
      console.error('Error postponing medication:', error);
    }
  };

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
                onPostpone={handlePostpone}
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
