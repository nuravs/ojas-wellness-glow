
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
          bg: 'bg-white',
          border: 'border-ojas-error',
          icon: Pill,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-error',
          titleColor: 'text-ojas-error',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-error hover:bg-ojas-error-hover',
          buttonText: 'text-white'
        };
      case 'symptom-reminder':
        return {
          bg: 'bg-white',
          border: 'border-ojas-alert',
          icon: Activity,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-alert',
          titleColor: 'text-ojas-alert',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-alert hover:bg-ojas-alert-hover',
          buttonText: 'text-ojas-text-main'
        };
      case 'refill-needed':
        return {
          bg: 'bg-white',
          border: 'border-ojas-alert',
          icon: AlertCircle,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-alert',
          titleColor: 'text-ojas-alert',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-alert hover:bg-ojas-alert-hover',
          buttonText: 'text-ojas-text-main'
        };
      case 'appointment-reminder':
        return {
          bg: 'bg-white',
          border: 'border-ojas-primary',
          icon: Clock,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-primary',
          titleColor: 'text-ojas-primary',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-primary hover:bg-ojas-primary-hover',
          buttonText: 'text-white'
        };
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-ojas-success',
          icon: CheckCircle,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-success',
          titleColor: 'text-ojas-success',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-success hover:bg-ojas-success-hover',
          buttonText: 'text-white'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-ojas-primary',
          icon: AlertCircle,
          iconColor: 'text-white',
          iconBg: 'bg-ojas-primary',
          titleColor: 'text-ojas-primary',
          messageColor: 'text-ojas-text-main',
          buttonBg: 'bg-ojas-primary hover:bg-ojas-primary-hover',
          buttonText: 'text-white'
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
        <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0 shadow-ojas-soft`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          {/* Title with strong contrast */}
          <h3 className={`text-xl font-bold ${config.titleColor} mb-2`}>
            {title}
          </h3>
          
          {/* Message with accessibility considerations */}
          <p className={`text-base font-medium ${config.messageColor} mb-4 leading-relaxed`}>
            {message}
          </p>
          
          {/* Action button with high contrast */}
          {actionText && onAction && (
            <button
              onClick={onAction}
              className={`px-6 py-3 ${config.buttonBg} ${config.buttonText} rounded-xl font-bold text-base transition-all duration-200 active:scale-95 shadow-ojas-soft border-2 border-transparent min-h-[48px] focus:ring-4 focus:ring-offset-2 focus:ring-current/20`}
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
            className="w-10 h-10 rounded-full hover:bg-ojas-border/30 flex items-center justify-center transition-colors duration-200 flex-shrink-0 border-2 border-transparent hover:border-ojas-border focus:ring-2 focus:ring-ojas-primary/50"
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
