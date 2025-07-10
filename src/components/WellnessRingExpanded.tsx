
import React from 'react';
import { Check, Clock, Minus, Activity, AlertCircle } from 'lucide-react';
import WellnessRingSummaryItem from './WellnessRingSummaryItem';

interface MedsCount {
  taken: number;
  total: number;
}

interface ComorbidityStatus {
  controlled: number;
  needsAttention: number;
  total: number;
}

interface WellnessRingExpandedProps {
  medsCount: MedsCount;
  symptomsLogged: boolean;
  nextAppointment?: string;
  comorbidityStatus?: ComorbidityStatus;
}

const WellnessRingExpanded: React.FC<WellnessRingExpandedProps> = ({ 
  medsCount, 
  symptomsLogged, 
  nextAppointment,
  comorbidityStatus
}) => {
  const getSummaryItems = () => {
    const items = [
      {
        label: 'Medications',
        value: `${medsCount.taken}/${medsCount.total} taken`,
        status: (medsCount.taken === medsCount.total ? 'good' : 'attention') as 'good' | 'attention' | 'neutral',
        icon: medsCount.taken === medsCount.total ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
        textStatus: medsCount.taken === medsCount.total ? 'Complete' : 'Pending'
      }
    ];

    // Add comorbidity status if available
    if (comorbidityStatus && comorbidityStatus.total > 0) {
      items.push({
        label: 'Health Conditions',
        value: `${comorbidityStatus.controlled} controlled, ${comorbidityStatus.needsAttention} need attention`,
        status: (comorbidityStatus.needsAttention === 0 ? 'good' : 'attention') as 'good' | 'attention' | 'neutral',
        icon: comorbidityStatus.needsAttention === 0 ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />,
        textStatus: comorbidityStatus.needsAttention === 0 ? 'Well Managed' : 'Need Review'
      });
    }

    items.push(
      {
        label: 'Symptoms',
        value: symptomsLogged ? 'Logged today' : 'No entries yet',
        status: (symptomsLogged ? 'good' : 'neutral') as 'good' | 'attention' | 'neutral',
        icon: symptomsLogged ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />,
        textStatus: symptomsLogged ? 'Logged' : 'None'
      },
      {
        label: 'Next Appointment',
        value: nextAppointment || 'None scheduled',
        status: 'neutral' as 'good' | 'attention' | 'neutral',
        icon: <Clock className="w-4 h-4" />,
        textStatus: nextAppointment ? 'Upcoming' : 'None'
      }
    );

    return items;
  };

  return (
    <div className="mt-8 animate-gentle-fade-in">
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border-2 border-ojas-border dark:border-ojas-slate-gray p-6">
        <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-6 text-center">Today's Overview</h3>
        
        <div className="space-y-4">
          {getSummaryItems().map((item, index) => (
            <WellnessRingSummaryItem key={index} item={item} />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-ojas-border dark:border-ojas-slate-gray">
          <p className="text-center text-ojas-text-secondary dark:text-ojas-cloud-silver text-sm">
            Your wellness summary updates throughout the day
          </p>
        </div>
      </div>
    </div>
  );
};

export default WellnessRingExpanded;
