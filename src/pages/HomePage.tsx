import React, { useState } from 'react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import SmartBannersSection from '../components/SmartBannersSection';
import MedicationSection from '../components/MedicationSection';
import InsightsSection from '../components/InsightsSection';
import EmptyState from '../components/EmptyState';
import HomeHeader from '../components/HomeHeader';
import AIAssistantFAB from '../components/AIAssistantFAB';
import EnhancedFloatingHelpButton from '../components/EnhancedFloatingHelpButton';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { Activity } from 'lucide-react';
import { getCopyForRole } from '../utils/roleBasedCopy';

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

  // Calculate wellness status and score
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  
  const calculateWellnessScore = () => {
    if (totalMeds === 0) return 85; // Default good score
    const medScore = (takenMeds / totalMeds) * 60; // 60% weight for medications
    const symptomScore = 25; // Placeholder for symptom tracking
    const vitalScore = 15; // Placeholder for vitals
    return Math.round(medScore + symptomScore + vitalScore);
  };

  const getWellnessStatus = () => {
    const score = calculateWellnessScore();
    if (score >= 80) return 'good';
    if (score >= 60) return 'attention';
    return 'urgent';
  };

  const wellnessScore = calculateWellnessScore();
  const wellnessStatus = getWellnessStatus();

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
    <div className="min-h-screen bg-ojas-bg-light">
      <SafeAreaContainer>
        {/* Enhanced Personalized Header with Role-Based Copy */}
        <HomeHeader userRole={userRole} />

        {/* Enhanced Interactive Wellness Ring with Progress Zones */}
        <div className="mb-12">
          <EnhancedWellnessRing
            status={wellnessStatus}
            medsCount={{ taken: takenMeds, total: totalMeds }}
            symptomsLogged={false}
            nextAppointment="June 15"
            score={wellnessScore}
          />
        </div>

        {/* Smart AI Banners */}
        <SmartBannersSection
          medications={medications}
          dismissedBanners={dismissedBanners}
          onDismissBanner={handleDismissBanner}
        />

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
      </SafeAreaContainer>

      {/* Enhanced Floating Action Buttons with Safe Area */}
      <AIAssistantFAB />
      <EnhancedFloatingHelpButton />
      
      {/* Symptom Log FAB - Keep existing functionality */}
      <div className="fixed bottom-28 right-20 z-40">
        <button
          onClick={handleSymptomLog}
          className="w-12 h-12 bg-ojas-calming-green text-white rounded-full shadow-ojas-medium flex items-center justify-center transition-all duration-200 hover:bg-ojas-calming-green-hover hover:scale-105 active:scale-95 border-2 border-white dark:border-ojas-charcoal-gray"
          aria-label="Log symptoms"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <Activity className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
