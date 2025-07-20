
import React from 'react';
import { LogOut, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HomePageHeaderProps {
  userProfile: any;
}

const HomePageHeader: React.FC<HomePageHeaderProps> = ({ userProfile }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
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

  return (
    <div className="bg-white px-4 py-6 border-b border-ojas-border">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-ojas-text-main mb-1">
            Good morning, {userProfile.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-sm text-ojas-text-secondary">
            {getCurrentDate()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-ojas-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">2</span>
            </span>
          </button>
          
          <button 
            onClick={handleSignOut}
            className="p-2 text-ojas-text-secondary hover:text-ojas-text-main transition-colors"
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
