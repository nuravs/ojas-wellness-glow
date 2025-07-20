
import React, { useState } from 'react';
import { LogOut, Bell, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HomePageHeaderProps {
  userProfile: any;
}

const HomePageHeader: React.FC<HomePageHeaderProps> = ({ userProfile }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    // In a real app, this would show a notifications dropdown
    // For now, we'll navigate to a notifications page or show a toast
    console.log('Notifications clicked');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-white px-4 py-6 border-b border-ojas-border">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-ojas-text-main mb-1">
            {getGreeting()}, {userProfile.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-sm text-ojas-text-secondary">
            {getCurrentDate()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleNotifications}
            className="relative p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-ojas-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">2</span>
            </span>
          </button>
          
          <button 
            onClick={handleSettings}
            className="p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-ojas-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {userProfile.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
