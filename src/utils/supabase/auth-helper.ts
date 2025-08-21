'use client';

import { useAuth } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/client';

export async function getAuthenticatedSupabaseClient() {
  const { getToken, userId } = useAuth();
  
  if (!userId) {
    throw new Error('No authenticated user found');
  }

  const supabaseAccessToken = await getToken({ template: 'supabase' });
  
  if (!supabaseAccessToken) {
    throw new Error('Could not get Supabase token');
  }

  const supabase = createClient();
  
  // Set the session using the Clerk token
  await supabase.auth.setSession({
    access_token: supabaseAccessToken,
    refresh_token: '',
  });

  return { supabase, userId };
}

// Helper function to get user data from our database
export async function getCurrentUserData(supabase: any, clerkUserId: string) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (userError || !userData) {
    throw new Error('User not found in database');
  }

  return userData;
}