
import React, { useState } from 'react';
import { Check, Clock, AlertTriangle, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';
import WellnessRingCenter from './WellnessRingCenter';
import WellnessRingExpanded from './WellnessRingExpanded';
import WellnessRingLegend from './WellnessRingLegend';

interface WellnessRingProps {
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  nextAppointment?: string;
  onExpand?: () => void;
}

const WellnessRing: React.FC<WellnessRingProps> = ({ 
  status, 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  onExpand 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    onExpand?.();
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'good': 
        return { 
          icon: <CheckCircle className="w-10 h-10 text-ojas-success" />, 
          label: 'Excellent',
          description: 'All systems looking great',
          accessibilityLabel: 'Excellent health status - Everything is on track',
          statusIcon: <Check className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 100,
          ringColor: '#00B488',
          glowColor: 'rgba(0, 180, 136, 0.3)'
        };
      case 'attention': 
        return { 
          icon: <Clock3 className="w-10 h-10 text-ojas-alert" />, 
          label: 'Good',
          description: 'Minor attention needed',
          accessibilityLabel: 'Good health status - Small reminders pending',
          statusIcon: <Clock className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 75,
          ringColor: '#FFC300',
          glowColor: 'rgba(255, 195, 0, 0.3)'
        };
      case 'urgent': 
        return { 
          icon: <AlertCircle className="w-10 h-10 text-ojas-error" />, 
          label: 'Needs Attention',
          description: 'Important items require action',
          accessibilityLabel: 'Health status needs attention - Action required',
          statusIcon: <AlertTriangle className="w-4 h-4" />,
          score: Math.round((medsCount.taken / medsCount.total) * 100) || 50,
          ringColor: '#FF4E4E',
          glowColor: 'rgba(255, 78, 78, 0.4)'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const radius = 110;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Complete Circle Implementation */}
      <button
        onClick={handleTap}
        className={`relative w-72 h-72 mx-auto flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 rounded-full transition-all duration-300 ${
          status === 'attention' ? 'animate-pulse-glow' : ''
        }`}
        aria-label={`Health status: ${statusConfig.accessibilityLabel}. Tap to ${isExpanded ? 'hide' : 'view'} details.`}
        aria-expanded={isExpanded}
        style={{
          boxShadow: `0 0 30px ${statusConfig.glowColor}`
        }}
      >
        {/* Complete SVG Ring - Always Full Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          {/* Background circle */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="rgba(225, 228, 234, 0.4)"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Always complete colored ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={statusConfig.ringColor}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 12px ${statusConfig.glowColor})`
            }}
          />
        </svg>

        {/* Enhanced Center Content - Improved Layout */}
        <WellnessRingCenter statusConfig={statusConfig} isExpanded={isExpanded} />
      </button>

      {/* Status Summary */}
      <p className="text-center mt-6 text-ojas-text-secondary dark:text-ojas-cloud-silver text-lg font-medium">
        {statusConfig.description}
      </p>

      {/* Health Score Zones Legend */}
      <WellnessRingLegend />

      {/* Enhanced Expanded Interactive Summary */}
      {isExpanded && (
        <WellnessRingExpanded 
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
          nextAppointment={nextAppointment}
        />
      )}
    </div>
  );
};

export default WellnessRing;
