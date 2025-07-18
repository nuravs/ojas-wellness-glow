
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthDebug = () => {
  const { user, session, userProfile, loading, error } = useAuth();

  useEffect(() => {
    console.log('AUTH_DEBUG: State changed', {
      hasUser: !!user,
      hasSession: !!session,
      hasProfile: !!userProfile,
      loading,
      error,
      userId: user?.id,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null
    });
  }, [user, session, userProfile, loading, error]);

  return { user, session, userProfile, loading, error };
};
