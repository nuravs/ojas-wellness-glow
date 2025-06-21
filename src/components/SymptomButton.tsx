
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SymptomButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const SymptomButton: React.FC<SymptomButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  color = 'blue' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'bg-wellness-green/10 hover:bg-wellness-green/20 text-wellness-green border-wellness-green/20';
      case 'yellow': return 'bg-wellness-yellow/10 hover:bg-wellness-yellow/20 text-wellness-yellow border-wellness-yellow/20';
      case 'red': return 'bg-wellness-red/10 hover:bg-wellness-red/20 text-wellness-red border-wellness-red/20';
      default: return 'bg-wellness-blue/10 hover:bg-wellness-blue/20 text-wellness-blue border-wellness-blue/20';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`ojas-card ${getColorClasses()} hover:scale-105 active:scale-95 transition-all duration-200 text-center min-h-[120px] flex flex-col items-center justify-center gap-3 border-2`}
      aria-label={`Log ${label} symptom`}
    >
      <Icon className="w-8 h-8" />
      <span className="text-lg font-medium">{label}</span>
    </button>
  );
};

export default SymptomButton;
