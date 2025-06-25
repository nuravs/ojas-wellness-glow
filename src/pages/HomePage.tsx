
import React, { useState } from 'react';
import WellnessRing from '../components/WellnessRing';
import SmartBannersSection from '../components/SmartBannersSection';
import MedicationSection from '../components/MedicationSection';
import InsightsSection from '../components/InsightsSection';
import EmptyState from '../components/EmptyState';
import HomeHeader from '../components/HomeHeader';
import { Activity } from 'lucide-react';

interface HomePageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  userRole: 'patient' | 'caregiver';
}

const HomePage: React.FC<HomePageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  userRole
}) => {
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());

  // Calculate wellness status
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  
  const getWellnessStatus = () => {
    if (totalMeds === 0) return 'good';
    if (takenMeds === totalMeds) return 'good';
    const pendingMeds = medications.filter(med => !med.taken);
    if (pendingMeds.length > 0) return 'attention';
    return 'good';
  };

  const handleDismissInsight = (id: string) => {
    setDismissedInsights(prev => new Set([...prev, id]));
  };

  const handleDismissBanner = (id: string) => {
    setDismissedBanners(prev => new Set([...prev, id]));
  };

  const handleSymptomLog = () => {
    console.log('Open symptom logging');
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light pb-24">
      <div className="max-w-md mx-auto px-6 py-10">
        {/* Enhanced Personalized Header with Ojas Branding */}
        <HomeHeader userRole={userRole} />

        {/* Enhanced Interactive Wellness Halo */}
        <div className="mb-12">
          <WellnessRing
            status={getWellnessStatus()}
            medsCount={{ taken: takenMeds, total: totalMeds }}
            symptomsLogged={false}
            nextAppointment="June 15"
          />
        </div>

        {/* Smart AI Banners */}
        <SmartBannersSection
          medications={medications}
          dismissedBanners={dismissedBanners}
          onDismissBanner={handleDismissBanner}
        />

        {/* Fixed Floating Action Button - Increased bottom spacing */}
        <div className="fixed bottom-36 right-6 z-40">
          <button
            onClick={handleSymptomLog}
            className="ojas-fab"
            aria-label="Log symptoms"
          >
            <Activity className="w-9 h-9" />
          </button>
        </div>

        {/* Medication Sections */}
        <MedicationSection
          medications={medications}
          onToggleMedication={onToggleMedication}
          onPostponeMedication={onPostponeMedication}
        />

        {/* Enhanced Wellness Insights */}
        <InsightsSection
          dismissedInsights={dismissedInsights}
          onDismissInsight={handleDismissInsight}
        />

        {/* Enhanced Empty State */}
        {medications.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};

export default HomePage;
