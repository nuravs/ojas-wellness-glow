
import React from 'react';
import { Clock, Pill, Heart, Activity, AlertTriangle, CheckCircle, Calendar, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TodaysFocusSectionProps {
  medications: any[];
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  vitals: any[];
  userProfile: any;
  onMedicationAction: (id: string) => void;
}

const TodaysFocusSection: React.FC<TodaysFocusSectionProps> = ({
  medications,
  medsCount,
  symptomsLogged,
  vitals,
  userProfile,
  onMedicationAction
}) => {
  const navigate = useNavigate();

  // Determine the single most important action for today
  const getPrimaryAction = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check for overdue medications first (highest priority)
    const overdueMeds = medications.filter(med => {
      if (med.taken) return false;
      const [hour, minute] = med.time.split(':').map(Number);
      const medTime = new Date();
      medTime.setHours(hour, minute, 0, 0);
      return now > medTime;
    });

    if (overdueMeds.length > 0) {
      const med = overdueMeds[0];
      return {
        id: `overdue-med-${med.id}`,
        type: 'urgent',
        icon: AlertTriangle,
        title: 'Overdue Medication',
        message: `${med.name} was due at ${med.time}`,
        actionText: 'Take Now',
        actionColor: 'bg-ojas-error hover:bg-ojas-error/90',
        action: () => onMedicationAction(med.id)
      };
    }

    // Check for upcoming medications (next 2 hours)
    const upcomingMeds = medications.filter(med => {
      if (med.taken) return false;
      const [hour, minute] = med.time.split(':').map(Number);
      const medTime = new Date();
      medTime.setHours(hour, minute, 0, 0);
      const timeDiff = medTime.getTime() - now.getTime();
      return timeDiff > 0 && timeDiff <= 2 * 60 * 60 * 1000; // Next 2 hours
    });

    if (upcomingMeds.length > 0) {
      const med = upcomingMeds[0];
      return {
        id: `upcoming-med-${med.id}`,
        type: 'attention',
        icon: Pill,
        title: 'Upcoming Medication',
        message: `${med.name} is due at ${med.time}`,
        actionText: 'Take Now',
        actionColor: 'bg-ojas-primary hover:bg-ojas-primary-hover',
        action: () => onMedicationAction(med.id)
      };
    }

    // Check if symptoms haven't been logged today
    if (!symptomsLogged) {
      return {
        id: 'log-symptoms',
        type: 'reminder',
        icon: Heart,
        title: 'Track Your Wellness',
        message: 'How are you feeling today? Log your symptoms to track your progress.',
        actionText: 'Log Symptoms',
        actionColor: 'bg-ojas-calming-green hover:bg-ojas-calming-green/90',
        action: () => navigate('/symptoms')
      };
    }

    // Check if vitals haven't been logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysVitals = vitals.filter(vital => {
      const vitalDate = new Date(vital.measured_at);
      vitalDate.setHours(0, 0, 0, 0);
      return vitalDate.getTime() === today.getTime();
    });

    if (todaysVitals.length === 0 && currentHour >= 8) {
      return {
        id: 'log-vitals',
        type: 'reminder',
        icon: Activity,
        title: 'Record Your Vitals',
        message: 'Start your day by recording your blood pressure and heart rate.',
        actionText: 'Log Vitals',
        actionColor: 'bg-ojas-primary hover:bg-ojas-primary-hover',
        action: () => navigate('/vitals?action=add')
      };
    }

    // Everything is up to date - show positive reinforcement
    return {
      id: 'all-good',
      type: 'success',
      icon: CheckCircle,
      title: 'You\'re All Set!',
      message: 'Great job staying on top of your health today. Keep up the excellent work!',
      actionText: 'View Progress',
      actionColor: 'bg-ojas-success hover:bg-ojas-success/90',
      action: () => navigate('/more')
    };
  };

  const primaryAction = getPrimaryAction();
  const IconComponent = primaryAction.icon;

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-ojas-error/5 border-ojas-error/20';
      case 'attention': return 'bg-ojas-alert/5 border-ojas-alert/20';
      case 'reminder': return 'bg-ojas-primary/5 border-ojas-primary/20';
      case 'success': return 'bg-ojas-success/5 border-ojas-success/20';
      default: return 'bg-ojas-bg-light border-ojas-border';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-ojas-error';
      case 'attention': return 'text-ojas-alert';
      case 'reminder': return 'text-ojas-primary';
      case 'success': return 'text-ojas-success';
      default: return 'text-ojas-text-main';
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-ojas-text-main mb-2">
          Today's Focus
        </h2>
        <p className="text-ojas-text-secondary">
          Your most important health action right now
        </p>
      </div>

      <Card className={`${getBackgroundColor(primaryAction.type)} border-2 shadow-ojas-soft`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-ojas-border flex items-center justify-center mb-6">
              <IconComponent className={`w-10 h-10 ${getIconColor(primaryAction.type)}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-ojas-text-main mb-3">
              {primaryAction.title}
            </h3>
            
            <p className="text-ojas-text-secondary text-lg leading-relaxed mb-8 max-w-md">
              {primaryAction.message}
            </p>
            
            <Button
              onClick={primaryAction.action}
              className={`${primaryAction.actionColor} text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-ojas-soft hover:shadow-ojas-strong transition-all duration-200 active:scale-95`}
              style={{ minHeight: '56px', minWidth: '200px' }}
            >
              {primaryAction.actionText}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-ojas-text-main">
            {medsCount.taken}/{medsCount.total}
          </div>
          <div className="text-sm text-ojas-text-secondary">
            Medications
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ojas-text-main">
            {symptomsLogged ? '✓' : '—'}
          </div>
          <div className="text-sm text-ojas-text-secondary">
            Symptoms
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ojas-text-main">
            {vitals.length}
          </div>
          <div className="text-sm text-ojas-text-secondary">
            Vitals Today
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysFocusSection;
