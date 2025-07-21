import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock3, AlertCircle, Check, Clock, AlertTriangle } from 'lucide-react';

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
  condensed = false
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
    // Condensed version for the new focused homepage
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

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-ojas-soft border border-ojas-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {status === 'good' && <CheckCircle className="w-6 h-6 text-ojas-success" />}
            {status === 'attention' && <Clock3 className="w-6 h-6 text-ojas-alert" />}
            {status === 'urgent' && <AlertCircle className="w-6 h-6 text-ojas-error" />}
            <h2 className="text-lg font-semibold text-ojas-text-main">
              Wellness Score
            </h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(status)}`}>
            {getStatusLabel(status)}
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-ojas-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-ojas-text-main">{score}</span>
            </div>
            <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-white border-2 border-ojas-border flex items-center justify-center">
              {getStatusIcon(status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/more')}
            className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellnessSection;
