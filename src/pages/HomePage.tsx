
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

  // Calculate wellness status based on medications
  const getWellnessStatus = (): 'good' | 'attention' | 'urgent' => {
    if (!medications || medications.length === 0) return 'good';
    
    const overdueMeds = medications.filter(med => !med.taken);
    if (overdueMeds.length > 2) return 'urgent';
    if (overdueMeds.length > 0) return 'attention';
    return 'good';
  };

  // Calculate medication counts
  const getMedsCount = () => {
    if (!medications || medications.length === 0) {
      return { taken: 0, total: 0 };
    }
    
    const taken = medications.filter(med => med.taken).length;
    const total = medications.length;
    return { taken, total };
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
          status={getWellnessStatus()}
          medsCount={getMedsCount()}
          symptomsLogged={false}
        />
        <SmartBannersSection 
          medications={medications || []}
          dismissedBanners={new Set<string>()}
          onDismissBanner={handleDismissBanner}
        />
        <MedicationSection 
          medications={medications || []}
          onToggleMedication={handleMedicationToggle}
          onPostponeMedication={handleMedicationPostpone}
        />
        <TodaysFocusCard />
        <InsightsSection 
          dismissedInsights={new Set<string>()}
          onDismissInsight={handleDismissInsight}
        />
      </div>
      
      <AIAssistantFAB />
    </SafeAreaContainer>
  );
};

export default HomePage;
