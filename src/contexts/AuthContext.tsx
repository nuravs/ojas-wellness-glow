
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

      console.log('📦 Raw profile data received:', data);
      
      // Handle the response - RPC returns the JSON directly now
      if (!data) {
        console.warn('⚠️ No profile data found for user:', userId);
        setError('No profile found for user');
        return null;
      }

      // Validate the profile data structure
      if (!isValidUserProfile(data)) {
        console.error('❌ Invalid profile data structure:', data);
        console.log('Expected fields: user_id, full_name, role');
        setError('Profile data incomplete - missing required fields');
        return null;
      }

      console.log('✅ Valid profile data:', data);
      setError(null);
      return data;
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
      
      // Handle the updated profile response
      if (data && isValidUserProfile(data)) {
        console.log('✅ Profile updated successfully:', data);
        setUserProfile(data);
        setError(null);
        return true;
      } else {
        console.error('❌ Invalid updated profile data:', data);
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

  // Profile fetch timeout - reduced to 3 seconds
  useEffect(() => {
    if (isOnAuthPage()) return;

    const timeout = setTimeout(() => {
      if (loading && user && !userProfile) {
        console.warn('⏰ Profile fetch timeout reached, allowing app to continue');
        setLoading(false);
        setError('Profile loading timed out - some features may be limited');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading, user, userProfile]);

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
            const profile = await fetchUserProfile(initialSession.user.id);
            setUserProfile(profile);
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
            setLoading(true);
            
            // Fetch profile with timeout safeguard
            const profilePromise = fetchUserProfile(session.user.id);
            const timeoutPromise = new Promise<null>((resolve) => {
              setTimeout(() => {
                console.warn('⏰ Profile fetch timeout in auth state change');
                resolve(null);
              }, 3000);
            });
            
            const profile = await Promise.race([profilePromise, timeoutPromise]);
            setUserProfile(profile);
            setLoading(false);
          } else {
            // On auth page, clear loading immediately
            setLoading(false);
          }
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
