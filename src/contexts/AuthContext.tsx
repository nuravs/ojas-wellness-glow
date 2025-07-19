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
  userProfile: UserProfile | null;
  loading: boolean;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Use the database function to get user profile from staging schema
      const { data, error } = await supabase
        .rpc('get_user_profile', { profile_user_id: userId });

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile data received:', data);
      
      // The RPC function returns JSON object directly
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
        return false;
      }

      console.log('Profile updated successfully:', data);
      
      // Update local state with the returned profile
      if (data) {
        setUserProfile(data as UserProfile);
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return false;
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    const loadUser = async () => {
      try {
        const {
          data: { user: initialUser },
        } = await session;

        if (initialUser) {
          setUser(initialUser);
          const profile = await fetchUserProfile(initialUser.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Signup failed:", error);
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
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const value: AuthContextProps = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
