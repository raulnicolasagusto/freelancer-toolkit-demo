'use client';

import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

export function useSupabase() {
  const { getToken, isSignedIn } = useAuth();
  
  const supabase = useMemo(() => {
    const client = createClient();
    
    // Configure auth if user is signed in
    if (isSignedIn) {
      getToken({ template: 'supabase' }).then((token) => {
        if (token) {
          client.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        }
      }).catch((error) => {
        console.warn('Could not set Supabase auth:', error);
      });
    }
    
    return client;
  }, [getToken, isSignedIn]);

  return { supabase, isAuthenticated: isSignedIn };
}