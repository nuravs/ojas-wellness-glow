
import React, { useState } from 'react';
import MedicationTimeline from '../components/MedicationTimeline';
import SafeAreaContainer from '../components/SafeAreaContainer';
import MedicationActionsHeader from '../components/medication/MedicationActionsHeader';
import EnhancedRefillAlertsSection from '../components/medication/EnhancedRefillAlertsSection';
import MedicationsList from '../components/medication/MedicationsList';
import MedicationEmptyState from '../components/medication/MedicationEmptyState';
import { useMedications } from '../hooks/useMedications';
import { useRefillAlerts } from '../hooks/useRefillAlerts';

interface MedicationsPageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    caregiver_visible?: boolean;
    logged_by_role?: 'patient' | 'caregiver';
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
  const { toggleCaregiverVisibility } = useMedications();
  const { refillAlerts, dismissAlert, handleRefill, loading: refillLoading } = useRefillAlerts();
  
  const pendingMeds = medications.filter(med => !med.taken);
  const completedMeds = medications.filter(med => med.taken);

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

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-20" style={{ padding: '0 16px' }}>
        <SafeAreaContainer>
          <MedicationActionsHeader
            userRole={userRole}
            isUploading={isUploading}
            onCameraUpload={handleCameraUpload}
            onAddMedication={onAddMedication}
          />

          {/* Today's Schedule - Now at the top */}
          {medications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-6">
                Today's Schedule
              </h2>
              <MedicationTimeline medications={medications} />
            </div>
          )}

          {/* Enhanced Refill Reminders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-6">
              Refill Reminders
            </h2>
            <EnhancedRefillAlertsSection
              refillAlerts={refillAlerts}
              onRefillAction={handleRefill}
              onDismissRefill={dismissAlert}
              loading={refillLoading}
            />
          </div>

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
              onToggleVisibility={toggleCaregiverVisibility}
              userRole={userRole}
            />
          )}
        </SafeAreaContainer>
      </div>
    </div>
  );
};

export default MedicationsPage;
