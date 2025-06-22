
import React, { useState } from 'react';
import MedicationCard from '../components/MedicationCard';
import MedicationTimeline from '../components/MedicationTimeline';
import { Plus, Camera, Upload } from 'lucide-react';

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
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  onAddMedication 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
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
    <div className="min-h-screen bg-ojas-bg-light pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ojas-text-main mb-2">
              Your Medications
            </h1>
            <p className="text-ojas-text-secondary text-lg">
              Today's schedule
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCameraUpload}
              className={`w-12 h-12 bg-ojas-primary rounded-full flex items-center justify-center text-white hover:bg-ojas-primary-hover transition-all duration-200 shadow-ojas-medium ${
                isUploading ? 'animate-pill-bottle-fill' : ''
              }`}
              aria-label="Upload prescription"
              disabled={isUploading}
            >
              {isUploading ? (
                <Upload className="w-6 h-6 animate-pulse" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={onAddMedication}
              className="w-12 h-12 bg-ojas-primary rounded-full flex items-center justify-center text-white hover:bg-ojas-primary-hover transition-all duration-200 shadow-ojas-medium"
              aria-label="Add new medication"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        {medications.length > 0 && (
          <MedicationTimeline medications={medications} />
        )}

        {/* Pending Medications */}
        {sortedPendingMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-text-main mb-6">
              Still to take ({sortedPendingMeds.length})
            </h2>
            <div className="space-y-6">
              {sortedPendingMeds.map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggle={onToggleMedication}
                  onPostpone={onPostponeMedication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Medications */}
        {completedMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-text-main mb-6">
              Completed today ({completedMeds.length})
            </h2>
            <div className="space-y-6">
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

        {/* Empty State */}
        {medications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-ojas-primary" />
            </div>
            <h3 className="text-xl font-semibold text-ojas-text-main mb-2">
              No medications yet
            </h3>
            <p className="text-ojas-text-secondary mb-6">
              Tap the + button to add your first medication or use the camera to upload a prescription
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onAddMedication}
                className="px-8 py-4 bg-ojas-primary text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-hover active:scale-95 shadow-ojas-medium"
              >
                Add Medication
              </button>
              <button
                onClick={handleCameraUpload}
                className="px-8 py-4 bg-ojas-alert text-ojas-text-main rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-alert-hover active:scale-95 shadow-ojas-medium"
              >
                Upload Prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;
