import React from 'react';
import { Activity } from 'lucide-react';

interface LinkedCondition {
  id: string;
  condition_name: string;
  status: 'active' | 'controlled' | 'monitoring' | 'inactive';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface MedicationConditionTagsProps {
  linkedConditions: LinkedCondition[];
  className?: string;
}

const MedicationConditionTags: React.FC<MedicationConditionTagsProps> = ({ 
  linkedConditions, 
  className = "" 
}) => {
  if (!linkedConditions.length) {
    return null;
  }

  const getConditionColor = (condition: LinkedCondition) => {
    switch (condition.status) {
      case 'controlled':
        return 'bg-ojas-calming-green/10 text-ojas-calming-green border-ojas-calming-green/20';
      case 'monitoring':
        return 'bg-ojas-soft-gold/10 text-ojas-soft-gold border-ojas-soft-gold/20';
      case 'active':
        if (condition.severity === 'severe') {
          return 'bg-ojas-error/10 text-ojas-error border-ojas-error/20';
        }
        return 'bg-ojas-primary-blue/10 text-ojas-primary-blue border-ojas-primary-blue/20';
      case 'inactive':
        return 'bg-ojas-slate-gray/10 text-ojas-slate-gray border-ojas-slate-gray/20';
      default:
        return 'bg-ojas-charcoal-gray/10 text-ojas-charcoal-gray border-ojas-charcoal-gray/20';
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {linkedConditions.map(condition => (
        <div
          key={condition.id}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(condition)}`}
        >
          <Activity className="w-3 h-3" />
          <span>{condition.condition_name}</span>
        </div>
      ))}
    </div>
  );
};

export default MedicationConditionTags;