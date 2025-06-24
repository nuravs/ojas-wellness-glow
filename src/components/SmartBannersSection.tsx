
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
  const pendingMeds = medications.filter(med => !med.taken);

  // Generate smart banners based on current state
  const getSmartBanners = () => {
    const banners = [];
    
    // Missed dose banner
    if (pendingMeds.length > 0) {
      const overdueMeds = pendingMeds.filter(med => {
        const now = new Date();
        const medTime = new Date();
        const [hours] = med.time.split(':');
        medTime.setHours(parseInt(hours), 0, 0, 0);
        return now > medTime;
      });
      
      if (overdueMeds.length > 0 && !dismissedBanners.has('missed-dose')) {
        banners.push({
          id: 'missed-dose',
          type: 'missed-dose' as const,
          title: 'Missed Medication',
          message: `You have ${overdueMeds.length} overdue medication${overdueMeds.length > 1 ? 's' : ''}. Tap to reschedule or mark as taken.`,
          actionText: 'Review Now',
          priority: 'high' as const,
          onAction: () => console.log('Navigate to medications')
        });
      }
    }
    
    // Symptom reminder banner
    if (!dismissedBanners.has('symptom-reminder')) {
      const today = new Date().toDateString();
      const lastLoggedToday = localStorage.getItem('lastSymptomLog') === today;
      
      if (!lastLoggedToday) {
        banners.push({
          id: 'symptom-reminder',
          type: 'symptom-reminder' as const,
          title: 'Symptom Check-in',
          message: 'No symptoms logged today. Recording how you feel helps your care team.',
          actionText: 'Log Symptoms',
          priority: 'medium' as const,
          onAction: () => console.log('Navigate to symptoms')
        });
      }
    }
    
    // Refill reminder (mock data)
    if (!dismissedBanners.has('refill-reminder')) {
      banners.push({
        id: 'refill-reminder',
        type: 'refill-needed' as const,
        title: 'Refill Needed Soon',
        message: 'Levodopa has 3 days remaining. Order your refill now to avoid running out.',
        actionText: 'Order Refill',
        priority: 'medium' as const,
        onAction: () => console.log('Navigate to pharmacy')
      });
    }
    
    return banners;
  };

  const smartBanners = getSmartBanners();

  if (smartBanners.length === 0) return null;

  return (
    <>
      {smartBanners.map(banner => (
        <SmartBanner
          key={banner.id}
          type={banner.type}
          title={banner.title}
          message={banner.message}
          actionText={banner.actionText}
          onAction={banner.onAction}
          onDismiss={() => onDismissBanner(banner.id)}
          priority={banner.priority}
        />
      ))}
    </>
  );
};

export default SmartBannersSection;
