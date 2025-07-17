
import React, { useState } from 'react';
import { Settings, ChevronRight, Plus } from 'lucide-react';
import EnhancedWellnessRing from '../components/EnhancedWellnessRing';
import TodaysActionSummary from '../components/TodaysActionSummary';
import TodaysFocusCard from '../components/TodaysFocusCard';
import ContextualSupportBanner from '../components/ContextualSupportBanner';
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
  
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  
  const getWellnessScore = () => {
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
      return getSimpleWellnessScore();
    }
  };

  const getSimpleWellnessScore = () => {
    if (totalMeds === 0 && comorbidities.length === 0) return 75;
    
    const medScore = totalMeds > 0 ? (takenMeds / totalMeds) * 30 : 30;
    
    let comorbidityScore = 25;
    if (comorbidities.length > 0) {
      const controlledConditions = comorbidities.filter(c => c.status === 'controlled').length;
      const monitoringConditions = comorbidities.filter(c => c.status === 'monitoring').length;
      const activeConditions = comorbidities.filter(c => c.status === 'active').length;
      
      const totalConditionScore = (controlledConditions * 1.0) + (monitoringConditions * 0.7) + (activeConditions * 0.4);
      comorbidityScore = (totalConditionScore / comorbidities.length) * 25;
    }
    
    const recentNeurologicalSymptoms = getNeurologicalSymptoms();
    const avgSeverity = calculateAverageSeverity(recentNeurologicalSymptoms);
    const symptomScore = Math.max(0, 25 - (avgSeverity * 2.5));
    
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

  const getTodaysAppointment = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return appointments.find(apt => 
      apt.appointment_date === todayString && 
      apt.status === 'scheduled'
    );
  };

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

  const getComorbidityStatus = () => {
    const controlled = comorbidities.filter(c => c.status === 'controlled').length;
    const needsAttention = comorbidities.filter(c => c.status === 'active' || c.status === 'monitoring').length;
    return { controlled, needsAttention, total: comorbidities.length };
  };

  const comorbidityStatus = getComorbidityStatus();

  return (
    <div className="min-h-screen bg-ojas-bg-light">
      <div className="overflow-y-auto pb-32">
        <SafeAreaContainer>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-6">
            <h1 className="text-2xl font-semibold text-ojas-text-main">
              Hi, Sarah
            </h1>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Settings className="w-6 h-6 text-ojas-text-secondary" />
            </button>
          </div>

          {/* Wellness Ring */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
              <h2 className="text-lg font-semibold text-ojas-text-main mb-4">Wellness Ring</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#E1E4EA"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#0077B6"
                      strokeWidth="8"
                      strokeDasharray={`${(wellnessScore / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-ojas-text-main">{wellnessScore}</div>
                      <div className="text-xs text-ojas-text-secondary">Daily Health Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-ojas-soft overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
                  <p className="text-sm text-gray-200">
                    Your sleep quality has been lower than usual. Consider adjusting your evening routine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
              <h3 className="text-lg font-semibold text-ojas-text-main mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  style={{ minHeight: '44px' }}
                >
                  <span className="text-ojas-text-main">Medications to take</span>
                  <ChevronRight className="w-5 h-5 text-ojas-text-secondary" />
                </button>
                <button 
                  onClick={onNavigateToHealthLog}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  style={{ minHeight: '44px' }}
                >
                  <span className="text-ojas-text-main">Log Symptoms</span>
                  <ChevronRight className="w-5 h-5 text-ojas-text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-ojas-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ojas-text-main">Vitals</h3>
                <button 
                  onClick={onNavigateToHealthLog}
                  className="text-sm text-ojas-primary font-medium"
                >
                  Quick Add
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-ojas-text-main font-medium">Blood Pressure</div>
                    <div className="text-sm text-ojas-text-secondary">Last Reading: 120/80</div>
                  </div>
                  <button 
                    className="px-3 py-1 text-sm text-ojas-primary border border-ojas-primary rounded-lg hover:bg-ojas-primary hover:text-white transition-colors"
                    style={{ minHeight: '32px' }}
                  >
                    Quick Add
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-ojas-text-main font-medium">Heart Rate</div>
                    <div className="text-sm text-ojas-text-secondary">Last Reading: 72 bpm</div>
                  </div>
                  <button 
                    className="px-3 py-1 text-sm text-ojas-primary border border-ojas-primary rounded-lg hover:bg-ojas-primary hover:text-white transition-colors"
                    style={{ minHeight: '32px' }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Support Banner */}
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
        </SafeAreaContainer>
      </div>

      {/* Floating Action Buttons */}
      <AIAssistantFAB />
      <EnhancedFloatingHelpButton />
    </div>
  );
};

export default HomePage;
