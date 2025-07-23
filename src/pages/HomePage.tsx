
import React from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useAuth } from '../contexts/AuthContext';
import SafeAreaContainer from '../components/SafeAreaContainer';
import HomePageHeader from '../components/homepage/HomePageHeader';
import WellnessSection from '../components/homepage/WellnessSection';
import AIInsightsSection from '../components/homepage/AIInsightsSection';
import DailyEducationCard from '../components/homepage/DailyEducationCard';
import DailyBrainExercise from '../components/homepage/DailyBrainExercise';
import ComorbiditiesStatusWidget from '../components/homepage/ComorbiditiesStatusWidget';
import SecondaryActionsSection from '../components/homepage/SecondaryActionsSection';
import EmergencyButton from '../components/EmergencyButton';
import { LiveRegion } from '../components/ui/enhanced-accessibility';
import { useHealthData } from '../hooks/useHealthData';
import { useMedications } from '../hooks/useMedications';
import { useSymptoms } from '../hooks/useSymptoms';
import { useVitals } from '../hooks/useVitals';
import { useMedicationLogs } from '../hooks/useMedicationLogs';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, userProfile } = useAuth();
  const { wellnessScore, todaysFocus, lastUpdated } = useHealthStore();
  const { medications } = useMedications();
  const { symptoms } = useSymptoms();
  const { vitals } = useVitals();
  const { medicationLogs } = useMedicationLogs();
  const navigate = useNavigate();
  
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

  const handleNavigateToEducation = () => {
    navigate('/wellness-center');
  };

  const handleNavigateToBrainGym = () => {
    navigate('/brain-gym');
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
            {/* Central wellness ring - Primary Feature */}
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
            
            {/* AI Insights - Moved up for priority */}
            <div className="px-0">
              <AIInsightsSection
                medications={medications}
                vitals={vitals}
                symptoms={symptoms}
                medicationLogs={medicationLogs}
                userRole={userRole}
                onViewAll={() => navigate('/more')}
              />
            </div>

            {/* Health Conditions Status - Important for neurological patients */}
            <ComorbiditiesStatusWidget userRole={userRole} />
            
            {/* Educational Content - Core PRD feature */}
            <DailyEducationCard 
              userRole={userRole}
              onViewMore={handleNavigateToEducation}
            />
            
            {/* Daily Brain Exercise - Core PRD feature */}
            <DailyBrainExercise userRole={userRole} />
            
            {/* Streamlined Secondary Actions - Reduced redundancy */}
            <SecondaryActionsSection
              medsCount={medsCount}
              symptomsLogged={symptomsLogged}
              vitals={vitals}
              userRole={userRole}
            />
          </div>
        </main>

        {/* Emergency Button - Always visible for safety */}
        <EmergencyButton />
      </div>
    </SafeAreaContainer>
  );
};

export default HomePage;
