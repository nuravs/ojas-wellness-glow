
import React from 'react';
import CompletedMedicationCard from './medication/CompletedMedicationCard';
import PendingMedicationCard from './medication/PendingMedicationCard';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
  isPriority?: boolean;
  userRole?: 'patient' | 'caregiver';
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone,
  isPriority = false,
  userRole = 'patient'
}) => {
  // Completed medication state
  if (medication.taken) {
    return <CompletedMedicationCard medication={medication} />;
  }

  // Pending medication state
  return (
    <PendingMedicationCard
      medication={medication}
      onToggle={onToggle}
      onPostpone={onPostpone}
      isPriority={isPriority}
      userRole={userRole}
    />
  );
};

export default MedicationCard;
