
import React from 'react';

interface HomeHeaderProps {
  userRole: 'patient' | 'caregiver';
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userRole }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-ojas-text-main font-heading mb-4">
        Good morning, {userRole === 'caregiver' ? 'Caregiver' : 'Sarah'}
      </h1>
      <p className="text-ojas-text-secondary text-xl">
        {userRole === 'caregiver' ? "Let's check on your patient's progress" : "Let's see how you're doing today"}
      </p>
    </div>
  );
};

export default HomeHeader;
