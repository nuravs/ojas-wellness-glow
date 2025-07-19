
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CaregiverRelationship {
  id: string;
  patient_id: string;
  caregiver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  patient_profile?: {
    full_name: string;
    user_id: string;
  };
  caregiver_profile?: {
    full_name: string;
    user_id: string;
  };
}

export function useCaregiverLinks() {
  const { session } = useAuth();
  const user = session?.user;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all caregiver links using RPC function
  const caregiverLinksQuery = useQuery({
    queryKey: ['caregiver-links', user?.id],
    queryFn: async (): Promise<CaregiverRelationship[]> => {
      if (!user) return [];

      try {
        // Use .rpc() method with proper typing
        const { data, error } = await supabase.rpc('get_patient_caregiver_relationships', {
          user_id: user.id
        });

        if (error) {
          console.error('Error fetching caregiver relationships:', error);
          return [];
        }

        // The RPC function returns JSON directly, cast via unknown to our type
        return (data as unknown as CaregiverRelationship[]) || [];
      } catch (err) {
        console.error('Failed to fetch caregiver relationships:', err);
        return [];
      }
    },
    enabled: !!user,
  });

  // Patient sends caregiver invite
  const sendInvite = useMutation({
    mutationFn: async (caregiverEmail: string) => {
      if (!user) throw new Error('User not authenticated');

      // First, find the caregiver by email using user profiles
      const { data: caregiverProfile, error } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, role')
        .eq('role', 'caregiver')
        .single();

      if (error || !caregiverProfile) {
        throw new Error('Caregiver not found. Please ensure the email is correct and the user has an account.');
      }

      // Create the invitation using RPC function
      const { data, error: inviteError } = await supabase.rpc('create_caregiver_request', {
        patient_user_id: user.id,
        caregiver_user_id: caregiverProfile.user_id
      });

      if (inviteError) {
        if (inviteError.message.includes('Request already exists')) {
          throw new Error('You have already sent an invitation to this caregiver.');
        }
        throw inviteError;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "Your invitation has been sent to the caregiver for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ['caregiver-links'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Caregiver approves the link
  const approveLink = useMutation({
    mutationFn: async (linkId: string) => {
      const { data, error } = await supabase.rpc('update_caregiver_request_status', {
        request_id: linkId,
        new_status: 'approved'
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Request approved",
        description: "Caregiver access has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['caregiver-links'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to approve request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const relationships = caregiverLinksQuery.data || [];
  const pendingRequests = relationships.filter(r => r.status === 'pending');
  const approvedRelationships = relationships.filter(r => r.status === 'approved');
  
  const pendingRequestsForPatient = pendingRequests.filter(r => r.patient_id === user?.id);
  const pendingRequestsFromCaregiver = pendingRequests.filter(r => r.caregiver_id === user?.id);

  return {
    relationships,
    caregiverLinks: relationships, // For backward compatibility
    pendingRequests,
    approvedRelationships,
    pendingRequestsForPatient,
    pendingRequestsFromCaregiver,
    isLoading: caregiverLinksQuery.isLoading,
    sendInvite: sendInvite.mutateAsync,
    approveLink: approveLink.mutateAsync,
  };
}
