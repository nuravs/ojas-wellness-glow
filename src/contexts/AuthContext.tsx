
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
  created_at?: string;
  updated_at?: string;
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

// Type guard to validate UserProfile structure
const isValidUserProfile = (data: any): data is UserProfile => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.user_id === 'string' &&
    typeof data.full_name === 'string' &&
    typeof data.role === 'string'
  );
};

// Type guard to check if data is an object (not array)
const isObject = (data: any): data is Record<string, any> => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're on the auth page to avoid unnecessary loading states
  const isOnAuthPage = () => {
    return window.location.pathname === '/auth';
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .rpc('get_user_profile', { profile_user_id: userId });

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setError(`Failed to fetch profile: ${error.message}`);
        return null;
      }

      console.log('📦 Raw RPC response:', data);
      
      // Handle the RPC response - check if it's wrapped or direct
      let profileData = data;
      
      // If the response is an object and has the function name key, unwrap it
      if (isObject(data) && 'get_user_profile' in data) {
        profileData = data.get_user_profile;
        console.log('🔧 Unwrapped profile data:', profileData);
      }
      
      if (!profileData) {
        console.warn('⚠️ No profile data found for user:', userId);
        setError('No profile found for user');
        return null;
      }

      // Validate the profile data structure
      if (!isValidUserProfile(profileData)) {
        console.error('❌ Invalid profile data structure:', profileData);
        console.log('Expected fields: user_id, full_name, role');
        setError('Profile data incomplete - missing required fields');
        return null;
      }

      console.log('✅ Valid profile data:', profileData);
      setError(null);
      return profileData;
    } catch (error) {
      console.error('💥 Exception in fetchUserProfile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Profile fetch failed: ${errorMessage}`);
      return null;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      console.warn('⚠️ Cannot update profile: no authenticated user');
      return false;
    }

    try {
      console.log('📝 Updating user profile with:', updates);
      
      const { data, error } = await supabase
        .rpc('update_user_profile', { 
          profile_user_id: user.id, 
          profile_updates: updates as any 
        });

      if (error) {
        console.error('❌ Error updating user profile:', error);
        setError(`Failed to update profile: ${error.message}`);
        return false;
      }

      console.log('📦 Update response data:', data);
      
      // Handle the RPC response - check if it's wrapped or direct
      let updatedProfile = data;
      
      // If the response is an object and has the function name key, unwrap it
      if (isObject(data) && 'update_user_profile' in data) {
        updatedProfile = data.update_user_profile;
        console.log('🔧 Unwrapped updated profile:', updatedProfile);
      }
      
      if (updatedProfile && isValidUserProfile(updatedProfile)) {
        console.log('✅ Profile updated successfully:', updatedProfile);
        setUserProfile(updatedProfile);
        setError(null);
        return true;
      } else {
        console.error('❌ Invalid updated profile data:', updatedProfile);
        setError('Invalid updated profile data received');
        return false;
      }
    } catch (error) {
      console.error('💥 Exception in updateUserProfile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Profile update failed: ${errorMessage}`);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth state management');
    
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (!isOnAuthPage()) {
            setError(`Session error: ${error.message}`);
          }
          setLoading(false);
          return;
        }
        
        console.log('📦 Initial session:', initialSession ? 'Found' : 'None');
        
        if (initialSession?.user) {
          console.log('👤 User found in initial session:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Only fetch profile if not on auth page
          if (!isOnAuthPage()) {
            try {
              const profile = await fetchUserProfile(initialSession.user.id);
              setUserProfile(profile);
            } catch (error) {
              console.error('Profile fetch error during init:', error);
              // Don't set error here - profile issues shouldn't block auth
            }
          }
        }
        
        // Always clear loading after initial check
        setLoading(false);
      } catch (error) {
        console.error('💥 Exception in getInitialSession:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (!isOnAuthPage()) {
          setError(`Session initialization failed: ${errorMessage}`);
        }
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
      
      try {
        if (session?.user) {
          console.log('👤 User authenticated:', session.user.email);
          setSession(session);
          setUser(session.user);
          setError(null);
          
          // Only fetch profile if not on auth page
          if (!isOnAuthPage()) {
            // Fetch profile in background without blocking auth completion
            setTimeout(async () => {
              try {
                const profile = await fetchUserProfile(session.user.id);
                setUserProfile(profile);
              } catch (error) {
                console.error('Background profile fetch error:', error);
                // Don't set error - profile issues shouldn't block auth flow
              }
            }, 0);
          }
          setLoading(false);
        } else {
          console.log('👤 User signed out or no session');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('💥 Exception in auth state change:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (!isOnAuthPage()) {
          setError(`Auth state change error: ${errorMessage}`);
        }
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting signup for:', email);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Signup error:', error.message);
        setError(error.message);
        throw error;
      }

      console.log('✅ Signup successful:', data);
      return data;
    } catch (error) {
      console.error('💥 Signup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting signin for:', email);
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Signin error:', error.message);
        setError(error.message);
        setLoading(false);
        throw error;
      }

      console.log('✅ Signin successful:', data);
      return data;
    } catch (error) {
      console.error('💥 Signin failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signin failed';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user');
      setLoading(true);
      
      await supabase.auth.signOut();
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setError(null);
      setLoading(false);
      
      console.log('✅ Signout successful');
    } catch (error) {
      console.error('💥 Signout failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signout failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 Auth State Debug:', {
      user: user ? `${user.email} (${user.id})` : 'None',
      userProfile: userProfile ? `${userProfile.full_name} (${userProfile.role})` : 'None',
      loading,
      error,
      currentPath: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [user, userProfile, loading, error]);

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
