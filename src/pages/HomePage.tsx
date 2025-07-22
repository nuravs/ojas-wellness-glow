
import React from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useAuth } from '../contexts/AuthContext';
import SafeAreaContainer from '../components/SafeAreaContainer';
import HomePageHeader from '../components/homepage/HomePageHeader';
import WellnessSection from '../components/homepage/WellnessSection';
import { TodaysFocusSection } from '../components/homepage/TodaysFocusSection';
import TodaysActionsSection from '../components/homepage/TodaysActionsSection';
import SecondaryActionsSection from '../components/homepage/SecondaryActionsSection';
import CollapsibleInsightsSection from '../components/homepage/CollapsibleInsightsSection';
import { LiveRegion } from '../components/ui/enhanced-accessibility';
import { useHealthData } from '../hooks/useHealthData';
import { useMedications } from '../hooks/useMedications';
import { useSymptoms } from '../hooks/useSymptoms';
import { useVitals } from '../hooks/useVitals';
import { useMedicationLogs } from '../hooks/useMedicationLogs';

const HomePage = () => {
  const { user, userProfile } = useAuth();
  const { wellnessScore, todaysFocus, lastUpdated } = useHealthStore();
  const { medications } = useMedications();
  const { symptoms } = useSymptoms();
  const { vitals } = useVitals();
  const { medicationLogs } = useMedicationLogs();
  
  // Initialize health data
  useHealthData();
  
  const userRole = userProfile?.role as 'patient' | 'caregiver' || 'patient';

  // Calculate medication counts for wellness section
  const today = new Date().toISOString().split('T')[0];
  const takenToday = medicationLogs.filter(log => 
    log.status === 'taken' && log.created_at?.startsWith(today)
  ).length;
  
  const medsCount = {
    taken: takenToday,
    total: medications.filter(med => med.active).length
  };

  // Check if symptoms were logged today
  const symptomsLogged = symptoms.some(symptom => 
    symptom.logged_at?.startsWith(today)
  );

  const handleMedicationAction = (id: string) => {
    // TODO: Implement medication action
    console.log('Medication action:', id);
  };

  const handleLogSymptom = () => {
    // TODO: Navigate to symptom logging
    console.log('Log symptom');
  };

  const handleViewMedications = () => {
    // TODO: Navigate to medications page
    console.log('View medications');
  };

  return (
    <SafeAreaContainer>
      <div className="flex flex-col min-h-screen bg-ojas-bg-light">
        <HomePageHeader userProfile={userProfile} />
        
        <main className="flex-1 px-4 pb-24">
          <LiveRegion 
            message={`Wellness score updated to ${wellnessScore}%`}
            priority="polite"
          />
          
          <div className="space-y-6">
            {/* Central wellness ring */}
            <WellnessSection
              score={wellnessScore}
              status={wellnessScore >= 80 ? 'good' : wellnessScore >= 60 ? 'attention' : 'urgent'}
              medsCount={medsCount}
              symptomsLogged={symptomsLogged}
              vitals={vitals}
              symptoms={symptoms}
              medications={medications}
              medicationLogs={medicationLogs}
              userRole={userRole}
            />
            
            {/* Today's focus */}
            <TodaysFocusSection />
            
            {/* Quick actions */}
            <TodaysActionsSection
              medications={medications}
              medsCount={medsCount}
              symptomsLogged={symptomsLogged}
              onMedicationAction={handleMedicationAction}
              onLogSymptom={handleLogSymptom}
              onViewMedications={handleViewMedications}
            />
            
            {/* Secondary actions */}
            <SecondaryActionsSection />
            
            {/* Collapsible insights */}
            <CollapsibleInsightsSection
              medications={medications}
              vitals={vitals}
              symptoms={symptoms}
              medicationLogs={medicationLogs}
              userRole={userRole}
            />
          </div>
        </main>
      </div>
    </SafeAreaContainer>
  );
};

export default HomePage;
