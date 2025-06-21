
import React from 'react';
import { Home, Pill, Heart, Folder, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'wellness' | 'records' | 'more';
  onTabChange: (tab: 'home' | 'medications' | 'wellness' | 'records' | 'more') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'medications' as const, label: 'Meds', icon: Pill },
    { id: 'wellness' as const, label: 'Wellness', icon: Heart },
    { id: 'records' as const, label: 'Records', icon: Folder },
    { id: 'more' as const, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-calm-200 px-2 py-2 z-50 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`ojas-tab ${activeTab === id ? 'active' : 'inactive'}`}
              aria-label={`Navigate to ${label}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
