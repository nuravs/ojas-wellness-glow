
import React from 'react';
import { Home, Pill, Activity, Calendar } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'medications' | 'symptoms' | 'calendar';
  onTabChange: (tab: 'home' | 'medications' | 'symptoms' | 'calendar') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'medications' as const, label: 'Medications', icon: Pill },
    { id: 'symptoms' as const, label: 'Symptoms', icon: Activity },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-wellness-calm-200 px-4 py-2 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`ojas-tab ${activeTab === id ? 'active' : 'inactive'}`}
              aria-label={`Navigate to ${label}`}
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
