'use client';

import { createClient } from '@/utils/supabase/client';

export interface UserData {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  imageUrl?: string;
}

export async function syncUserToDatabase(userData: UserData): Promise<boolean> {
  try {
    const supabase = createClient();
    
    console.log('Syncing user to database:', userData);

    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userData.clerkUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', checkError);
      throw checkError;
    }

    if (existingUser) {
      console.log('User already exists in database:', existingUser.id);
      return true;
    }

    // Crear nuevo usuario
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        clerk_user_id: userData.clerkUserId,
        email: userData.email,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        username: userData.username || userData.email.split('@')[0],
        image_url: userData.imageUrl || '',
        preferences: {
          language: 'es',
          theme: 'dark'
        }
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      throw insertError;
    }

    console.log('User created successfully:', newUser);
    return true;
  } catch (error) {
    console.error('Error in syncUserToDatabase:', error);
    return false;
  }
}

export async function ensureUserExists(clerkUserId: string, email: string): Promise<boolean> {
  try {
    const result = await syncUserToDatabase({
      clerkUserId,
      email,
      firstName: '',
      lastName: '',
      username: email.split('@')[0]
    });
    return result;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return false;
  }
}