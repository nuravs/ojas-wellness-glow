
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseClient } from './useSupabaseClient';
import { useMedications } from './useMedications';
import { useVitals } from './useVitals';
import { useSymptoms } from './useSymptoms';
import { useComorbidities } from './useComorbidities';
import { useMedicationConditions } from './useMedicationConditions';
import { useMedicationLogs } from './useMedicationLogs';

export const useStagingDataTest = () => {
  const { user, userProfile } = useAuth();
  const { client } = useSupabaseClient();
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  // Import all the hooks to test data loading
  const { medications, loading: medsLoading } = useMedications();
  const { vitals, loading: vitalsLoading } = useVitals();
  const { symptoms, loading: symptomsLoading } = useSymptoms();
  const { comorbidities, loading: comorbiditiesLoading } = useComorbidities();
  const { medicationConditions, loading: conditionsLoading } = useMedicationConditions();
  const { medicationLogs, loading: logsLoading } = useMedicationLogs();

  const runStagingDataTest = async () => {
    if (!user) return;
    
    setTesting(true);
    const results: any = {};
    
    try {
      console.log('Starting comprehensive staging data test for user:', user.id);
      
      // Test 1: User Profile
      results.userProfile = {
        data: userProfile,
        loaded: !!userProfile,
        hasRequiredFields: !!(userProfile?.role && userProfile?.full_name)
      };
      
      // Test 2: Medications
      results.medications = {
        data: medications,
        count: medications?.length || 0,
        loaded: !medsLoading,
        hasData: (medications?.length || 0) > 0
      };
      
      // Test 3: Vitals
      results.vitals = {
        data: vitals,
        count: vitals?.length || 0,
        loaded: !vitalsLoading,
        hasData: (vitals?.length || 0) > 0
      };
      
      // Test 4: Symptoms
      results.symptoms = {
        data: symptoms,
        count: symptoms?.length || 0,
        loaded: !symptomsLoading,
        hasData: (symptoms?.length || 0) > 0
      };
      
      // Test 5: Comorbidities
      results.comorbidities = {
        data: comorbidities,
        count: comorbidities?.length || 0,
        loaded: !comorbiditiesLoading,
        hasData: (comorbidities?.length || 0) > 0
      };
      
      // Test 6: Medication Conditions
      results.medicationConditions = {
        data: medicationConditions,
        count: medicationConditions?.length || 0,
        loaded: !conditionsLoading,
        hasData: (medicationConditions?.length || 0) > 0
      };
      
      // Test 7: Medication Logs
      results.medicationLogs = {
        data: medicationLogs,
        count: medicationLogs?.length || 0,
        loaded: !logsLoading,
        hasData: (medicationLogs?.length || 0) > 0
      };
      
      // Summary
      results.summary = {
        totalDataSources: 7,
        loadedSources: Object.values(results).filter((r: any) => r.loaded).length,
        sourcesWithData: Object.values(results).filter((r: any) => r.hasData).length,
        allLoaded: Object.values(results).every((r: any) => r.loaded),
        userRole: userProfile?.role || 'unknown'
      };
      
      console.log('Staging data test results:', results);
      setTestResults(results);
      
    } catch (error) {
      console.error('Error in staging data test:', error);
      results.error = error;
      setTestResults(results);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (user && userProfile && !testing) {
      // Run test after a short delay to ensure all hooks have loaded
      setTimeout(runStagingDataTest, 2000);
    }
  }, [user, userProfile, medsLoading, vitalsLoading, symptomsLoading, comorbiditiesLoading, conditionsLoading, logsLoading]);

  return {
    testResults,
    testing,
    runTest: runStagingDataTest
  };
};
