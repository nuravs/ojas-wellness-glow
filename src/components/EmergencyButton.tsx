
import React from 'react';
import { Phone } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const handleEmergencyCall = () => {
    // In a real app, this would trigger emergency contacts or 911
    alert('Emergency services would be contacted. In development mode.');
  };

  return (
    <div className="fixed top-6 right-6 z-50 group">
      <button
        onClick={handleEmergencyCall}
        className="w-16 h-16 bg-ojas-vibrant-coral rounded-full shadow-ojas-strong flex items-center justify-center text-white hover:bg-ojas-vibrant-coral-hover transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse-gentle"
        aria-label="Emergency - Call for help"
        title="Emergency - Call for help"
      >
        <Phone className="w-8 h-8" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-ojas-charcoal-gray text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Emergency
        <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-ojas-charcoal-gray"></div>
      </div>
    </div>
  );
};

export default EmergencyButton;
