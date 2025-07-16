
import React, { useState } from 'react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import TodaysActionSummary from '../components/TodaysActionSummary';
import HomeHeader from '../components/HomeHeader';
import AIAssistantFAB from '../components/AIAssistantFAB';
import EnhancedFloatingHelpButton from '../components/EnhancedFloatingHelpButton';
import SafeAreaContainer from '../components/SafeAreaContainer';
import ComorbidityStatusSummary from '../components/ComorbidityStatusSummary';
import VitalsWidget from '../components/vitals/VitalsWidget';
import { useComorbidities } from '../hooks/useComorbidities';

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
  const { comorbidities } = useComorbidities();
  
  // Calculate wellness status and score with enhanced algorithm
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  
  const calculateWellnessScore = () => {
    if (totalMeds === 0 && comorbidities.length === 0) return 85; // Default good score
    
    // New scoring weights: Medication adherence (30%), Neurological symptoms (25%), Comorbidity management (25%), General wellness (20%)
    const medScore = totalMeds > 0 ? (takenMeds / totalMeds) * 30 : 30; // 30% weight for medications
    
    // Comorbidity management score (25% weight)
    let comorbidityScore = 25; // Default if no conditions
    if (comorbidities.length > 0) {
      const controlledConditions = comorbidities.filter(c => c.status === 'controlled').length;
      const monitoringConditions = comorbidities.filter(c => c.status === 'monitoring').length;
      const activeConditions = comorbidities.filter(c => c.status === 'active').length;
      
      // Score based on condition status: controlled = full points, monitoring = 70%, active = 40%
      const totalConditionScore = (controlledConditions * 1.0) + (monitoringConditions * 0.7) + (activeConditions * 0.4);
      comorbidityScore = (totalConditionScore / comorbidities.length) * 25;
    }
    
    const symptomScore = 20; // Placeholder for neurological symptoms (25% weight, reduced to 20% for now)
    const generalWellnessScore = 20; // Placeholder for general wellness (20% weight)
    
    return Math.round(medScore + comorbidityScore + symptomScore + generalWellnessScore);
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

  const handleNavigateToVitals = () => {
    console.log('Navigate to vitals page');
  };

  // Calculate comorbidity summary for dashboard
  const getComorbidityStatus = () => {
    const controlled = comorbidities.filter(c => c.status === 'controlled').length;
    const needsAttention = comorbidities.filter(c => c.status === 'active' || c.status === 'monitoring').length;
    return { controlled, needsAttention, total: comorbidities.length };
  };

  const comorbidityStatus = getComorbidityStatus();

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32">
        <SafeAreaContainer>
          {/* Enhanced Personalized Header with Role-Based Copy */}
          <HomeHeader userRole={userRole} />

          {/* Enhanced Interactive Wellness Ring with Comorbidity Integration */}
          <div className="mb-8 relative">
            <EnhancedWellnessRing
              status={wellnessStatus}
              medsCount={{ taken: takenMeds, total: totalMeds }}
              symptomsLogged={false}
              nextAppointment="June 15"
              score={wellnessScore}
              userRole={userRole}
              onExpand={handleWellnessExpand}
              comorbidityStatus={comorbidityStatus}
            />
          </div>

          {/* Comorbidity Status Summary */}
          {comorbidities.length > 0 && (
            <div className="mb-8">
              <ComorbidityStatusSummary 
                comorbidities={comorbidities}
                userRole={userRole}
              />
            </div>
          )}

          {/* Vitals Widget */}
          <div className="mb-8">
            <VitalsWidget 
              userRole={userRole}
              onNavigateToVitals={handleNavigateToVitals}
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
              comorbidityStatus={comorbidityStatus}
            />
          </div>

          {/* Show only urgent medications on home screen with condition indicators */}
          {medications.filter(med => !med.taken).length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
                Medication Reminders
              </h2>
              <div className="space-y-4">
                {medications.filter(med => !med.taken).slice(0, 2).map(medication => (
                  <div key={medication.id} className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-grid-16">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">{medication.name}</h3>
                        <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">{medication.dosage} • {medication.time}</p>
                        {/* Placeholder for condition tags - will be implemented in medication-condition linking */}
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
