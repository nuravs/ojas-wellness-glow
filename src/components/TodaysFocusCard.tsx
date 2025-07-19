
import React from 'react';
import { Calendar, AlertTriangle, Heart, Sparkles, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TodaysFocusCardProps {
  userRole?: 'patient' | 'caregiver';
  upcomingAppointment?: {
    doctor_name: string;
    appointment_time: string;
    appointment_type: string;
  } | null;
  overdueMedications?: Array<{
    name: string;
    time: string;
  }>;
  criticalAlerts?: Array<{
    type: 'vital' | 'symptom' | 'medication';
    message: string;
  }>;
  medsCount?: { taken: number; total: number };
  symptomsLogged?: boolean;
}

const TodaysFocusCard: React.FC<TodaysFocusCardProps> = ({
  userRole = 'patient',
  upcomingAppointment,
  overdueMedications = [],
  criticalAlerts = [],
  medsCount = { taken: 0, total: 0 },
  symptomsLogged = false
}) => {
  // Determine priority content based on real data
  const getPriorityContent = () => {
    // Check for critical alerts first
    if (criticalAlerts.length > 0) {
      const alert = criticalAlerts[0];
      return {
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        title: 'Attention Needed',
        content: alert.message,
        actionText: 'Review',
        actionColor: 'bg-red-500 hover:bg-red-600'
      };
    }

    // Check for overdue medications based on real data
    const overdueMedsCount = medsCount.total - medsCount.taken;
    if (overdueMedsCount > 0) {
      return {
        icon: Clock,
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        title: 'Medications Pending',
        content: `${overdueMedsCount} medication${overdueMedsCount > 1 ? 's' : ''} still need${overdueMedsCount === 1 ? 's' : ''} to be taken today`,
        actionText: 'View Medications',
        actionColor: 'bg-orange-500 hover:bg-orange-600'
      };
    }

    // Check for upcoming appointment
    if (upcomingAppointment) {
      return {
        icon: Calendar,
        iconColor: 'text-ojas-primary',
        bgColor: 'bg-ojas-primary/5 dark:bg-ojas-primary/10',
        borderColor: 'border-ojas-primary/20 dark:border-ojas-primary/30',
        title: 'Today\'s Appointment',
        content: `${upcomingAppointment.appointment_type} with ${upcomingAppointment.doctor_name} at ${upcomingAppointment.appointment_time}`,
        actionText: 'View Details',
        actionColor: 'bg-ojas-primary hover:bg-ojas-primary-hover'
      };
    }

    // Check if symptoms haven't been logged
    if (!symptomsLogged) {
      return {
        icon: Heart,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        title: 'Track Your Health',
        content: 'Consider logging how you\'re feeling today to help track your wellness journey',
        actionText: 'Log Symptoms',
        actionColor: 'bg-blue-500 hover:bg-blue-600'
      };
    }

    // Default positive content when everything is up to date
    const positiveMessages = [
      "Great job staying on top of your health! 🌟",
      "Your wellness journey is looking fantastic today! ✨", 
      "Keep up the excellent health management! 💪",
      "You're doing amazing with your daily routine! 🎉"
    ];

    const randomMessage = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];

    return {
      icon: Sparkles,
      iconColor: 'text-ojas-calming-green',
      bgColor: 'bg-ojas-calming-green/5 dark:bg-ojas-calming-green/10',
      borderColor: 'border-ojas-calming-green/20 dark:border-ojas-calming-green/30',
      title: 'Today\'s Focus',
      content: randomMessage,
      actionText: 'View Wellness',
      actionColor: 'bg-ojas-calming-green hover:bg-ojas-calming-green/90'
    };
  };

  const content = getPriorityContent();
  const IconComponent = content.icon;

  return (
    <Card className={`${content.bgColor} ${content.borderColor} border-2 shadow-ojas-soft`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full bg-white dark:bg-ojas-charcoal-gray ${content.borderColor} border-2 flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-6 h-6 ${content.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
              {content.title}
            </h3>
            <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-sm leading-relaxed mb-4">
              {content.content}
            </p>
            
            <button className={`${content.actionColor} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95`}>
              {content.actionText}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysFocusCard;
