
import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="w-28 h-28 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <Plus className="w-14 h-14 text-ojas-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-ojas-text-main mb-4 font-heading">
        Welcome to Ojas
      </h3>
      <p className="text-ojas-text-secondary mb-8 leading-relaxed text-lg">
        Let's start by adding your medications and setting up your wellness routine. We're here to support you every step of the way.
      </p>
      <button className="ojas-button-primary">
        <Plus className="w-6 h-6" />
        Get Started
      </button>
    </div>
  );
};

export default EmptyState;
