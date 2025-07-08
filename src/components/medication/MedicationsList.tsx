
import React from 'react';
import MedicationCard from '../MedicationCard';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  caregiver_visible?: boolean;
  logged_by_role?: 'patient' | 'caregiver';
}

interface MedicationsListProps {
  pendingMeds: Medication[];
  completedMeds: Medication[];
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  userRole: 'patient' | 'caregiver';
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  pendingMeds,
  completedMeds,
  onToggleMedication,
  onPostponeMedication,
  onToggleVisibility,
  userRole
}) => {
  return (
    <>
      {/* Pending Medications - Standardized Height ~120dp */}
      {pendingMeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ojas-text-main mb-6">
            Still to take ({pendingMeds.length})
          </h2>
          <div className="space-y-4"> {/* Reduced spacing for more cards per view */}
            {pendingMeds.map(medication => (
              <div key={medication.id} style={{ minHeight: '120px' }}>
                <MedicationCard
                  medication={medication}
                  onToggle={onToggleMedication}
                  onPostpone={onPostponeMedication}
                  onToggleVisibility={onToggleVisibility}
                  userRole={userRole}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Medications - Standardized Height */}
      {completedMeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ojas-text-main mb-6">
            Completed today ({completedMeds.length})
          </h2>
          <div className="space-y-4">
            {completedMeds.map(medication => (
              <div key={medication.id} style={{ minHeight: '120px' }}>
                <MedicationCard
                  medication={medication}
                  onToggle={onToggleMedication}
                  onToggleVisibility={onToggleVisibility}
                  userRole={userRole}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MedicationsList;
