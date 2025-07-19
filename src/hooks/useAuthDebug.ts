
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthDebug = () => {
  const { user, userProfile, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      } : null,
      userProfile: userProfile ? {
        user_id: userProfile.user_id,
        role: userProfile.role,
        full_name: userProfile.full_name,
        consent_given: userProfile.consent_given,
        linked_user_id: userProfile.linked_user_id
      } : null,
      loading,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    console.log('Auth Debug Info (staging schema):', info);
  }, [user, userProfile, loading]);

  return {
    user,
    userProfile,
    loading,
    debugInfo
  };
};
