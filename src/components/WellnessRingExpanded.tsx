
import React from 'react';
import { Check, Clock, Minus } from 'lucide-react';
import WellnessRingSummaryItem from './WellnessRingSummaryItem';

interface MedsCount {
  taken: number;
  total: number;
}

interface WellnessRingExpandedProps {
  medsCount: MedsCount;
  symptomsLogged: boolean;
  nextAppointment?: string;
}

const WellnessRingExpanded: React.FC<WellnessRingExpandedProps> = ({ 
  medsCount, 
  symptomsLogged, 
  nextAppointment 
}) => {
  const getSummaryItems = () => {
    return [
      {
        label: 'Medications',
        value: `${medsCount.taken}/${medsCount.total} taken`,
        status: (medsCount.taken === medsCount.total ? 'good' : 'attention') as 'good' | 'attention' | 'neutral',
        icon: medsCount.taken === medsCount.total ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
        textStatus: medsCount.taken === medsCount.total ? 'Complete' : 'Pending'
      },
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
    ];
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
