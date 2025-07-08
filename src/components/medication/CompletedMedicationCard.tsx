
import React from 'react';
import { Pill, CheckCircle, Clock } from 'lucide-react';
import MedicationLoggedBy from './MedicationLoggedBy';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  logged_by_role?: 'patient' | 'caregiver';
}

interface CompletedMedicationCardProps {
  medication: Medication;
  userRole?: 'patient' | 'caregiver';
}

const CompletedMedicationCard: React.FC<CompletedMedicationCardProps> = ({ 
  medication,
  userRole = 'patient' 
}) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border overflow-hidden opacity-75" style={{ minHeight: '120px' }}>
      {/* Left sidebar - Success color */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-ojas-success"></div>
      
      {/* Completed badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-ojas-success/10 rounded-full">
        <CheckCircle className="w-3 h-3 text-ojas-success" />
        <span className="text-xs font-medium text-ojas-success">Completed</span>
      </div>
      
      <div className="flex items-start gap-6 p-6">
        <div className="w-16 h-16 rounded-xl bg-ojas-success/20 flex items-center justify-center flex-shrink-0">
          <Pill className="w-8 h-8 text-ojas-success" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-ojas-text-main line-through">
              {medication.name}
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-ojas-success/10 rounded-full">
              <CheckCircle className="w-4 h-4 text-ojas-success" />
              <span className="text-sm font-medium text-ojas-success">Done</span>
            </div>
          </div>
          
          <p className="text-ojas-text-secondary font-medium mb-3">
            {medication.dosage}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-ojas-text-secondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Taken at {medication.time}</span>
            </div>
            
            {/* Show who logged this medication */}
            <MedicationLoggedBy 
              loggedByRole={medication.logged_by_role}
              userRole={userRole}
              className="text-ojas-success"
            />
          </div>
          
          <div className="text-center py-2">
            <span className="text-sm text-ojas-success font-medium">
              ✓ Well done! Keep up the great work.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedMedicationCard;
