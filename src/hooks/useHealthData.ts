
import { useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useMedications } from './useMedications';
import { useSymptoms } from './useSymptoms';
import { useVitals } from './useVitals';
import { calculateWellnessScore } from '../utils/wellnessScore';

export const useHealthData = () => {
  const {
    setWellnessScore,
    setTodaysFocus,
    setMedicationsPending,
    setSymptomsToday,
    setVitalsOutOfRange,
    updateLastUpdated,
  } = useHealthStore();

  const { medications, loading: medicationsLoading } = useMedications();
  const { symptoms, loading: symptomsLoading } = useSymptoms();
  const { vitals, loading: vitalsLoading } = useVitals();

  useEffect(() => {
    if (medicationsLoading || symptomsLoading || vitalsLoading) return;

    // Calculate wellness score
    const wellnessScore = calculateWellnessScore({
      medications,
      symptoms,
      vitals,
    });

    // Count pending medications
    const pendingMeds = medications.filter(med => 
      med.active && !med.taken_today
    ).length;

    // Count today's symptoms
    const today = new Date().toISOString().split('T')[0];
    const todaySymptoms = symptoms.filter(symptom => 
      symptom.logged_at.startsWith(today)
    ).length;

    // Count out-of-range vitals
    const outOfRangeVitals = vitals.filter(vital => 
      vital.out_of_range
    ).length;

    // Determine today's focus
    let todaysFocus = null;
    if (pendingMeds > 0) {
      todaysFocus = {
        title: `${pendingMeds} medication${pendingMeds > 1 ? 's' : ''} pending`,
        action: 'Take medications',
        priority: 'high' as const,
      };
    } else if (outOfRangeVitals > 0) {
      todaysFocus = {
        title: 'Monitor vitals',
        action: 'Check vitals',
        priority: 'medium' as const,
      };
    } else {
      todaysFocus = {
        title: 'Great progress today!',
        action: 'Log wellness',
        priority: 'low' as const,
      };
    }

    // Update store
    setWellnessScore(wellnessScore);
    setTodaysFocus(todaysFocus);
    setMedicationsPending(pendingMeds);
    setSymptomsToday(todaySymptoms);
    setVitalsOutOfRange(outOfRangeVitals);
    updateLastUpdated();
  }, [
    medications,
    symptoms,
    vitals,
    medicationsLoading,
    symptomsLoading,
    vitalsLoading,
    setWellnessScore,
    setTodaysFocus,
    setMedicationsPending,
    setSymptomsToday,
    setVitalsOutOfRange,
    updateLastUpdated,
  ]);

  return {
    loading: medicationsLoading || symptomsLoading || vitalsLoading,
  };
};
