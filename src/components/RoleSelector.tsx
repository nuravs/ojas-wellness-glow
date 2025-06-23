
import React, { useState } from 'react';
import { User, Users, ArrowRight } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelected: (role: 'patient' | 'caregiver') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'caregiver' | null>(null);

  const roles = [
    {
      id: 'patient' as const,
      title: 'I am a Patient',
      description: 'Managing my own health and symptoms',
      icon: User,
      color: 'primary-blue'
    },
    {
      id: 'caregiver' as const,
      title: 'I am a Caregiver',
      description: 'Helping care for someone else',
      icon: Users,
      color: 'calming-green'
    }
  ];

  const handleRoleSelect = (role: 'patient' | 'caregiver') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center p-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ojas-charcoal-gray mb-4">
            Welcome to Ojas
          </h1>
          <p className="text-xl text-ojas-slate-gray">
            Let's personalize your experience
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`w-full p-8 rounded-2xl border-4 transition-all duration-200 text-left ${
                selectedRole === role.id
                  ? `border-ojas-${role.color} bg-ojas-${role.color}/10 shadow-ojas-medium`
                  : 'border-ojas-cloud-silver bg-white hover:border-ojas-slate-gray shadow-ojas-soft'
              }`}
              aria-pressed={selectedRole === role.id}
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedRole === role.id
                    ? `bg-ojas-${role.color} text-white`
                    : `bg-ojas-${role.color}/10 text-ojas-${role.color}`
                }`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-ojas-charcoal-gray mb-2">
                    {role.title}
                  </h3>
                  <p className="text-lg text-ojas-slate-gray">
                    {role.description}
                  </p>
                </div>
                {selectedRole === role.id && (
                  <div className="w-8 h-8 bg-ojas-primary-blue rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full px-8 py-6 rounded-2xl font-semibold text-xl transition-all duration-200 flex items-center justify-center gap-4 ${
            selectedRole
              ? 'bg-ojas-primary-blue text-white hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-medium'
              : 'bg-ojas-cloud-silver text-ojas-slate-gray cursor-not-allowed'
          }`}
        >
          Continue to App
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
