
import React from 'react';
import { getCopyForRole } from '../utils/roleBasedCopy';

interface HomeHeaderProps {
  userRole: 'patient' | 'caregiver';
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userRole }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-ojas-text-main font-heading mb-4">
        {getCopyForRole('homeGreeting', userRole)}
      </h1>
      <p className="text-ojas-text-secondary text-xl">
        {getCopyForRole('homeSubtitle', userRole)}
      </p>
    </div>
  );
};

export default HomeHeader;
