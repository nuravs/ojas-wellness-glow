
import React, { useState } from 'react';
import { Pill, Clock, Check } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
  onPostpone?: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onToggle, 
  onPostpone 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTaken = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(medication.id);
    }, 200);
  };

  const handlePostpone = () => {
    onPostpone?.(medication.id);
  };

  if (medication.taken) {
    return (
      <div className="ojas-card bg-wellness-green/5 border-wellness-green/20 animate-gentle-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-wellness-green/20 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-wellness-green animate-check-mark" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-wellness-green line-through">
              {medication.name}
            </h3>
            <p className="text-sm text-calm-600">
              {medication.dosage} • Taken at {medication.time}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ojas-card ${isAnimating ? 'animate-pulse-gentle' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-wellness-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Pill className="w-6 h-6 text-wellness-blue" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-calm-800 mb-1">
            {medication.name}
          </h3>
          <p className="text-calm-600 mb-4">
            {medication.dosage}
          </p>
          <div className="flex items-center gap-2 mb-6 text-calm-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{medication.time}</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleTaken}
              className="ojas-button-primary flex-1"
              aria-label={`Mark ${medication.name} as taken`}
            >
              <Check className="w-5 h-5" />
              Taken
            </button>
            
            {onPostpone && (
              <button
                onClick={handlePostpone}
                className="ojas-button-secondary"
                aria-label={`Postpone ${medication.name}`}
              >
                <Clock className="w-5 h-5" />
                Postpone
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
