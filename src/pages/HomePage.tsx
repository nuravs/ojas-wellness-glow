
import React, { useState } from 'react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import TodaysActionSummary from '../components/TodaysActionSummary';
import HomeHeader from '../components/HomeHeader';
import AIAssistantFAB from '../components/AIAssistantFAB';
import EnhancedFloatingHelpButton from '../components/EnhancedFloatingHelpButton';
import CoachMark from '../components/CoachMark';
import SafeAreaContainer from '../components/SafeAreaContainer';

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

  const handleViewAllActions = () => {
    console.log('Navigate to detailed actions view');
  };

  const handleWellnessExpand = () => {
    console.log('Navigate to trends and detailed wellness view');
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32 px-grid-16">
        <SafeAreaContainer>
          {/* Enhanced Personalized Header with Role-Based Copy */}
          <HomeHeader userRole={userRole} />

          {/* Enhanced Interactive Wellness Ring with Progress Zones */}
          <div className="mb-8 relative">
            <EnhancedWellnessRing
              status={wellnessStatus}
              medsCount={{ taken: takenMeds, total: totalMeds }}
              symptomsLogged={false}
              nextAppointment="June 15"
              score={wellnessScore}
              userRole={userRole}
              onExpand={handleWellnessExpand}
            />
            
            {/* Coach Mark for Ring Interaction */}
            <CoachMark
              id="wellness-ring-tap"
              message="Tap the ring to see your detailed health overview"
              position={{
                top: '50%',
                right: '-220px'
              }}
            />
          </div>

          {/* Today's Action Summary - Compact */}
          <div className="mb-8">
            <TodaysActionSummary 
              medsCount={{ taken: takenMeds, total: totalMeds }}
              symptomsLogged={false}
              nextAppointment="June 15"
              userRole={userRole}
              onViewAll={handleViewAllActions}
            />
          </div>

          {/* Show only urgent medications on home screen */}
          {medications.filter(med => !med.taken).length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
                Medication Reminders
              </h2>
              <div className="space-y-4">
                {medications.filter(med => !med.taken).slice(0, 2).map(medication => (
                  <div key={medication.id} className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-grid-16">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">{medication.name}</h3>
                        <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">{medication.dosage} • {medication.time}</p>
                      </div>
                      <button
                        onClick={() => onToggleMedication(medication.id)}
                        className="px-4 py-2 bg-ojas-primary text-white rounded-xl font-medium hover:bg-ojas-primary-hover transition-colors duration-200 active:scale-95"
                        style={{ minHeight: '44px', minWidth: '44px' }}
                      >
                        Mark Taken
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SafeAreaContainer>
      </div>

      {/* Enhanced Floating Action Buttons with Safe Area - Only 2 FABs */}
      <AIAssistantFAB />
      <EnhancedFloatingHelpButton />
    </div>
  );
};

export default HomePage;
