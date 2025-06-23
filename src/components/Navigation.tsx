
import React from 'react';
import { Home, Pill, Activity, Heart, Folder, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more';
  onTabChange: (tab: 'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'medications' as const, label: 'Meds', icon: Pill },
    { id: 'symptoms' as const, label: 'Symptoms', icon: Activity },
    { id: 'wellness' as const, label: 'Wellness', icon: Heart },
    { id: 'more' as const, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-ojas-border px-4 py-3 z-40 shadow-ojas-strong"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto">
        <div className="flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`ojas-tab ${activeTab === id ? 'active' : 'inactive'}`}
              aria-label={`Navigate to ${label}`}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
