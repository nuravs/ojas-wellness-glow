
import React from 'react';
import { Phone } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const handleEmergencyCall = () => {
    // In a real app, this would trigger emergency contacts or 911
    alert('Emergency services would be contacted. In development mode.');
  };

  return (
    <div className="fixed top-4 right-4 z-50 group">
      <button
        onClick={handleEmergencyCall}
        className="w-12 h-12 bg-ojas-vibrant-coral rounded-full shadow-ojas-strong flex items-center justify-center text-white hover:bg-ojas-vibrant-coral-hover transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Emergency - Call for help"
        title="Emergency - Call for help"
      >
        <Phone className="w-5 h-5" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-ojas-charcoal-gray text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Emergency
        <div className="absolute bottom-full right-3 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-ojas-charcoal-gray"></div>
      </div>
    </div>
  );
};

export default EmergencyButton;
