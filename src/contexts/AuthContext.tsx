
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, stagingSupabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    console.log(`AUTH_CONTEXT: Attempting to fetch profile for user: ${userId} (attempt ${retryCount + 1})`);
    
    try {
      // Check if we have a valid session
      const { data: currentSession } = await supabase.auth.getSession();
      console.log("AUTH_CONTEXT: Current session check:", !!currentSession.session);
      
      if (!currentSession.session) {
        console.error("AUTH_CONTEXT: No valid session found when fetching profile");
        return null;
      }

      // Use staging client for user profile operations
      const { data: profile, error } = await stagingSupabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('AUTH_CONTEXT: Error fetching user profile:', error.message, error.details);
        
        // Retry logic for transient errors
        if (retryCount < 2 && (error.code === 'PGRST116' || error.message.includes('JWT'))) {
          console.log(`AUTH_CONTEXT: Retrying profile fetch in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchUserProfile(userId, retryCount + 1);
        }
        
        setError(`Failed to load user profile: ${error.message}`);
        return null;
      }

      console.log("AUTH_CONTEXT: Profile fetched successfully:", profile);
      setError(null);
      return profile;
    } catch (err) {
      console.error('AUTH_CONTEXT: Unexpected error fetching profile:', err);
      setError('An unexpected error occurred while loading your profile');
      return null;
    }
  };

  useEffect(() => {
    console.log("AUTH_CONTEXT: Setting up auth state listener.");
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AUTH_CONTEXT: Auth state changed. Event: ${event}, Session: ${session ? 'Exists' : 'null'}`);
        console.log("AUTH_CONTEXT: Session details:", session ? { 
          user_id: session.user.id, 
          expires_at: session.expires_at,
          access_token: session.access_token ? 'present' : 'missing'
        } : 'no session');

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          // Add a small delay to ensure the session is fully established
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            setLoading(false);
          }, 100);
        } else {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setError(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("AUTH_CONTEXT: Error getting initial session:", error);
        setLoading(false);
        return;
      }
      
      console.log("AUTH_CONTEXT: Initial session check:", session ? 'Found' : 'None');
      if (!session) {
        setLoading(false);
      }
    });

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
    
    // Use staging client for profile updates
    const { error } = await stagingSupabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', user.id);
    
    if (!error) {
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error };
  };

  const value = { 
    user, 
    session, 
    userProfile, 
    loading, 
    error, 
    signUp, 
    signIn, 
    signOut, 
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
