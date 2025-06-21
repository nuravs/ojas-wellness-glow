
import React from 'react';
import { Home, Pill, Activity, Calendar, Folder, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'symptoms' | 'calendar' | 'records' | 'help';
  onTabChange: (tab: 'home' | 'medications' | 'symptoms' | 'calendar' | 'records' | 'help') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'medications' as const, label: 'Meds', icon: Pill },
    { id: 'symptoms' as const, label: 'Symptoms', icon: Activity },
    { id: 'records' as const, label: 'Records', icon: Folder },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-wellness-calm-200 px-2 py-2 z-50">
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
