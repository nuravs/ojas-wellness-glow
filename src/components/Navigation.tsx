
import React from 'react';
import { Home, Pill, Activity, Heart, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'symptoms' | 'vitals' | 'records' | 'more';
  onTabChange: (tab: 'home' | 'medications' | 'symptoms' | 'vitals' | 'records' | 'more') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'medications' as const, label: 'Meds', icon: Pill },
    { id: 'symptoms' as const, label: 'Symptoms', icon: Activity },
    { id: 'vitals' as const, label: 'Vitals', icon: Heart },
    { id: 'more' as const, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-ojas-charcoal-gray border-t-2 border-ojas-border dark:border-ojas-slate-gray px-4 py-3 z-40 shadow-ojas-strong"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto">
        <div className="flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                activeTab === id 
                  ? 'bg-ojas-primary/10 text-ojas-primary' 
                  : 'text-ojas-text-secondary dark:text-ojas-cloud-silver hover:text-ojas-primary hover:bg-ojas-primary/5'
              }`}
              aria-label={`Navigate to ${label}`}
              aria-current={activeTab === id ? 'page' : undefined}
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
