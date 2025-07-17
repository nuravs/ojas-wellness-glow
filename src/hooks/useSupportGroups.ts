import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  condition_focus?: string;
  is_private: boolean;
  moderated: boolean;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupportGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  display_name?: string;
  anonymous: boolean;
  joined_at: string;
}

export interface SupportGroupPost {
  id: string;
  group_id: string;
  user_id: string;
  title?: string;
  content: string;
  post_type: string;
  anonymous: boolean;
  moderated: boolean;
  pinned: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export const useSupportGroups = () => {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [userMemberships, setUserMemberships] = useState<SupportGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error loading support groups:', error);
      toast({
        title: "Error loading support groups",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    }
  };

  const loadUserMemberships = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_group_members')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserMemberships(data || []);
    } catch (error) {
      console.error('Error loading user memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string, anonymous: boolean = false, displayName?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('support_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          anonymous,
          display_name: anonymous ? displayName : undefined
        });

      if (error) throw error;

      // Update member count
      await (supabase as any).rpc('increment_group_member_count', { group_id: groupId });

      toast({
        title: "Successfully joined group",
        description: "Welcome to the community!"
      });

      loadUserMemberships();
      loadGroups();
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error joining group",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('support_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update member count
      await (supabase as any).rpc('decrement_group_member_count', { group_id: groupId });

      toast({
        title: "Left group successfully",
        description: "You can rejoin anytime"
      });

      loadUserMemberships();
      loadGroups();
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: "Error leaving group",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  const createGroup = async (groupData: {
    name: string;
    description: string;
    group_type: string;
    condition_focus?: string;
    is_private: boolean;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          ...groupData,
          created_by: user.id,
          member_count: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Automatically join the creator
      await supabase
        .from('support_group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      toast({
        title: "Group created successfully",
        description: "Your community is ready!"
      });

      loadGroups();
      loadUserMemberships();
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error creating group",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    }
  };

  const isUserMember = (groupId: string): boolean => {
    return userMemberships.some(membership => membership.group_id === groupId);
  };

  const getUserMembership = (groupId: string): SupportGroupMember | undefined => {
    return userMemberships.find(membership => membership.group_id === groupId);
  };

  const getGroupsByType = (type: string): SupportGroup[] => {
    return groups.filter(group => group.group_type === type);
  };

  const getJoinedGroups = (): SupportGroup[] => {
    const joinedGroupIds = userMemberships.map(m => m.group_id);
    return groups.filter(group => joinedGroupIds.includes(group.id));
  };

  useEffect(() => {
    loadGroups();
    loadUserMemberships();
  }, [user]);

  return {
    groups,
    userMemberships,
    loading,
    joinGroup,
    leaveGroup,
    createGroup,
    isUserMember,
    getUserMembership,
    getGroupsByType,
    getJoinedGroups,
    refetch: () => {
      loadGroups();
      loadUserMemberships();
    }
  };
};