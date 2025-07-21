
import React from 'react';
import { TrendingUp, Calendar, Users, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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

  const secondaryActions = [
    {
      id: 'view-trends',
      icon: TrendingUp,
      title: 'View Trends',
      description: 'See your health patterns over time',
      action: () => navigate('/more'),
      color: 'text-ojas-primary'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Calendar',
      description: 'Appointments and reminders',
      action: () => navigate('/calendar'),
      color: 'text-ojas-secondary'
    },
    {
      id: 'support',
      icon: Users,
      title: 'Support Groups',
      description: 'Connect with others',
      action: () => navigate('/support-groups'),
      color: 'text-ojas-calming-green'
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      description: 'Customize your experience',
      action: () => navigate('/?page=settings'),
      color: 'text-ojas-text-secondary'
    }
  ];

  return (
    <div className="px-4 mb-8">
      <h3 className="text-lg font-semibold text-ojas-text-main mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {secondaryActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={action.id}
              className="shadow-ojas-soft border border-ojas-border hover:shadow-ojas-medium transition-all duration-200 cursor-pointer"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ojas-bg-light flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ojas-text-main text-sm">
                        {action.title}
                      </h4>
                      <p className="text-xs text-ojas-text-secondary">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ojas-text-secondary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SecondaryActionsSection;
