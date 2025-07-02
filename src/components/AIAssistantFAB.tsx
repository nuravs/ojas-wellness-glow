
import React from 'react';
import { Bot } from 'lucide-react';

const AIAssistantFAB: React.FC = () => {
  const handleAIAssistant = () => {
    // AI assistant functionality - would integrate with AI service
    alert('AI Assistant - Would provide intelligent health insights and answer questions');
  };

  return (
    <div className="fixed bottom-28 left-6 z-50 group">
      <button
        onClick={handleAIAssistant}
        className="w-14 h-14 bg-ojas-primary-blue rounded-full shadow-ojas-strong flex items-center justify-center text-white hover:bg-ojas-primary-blue-hover transition-all duration-200 hover:scale-110 active:scale-95 border-4 border-white dark:border-ojas-charcoal-gray"
        aria-label="AI Assistant - Get health insights and answers"
        title="AI Assistant"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0, 119, 182, 0.4))',
          minWidth: '44px',
          minHeight: '44px'
        }}
      >
        <Bot className="w-7 h-7" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-ojas-charcoal-gray text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        AI Assistant
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ojas-charcoal-gray"></div>
      </div>
    </div>
  );
};

export default AIAssistantFAB;
