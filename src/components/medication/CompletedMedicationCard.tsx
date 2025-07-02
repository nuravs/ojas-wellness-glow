
import React from 'react';
import { CheckCircle, Check, Clock } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface CompletedMedicationCardProps {
  medication: Medication;
}

const CompletedMedicationCard: React.FC<CompletedMedicationCardProps> = ({ medication }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border overflow-hidden animate-gentle-fade-in" style={{ minHeight: '120px' }}>
      {/* Left sidebar - success */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-ojas-success"></div>
      
      <div className="flex items-center gap-6 p-6">
        <div className="w-16 h-16 bg-ojas-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-8 h-8 text-ojas-success animate-success-check" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-ojas-success">
              {medication.name}
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-ojas-success/10 rounded-full">
              <Check className="w-4 h-4 text-ojas-success" />
              <span className="text-sm font-medium text-ojas-success">Taken</span>
            </div>
          </div>
          <p className="text-ojas-text-secondary font-medium mb-2">
            {medication.dosage}
          </p>
          <div className="flex items-center gap-2 text-ojas-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Completed at {medication.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedMedicationCard;
