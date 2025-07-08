
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CaregiverVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  medicationName: string;
  userRole: 'patient' | 'caregiver';
}

const CaregiverVisibilityToggle: React.FC<CaregiverVisibilityToggleProps> = ({
  isVisible,
  onToggle,
  medicationName,
  userRole
}) => {
  // Only show for patients
  if (userRole !== 'patient') return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ojas-bg-light dark:bg-ojas-slate-gray hover:bg-gray-200 dark:hover:bg-ojas-slate-gray/80 transition-colors text-sm"
      style={{ minHeight: '44px', minWidth: '44px' }}
      aria-label={`${isVisible ? 'Hide' : 'Show'} ${medicationName} to caregiver`}
    >
      {isVisible ? (
        <>
          <Eye className="w-4 h-4 text-ojas-success" />
          <span className="text-ojas-text-secondary">Visible to caregiver</span>
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4 text-ojas-text-secondary" />
          <span className="text-ojas-text-secondary">Private</span>
        </>
      )}
    </button>
  );
};

export default CaregiverVisibilityToggle;
