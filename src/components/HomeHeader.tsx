
import React from 'react';

interface HomeHeaderProps {
  userRole: 'patient' | 'caregiver';
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userRole }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-ojas-primary rounded-full flex items-center justify-center shadow-ojas-medium">
          <span className="text-2xl font-bold text-white">O</span>
        </div>
        <h1 className="text-4xl font-bold text-ojas-text-main font-heading">
          Good morning, {userRole === 'caregiver' ? 'Caregiver' : 'Sarah'}
        </h1>
      </div>
      <p className="text-ojas-text-secondary text-xl">
        {userRole === 'caregiver' ? "Let's check on your patient's progress" : "Let's see how you're doing today"}
      </p>
    </div>
  );
};

export default HomeHeader;
