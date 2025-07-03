
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CoachMarkProps {
  id: string;
  message: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  onDismiss?: () => void;
}

const CoachMark: React.FC<CoachMarkProps> = ({ id, message, position, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this coach mark has been seen before
    const seenCoachMarks = JSON.parse(localStorage.getItem('ojas-coach-marks-seen') || '[]');
    
    if (!seenCoachMarks.includes(id)) {
      // Show after a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Mark as seen in localStorage
    const seenCoachMarks = JSON.parse(localStorage.getItem('ojas-coach-marks-seen') || '[]');
    if (!seenCoachMarks.includes(id)) {
      seenCoachMarks.push(id);
      localStorage.setItem('ojas-coach-marks-seen', JSON.stringify(seenCoachMarks));
    }
    
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="coach-mark"
      style={{
        ...position,
        maxWidth: '200px',
        zIndex: 60
      }}
    >
      <div className="flex items-start gap-2">
        <span className="flex-1 text-sm">{message}</span>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss tip"
          style={{ minWidth: '20px', minHeight: '20px' }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default CoachMark;
