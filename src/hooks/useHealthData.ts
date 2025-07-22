
import { useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useMedications } from './useMedications';
import { useSymptoms } from './useSymptoms';
import { useVitals } from './useVitals';
import { useMedicationLogs } from './useMedicationLogs';
import { useComorbidities } from './useComorbidities';
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
  const { medicationLogs, loading: medicationLogsLoading } = useMedicationLogs();
  const { comorbidities, loading: comorbiditiesLoading } = useComorbidities();

  useEffect(() => {
    if (medicationsLoading || symptomsLoading || vitalsLoading || medicationLogsLoading || comorbiditiesLoading) return;

    // Calculate wellness score with all required data
    const wellnessScore = calculateWellnessScore({
      medications,
      symptoms,
      vitals,
      medicationLogs,
      comorbidities,
    });

    // Count pending medications - check if active and not taken today
    const pendingMeds = medications.filter(med => {
      if (!med.active) return false;
      
      // Check if medication was taken today by looking at logs
      const today = new Date().toISOString().split('T')[0];
      const takenToday = medicationLogs.some(log => 
        log.medication_id === med.id && 
        log.status === 'taken' && 
        log.created_at?.startsWith(today)
      );
      
      return !takenToday;
    }).length;

    // Count today's symptoms
    const today = new Date().toISOString().split('T')[0];
    const todaySymptoms = symptoms.filter(symptom => 
      symptom.logged_at?.startsWith(today)
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

    // Update store - extract numeric value from wellness score
    const scoreValue = typeof wellnessScore === 'object' ? wellnessScore.score : wellnessScore;
    setWellnessScore(scoreValue);
    setTodaysFocus(todaysFocus);
    setMedicationsPending(pendingMeds);
    setSymptomsToday(todaySymptoms);
    setVitalsOutOfRange(outOfRangeVitals);
    updateLastUpdated();
  }, [
    medications,
    symptoms,
    vitals,
    medicationLogs,
    comorbidities,
    medicationsLoading,
    symptomsLoading,
    vitalsLoading,
    medicationLogsLoading,
    comorbiditiesLoading,
    setWellnessScore,
    setTodaysFocus,
    setMedicationsPending,
    setSymptomsToday,
    setVitalsOutOfRange,
    updateLastUpdated,
  ]);

  return {
    loading: medicationsLoading || symptomsLoading || vitalsLoading || medicationLogsLoading || comorbiditiesLoading,
  };
};
