
import React from 'react';
import { Link, Plus } from 'lucide-react';
import { Comorbidity } from '../../hooks/useComorbidities';

interface MedicationConditionTagsProps {
  conditions: Comorbidity[];
  onLinkCondition?: () => void;
  showAddButton?: boolean;
}

const MedicationConditionTags: React.FC<MedicationConditionTagsProps> = ({
  conditions,
  onLinkCondition,
  showAddButton = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'controlled':
        return 'bg-ojas-success/20 text-ojas-success border-ojas-success/30';
      case 'monitoring':
        return 'bg-ojas-alert/20 text-ojas-alert border-ojas-alert/30';
      case 'active':
        return 'bg-ojas-error/20 text-ojas-error border-ojas-error/30';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  if (conditions.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {conditions.map((condition) => (
        <div
          key={condition.id}
          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(condition.status)}`}
        >
          <Link className="w-3 h-3" />
          <span>{condition.condition_name}</span>
        </div>
      ))}
      
      {showAddButton && onLinkCondition && (
        <button
          onClick={onLinkCondition}
          className="px-2 py-1 rounded-full text-xs font-medium border border-dashed border-ojas-border dark:border-ojas-slate-gray text-ojas-text-secondary dark:text-ojas-cloud-silver hover:border-ojas-primary hover:text-ojas-primary transition-colors flex items-center gap-1"
          style={{ minHeight: '24px', minWidth: '24px' }}
        >
          <Plus className="w-3 h-3" />
          <span>Link condition</span>
        </button>
      )}
    </div>
  );
};

export default MedicationConditionTags;
