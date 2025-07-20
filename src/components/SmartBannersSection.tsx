
import React from 'react';
import SmartBanner from './SmartBanner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface SmartBannersSectionProps {
  medications: Medication[];
  dismissedBanners: Set<string>;
  onDismissBanner: (id: string) => void;
}

const SmartBannersSection: React.FC<SmartBannersSectionProps> = ({
  medications,
  dismissedBanners,
  onDismissBanner
}) => {
  // Generate smart banners based on medication status
  const generateBanners = () => {
    const banners: Array<{
      id: string;
      type: 'missed-dose' | 'symptom-reminder' | 'refill-needed' | 'appointment-reminder' | 'success';
      title: string;
      message: string;
      actionText?: string;
      onAction?: () => void;
    }> = [];

    // Check for overdue medications
    const overdueMeds = medications.filter(med => {
      if (med.taken) return false;
      
      const medTime = new Date();
      const [hours, minutes] = med.time.split(':');
      medTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return medTime < new Date();
    });

    if (overdueMeds.length > 0 && !dismissedBanners.has('overdue-meds')) {
      banners.push({
        id: 'overdue-meds',
        type: 'missed-dose',
        title: 'Medication Reminder',
        message: `${overdueMeds.length} medication${overdueMeds.length > 1 ? 's' : ''} overdue. Take them now?`,
        actionText: 'View Medications',
        onAction: () => {
          // Navigate to medications page
          console.log('Navigate to medications');
        }
      });
    }

    // Check for no symptom logging today
    const today = new Date().toDateString();
    const lastSymptomLog = localStorage.getItem('lastSymptomLog');
    
    if (lastSymptomLog !== today && !dismissedBanners.has('log-symptoms')) {
      banners.push({
        id: 'log-symptoms',
        type: 'symptom-reminder',
        title: 'Track Your Health',
        message: 'Haven\'t logged symptoms today. How are you feeling?',
        actionText: 'Log Symptoms',
        onAction: () => {
          // Navigate to symptoms page
          console.log('Navigate to symptoms');
        }
      });
    }

    // Wellness tip banner
    if (!dismissedBanners.has('wellness-tip')) {
      const tips = [
        'Regular exercise can help manage Parkinson\'s symptoms effectively.',
        'Staying hydrated is important for medication absorption.',
        'Good sleep hygiene can improve overall health and wellness.',
        'Consider joining a support group to connect with others.'
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      banners.push({
        id: 'wellness-tip',
        type: 'success',
        title: 'Wellness Tip',
        message: randomTip,
        actionText: 'Learn More'
      });
    }

    return banners;
  };

  const banners = generateBanners();

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white px-4">
        Smart Reminders
      </h2>
      <div className="space-y-3 px-4">
        {banners.map(banner => (
          <SmartBanner
            key={banner.id}
            type={banner.type}
            title={banner.title}
            message={banner.message}
            actionText={banner.actionText}
            onAction={banner.onAction}
            onDismiss={() => onDismissBanner(banner.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartBannersSection;
