
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock3, AlertCircle, Check, Clock, AlertTriangle } from 'lucide-react';
import WellnessRing from '../WellnessRing';
import EnhancedWellnessRing from '../EnhancedWellnessRing';

interface WellnessSectionProps {
  score: number;
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  vitals: any[];
  symptoms: any[];
  medications: any[];
  medicationLogs: any[];
  condensed?: boolean;
  userRole?: 'patient' | 'caregiver';
}

const WellnessSection: React.FC<WellnessSectionProps> = ({ 
  score, 
  status, 
  medsCount, 
  symptomsLogged, 
  vitals, 
  symptoms, 
  medications, 
  medicationLogs,
  condensed = false,
  userRole = 'patient'
}) => {
  const navigate = useNavigate();

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-ojas-success/10 text-ojas-success';
      case 'attention': return 'bg-ojas-alert/10 text-ojas-alert';
      case 'urgent': return 'bg-ojas-error/10 text-ojas-error';
      default: return 'bg-ojas-text-secondary/10 text-ojas-text-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <Check className="w-4 h-4" />;
      case 'attention': return <Clock className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Excellent';
      case 'attention': return 'Needs Attention';
      case 'urgent': return 'Urgent Action Needed';
      default: return 'Unknown';
    }
  };

  if (condensed) {
    // Condensed version for quick overview
    return (
      <div className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusBgColor(status)}`}>
                <span className="text-2xl font-bold text-ojas-text-main">{score}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-ojas-border flex items-center justify-center">
                {getStatusIcon(status)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-ojas-text-main">
                Wellness Score
              </h3>
              <p className="text-sm text-ojas-text-secondary">
                {getStatusLabel(status)}
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/more')}
            className="text-ojas-primary text-sm font-medium hover:text-ojas-primary-hover"
          >
            View Details
          </button>
        </div>
      </div>
    );
  }

  // Full animated wellness ring - this is the main feature
  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-ojas-soft border border-ojas-border">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-xl font-semibold text-ojas-text-main">
            Today's Wellness
          </h2>
        </div>

        {/* Enhanced Wellness Ring - The main animated element */}
        <EnhancedWellnessRing
          status={status}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
          score={score}
          userRole={userRole}
          onExpand={() => navigate('/more')}
        />

        {/* Quick Stats Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ojas-success/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-ojas-success" />
            </div>
            <div>
              <h3 className="font-semibold text-ojas-text-main text-sm">
                Medications
              </h3>
              <p className="text-xs text-ojas-text-secondary">
                {medsCount.taken}/{medsCount.total} taken
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center">
              {symptomsLogged ? (
                <Check className="w-4 h-4 text-ojas-primary" />
              ) : (
                <Clock className="w-4 h-4 text-ojas-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-ojas-text-main text-sm">
                Symptoms
              </h3>
              <p className="text-xs text-ojas-text-secondary">
                {symptomsLogged ? 'Logged today' : 'Not logged'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessSection;
