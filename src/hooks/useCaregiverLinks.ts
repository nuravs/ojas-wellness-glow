import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export function useCaregiverLinks() {
  const { session } = useAuth();
  const user = session?.user;
  const queryClient = useQueryClient();

  // Fetch all caregiver links (depends on role)
  const caregiverLinksQuery = useQuery({
    queryKey: ['caregiver-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_caregivers')
        .select('*');

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Patient sends caregiver invite
  const sendInvite = useMutation({
    mutationFn: async (caregiverEmail: string) => {
      // Get user_id for caregiver via email
      const { data: caregiverProfile, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', caregiverEmail)
        .single();

      if (error) throw new Error('Caregiver not found.');

      const { data, error: insertError } = await supabase
        .from('patient_caregivers')
        .insert([
          {
            id: uuidv4(),
            patient_id: user?.id,
            caregiver_id: caregiverProfile.id,
            status: 'pending',
            invited_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw new Error(insertError.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-links'] });
    },
  });

  // Caregiver approves the link
  const approveLink = useMutation({
    mutationFn: async (linkId: string) => {
      const { data, error } = await supabase
        .from('patient_caregivers')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', linkId);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-links'] });
    },
  });

  return {
    caregiverLinks: caregiverLinksQuery.data || [],
    isLoading: caregiverLinksQuery.isLoading,
    sendInvite: sendInvite.mutateAsync,
    approveLink: approveLink.mutateAsync,
  };
}
