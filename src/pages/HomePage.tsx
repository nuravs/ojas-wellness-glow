
import React, { useState } from 'react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import TodaysActionSummary from '../components/TodaysActionSummary';
import HomeHeader from '../components/HomeHeader';
import AIAssistantFAB from '../components/AIAssistantFAB';
import EnhancedFloatingHelpButton from '../components/EnhancedFloatingHelpButton';
import SafeAreaContainer from '../components/SafeAreaContainer';
import ComorbidityStatusSummary from '../components/ComorbidityStatusSummary';
import VitalsWidget from '../components/vitals/VitalsWidget';
import RefillAlertsSection from '../components/medication/RefillAlertsSection';
import { useComorbidities } from '../hooks/useComorbidities';
import { useSymptoms } from '../hooks/useSymptoms';
import { useAppointments } from '../hooks/useAppointments';
import { useVitals } from '../hooks/useVitals';
import { calculateWellnessScore } from '../utils/wellnessScore';
import { generateRefillAlerts } from '../utils/refillUtils';

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
  onNavigateToVitals?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  userRole,
  onNavigateToVitals
}) => {
  const { comorbidities } = useComorbidities();
  const { symptoms, getNeurologicalSymptoms, calculateAverageSeverity } = useSymptoms();
  const { getFormattedNextAppointment } = useAppointments();
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

  // Calculate refill alerts
  const refillAlerts = generateRefillAlerts(
    medications.map(med => ({
      id: med.id,
      name: med.name,
      pills_remaining: 30, // Placeholder - would come from database
      daily_consumption: 1, // Placeholder - would come from database
      next_refill_date: undefined
    }))
  );

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

  const handleNavigateToVitals = () => {
    if (onNavigateToVitals) {
      onNavigateToVitals();
    }
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
              symptomsLogged={symptoms.length > 0}
              nextAppointment={getFormattedNextAppointment()}
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

          {/* Refill Alerts */}
          {refillAlerts.length > 0 && (
            <div className="mb-8">
              <RefillAlertsSection 
                refillAlerts={refillAlerts}
                onRefillAction={handleRefillRequested}
                onDismissRefill={(id) => console.log('Dismiss refill alert:', id)}
              />
            </div>
          )}

          {/* Today's Action Summary - Compact */}
          <div className="mb-8">
            <TodaysActionSummary 
              medsCount={{ taken: takenMeds, total: totalMeds }}
              symptomsLogged={symptoms.length > 0}
              nextAppointment={getFormattedNextAppointment()}
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
