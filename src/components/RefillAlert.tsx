
import React from 'react';
import { AlertTriangle, Pill } from 'lucide-react';

interface RefillAlertProps {
  medicationName: string;
  daysLeft: number;
  onRefillAction: () => void;
  onDismiss: () => void;
}

const RefillAlert: React.FC<RefillAlertProps> = ({ 
  medicationName, 
  daysLeft, 
  onRefillAction, 
  onDismiss 
}) => {
  const isUrgent = daysLeft <= 3;
  
  return (
    <div className={`border-2 rounded-2xl p-6 shadow-ojas-soft mb-6 animate-gentle-fade-in ${
      isUrgent 
        ? 'bg-ojas-vibrant-coral/10 border-ojas-vibrant-coral/30' 
        : 'bg-ojas-soft-gold/10 border-ojas-soft-gold/30'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUrgent 
            ? 'bg-ojas-vibrant-coral/20 text-ojas-vibrant-coral' 
            : 'bg-ojas-soft-gold/20 text-ojas-soft-gold'
        }`}>
          {isUrgent ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <Pill className="w-6 h-6" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">
            {isUrgent ? 'Urgent: Refill Needed' : 'Refill Reminder'}
          </h3>
          <p className="text-base text-ojas-charcoal-gray mb-4">
            <strong>{medicationName}</strong> - {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onRefillAction}
              className="px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-semibold text-base transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-soft"
            >
              Order Refill
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-3 bg-white border-2 border-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-medium text-base transition-all duration-200 hover:bg-gray-50 active:scale-95"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillAlert;
