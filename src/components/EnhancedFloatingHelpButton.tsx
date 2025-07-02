
import React from 'react';
import { Phone } from 'lucide-react';

const EnhancedFloatingHelpButton: React.FC = () => {
  const handleSOS = () => {
    // Enhanced SOS functionality - would contact emergency services
    alert('SOS Emergency - Would contact your emergency contacts and medical team immediately');
  };

  return (
    <div className="fixed bottom-28 right-6 z-50 group">
      <button
        onClick={handleSOS}
        className="w-14 h-14 bg-ojas-vibrant-coral rounded-full shadow-ojas-strong flex items-center justify-center text-white hover:bg-ojas-vibrant-coral-hover transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse-gentle border-4 border-white dark:border-ojas-charcoal-gray"
        aria-label="Emergency SOS - Call for immediate help"
        title="Emergency SOS"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(255, 78, 78, 0.5))',
          minWidth: '44px',
          minHeight: '44px'
        }}
      >
        <Phone className="w-7 h-7" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-ojas-charcoal-gray text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Emergency SOS
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ojas-charcoal-gray"></div>
      </div>
    </div>
  );
};

export default EnhancedFloatingHelpButton;
