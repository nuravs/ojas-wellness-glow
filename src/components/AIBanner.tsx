
import React from 'react';
import { AlertCircle, Pill, TrendingUp, X } from 'lucide-react';

interface AIBannerProps {
  type: 'missed-dose' | 'symptom-reminder' | 'refill-needed' | 'weekly-summary';
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const AIBanner: React.FC<AIBannerProps> = ({ 
  type, 
  message, 
  actionText, 
  onAction, 
  onDismiss 
}) => {
  const getBannerStyles = () => {
    switch (type) {
      case 'missed-dose':
        return {
          bg: 'bg-ojas-vibrant-coral/10',
          border: 'border-ojas-vibrant-coral/30',
          icon: Pill,
          iconColor: 'text-ojas-vibrant-coral',
          iconBg: 'bg-ojas-vibrant-coral/20'
        };
      case 'symptom-reminder':
        return {
          bg: 'bg-ojas-soft-gold/10',
          border: 'border-ojas-soft-gold/30',
          icon: TrendingUp,
          iconColor: 'text-ojas-soft-gold',
          iconBg: 'bg-ojas-soft-gold/20'
        };
      case 'refill-needed':
        return {
          bg: 'bg-ojas-vibrant-coral/10',
          border: 'border-ojas-vibrant-coral/30',
          icon: AlertCircle,
          iconColor: 'text-ojas-vibrant-coral',
          iconBg: 'bg-ojas-vibrant-coral/20'
        };
      default:
        return {
          bg: 'bg-ojas-primary-blue/10',
          border: 'border-ojas-primary-blue/30',
          icon: TrendingUp,
          iconColor: 'text-ojas-primary-blue',
          iconBg: 'bg-ojas-primary-blue/20'
        };
    }
  };

  const styles = getBannerStyles();
  const IconComponent = styles.icon;

  return (
    <div className={`${styles.bg} border-2 ${styles.border} rounded-2xl p-6 shadow-ojas-soft mb-6 animate-gentle-fade-in`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <p className="text-lg font-medium text-ojas-charcoal-gray mb-3">
            {message}
          </p>
          
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-semibold text-base transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-soft"
            >
              {actionText}
            </button>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full hover:bg-ojas-cloud-silver flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5 text-ojas-slate-gray" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AIBanner;
