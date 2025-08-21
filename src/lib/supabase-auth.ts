'use client';

import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@clerk/nextjs';

export async function getAuthenticatedSupabaseClient() {
  const supabase = createClient();
  
  try {
    // Get Clerk session token
    const { getToken } = useAuth();
    const token = await getToken({ template: 'supabase' });
    
    if (token) {
      // Set auth header for Supabase
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // Not needed for Clerk integration
      });
    }
  } catch (error) {
    console.warn('Could not set Supabase auth:', error);
  }
  
  return supabase;
}