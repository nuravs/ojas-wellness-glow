
import React from 'react';
import { Calendar, Heart, Users, Waves, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SecondaryActionsSectionProps {
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  vitals: any[];
  userRole: 'patient' | 'caregiver';
}

const SecondaryActionsSection: React.FC<SecondaryActionsSectionProps> = ({
  medsCount,
  symptomsLogged,
  vitals,
  userRole
}) => {
  const navigate = useNavigate();

  const priorityActions = [
    {
      id: 'calm-room',
      title: 'Calm Room',
      description: 'Relaxation & mindfulness',
      icon: Waves,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      path: '/calm-room'
    },
    {
      id: 'support-groups',
      title: 'Support Groups',
      description: 'Connect with community',
      icon: Users,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      path: '/support-groups'
    },
    {
      id: 'education',
      title: 'Education Hub',
      description: 'Learn & understand',
      icon: BookOpen,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      path: '/wellness-center'
    },
    {
      id: 'conditions',
      title: 'Manage Conditions',
      description: 'Track comorbidities',
      icon: Heart,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      path: '/comorbidities'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {priorityActions.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`${action.color} rounded-2xl p-4 transition-all duration-200 hover:shadow-ojas-soft active:scale-95 text-left`}
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${action.iconColor}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-ojas-text-main text-sm">
                {action.title}
              </h3>
            </div>
            <p className="text-xs text-ojas-text-secondary leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SecondaryActionsSection;
