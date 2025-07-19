
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface MedicationCondition {
  id: string;
  medication_id: string;
  comorbidity_id: string;
  created_at: string;
}

export interface MedicationWithConditions {
  id: string;
  name: string;
  dosage: string;
  conditions: Array<{
    id: string;
    condition_name: string;
    status: string;
  }>;
}

export const useMedicationConditions = () => {
  const [medicationConditions, setMedicationConditions] = useState<MedicationCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMedicationConditions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading medication conditions for user:', user.id);
      
      // Use the database function to fetch medication conditions from staging
      const { data, error } = await supabase
        .rpc('get_user_medication_conditions', { conditions_user_id: user.id });

      if (error) {
        console.error('Error loading medication conditions:', error);
        toast({
          title: "Error loading medication conditions",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      console.log('Medication conditions data received:', data);
      
      // The RPC function returns JSON array directly
      const conditionsArray = Array.isArray(data) ? data : [];
      setMedicationConditions((conditionsArray as unknown as MedicationCondition[]) || []);
    } catch (error) {
      console.error('Error in fetchMedicationConditions:', error);
      toast({
        title: "Connection Error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const linkMedicationToCondition = async (medicationId: string, comorbidityId: string) => {
    try {
      // Insert into staging schema via direct query since we don't have a specific function for this
      const { data, error } = await supabase
        .from('medication_conditions')
        .insert({
          medication_id: medicationId,
          comorbidity_id: comorbidityId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error linking medication to condition:', error);
        toast({
          title: "Error",
          description: "Failed to link medication to condition",
          variant: "destructive"
        });
        throw error;
      }
      
      // Refresh the list
      await fetchMedicationConditions();
      toast({
        title: "Success",
        description: "Medication linked to condition successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error in linkMedicationToCondition:', error);
      throw error;
    }
  };

  const unlinkMedicationFromCondition = async (medicationId: string, comorbidityId: string) => {
    try {
      const { error } = await supabase
        .from('medication_conditions')
        .delete()
        .eq('medication_id', medicationId)
        .eq('comorbidity_id', comorbidityId);

      if (error) {
        console.error('Error unlinking medication from condition:', error);
        toast({
          title: "Error",
          description: "Failed to unlink medication from condition",
          variant: "destructive"
        });
        throw error;
      }
      
      // Refresh the list
      await fetchMedicationConditions();
      toast({
        title: "Success",
        description: "Medication unlinked from condition successfully",
      });
    } catch (error) {
      console.error('Error in unlinkMedicationFromCondition:', error);
      throw error;
    }
  };

  const getMedicationsWithConditions = async () => {
    try {
      // This would need a more complex database function to join medications with conditions
      // For now, return the current medication conditions
      return medicationConditions;
    } catch (error) {
      console.error('Error fetching medications with conditions:', error);
      return [];
    }
  };

  const getConditionsForMedication = (medicationId: string) => {
    return medicationConditions.filter(mc => mc.medication_id === medicationId);
  };

  const getMedicationsForCondition = (comorbidityId: string) => {
    return medicationConditions.filter(mc => mc.comorbidity_id === comorbidityId);
  };

  useEffect(() => {
    fetchMedicationConditions();
  }, [user]);

  return {
    medicationConditions,
    loading,
    linkMedicationToCondition,
    unlinkMedicationFromCondition,
    getMedicationsWithConditions,
    getConditionsForMedication,
    getMedicationsForCondition,
    refetch: fetchMedicationConditions
  };
};
