
import React from 'react';
import { Home, Activity, Pill, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'health-log' | 'more';
  onTabChange: (tab: 'home' | 'medications' | 'health-log' | 'more') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'health-log' as const, label: 'Health Log', icon: Activity },
    { id: 'medications' as const, label: 'Medications', icon: Pill },
    { id: 'more' as const, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-ojas-charcoal-gray border-t border-ojas-border dark:border-ojas-slate-gray px-4 py-2 z-40 shadow-ojas-strong"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                activeTab === id 
                  ? 'text-ojas-primary' 
                  : 'text-ojas-text-secondary dark:text-ojas-cloud-silver hover:text-ojas-primary'
              }`}
              aria-label={`Navigate to ${label}`}
              aria-current={activeTab === id ? 'page' : undefined}
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${activeTab === id ? 'fill-current' : ''}`} 
                fill={activeTab === id ? 'currentColor' : 'none'}
              />
              <span className={`text-xs font-medium ${activeTab === id ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
