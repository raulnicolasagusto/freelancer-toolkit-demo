'use client';

import { createClient } from '@/utils/supabase/client';
import { useAuth, useUser } from '@clerk/nextjs';

export async function getAuthenticatedSupabase() {
  const supabase = createClient();
  
  return supabase; // For now, return basic client
}

// Hook para usar Supabase autenticado
export function useAuthenticatedSupabase() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const getSupabase = async () => {
    const supabase = createClient();
    
    if (isSignedIn && user) {
      try {
        // Por ahora usamos el cliente básico
        // TODO: Configurar token de Clerk para Supabase
        return supabase;
      } catch (error) {
        console.warn('Auth setup failed:', error);
      }
    }
    
    return supabase;
  };
  
  return { getSupabase, isAuthenticated: isSignedIn, user };
}