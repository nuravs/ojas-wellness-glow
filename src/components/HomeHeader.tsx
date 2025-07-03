
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCopyForRole } from '../utils/roleBasedCopy';
import { LogOut } from 'lucide-react';

interface HomeHeaderProps {
  userRole: 'patient' | 'caregiver';
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userRole }) => {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-between items-start mb-12">
      <div className="text-left flex-1">
        <h1 className="text-4xl font-bold text-ojas-text-main font-heading mb-2">
          {getCopyForRole('homeGreeting', userRole)}
        </h1>
        {userProfile && (
          <p className="text-ojas-text-secondary text-lg mb-2">
            Welcome back, {userProfile.full_name}
          </p>
        )}
        <p className="text-ojas-text-secondary text-xl">
          {getCopyForRole('homeSubtitle', userRole)}
        </p>
      </div>
      
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-4 py-2 text-ojas-slate-gray hover:text-ojas-charcoal-gray transition-colors duration-200"
        aria-label="Sign out"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm">Sign Out</span>
      </button>
    </div>
  );
};

export default HomeHeader;
