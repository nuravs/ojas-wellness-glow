
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SymptomButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  severity?: 'low' | 'medium' | 'high';
}

const SymptomButton: React.FC<SymptomButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  color = 'blue',
  severity
}) => {
  const getColorClasses = (buttonColor: string) => {
    switch (buttonColor) {
      case 'green': 
        return 'bg-ojas-calming-green/10 hover:bg-ojas-calming-green/20 text-ojas-calming-green border-ojas-calming-green/30';
      case 'blue': 
        return 'bg-ojas-primary-blue/10 hover:bg-ojas-primary-blue/20 text-ojas-primary-blue border-ojas-primary-blue/30';
      case 'yellow': 
        return 'bg-ojas-soft-gold/10 hover:bg-ojas-soft-gold/20 text-ojas-soft-gold border-ojas-soft-gold/30';
      case 'red': 
        return 'bg-ojas-vibrant-coral/10 hover:bg-ojas-vibrant-coral/20 text-ojas-vibrant-coral border-ojas-vibrant-coral/30';
      default: 
        return 'bg-ojas-primary-blue/10 hover:bg-ojas-primary-blue/20 text-ojas-primary-blue border-ojas-primary-blue/30';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-ojas-soft border-2 hover:scale-105 active:scale-95 transition-all duration-200 text-center min-h-[140px] flex flex-col items-center justify-center gap-4 cursor-pointer p-6 ${getColorClasses(color)}`}
      aria-label={`Log ${label} symptom${severity ? ` - ${severity} severity` : ''}`}
    >
      <Icon className="w-12 h-12" />
      <div>
        <span className="text-lg font-semibold block">{label}</span>
        {severity && (
          <span className="text-sm font-medium opacity-75 block mt-1">
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        )}
      </div>
    </button>
  );
};

export default SymptomButton;
