
import React from 'react';
import { HelpCircle } from 'lucide-react';

const FloatingHelpButton: React.FC = () => {
  const handleSOS = () => {
    // In a real app, this would trigger emergency contacts or help system
    alert('Emergency help feature - would contact your emergency contacts or medical team');
  };

  return (
    <button
      onClick={handleSOS}
      className="fixed bottom-24 right-6 w-14 h-14 bg-ojas-vibrant-coral rounded-full shadow-ojas-strong flex items-center justify-center text-white hover:bg-ojas-vibrant-coral-hover transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse-gentle z-50"
      aria-label="Emergency help and support"
    >
      <HelpCircle className="w-7 h-7" />
    </button>
  );
};

export default FloatingHelpButton;
