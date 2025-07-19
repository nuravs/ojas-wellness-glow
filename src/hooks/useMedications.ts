
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: any;
  instructions?: string;
  active: boolean;
  taken: boolean;
  time: string;
  next_dose?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  caregiver_visible: boolean;
  pills_remaining?: number;
  next_refill_date?: string;
  daily_consumption?: number;
}

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMedications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching medications for user:', user.id);
      
      // Use the database function to fetch medications
      const { data, error } = await supabase
        .rpc('get_user_medications', { medication_user_id: user.id });

      if (error) {
        console.error('Error fetching medications:', error);
      } else {
        console.log('Medications data received:', data);
        
        // Parse the JSON response and ensure it's an array
        const medicationsArray = Array.isArray(data) ? data : (data ? [data] : []);
        
        // Transform the data to include taken status and time
        const transformedMedications = medicationsArray.map((med: any) => ({
          ...med,
          taken: false, // This would be determined by checking medication logs
          time: med.next_dose ? new Date(med.next_dose).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00',
        }));
        
        console.log('Transformed medications:', transformedMedications);
        setMedications(transformedMedications);
      }
    } catch (error) {
      console.error('Unexpected error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMedication = async (medicationId: string) => {
    if (!user) return;

    try {
      // Use the database function for medication logging
      const { error } = await supabase.rpc('log_medication', {
        med_id: medicationId,
        med_user_id: user.id,
        log_status: 'taken',
        log_time: new Date().toISOString(),
      });

      if (error) {
        console.error('Error logging medication:', error);
      } else {
        // Update local state
        setMedications(prev =>
          prev.map(med =>
            med.id === medicationId ? { ...med, taken: !med.taken } : med
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error toggling medication:', error);
    }
  };

  const postponeMedication = async (medicationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_medication', {
        med_id: medicationId,
        med_user_id: user.id,
        log_status: 'postponed',
        log_time: new Date().toISOString(),
      });

      if (error) {
        console.error('Error postponing medication:', error);
      }
    } catch (error) {
      console.error('Unexpected error postponing medication:', error);
    }
  };

  const toggleCaregiverVisibility = async (medicationId: string) => {
    if (!user) return;

    try {
      const medication = medications.find(med => med.id === medicationId);
      if (!medication) return;

      const { error } = await supabase.rpc('update_medication_visibility', {
        med_id: medicationId,
        med_user_id: user.id,
        is_visible: !medication.caregiver_visible,
      });

      if (error) {
        console.error('Error updating caregiver visibility:', error);
      } else {
        // Update local state
        setMedications(prev =>
          prev.map(med =>
            med.id === medicationId 
              ? { ...med, caregiver_visible: !med.caregiver_visible } 
              : med
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error toggling caregiver visibility:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [user]);

  return {
    medications,
    loading,
    toggleMedication,
    postponeMedication,
    toggleCaregiverVisibility,
    refetch: fetchMedications,
  };
};
