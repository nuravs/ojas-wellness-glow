
import React from 'react';
import { User, Heart } from 'lucide-react';

interface MedicationLoggedByProps {
  loggedByRole?: 'patient' | 'caregiver';
  userRole?: 'patient' | 'caregiver';
  className?: string;
}

const MedicationLoggedBy: React.FC<MedicationLoggedByProps> = ({ 
  loggedByRole, 
  userRole,
  className = "" 
}) => {
  if (!loggedByRole) return null;

  const isLoggedBySelf = loggedByRole === userRole;
  const icon = loggedByRole === 'caregiver' ? Heart : User;
  const IconComponent = icon;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span className="text-xs">
        {isLoggedBySelf ? 'You' : `By ${loggedByRole}`}
      </span>
    </div>
  );
};

export default MedicationLoggedBy;
