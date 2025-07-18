import React, { useState } from 'react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import TodaysActionSummary from '../components/TodaysActionSummary';
import TodaysFocusCard from '../components/TodaysFocusCard';
import ContextualSupportBanner from '../components/ContextualSupportBanner';
import HomeHeader from '../components/HomeHeader';
import AIAssistantFAB from '../components/AIAssistantFAB';
import EnhancedFloatingHelpButton from '../components/EnhancedFloatingHelpButton';
import SafeAreaContainer from '../components/SafeAreaContainer';
import ComorbidityStatusSummary from '../components/ComorbidityStatusSummary';
import VitalsWidget from '../components/vitals/VitalsWidget';
import RefillAlertsSection from '../components/medication/RefillAlertsSection';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { useComorbidities } from '../hooks/useComorbidities';
import { useSymptoms } from '../hooks/useSymptoms';
import { useAppointments } from '../hooks/useAppointments';
import { useVitals } from '../hooks/useVitals';
import { calculateWellnessScore } from '../utils/wellnessScore';
import { Plus, Calendar, Activity, Heart } from 'lucide-react';

interface HomePageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    medication_id?: string;
    caregiver_visible?: boolean;
    logged_by?: string;
    logged_by_role?: 'patient' | 'caregiver';
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  userRole: 'patient' | 'caregiver';
  onNavigateToHealthLog?: () => void;
  onNavigateToSupportGroups?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  userRole,
  onNavigateToHealthLog,
  onNavigateToSupportGroups
}) => {
  const { comorbidities } = useComorbidities();
  const { symptoms, getNeurologicalSymptoms, calculateAverageSeverity } = useSymptoms();
  const { appointments, getFormattedNextAppointment } = useAppointments();
  const { vitals } = useVitals();
  
  // Calculate wellness status and score with real data integration
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  
  // Real wellness score calculation using integrated data
  const getWellnessScore = () => {
    // Transform data for wellness score calculation
    const medicationLogs = medications.map(med => ({
      status: med.taken ? 'taken' : 'pending',
      created_at: new Date().toISOString()
    }));

    const wellnessData = {
      medications: medications.map(med => ({
        id: med.medication_id || med.id,
        name: med.name,
        dosage: med.dosage,
        frequency: { times_per_day: 1 },
        active: true,
        user_id: '',
        instructions: '',
        created_at: '',
        updated_at: ''
      })),
      medicationLogs,
      comorbidities: comorbidities.map(c => ({
        ...c,
        updated_at: c.updated_at
      })),
      vitals: vitals.map(v => ({
        ...v,
        measured_at: v.measured_at
      })),
      symptoms: symptoms.map(s => ({
        ...s,
        logged_at: s.logged_at
      }))
    };

    try {
      const score = calculateWellnessScore(wellnessData);
      return score.overall;
    } catch (error) {
      console.error('Error calculating wellness score:', error);
      // Fallback to simple calculation
      return getSimpleWellnessScore();
    }
  };

  const getSimpleWellnessScore = () => {
    if (totalMeds === 0 && comorbidities.length === 0) return 85;
    
    const medScore = totalMeds > 0 ? (takenMeds / totalMeds) * 30 : 30;
    
    let comorbidityScore = 25;
    if (comorbidities.length > 0) {
      const controlledConditions = comorbidities.filter(c => c.status === 'controlled').length;
      const monitoringConditions = comorbidities.filter(c => c.status === 'monitoring').length;
      const activeConditions = comorbidities.filter(c => c.status === 'active').length;
      
      const totalConditionScore = (controlledConditions * 1.0) + (monitoringConditions * 0.7) + (activeConditions * 0.4);
      comorbidityScore = (totalConditionScore / comorbidities.length) * 25;
    }
    
    // Real symptom scoring
    const recentNeurologicalSymptoms = getNeurologicalSymptoms();
    const avgSeverity = calculateAverageSeverity(recentNeurologicalSymptoms);
    const symptomScore = Math.max(0, 25 - (avgSeverity * 2.5));
    
    // Vitals scoring (20% weight)
    const recentVitals = vitals.filter(v => {
      const vitalDate = new Date(v.measured_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return vitalDate >= sevenDaysAgo;
    });
    
    const outOfRangeVitals = recentVitals.filter(v => v.out_of_range).length;
    const vitalsScore = recentVitals.length > 0 ? 
      Math.max(0, 20 - ((outOfRangeVitals / recentVitals.length) * 20)) : 15;
    
    return Math.round(medScore + comorbidityScore + symptomScore + vitalsScore);
  };

  const getWellnessStatus = () => {
    const score = getWellnessScore();
    if (score >= 80) return 'good';
    if (score >= 60) return 'attention';
    return 'urgent';
  };

  const wellnessScore = getWellnessScore();
  const wellnessStatus = getWellnessStatus();

  // Mock refill alerts for now - will be replaced with real data when medication table is updated
  const refillAlerts = [
    {
      id: 'alert-1',
      medicationName: 'Levodopa',
      daysLeft: 3,
      pillsRemaining: 9,
      nextRefillDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      urgency: 'high' as const
    }
  ];

  const handleRefillRequested = (medicationId: string) => {
    console.log('Refill requested for medication:', medicationId);
    // TODO: Implement refill request functionality
  };

  const handleViewAllActions = () => {
    console.log('Navigate to detailed actions view');
  };

  const handleWellnessExpand = () => {
    console.log('Navigate to trends and detailed wellness view');
  };

  const handleNavigateToHealthLog = () => {
    if (onNavigateToHealthLog) {
      onNavigateToHealthLog();
    }
  };

  // Get today's appointment if any
  const getTodaysAppointment = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return appointments.find(apt => 
      apt.appointment_date === todayString && 
      apt.status === 'scheduled'
    );
  };

  // Get overdue medications
  const getOverdueMedications = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return medications.filter(med => {
      if (med.taken) return false;
      
      const [hours, minutes] = med.time.split(':').map(Number);
      const medTime = hours * 60 + minutes;
      
      return medTime < currentTime;
    }).map(med => ({
      name: med.name,
      time: med.time
    }));
  };

  // Calculate comorbidity summary for dashboard
  const getComorbidityStatus = () => {
    const controlled = comorbidities.filter(c => c.status === 'controlled').length;
    const needsAttention = comorbidities.filter(c => c.status === 'active' || c.status === 'monitoring').length;
    return { controlled, needsAttention, total: comorbidities.length };
  };

  const comorbidityStatus = getComorbidityStatus();

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32">
        <SafeAreaContainer>
          {/* New Header Design */}
          <div className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                  Good morning, Sarah
                </h1>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {currentDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white dark:bg-ojas-charcoal-gray shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray flex items-center justify-center">
                  <div className="w-2 h-2 bg-ojas-primary rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Wellness Ring - Same Size */}
          <div className="mb-8 relative">
            <EnhancedWellnessRing
              status={wellnessStatus}
              medsCount={{ taken: takenMeds, total: totalMeds }}
              symptomsLogged={symptoms.length > 0}
              nextAppointment={getFormattedNextAppointment()}
              score={wellnessScore}
              userRole={userRole}
              onExpand={handleWellnessExpand}
              comorbidityStatus={comorbidityStatus}
            />
          </div>

          {/* AI Insights Panel - Enhanced Design */}
          <div className="mb-6">
            <AIInsightsPanel userRole={userRole} />
          </div>

          {/* Today's Actions - Streamlined */}
          <div className="mb-6">
            <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  Today's Actions
                </h3>
                <button className="text-ojas-primary text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-ojas-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      Medications
                    </p>
                    <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      {takenMeds} of {totalMeds} taken today
                    </p>
                  </div>
                  <div className="text-xs text-ojas-primary font-medium">
                    {totalMeds - takenMeds} pending
                  </div>
                </div>

                {getTodaysAppointment() && (
                  <div className="flex items-center gap-3 p-3 bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-ojas-calming-green/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-ojas-calming-green" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                        Appointment Today
                      </p>
                      <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                        {getTodaysAppointment()?.appointment_time} with {getTodaysAppointment()?.doctor_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest Vitals - Enhanced */}
          <div className="mb-6">
            <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  Latest Vitals
                </h3>
                <button 
                  onClick={handleNavigateToHealthLog}
                  className="text-ojas-primary text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              <VitalsWidget 
                userRole={userRole}
                onNavigateToVitals={handleNavigateToHealthLog}
              />
              
              {/* Add Vital Button */}
              <button 
                onClick={handleNavigateToHealthLog}
                className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-ojas-border dark:border-ojas-slate-gray rounded-xl text-ojas-text-secondary dark:text-ojas-cloud-silver hover:border-ojas-primary hover:text-ojas-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Vital Reading</span>
              </button>
            </div>
          </div>

          {/* Contextual Support Banner - Only show if needed */}
          {onNavigateToSupportGroups && wellnessScore < 70 && (
            <div className="mb-8">
              <ContextualSupportBanner
                userRole={userRole}
                wellnessScore={wellnessScore}
                recentSymptoms={symptoms.slice(0, 5)}
                onNavigateToSupport={onNavigateToSupportGroups}
              />
            </div>
          )}

          {/* Refill Alerts - Only if present */}
          {refillAlerts.length > 0 && (
            <div className="mb-8">
              <RefillAlertsSection 
                refillAlerts={refillAlerts}
                onRefillAction={handleRefillRequested}
                onDismissRefill={(id) => console.log('Dismiss refill alert:', id)}
              />
            </div>
          )}
        </SafeAreaContainer>
      </div>

      {/* Enhanced Floating Action Buttons */}
      <AIAssistantFAB />
      <EnhancedFloatingHelpButton />
    </div>
  );
};

export default HomePage;
