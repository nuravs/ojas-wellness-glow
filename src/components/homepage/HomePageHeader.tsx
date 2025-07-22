
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
  };

  const handleSettings = () => {
    // Navigate to settings through the Index page routing system
    navigate('/?page=settings');
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

  // Get meaningful notifications for health app
  const getHealthNotifications = () => {
    return [
      {
        id: 1,
        title: 'Medication Reminder',
        message: 'Time to take your evening medication',
        time: '30 minutes ago',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Vitals Check',
        message: 'Blood pressure reading is due',
        time: '2 hours ago',
        priority: 'medium'
      }
    ];
  };

  const notifications = getHealthNotifications();

  // Handle loading state when userProfile is null
  if (!userProfile) {
    return (
      <div className="bg-white px-4 py-6 border-b border-ojas-border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-ojas-text-main mb-1">
              {getGreeting()}...
            </h1>
            <p className="text-sm text-ojas-text-secondary">
              {getCurrentDate()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={handleNotifications}
                className="relative p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-ojas-error rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{notifications.length}</span>
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={handleSettings}
              className="p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 bg-ojas-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-6 border-b border-ojas-border relative">
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
          <div className="relative">
            <button 
              onClick={handleNotifications}
              className="relative p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-ojas-error rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{notifications.length}</span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-ojas-strong border border-ojas-border z-50">
                <div className="p-4 border-b border-ojas-border">
                  <h3 className="font-semibold text-ojas-text-main">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-ojas-border hover:bg-ojas-bg-light">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === 'high' ? 'bg-ojas-error' : 'bg-ojas-alert'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-ojas-text-main text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-ojas-text-secondary">
                            {notification.message}
                          </p>
                          <p className="text-xs text-ojas-text-secondary mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
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

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default HomePageHeader;
