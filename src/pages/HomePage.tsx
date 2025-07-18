
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

const HomePage = () => {
  const { userProfile } = useAuth();
  const { pendingRequestsForPatient } = usePatientCaregivers();

  if (!userProfile) {
    return (
      <SafeAreaContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <div className="space-y-6 pb-20">
        <HomeHeader />
        
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
        <WellnessRing />
        <SmartBannersSection />
        <MedicationSection />
        <TodaysFocusCard />
        <InsightsSection />
      </div>
      
      <AIAssistantFAB />
    </SafeAreaContainer>
  );
};

export default HomePage;
