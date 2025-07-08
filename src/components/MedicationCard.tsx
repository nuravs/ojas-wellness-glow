
import React from 'react';
import CompletedMedicationCard from './medication/CompletedMedicationCard';
import PendingMedicationCard from './medication/PendingMedicationCard';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  caregiver_visible?: boolean;
  logged_by_role?: 'patient' | 'caregiver';
}

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  isPriority?: boolean;
  userRole?: 'patient' | 'caregiver';
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone,
  onToggleVisibility,
  isPriority = false,
  userRole = 'patient'
}) => {
  // Completed medication state
  if (medication.taken) {
    return <CompletedMedicationCard medication={medication} userRole={userRole} />;
  }

  // Pending medication state
  return (
    <PendingMedicationCard
      medication={medication}
      onToggle={onToggle}
      onPostpone={onPostpone}
      onToggleVisibility={onToggleVisibility}
      isPriority={isPriority}
      userRole={userRole}
    />
  );
};

export default MedicationCard;
