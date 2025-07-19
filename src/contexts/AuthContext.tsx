
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

interface UserProfile {
  user_id: string;
  full_name: string;
  role: string;
  date_of_birth?: string | null;
  phone?: string | null;
  emergency_contact?: string | null;
  consent_given?: boolean | null;
  linked_user_id?: string | null;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Use the database function to get user profile from staging schema
      const { data, error } = await supabase
        .rpc('get_user_profile', { profile_user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message);
        return null;
      }

      console.log('User profile data received:', data);
      
      // The RPC function returns JSON object directly, cast via unknown for type safety
      return data as unknown as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;

    try {
      console.log('Updating user profile with:', updates);
      
      // Use the database function to update user profile in staging schema
      const { data, error } = await supabase
        .rpc('update_user_profile', { 
          profile_user_id: user.id, 
          profile_updates: updates as any 
        });

      if (error) {
        console.error('Error updating user profile:', error);
        setError(error.message);
        return false;
      }

      console.log('Profile updated successfully:', data);
      
      // Update local state with the returned profile
      if (data) {
        setUserProfile(data as unknown as UserProfile);
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          const profile = await fetchUserProfile(initialSession.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading initial session:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        setError(null);
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error.message);
        setError(error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error.message);
        setError(error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Signin failed:", error);
      setError(error instanceof Error ? error.message : 'Signin failed');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setError(null);
    } catch (error) {
      console.error("Signout failed:", error);
      setError(error instanceof Error ? error.message : 'Signout failed');
    }
  };

  const value: AuthContextProps = {
    user,
    session,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
