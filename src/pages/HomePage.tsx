
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { usePatientCaregivers } from '@/hooks/usePatientCaregivers';
import { useMedications } from '@/hooks/useMedications';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';
import { useVitals } from '@/hooks/useVitals';
import CaregiverLinkModal from '@/components/CaregiverLinkModal';
import PatientApprovalCard from '@/components/caregivers/PatientApprovalCard';
import CaregiverDashboard from '@/components/caregivers/CaregiverDashboard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import HomePageHeader from '@/components/homepage/HomePageHeader';
import WellnessSection from '@/components/homepage/WellnessSection';
import AIInsightsSection from '@/components/homepage/AIInsightsSection';
import TodaysActionsSection from '@/components/homepage/TodaysActionsSection';
import LatestVitalsSection from '@/components/homepage/LatestVitalsSection';

const HomePage = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { pendingRequestsForPatient } = usePatientCaregivers();
  const { medications, loading: medicationsLoading, toggleMedication, postponeMedication, refetch: refetchMedications } = useMedications();
  const { symptoms, loading: symptomsLoading } = useSymptoms();
  const { medicationLogs, loading: logsLoading } = useMedicationLogs();
  const { vitals } = useVitals();

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

  const getWellnessScore = () => {
    const { taken, total } = getMedicationStatus();
    const medicationScore = total > 0 ? (taken / total) * 100 : 100;
    
    // Factor in symptoms - if logged today, slight boost for engagement
    const symptomsLogged = getSymptomsLoggedToday();
    const symptomBonus = symptomsLogged ? 5 : 0;
    
    return Math.min(100, Math.round(medicationScore * 0.8 + 20 + symptomBonus));
  };

  const getWellnessStatus = () => {
    const score = getWellnessScore();
    if (score >= 80) return 'good';
    if (score >= 60) return 'attention';
    return 'urgent';
  };

  // Navigation handlers
  const handleViewAllInsights = () => {
    navigate('/?tab=more');
  };

  const handleViewAllVitals = () => {
    navigate('/vitals');
  };

  const handleQuickAddVital = () => {
    navigate('/vitals?action=add');
  };

  const handleAddVitalReading = (vitalType: string) => {
    navigate(`/vitals?action=add&type=${vitalType}`);
  };

  const handleLogSymptom = () => {
    navigate('/symptoms');
  };

  const handleViewMedications = () => {
    // Navigate to medications tab in the main app
    navigate('/?tab=medications');
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
  const wellnessStatus = getWellnessStatus();

  return (
    <SafeAreaContainer>
      <div className="min-h-screen bg-ojas-bg-light pb-20">
        <HomePageHeader userProfile={userProfile} />

        {/* Patient Approval Requests */}
        {userProfile.role === 'patient' && pendingRequestsForPatient.length > 0 && (
          <div className="px-4 mb-6 space-y-4">
            {pendingRequestsForPatient.map((request) => (
              <PatientApprovalCard key={request.id} request={request} />
            ))}
          </div>
        )}

        {/* Caregiver Dashboard */}
        {userProfile.role === 'caregiver' && (
          <div className="mb-6">
            <CaregiverDashboard />
          </div>
        )}

        {/* Link Caregiver Button (Only for Patients) */}
        {userProfile.role === 'patient' && (
          <div className="px-4 mb-6 flex justify-end">
            <Button onClick={() => setModalOpen(true)}>Link Caregiver</Button>
          </div>
        )}

        {/* Caregiver Modal */}
        <CaregiverLinkModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* Wellness Section */}
        <WellnessSection 
          score={wellnessScore}
          status={wellnessStatus}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
        />

        {/* AI Insights Section */}
        <AIInsightsSection 
          medications={medications || []}
          vitals={vitals}
          symptoms={symptoms || []}
          userRole={userProfile.role as 'patient' | 'caregiver'}
          onViewAll={handleViewAllInsights}
        />

        {/* Today's Actions Section */}
        <TodaysActionsSection 
          medications={medications || []}
          medsCount={medsCount}
          symptomsLogged={symptomsLogged}
          onMedicationAction={handleMedicationToggle}
          onLogSymptom={handleLogSymptom}
          onViewMedications={handleViewMedications}
        />

        {/* Latest Vitals Section */}
        <LatestVitalsSection 
          vitals={vitals}
          userRole={userProfile.role as 'patient' | 'caregiver'}
          onViewAll={handleViewAllVitals}
          onQuickAdd={handleQuickAddVital}
          onAddReading={handleAddVitalReading}
        />
      </div>
    </SafeAreaContainer>
  );
};

export default HomePage;
