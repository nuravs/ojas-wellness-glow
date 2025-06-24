
import React from 'react';
import { AlertCircle, Clock, Pill, Activity, X, CheckCircle } from 'lucide-react';

interface SmartBannerProps {
  type: 'missed-dose' | 'symptom-reminder' | 'refill-needed' | 'appointment-reminder' | 'success';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  priority?: 'low' | 'medium' | 'high';
}

const SmartBanner: React.FC<SmartBannerProps> = ({ 
  type, 
  title,
  message, 
  actionText, 
  onAction, 
  onDismiss,
  priority = 'medium'
}) => {
  const getBannerConfig = () => {
    switch (type) {
      case 'missed-dose':
        return {
          bg: 'bg-ojas-error/10',
          border: 'border-ojas-error/30',
          icon: Pill,
          iconColor: 'text-ojas-error',
          iconBg: 'bg-ojas-error/20',
          textColor: 'text-ojas-error'
        };
      case 'symptom-reminder':
        return {
          bg: 'bg-ojas-alert/10',
          border: 'border-ojas-alert/30',
          icon: Activity,
          iconColor: 'text-ojas-alert',
          iconBg: 'bg-ojas-alert/20',
          textColor: 'text-ojas-alert'
        };
      case 'refill-needed':
        return {
          bg: 'bg-ojas-alert/10',
          border: 'border-ojas-alert/30',
          icon: AlertCircle,
          iconColor: 'text-ojas-alert',
          iconBg: 'bg-ojas-alert/20',
          textColor: 'text-ojas-alert'
        };
      case 'appointment-reminder':
        return {
          bg: 'bg-ojas-primary/10',
          border: 'border-ojas-primary/30',
          icon: Clock,
          iconColor: 'text-ojas-primary',
          iconBg: 'bg-ojas-primary/20',
          textColor: 'text-ojas-primary'
        };
      case 'success':
        return {
          bg: 'bg-ojas-success/10',
          border: 'border-ojas-success/30',
          icon: CheckCircle,
          iconColor: 'text-ojas-success',
          iconBg: 'bg-ojas-success/20',
          textColor: 'text-ojas-success'
        };
      default:
        return {
          bg: 'bg-ojas-primary/10',
          border: 'border-ojas-primary/30',
          icon: AlertCircle,
          iconColor: 'text-ojas-primary',
          iconBg: 'bg-ojas-primary/20',
          textColor: 'text-ojas-primary'
        };
    }
  };

  const config = getBannerConfig();
  const IconComponent = config.icon;

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-6 shadow-ojas-soft mb-6 animate-gentle-fade-in ${
      priority === 'high' ? 'animate-pulse-urgent' : ''
    }`}
    role="alert"
    aria-live={priority === 'high' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-4">
        {/* Icon with high contrast background */}
        <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          {/* Title with strong contrast */}
          <h3 className={`text-lg font-bold text-ojas-text-main mb-2`}>
            {title}
          </h3>
          
          {/* Message with accessibility considerations */}
          <p className="text-base font-medium text-ojas-text-main mb-4">
            {message}
          </p>
          
          {/* Action button with high contrast */}
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-ojas-primary text-white rounded-xl font-bold text-base transition-all duration-200 hover:bg-ojas-primary-hover active:scale-95 shadow-ojas-soft border-2 border-ojas-primary min-h-[48px]"
              aria-label={`${actionText} - ${title}`}
            >
              {actionText}
            </button>
          )}
        </div>
        
        {/* Dismiss button with accessibility */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-10 h-10 rounded-full hover:bg-ojas-border/50 flex items-center justify-center transition-colors duration-200 flex-shrink-0 border-2 border-transparent hover:border-ojas-border"
            aria-label={`Dismiss ${title} notification`}
          >
            <X className="w-5 h-5 text-ojas-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SmartBanner;
