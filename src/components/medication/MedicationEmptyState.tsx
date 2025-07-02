
import React from 'react';
import { Plus } from 'lucide-react';

interface MedicationEmptyStateProps {
  onAddMedication: () => void;
  onCameraUpload: () => void;
}

const MedicationEmptyState: React.FC<MedicationEmptyStateProps> = ({
  onAddMedication,
  onCameraUpload
}) => {
  return (
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
          style={{ minHeight: '44px' }}
        >
          Add Medication
        </button>
        <button
          onClick={onCameraUpload}
          className="px-8 py-4 bg-ojas-alert text-ojas-text-main rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-alert-hover active:scale-95 shadow-ojas-medium"
          style={{ minHeight: '44px' }}
        >
          Upload Prescription
        </button>
      </div>
    </div>
  );
};

export default MedicationEmptyState;
