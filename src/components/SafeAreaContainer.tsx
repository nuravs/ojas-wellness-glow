
import React from 'react';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`} style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      {children}
    </div>
  );
};

export default SafeAreaContainer;
