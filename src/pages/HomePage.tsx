import React, { useState } from 'react';
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
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import WellnessScoreExplanation from '@/components/insights/WellnessScoreExplanation';
import { usePatientCaregivers } from '@/hooks/usePatientCaregivers';
import { useMedications } from '@/hooks/useMedications';
import { CaregiverLinkModal } from '@/components/CaregiverLinkModal';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { userProfile } = useAuth();
  const { pendingRequestsForPatient } = usePatientCaregivers();
  const { medications } = useMedications();

  const [modalOpen, setModalOpen] = useState(false);

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
    console.log('Toggle medication:', id);
  };

  const handleMedicationPostpone = async (id: string) => {
    console.log('Postpone medication:', id);
  };

  const handleDismissBanner = (id: string) => {
    console.log('Dismiss banner:', id);
  };

  const handleDismissInsight = (id: string) => {
    console.log('Dismiss insight:', id);
  };

  const getWellnessStatus = (): 'good' | 'attention' | 'urgent' => {
    if (!medications || medications.length === 0) return 'good';

    const overdueMeds = medications.filter(med => !med.taken);
    if (overdueMeds.length > 2) return 'urgent';
    if (overdueMeds.length > 0) return 'attention';
    return 'good';
  };

  const getMedsCount = () => {
    if (!medications || medications.length === 0) {
      return { taken: 0, total: 0 };
    }

    const taken = medications.filter(med => med.taken).length;
    const total = medications.length;
    return { taken, total };
  };

  const getWellnessScore = () => {
    const { taken, total } = getMedsCount();
    const medicationScore = total > 0 ? (taken / total) * 100 : 100;
    return Math.round(medicationScore * 0.8 + 20);
  };

  const wellnessScore = getWellnessScore();

  return (
    <SafeAreaContainer>
      <div className="space-y-6 pb-20">
        <HomeHeader userRole={userProfile.role as 'patient' | 'caregiver'} />

        {/* Patient Approval Requests */}
        {userProfile.role === 'patient' && pendingRequestsForPatient.length > 0 && (
          <div className="space-y-4">
            {pendingRequestsForPatient.map((request) => (
              <PatientApprovalCard key={request.id} request={request} />
            ))}
          </div>
        )}

        {/* Caregiver Dashboard */}
        {userProfile.role === 'caregiver' && (
          <CaregiverDashboard />
        )}

        {/* Link Caregiver Button (Only for Patients) */}
        {userProfile.role === 'patient' && (
          <div className="flex justify-end px-4">
            <Button onClick={() => setModalOpen(true)}>Link Caregiver</Button>
          </div>
        )}

        {/* Caregiver Modal */}
        <CaregiverLinkModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* Wellness Ring */}
        <WellnessRing
          status={getWellnessStatus()}
          medsCount={getMedsCount()}
          symptomsLogged={false}
        />

        {/* Wellness Score Explanation */}
        <WellnessScoreExplanation
          score={wellnessScore}
          breakdown={{
            medications: Math.round((getMedsCount().taken / Math.max(getMedsCount().total, 1)) * 100),
            symptoms: 75,
            vitals: 85,
            events: 90,
            activities: 60
          }}
          trends={{
            direction: wellnessScore > 70 ? 'up' : wellnessScore < 50 ? 'down' : 'stable',
            change: Math.floor(Math.random() * 10) - 5,
            period: 'last week'
          }}
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

        <AIInsightsPanel userRole={userProfile.role as 'patient' | 'caregiver'} />
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
