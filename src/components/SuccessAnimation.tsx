
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
  duration?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  message, 
  onComplete, 
  duration = 2000 
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-gentle-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-ojas-strong max-w-sm mx-4 text-center animate-success-pulse">
        <div className="w-16 h-16 bg-ojas-calming-green rounded-full flex items-center justify-center mx-auto mb-4 animate-success-check">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-2">Success!</h3>
        <p className="text-ojas-slate-gray">{message}</p>
        
        {/* Confetti elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-confetti`}
              style={{
                backgroundColor: i % 4 === 0 ? '#00B488' : i % 4 === 1 ? '#0077B6' : i % 4 === 2 ? '#FFC300' : '#FF4E4E',
                left: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
