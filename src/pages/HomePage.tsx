
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import HomeHeader from '@/components/HomeHeader';
import WellnessRing from '@/components/WellnessRing';
import SmartBannersSection from '@/components/SmartBannersSection';
import MedicationSection from '@/components/MedicationSection';
import InsightsSection from '@/components/InsightsSection';
import TodaysFocusCard from '@/components/TodaysFocusCard';
import AIAssistantFAB from '@/components/AIAssistantFAB';
import CaregiverDashboard from '@/components/caregivers/CaregiverDashboard';
import PatientApprovalCard from '@/components/caregivers/PatientApprovalCard';
import { usePatientCaregivers } from '@/hooks/usePatientCaregivers';
import { useMedications } from '@/hooks/useMedications';

const HomePage = () => {
  const { userProfile } = useAuth();
  const { pendingRequestsForPatient } = usePatientCaregivers();
  const { medications } = useMedications();

  if (!userProfile) {
    return (
      <SafeAreaContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </SafeAreaContainer>
    );
  }

  const handleMedicationToggle = async (id: string) => {
    // Implementation for medication toggle
    console.log('Toggle medication:', id);
  };

  const handleMedicationPostpone = async (id: string) => {
    // Implementation for medication postpone
    console.log('Postpone medication:', id);
  };

  const handleDismissBanner = (id: string) => {
    // Implementation for dismissing banner
    console.log('Dismiss banner:', id);
  };

  const handleDismissInsight = (id: string) => {
    // Implementation for dismissing insight
    console.log('Dismiss insight:', id);
  };

  return (
    <SafeAreaContainer>
      <div className="space-y-6 pb-20">
        <HomeHeader userRole={userProfile.role as 'patient' | 'caregiver'} />
        
        {/* Patient Approval Requests - Show only for patients with pending requests */}
        {userProfile.role === 'patient' && pendingRequestsForPatient.length > 0 && (
          <div className="space-y-4">
            {pendingRequestsForPatient.map((request) => (
              <PatientApprovalCard key={request.id} request={request} />
            ))}
          </div>
        )}

        {/* Caregiver Dashboard - Show only for caregivers */}
        {userProfile.role === 'caregiver' && (
          <CaregiverDashboard />
        )}

        {/* Regular Home Content */}
        <WellnessRing 
          status={{ 
            score: 75, 
            label: 'Good', 
            accessibilityLabel: 'Wellness score is 75 out of 100, which is good' 
          }}
          medsCount={medications?.length || 0}
          symptomsLogged={0}
        />
        <SmartBannersSection 
          medications={medications || []}
          dismissedBanners={[]}
          onDismissBanner={handleDismissBanner}
        />
        <MedicationSection 
          medications={medications || []}
          onToggleMedication={handleMedicationToggle}
          onPostponeMedication={handleMedicationPostpone}
        />
        <TodaysFocusCard />
        <InsightsSection 
          dismissedInsights={new Set()}
          onDismissInsight={handleDismissInsight}
        />
      </div>
      
      <AIAssistantFAB />
    </SafeAreaContainer>
  );
};

export default HomePage;
