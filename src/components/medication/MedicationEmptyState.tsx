
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
      <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
        No medications yet
      </h3>
      <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver mb-6">
        Use the buttons above to add your first medication or scan a prescription
      </p>
    </div>
  );
};

export default MedicationEmptyState;
