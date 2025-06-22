
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  const getSeverityIcon = () => {
    switch (severity) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <Minus className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSeverityText = () => {
    switch (severity) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`symptom-grid-button wellness-${color}`}
      aria-label={`Log ${label} symptom${severity ? ` - ${getSeverityText()} severity` : ''}`}
    >
      <Icon className="w-10 h-10" />
      <span className="text-lg font-semibold">{label}</span>
      {severity && (
        <div className="flex items-center gap-1 text-sm font-medium">
          {getSeverityIcon()}
          <span>{getSeverityText()}</span>
        </div>
      )}
    </button>
  );
};

export default SymptomButton;
