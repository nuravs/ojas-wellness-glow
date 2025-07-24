
import React from 'react';
import { Calendar, Users, Zap, BookOpen, Headphones, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-4">
      {/* Health Conditions Management */}
      <Card className="bg-white shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-ojas-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-ojas-text-main">Health Conditions</h3>
                <p className="text-sm text-ojas-text-secondary">
                  All 1 condition well managed
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation('/comorbidities')}
              className="flex items-center gap-2 bg-white hover:bg-ojas-bg-light border-ojas-border"
            >
              Manage Conditions
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Wellness Tip with Reminder */}
      <Card className="bg-white shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ojas-soft-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
              <BookOpen className="w-5 h-5 text-ojas-soft-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-ojas-text-secondary uppercase tracking-wider">
                  Daily Wellness Tip
                </span>
              </div>
              <h3 className="font-semibold text-ojas-text-main mb-2">
                Consistent Timing Helps
              </h3>
              <p className="text-sm text-ojas-text-secondary mb-4 leading-relaxed">
                Taking medications at the same time daily helps maintain steady therapeutic levels and can reduce fluctuations in symptoms.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation('/settings')}
                  className="bg-white hover:bg-ojas-bg-light border-ojas-border"
                >
                  Set Reminders
                </Button>
                <button
                  onClick={() => handleNavigation('/wellness-center')}
                  className="text-sm text-ojas-primary hover:text-ojas-primary-hover font-medium"
                >
                  View More Tips
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core App Features - Prominently Featured */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-ojas-soft border border-ojas-border hover:shadow-ojas-medium transition-shadow cursor-pointer">
          <CardContent 
            className="p-4 text-center"
            onClick={() => handleNavigation('/calm-room')}
          >
            <div className="w-12 h-12 rounded-full bg-ojas-calming-green/20 flex items-center justify-center mx-auto mb-3">
              <Headphones className="w-6 h-6 text-ojas-calming-green" />
            </div>
            <h3 className="font-semibold text-ojas-text-main mb-1">Calm Room</h3>
            <p className="text-xs text-ojas-text-secondary">
              Relaxation & mindfulness
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-ojas-soft border border-ojas-border hover:shadow-ojas-medium transition-shadow cursor-pointer">
          <CardContent 
            className="p-4 text-center"
            onClick={() => handleNavigation('/support-groups')}
          >
            <div className="w-12 h-12 rounded-full bg-ojas-primary/10 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-ojas-primary" />
            </div>
            <h3 className="font-semibold text-ojas-text-main mb-1">Support Groups</h3>
            <p className="text-xs text-ojas-text-secondary">
              Connect with community
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecondaryActionsSection;
