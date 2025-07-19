
import { supabase, stagingSupabase } from '../integrations/supabase/client';

// Hook to get the appropriate Supabase client based on operation type
export const useSupabaseClient = () => {
  return {
    // Use main client for auth operations
    auth: supabase,
    // Use staging client for data operations
    data: stagingSupabase,
  };
};
