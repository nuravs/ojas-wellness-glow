
import React from 'react';
import { Plus, Camera, Upload } from 'lucide-react';
import { getCopyForRole } from '../../utils/roleBasedCopy';

interface MedicationActionsHeaderProps {
  userRole: 'patient' | 'caregiver';
  isUploading: boolean;
  onCameraUpload: () => void;
  onAddMedication: () => void;
}

const MedicationActionsHeader: React.FC<MedicationActionsHeaderProps> = ({
  userRole,
  isUploading,
  onCameraUpload,
  onAddMedication
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-ojas-text-main mb-2">
          {getCopyForRole('dashboardTitle', userRole)}
        </h1>
      </div>
      
      {/* Enhanced Action Buttons with Text Labels */}
      <div className="flex gap-4">
        <div className="text-center">
          <button
            onClick={onCameraUpload}
            className={`w-16 h-16 bg-white border-3 border-ojas-primary-blue rounded-2xl flex items-center justify-center text-ojas-primary-blue hover:bg-ojas-primary-blue hover:text-white transition-all duration-200 shadow-ojas-medium mb-2 ${
              isUploading ? 'animate-pill-bottle-fill' : ''
            }`}
            aria-label="Scan prescription"
            disabled={isUploading}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {isUploading ? (
              <Upload className="w-7 h-7 animate-pulse" />
            ) : (
              <Camera className="w-7 h-7" />
            )}
          </button>
          <span className="text-sm font-semibold text-ojas-charcoal-gray">Scan Rx</span>
        </div>
        
        <div className="text-center">
          <button
            onClick={onAddMedication}
            className="w-16 h-16 bg-white border-3 border-ojas-calming-green rounded-2xl flex items-center justify-center text-ojas-calming-green hover:bg-ojas-calming-green hover:text-white transition-all duration-200 shadow-ojas-medium mb-2"
            aria-label="Add new medication"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Plus className="w-7 h-7" />
          </button>
          <span className="text-sm font-semibold text-ojas-charcoal-gray">Add Med</span>
        </div>
      </div>
    </div>
  );
};

export default MedicationActionsHeader;
