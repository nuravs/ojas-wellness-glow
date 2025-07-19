
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface Comorbidity {
  id: string;
  user_id: string;
  condition_name: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'controlled' | 'monitoring' | 'inactive';
  diagnosed_date?: string;
  notes?: string;
  caregiver_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationCondition {
  id: string;
  medication_id: string;
  comorbidity_id: string;
  created_at: string;
}

export const useComorbidities = () => {
  const [comorbidities, setComorbidities] = useState<Comorbidity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadComorbidities = async () => {
    if (!user) return;

    try {
      console.log('Loading comorbidities for user:', user.id);
      
      // Use the database function to fetch comorbidities from staging schema
      const { data, error } = await supabase
        .rpc('get_user_comorbidities', { comorbidities_user_id: user.id });

      if (error) {
        console.error('Error loading comorbidities:', error);
        toast({
          title: "Error loading conditions",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      console.log('Comorbidities data received:', data);
      
      // Parse the JSON response and ensure it's an array with proper typing
      const comorbiditiesArray = Array.isArray(data) ? data : (data ? [data] : []);
      setComorbidities((comorbiditiesArray as unknown as Comorbidity[]) || []);
    } catch (error) {
      console.error('Error in loadComorbidities:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addComorbidity = async (comorbidity: Omit<Comorbidity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('comorbidities')
        .insert({
          ...comorbidity,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comorbidity:', error);
        toast({
          title: "Error",
          description: "Failed to add condition",
          variant: "destructive"
        });
        return;
      }

      setComorbidities(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Condition added successfully",
      });

      return data;
    } catch (error) {
      console.error('Error in addComorbidity:', error);
      toast({
        title: "Error",
        description: "Failed to add condition",
        variant: "destructive"
      });
    }
  };

  const updateComorbidity = async (id: string, updates: Partial<Comorbidity>) => {
    try {
      const { data, error } = await supabase
        .from('comorbidities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating comorbidity:', error);
        toast({
          title: "Error",
          description: "Failed to update condition",
          variant: "destructive"
        });
        return;
      }

      setComorbidities(prev =>
        prev.map(item => item.id === id ? data : item)
      );

      toast({
        title: "Success",
        description: "Condition updated successfully",
      });
    } catch (error) {
      console.error('Error in updateComorbidity:', error);
      toast({
        title: "Error",
        description: "Failed to update condition",
        variant: "destructive"
      });
    }
  };

  const deleteComorbidity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comorbidities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting comorbidity:', error);
        toast({
          title: "Error",
          description: "Failed to delete condition",
          variant: "destructive"
        });
        return;
      }

      setComorbidities(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Condition deleted successfully",
      });
    } catch (error) {
      console.error('Error in deleteComorbidity:', error);
      toast({
        title: "Error",
        description: "Failed to delete condition",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadComorbidities();
    }
  }, [user]);

  return {
    comorbidities,
    loading,
    addComorbidity,
    updateComorbidity,
    deleteComorbidity,
    refetch: loadComorbidities
  };
};
