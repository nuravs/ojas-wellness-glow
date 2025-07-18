import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { role: 'patient' | 'caregiver'; full_name: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    console.log("AUTH_CONTEXT: Attempting to fetch profile for user:", userId);
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('AUTH_CONTEXT: Error fetching user profile:', error.message);
      return null;
    }
    console.log("AUTH_CONTEXT: Profile fetched successfully:", profile);
    return profile;
  };

  useEffect(() => {
    console.log("AUTH_CONTEXT: Setting up auth state listener.");
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AUTH_CONTEXT: Auth state changed. Event: ${event}, Session: ${session ? 'Exists' : 'null'}`);

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        } else {
          setUser(null);
          setSession(null);
          setUserProfile(null);
        }
        // This is the most important part: always stop loading after the event is handled.
        console.log("AUTH_CONTEXT: Auth check complete. Setting loading to false.");
        setLoading(false);
      }
    );

    return () => {
      console.log("AUTH_CONTEXT: Unsubscribing from auth changes.");
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { role: 'patient' | 'caregiver'; full_name: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: userData.role, full_name: userData.full_name } }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', user.id);
    if (!error) {
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error };
  };

  const value = { user, session, userProfile, loading, signUp, signIn, signOut, updateProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};