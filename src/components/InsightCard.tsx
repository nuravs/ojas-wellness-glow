
import React, { useState } from 'react';
import { Lightbulb, Heart, TrendingUp, X } from 'lucide-react';

interface InsightCardProps {
  type: 'encouragement' | 'trend' | 'tip';
  title: string;
  message: string;
  onDismiss?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  type, 
  title, 
  message, 
  onDismiss 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'encouragement': return <Heart className="w-6 h-6 text-wellness-green" />;
      case 'trend': return <TrendingUp className="w-6 h-6 text-wellness-blue" />;
      case 'tip': return <Lightbulb className="w-6 h-6 text-wellness-yellow" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'encouragement': return 'bg-wellness-green/5 border-wellness-green/20';
      case 'trend': return 'bg-wellness-blue/5 border-wellness-blue/20';
      case 'tip': return 'bg-wellness-yellow/5 border-wellness-yellow/20';
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className={`ojas-card ${getBgColor()} animate-gentle-fade-in`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-calm-800 mb-2">
            {title}
          </h3>
          <p className="text-calm-700 leading-relaxed">
            {message}
          </p>
        </div>
        
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            aria-label="Dismiss insight"
          >
            <X className="w-4 h-4 text-calm-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
