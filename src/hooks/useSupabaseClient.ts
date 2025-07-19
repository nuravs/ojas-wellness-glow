
import { supabase } from '../integrations/supabase/client';

// Hook to get the Supabase client configured for staging schema operations
export const useSupabaseClient = () => {
  return {
    // Use main client for all operations - database functions handle schema routing
    client: supabase,
    // Helper methods for common staging operations
    async callFunction(functionName: string, params: any) {
      const { data, error } = await supabase.rpc(functionName, params);
      
      if (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
      
      return data;
    },
    
    async getUserData(userId: string, dataType: string) {
      const functionMap = {
        'profile': 'get_user_profile',
        'medications': 'get_user_medications',
        'vitals': 'get_user_vitals',
        'symptoms': 'get_user_symptoms',
        'comorbidities': 'get_user_comorbidities',
        'medication_conditions': 'get_user_medication_conditions',
        'medication_logs': 'get_user_medication_logs'
      };
      
      const functionName = functionMap[dataType as keyof typeof functionMap];
      if (!functionName) {
        throw new Error(`Unknown data type: ${dataType}`);
      }
      
      const paramName = `${dataType === 'profile' ? 'profile_' : 
                          dataType === 'medications' ? 'medication_' :
                          dataType === 'vitals' ? 'vitals_' :
                          dataType === 'symptoms' ? 'symptoms_' :
                          dataType === 'comorbidities' ? 'comorbidities_' :
                          dataType === 'medication_conditions' ? 'conditions_' :
                          'logs_'}user_id`;
      
      return this.callFunction(functionName, { [paramName]: userId });
    }
  };
};
