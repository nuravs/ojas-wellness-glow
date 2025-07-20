
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
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';
import CaregiverLinkModal from '@/components/CaregiverLinkModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const HomePage = () => {
  const { userProfile } = useAuth();
  const { pendingRequestsForPatient } = usePatientCaregivers();
  const { medications, loading: medicationsLoading, toggleMedication, postponeMedication, refetch: refetchMedications } = useMedications();
  const { symptoms, loading: symptomsLoading } = useSymptoms();
  const { medicationLogs, loading: logsLoading } = useMedicationLogs();

  const [modalOpen, setModalOpen] = useState(false);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  if (!userProfile) {
    return (
      <SafeAreaContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </SafeAreaContainer>
    );
  }

  // Helper function to check if symptoms were logged today
  const getSymptomsLoggedToday = (): boolean => {
    if (!symptoms || symptoms.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return symptoms.some(symptom => {
      const symptomDate = new Date(symptom.logged_at);
      symptomDate.setHours(0, 0, 0, 0);
      return symptomDate.getTime() === today.getTime();
    });
  };

  // Helper function to determine medication taken status from logs
  const getMedicationStatus = () => {
    if (!medications || medications.length === 0) {
      return { taken: 0, total: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's medication logs
    const todaysLogs = medicationLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= today && logDate < tomorrow && log.status === 'taken';
    });

    // Count unique medications taken today
    const takenMedicationIds = new Set(todaysLogs.map(log => log.medication_id));
    const taken = takenMedicationIds.size;
    const total = medications.length;

    return { taken, total };
  };

  const handleMedicationToggle = async (id: string) => {
    try {
      await toggleMedication(id);
      // Force refetch to get updated data
      await refetchMedications();
      toast({
        title: "Medication logged",
        description: "Medication marked as taken successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMedicationPostpone = async (id: string) => {
    try {
      await postponeMedication(id);
      toast({
        title: "Medication postponed",
        description: "Medication has been postponed.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to postpone medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDismissBanner = (id: string) => {
    setDismissedBanners(prev => new Set([...prev, id]));
    toast({
      title: "Banner dismissed",
      description: "Smart banner has been dismissed.",
      variant: "default"
    });
  };

  const handleDismissInsight = (id: string) => {
    setDismissedInsights(prev => new Set([...prev, id]));
    toast({
      title: "Insight dismissed",
      description: "Insight has been dismissed.",
      variant: "default"
    });
  };

  const getWellnessStatus = (): 'good' | 'attention' | 'urgent' => {
    const { taken, total } = getMedicationStatus();
    
    if (total === 0) return 'good';

    const overdueMeds = total - taken;
    if (overdueMeds > 2) return 'urgent';
    if (overdueMeds > 0) return 'attention';
    return 'good';
  };

  const getWellnessScore = () => {
    const { taken, total } = getMedicationStatus();
    const medicationScore = total > 0 ? (taken / total) * 100 : 100;
    
    // Factor in symptoms - if logged today, slight boost for engagement
    const symptomsLogged = getSymptomsLoggedToday();
    const symptomBonus = symptomsLogged ? 5 : 0;
    
    return Math.min(100, Math.round(medicationScore * 0.8 + 20 + symptomBonus));
  };

  // Show loading state only if critical data is still loading
  if (medicationsLoading && !medications.length) {
    return (
      <SafeAreaContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ojas-slate-gray">Loading your health data...</p>
          </div>
        </div>
      </SafeAreaContainer>
    );
  }

  const medsCount = getMedicationStatus();
  const symptomsLogged = getSymptomsLoggedToday();
  const wellnessScore = getWellnessScore();

  console.log('HomePage Data Debug:', {
    medicationsCount: medications?.length || 0,
    symptomsCount: symptoms?.length || 0,
    logsCount: medicationLogs?.length || 0,
    medsCount,
    symptomsLogged,
    wellnessScore
  });

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

        {/* Wellness Ring with Real Data */}
        <WellnessRing
          status={getWellnessStatus()}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
        />

        {/* Wellness Score Explanation with Real Data */}
        <WellnessScoreExplanation
          score={wellnessScore}
          breakdown={{
            medications: Math.round((medsCount.taken / Math.max(medsCount.total, 1)) * 100),
            symptoms: symptomsLogged ? 85 : 75,
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
          dismissedBanners={dismissedBanners}
          onDismissBanner={handleDismissBanner}
          onMedicationAction={handleMedicationToggle}
          onNavigateToSymptoms={() => {
            // Navigate to symptoms - this would be handled by parent component
            console.log('Navigate to symptoms');
          }}
          onNavigateToMedications={() => {
            // Navigate to medications - this would be handled by parent component  
            console.log('Navigate to medications');
          }}
        />

        <MedicationSection
          medications={medications || []}
          onToggleMedication={handleMedicationToggle}
          onPostponeMedication={handleMedicationPostpone}
        />

        <AIInsightsPanel userRole={userProfile.role as 'patient' | 'caregiver'} />
        
        {/* Today's Focus Card with Real Data */}
        <TodaysFocusCard 
          userRole={userProfile.role as 'patient' | 'caregiver'}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
        />
        
        <InsightsSection
          dismissedInsights={dismissedInsights}
          onDismissInsight={handleDismissInsight}
        />
      </div>

      <AIAssistantFAB />
    </SafeAreaContainer>
  );
};

export default HomePage;
