
import React from 'react';
import { Calendar, MessageSquare, Phone, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  const quickActions = [
    {
      id: 'calendar',
      icon: Calendar,
      label: 'Calendar',
      description: 'View appointments',
      action: () => navigate('/calendar'),
      primary: false
    },
    {
      id: 'support',
      icon: MessageSquare,
      label: 'Support Groups',
      description: 'Connect with others',
      action: () => navigate('/support-groups'),
      primary: false
    },
    {
      id: 'emergency',
      icon: Phone,
      label: 'Emergency',
      description: 'Quick contact',
      action: () => {
        // Emergency contact functionality
        console.log('Emergency contact triggered');
      },
      primary: true
    },
    {
      id: 'calm-room',
      icon: MessageSquare,
      label: 'Calm Room',
      description: 'Relaxation space',
      action: () => navigate('/calm-room'),
      primary: false
    }
  ];

  return (
    <div className="px-4 mb-8">
      <Card className="shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-ojas-text-main mb-4">
            Quick Access
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.primary ? "default" : "outline"}
                  onClick={action.action}
                  className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecondaryActionsSection;
