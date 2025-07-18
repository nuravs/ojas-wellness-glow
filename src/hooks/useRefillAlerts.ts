
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';
import { 
  MedicationWithRefillData, 
  RefillAlert, 
  generateRefillAlerts,
  updateMedicationAfterRefill 
} from '../utils/refillUtils';

export const useRefillAlerts = () => {
  const [refillAlerts, setRefillAlerts] = useState<RefillAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRefillAlerts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: medications, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true);

      if (error) {
        console.error('Error loading medications for refills:', error);
        return;
      }

      const medicationsWithRefillData: MedicationWithRefillData[] = medications?.map(med => ({
        id: med.id,
        name: med.name,
        next_refill_date: med.next_refill_date,
        pills_remaining: med.pills_remaining,
        daily_consumption: Number(med.daily_consumption) || 1
      })) || [];

      const alerts = generateRefillAlerts(medicationsWithRefillData, 7);
      const filteredAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
      
      setRefillAlerts(filteredAlerts);
    } catch (error) {
      console.error('Error in loadRefillAlerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    setRefillAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleRefill = async (medicationId: string, newPillCount: number) => {
    try {
      // Get the medication details
      const { data: medication, error: fetchError } = await supabase
        .from('medications')
        .select('*')
        .eq('id', medicationId)
        .single();

      if (fetchError || !medication) {
        toast({
          title: "Error",
          description: "Could not find medication details",
          variant: "destructive"
        });
        return;
      }

      // Calculate updated refill data
      const updatedData = updateMedicationAfterRefill(
        {
          id: medication.id,
          name: medication.name,
          next_refill_date: medication.next_refill_date,
          pills_remaining: medication.pills_remaining,
          daily_consumption: Number(medication.daily_consumption) || 1
        },
        newPillCount
      );

      // Update in database
      const { error: updateError } = await supabase
        .from('medications')
        .update(updatedData)
        .eq('id', medicationId);

      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update medication refill data",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Refill updated!",
        description: `${medication.name} has been restocked with ${newPillCount} pills`,
      });

      // Reload alerts
      await loadRefillAlerts();
    } catch (error) {
      console.error('Error in handleRefill:', error);
      toast({
        title: "Error",
        description: "Failed to process refill",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadRefillAlerts();
  }, [user, dismissedAlerts]);

  return {
    refillAlerts,
    loading,
    dismissAlert,
    handleRefill,
    refetch: loadRefillAlerts
  };
};
