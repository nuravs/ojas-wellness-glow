
import React, { useState } from 'react';
import MedicationTimeline from '../components/MedicationTimeline';
import SafeAreaContainer from '../components/SafeAreaContainer';
import MedicationActionsHeader from '../components/medication/MedicationActionsHeader';
import RefillAlertsSection from '../components/medication/RefillAlertsSection';
import MedicationsList from '../components/medication/MedicationsList';
import MedicationEmptyState from '../components/medication/MedicationEmptyState';

interface MedicationsPageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  onAddMedication: () => void;
  userRole?: 'patient' | 'caregiver';
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  onAddMedication,
  userRole = 'patient'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dismissedRefills, setDismissedRefills] = useState<string[]>([]);
  
  const pendingMeds = medications.filter(med => !med.taken);
  const completedMeds = medications.filter(med => med.taken);

  // Mock refill data - in real app this would come from backend
  const refillAlerts = [
    { id: '1', medicationName: 'Levodopa', daysLeft: 2 },
    { id: '2', medicationName: 'Evening Supplement', daysLeft: 5 }
  ].filter(alert => !dismissedRefills.includes(alert.id));

  // Sort pending meds by overdue status and time
  const sortedPendingMeds = pendingMeds.sort((a, b) => {
    const aTime = new Date(`2000/01/01 ${a.time}`);
    const bTime = new Date(`2000/01/01 ${b.time}`);
    const now = new Date();
    
    const aOverdue = aTime < now;
    const bOverdue = bTime < now;
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    return aTime.getTime() - bTime.getTime();
  });

  const handleCameraUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      onAddMedication();
    }, 1500);
  };

  const handleRefillAction = (medicationName: string) => {
    alert(`Would redirect to pharmacy or doctor to refill ${medicationName}`);
  };

  const handleDismissRefill = (id: string) => {
    setDismissedRefills(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light pb-28">
      <SafeAreaContainer>
        <MedicationActionsHeader
          userRole={userRole}
          isUploading={isUploading}
          onCameraUpload={handleCameraUpload}
          onAddMedication={onAddMedication}
        />

        <RefillAlertsSection
          refillAlerts={refillAlerts}
          onRefillAction={handleRefillAction}
          onDismissRefill={handleDismissRefill}
        />

        {/* Timeline */}
        {medications.length > 0 && (
          <MedicationTimeline medications={medications} />
        )}

        {/* Medications List or Empty State */}
        {medications.length === 0 ? (
          <MedicationEmptyState
            onAddMedication={onAddMedication}
            onCameraUpload={handleCameraUpload}
          />
        ) : (
          <MedicationsList
            pendingMeds={sortedPendingMeds}
            completedMeds={completedMeds}
            onToggleMedication={onToggleMedication}
            onPostponeMedication={onPostponeMedication}
            userRole={userRole}
          />
        )}
      </SafeAreaContainer>
    </div>
  );
};

export default MedicationsPage;
