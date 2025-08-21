'use client';

import { useUser, useSession } from '@clerk/nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { useState, useMemo } from 'react';

/**
 * Hook personalizado para manejar la integración de Clerk con Supabase
 * Proporciona el cliente de Supabase configurado con el usuario actual de Clerk
 */
export function useSupabaseClient() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  
  // Crear cliente de Supabase con token de Clerk
  const supabase = useMemo(() => {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => {
          // Obtener token de la sesión de Clerk
          return session?.getToken() ?? null;
        },
      }
    );
  }, [session]);

  // Función para obtener el ID del usuario de Clerk
  const getClerkUserId = () => {
    return user?.id || null;
  };

  // Función para obtener datos del usuario para Supabase
  const getUserData = () => {
    if (!user) return null;

    return {
      clerk_user_id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      image_url: user.imageUrl,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };
  };

  // Función helper para sincronizar usuario con Supabase usando auth.jwt()
  const syncUserWithSupabase = async () => {
    if (!user || !isLoaded || !session) return null;

    const userData = getUserData();
    if (!userData) return null;

    try {
      // Intentar insertar o actualizar el usuario en Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'clerk_user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error syncing user with Supabase:', error);
        console.error('Full error details:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error syncing user with Supabase:', error);
      return null;
    }
  };

  return {
    supabase,
    user,
    isLoaded,
    getClerkUserId,
    getUserData,
    syncUserWithSupabase
  };
}