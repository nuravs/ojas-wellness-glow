
import React from 'react';
import { Calendar, Users, Heart, Activity, Brain, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

  const primaryActions = [
    {
      id: 'calm-room',
      title: 'Calm Room',
      description: 'Mindfulness & relaxation',
      icon: <Headphones className="w-6 h-6" />,
      color: 'bg-ojas-calming-green hover:bg-ojas-calming-green/90',
      textColor: 'text-white',
      path: '/calm-room'
    },
    {
      id: 'support-groups',
      title: 'Support Groups',
      description: 'Connect with community',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-ojas-primary hover:bg-ojas-primary-hover',
      textColor: 'text-white',
      path: '/support-groups'
    }
  ];

  const wellnessActions = [
    {
      id: 'vitals',
      title: 'Record Vitals',
      icon: <Heart className="w-5 h-5" />,
      path: '/vitals'
    },
    {
      id: 'brain-gym',
      title: 'Brain Gym',
      icon: <Brain className="w-5 h-5" />,
      path: '/brain-gym'
    },
    {
      id: 'wellness-center',
      title: 'Education',
      icon: <Activity className="w-5 h-5" />,
      path: '/wellness-center'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Wellness Actions */}
      <div>
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
          Wellness & Support
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {primaryActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => navigate(action.path)}
              className={`${action.color} ${action.textColor} p-6 h-auto rounded-2xl shadow-ojas-soft border-0 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              style={{ minHeight: '44px' }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">{action.title}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Secondary Wellness Actions */}
      <div>
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
          Health Tools
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {wellnessActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => navigate(action.path)}
              variant="outline"
              className="p-4 h-auto rounded-xl border-ojas-border hover:border-ojas-primary hover:bg-ojas-primary/5 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ minHeight: '44px' }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-ojas-primary">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-ojas-text-main dark:text-ojas-mist-white">
                  {action.title}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryActionsSection;
