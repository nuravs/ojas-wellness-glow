
import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import { Comorbidity } from '../../hooks/useComorbidities';

interface ComorbidityCardProps {
  comorbidity: Comorbidity;
  onUpdate: (id: string, updates: Partial<Comorbidity>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ComorbidityCard: React.FC<ComorbidityCardProps> = ({
  comorbidity,
  onUpdate,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'controlled':
        return 'text-ojas-success bg-ojas-success/10';
      case 'monitoring':
        return 'text-ojas-alert bg-ojas-alert/10';
      case 'active':
        return 'text-ojas-error bg-ojas-error/10';
      default:
        return 'text-ojas-text-secondary bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'text-ojas-success bg-ojas-success/10';
      case 'moderate':
        return 'text-ojas-alert bg-ojas-alert/10';
      case 'severe':
        return 'text-ojas-error bg-ojas-error/10';
      default:
        return 'text-ojas-text-secondary bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'controlled':
        return <CheckCircle className="w-4 h-4" />;
      case 'monitoring':
        return <Clock className="w-4 h-4" />;
      case 'active':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await onUpdate(comorbidity.id, { status: newStatus as any });
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-ojas-soft border border-ojas-border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-ojas-text-main mb-2">
            {comorbidity.condition_name}
          </h3>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(comorbidity.status)}`}>
              {getStatusIcon(comorbidity.status)}
              {comorbidity.status.charAt(0).toUpperCase() + comorbidity.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(comorbidity.severity)}`}>
              {comorbidity.severity.charAt(0).toUpperCase() + comorbidity.severity.slice(1)}
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5 text-ojas-text-secondary" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-ojas-medium border border-ojas-border py-2 z-10 min-w-48">
              <button
                onClick={() => {
                  setShowMenu(false);
                  // TODO: Open edit modal
                }}
                className="w-full px-4 py-2 text-left text-ojas-text-main hover:bg-gray-50 flex items-center gap-3"
                style={{ minHeight: '44px' }}
              >
                <Edit className="w-4 h-4" />
                Edit Condition
              </button>
              <button
                onClick={async () => {
                  setShowMenu(false);
                  if (window.confirm('Are you sure you want to delete this condition?')) {
                    await onDelete(comorbidity.id);
                  }
                }}
                className="w-full px-4 py-2 text-left text-ojas-error hover:bg-red-50 flex items-center gap-3"
                style={{ minHeight: '44px' }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      {comorbidity.diagnosed_date && (
        <div className="mb-3">
          <p className="text-sm text-ojas-text-secondary">
            Diagnosed: {new Date(comorbidity.diagnosed_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {comorbidity.notes && (
        <div className="mb-4">
          <p className="text-sm text-ojas-text-secondary">
            {comorbidity.notes}
          </p>
        </div>
      )}

      {/* Status Actions */}
      <div className="flex gap-2 flex-wrap">
        {comorbidity.status !== 'controlled' && (
          <button
            onClick={() => handleStatusChange('controlled')}
            className="px-3 py-1 bg-ojas-success/10 text-ojas-success rounded-lg text-sm font-medium hover:bg-ojas-success/20 transition-colors"
            style={{ minHeight: '32px' }}
          >
            Mark Controlled
          </button>
        )}
        {comorbidity.status !== 'monitoring' && (
          <button
            onClick={() => handleStatusChange('monitoring')}
            className="px-3 py-1 bg-ojas-alert/10 text-ojas-alert rounded-lg text-sm font-medium hover:bg-ojas-alert/20 transition-colors"
            style={{ minHeight: '32px' }}
          >
            Need Monitoring
          </button>
        )}
        {comorbidity.status !== 'active' && (
          <button
            onClick={() => handleStatusChange('active')}
            className="px-3 py-1 bg-ojas-error/10 text-ojas-error rounded-lg text-sm font-medium hover:bg-ojas-error/20 transition-colors"
            style={{ minHeight: '32px' }}
          >
            Mark Active
          </button>
        )}
      </div>
    </div>
  );
};

export default ComorbidityCard;
