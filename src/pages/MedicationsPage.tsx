
import React, { useState } from 'react';
import { Scan, Plus, Sun, Sunset, Moon, Clock } from 'lucide-react';
import MedicationTimeline from '../components/MedicationTimeline';
import SafeAreaContainer from '../components/SafeAreaContainer';
import MedicationActionsHeader from '../components/medication/MedicationActionsHeader';
import RefillAlertsSection from '../components/medication/RefillAlertsSection';
import MedicationsList from '../components/medication/MedicationsList';
import MedicationEmptyState from '../components/medication/MedicationEmptyState';
import { useMedications } from '../hooks/useMedications';

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
  const [dismissedRefills, setDismissedRefills] = useState<string[]>([]);
  const { toggleCaregiverVisibility } = useMedications();
  
  const pendingMeds = medications.filter(med => !med.taken);
  const completedMeds = medications.filter(med => med.taken);

  const refillAlerts = [
    { 
      id: '1', 
      medicationName: 'Aspirin', 
      daysLeft: 3, 
      pillsRemaining: 9, 
      nextRefillDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
      urgency: 'medium' as const 
    }
  ].filter(alert => !dismissedRefills.includes(alert.id));

  const handleCameraUpload = () => {
    setIsUploading(true);
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

  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return Sun;
      case 'afternoon': return Sun;
      case 'evening': return Sunset;
      case 'night': return Moon;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light">
      <div className="overflow-y-auto pb-20" style={{ padding: '0 16px' }}>
        <SafeAreaContainer>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <h1 className="text-2xl font-semibold text-ojas-text-main">
              Medications
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleCameraUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 border border-ojas-primary text-ojas-primary rounded-xl hover:bg-ojas-primary hover:text-white transition-colors font-medium"
                style={{ minHeight: '44px' }}
              >
                <Scan className="w-5 h-5" />
                Scan Prescription
              </button>
              <button
                onClick={onAddMedication}
                className="flex items-center gap-2 px-4 py-2 bg-ojas-calming-green text-white rounded-xl hover:bg-ojas-calming-green-hover transition-colors font-medium"
                style={{ minHeight: '44px' }}
              >
                <Plus className="w-5 h-5" />
                Add Medication
              </button>
            </div>
          </div>

          {medications.length === 0 ? (
            <MedicationEmptyState
              onAddMedication={onAddMedication}
              onCameraUpload={handleCameraUpload}
            />
          ) : (
            <>
              {/* Today Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-ojas-text-main mb-4">Today</h2>
                <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
                  <div className="space-y-4">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeOfDay) => {
                      const TimeIcon = getTimeOfDayIcon(timeOfDay);
                      return (
                        <div key={timeOfDay} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ojas-bg-light">
                            <TimeIcon className="w-5 h-5 text-ojas-text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-ojas-text-main">{timeOfDay}</div>
                            <div className="text-sm text-ojas-text-secondary">No medications scheduled</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Refill Reminders */}
              {refillAlerts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-ojas-text-main mb-4">Refill Reminders</h2>
                  <RefillAlertsSection
                    refillAlerts={refillAlerts}
                    onRefillAction={handleRefillAction}
                    onDismissRefill={handleDismissRefill}
                  />
                </div>
              )}

              {/* Pending */}
              {pendingMeds.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-ojas-text-main mb-4">Pending</h2>
                  <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
                    <div className="space-y-4">
                      {pendingMeds.map(medication => (
                        <div key={medication.id} className="flex items-center justify-between p-4 rounded-xl border border-ojas-border">
                          <div>
                            <div className="font-medium text-ojas-text-main">{medication.name}</div>
                            <div className="text-sm text-ojas-text-secondary">{medication.dosage}</div>
                          </div>
                          <button
                            onClick={() => onToggleMedication(medication.id)}
                            className="px-4 py-2 bg-ojas-primary text-white rounded-xl hover:bg-ojas-primary-hover transition-colors font-medium"
                            style={{ minHeight: '44px' }}
                          >
                            Mark Taken
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Completed */}
              {completedMeds.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-ojas-text-main mb-4">Completed</h2>
                  <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
                    <div className="space-y-4">
                      {completedMeds.map(medication => (
                        <div key={medication.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                          <div>
                            <div className="font-medium text-ojas-text-main">{medication.name}</div>
                            <div className="text-sm text-ojas-text-secondary">{medication.dosage}</div>
                          </div>
                          <div className="text-sm text-ojas-calming-green font-medium">Completed</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </SafeAreaContainer>
      </div>
    </div>
  );
};

export default MedicationsPage;
