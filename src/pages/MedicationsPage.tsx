
import React, { useState } from 'react';
import MedicationTimeline from '../components/MedicationTimeline';
import SafeAreaContainer from '../components/SafeAreaContainer';
import MedicationActionsHeader from '../components/medication/MedicationActionsHeader';
import EnhancedRefillAlertsSection from '../components/medication/EnhancedRefillAlertsSection';
import MedicationsList from '../components/medication/MedicationsList';
import MedicationEmptyState from '../components/medication/MedicationEmptyState';
import { useMedications } from '../hooks/useMedications';
import { useRefillAlerts } from '../hooks/useRefillAlerts';
import { toast } from '../hooks/use-toast';

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
  medications: propMedications, 
  onToggleMedication: propOnToggleMedication, 
  onPostponeMedication: propOnPostponeMedication,
  onAddMedication: propOnAddMedication,
  userRole = 'patient'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { 
    medications, 
    loading, 
    toggleMedication, 
    postponeMedication, 
    addMedication,
    toggleCaregiverVisibility 
  } = useMedications();
  const { refillAlerts, dismissAlert, handleRefill, loading: refillLoading } = useRefillAlerts();
  
  // Use hook data if available, fallback to props
  const activeMedications = medications.length > 0 ? medications : propMedications;
  const pendingMeds = activeMedications.filter(med => !med.taken);
  const completedMeds = activeMedications.filter(med => med.taken);

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

  const handleCameraUpload = async () => {
    setIsUploading(true);
    try {
      // Simulate camera/scan functionality
      toast({
        title: "Camera scan",
        description: "Camera scan functionality will be implemented in a future update.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedication = async () => {
    try {
      // For now, show a message about manual addition
      toast({
        title: "Add Medication",
        description: "Manual medication addition will be implemented in a future update.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleMedication = async (id: string) => {
    try {
      await toggleMedication(id);
      toast({
        title: "Medication logged",
        description: "Medication marked as taken successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePostponeMedication = async (id: string) => {
    try {
      await postponeMedication(id);
      toast({
        title: "Medication postponed",
        description: "Medication has been postponed.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to postpone medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-20" style={{ padding: '0 16px' }}>
        <SafeAreaContainer>
          <MedicationActionsHeader
            userRole={userRole}
            isUploading={isUploading}
            onCameraUpload={handleCameraUpload}
            onAddMedication={handleAddMedication}
          />

          {/* Today's Schedule - Now at the top */}
          {activeMedications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-6">
                Today's Schedule
              </h2>
              <MedicationTimeline medications={activeMedications} />
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
          {activeMedications.length === 0 ? (
            <MedicationEmptyState
              onAddMedication={handleAddMedication}
              onCameraUpload={handleCameraUpload}
            />
          ) : (
            <MedicationsList
              pendingMeds={sortedPendingMeds}
              completedMeds={completedMeds}
              onToggleMedication={handleToggleMedication}
              onPostponeMedication={handlePostponeMedication}
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
