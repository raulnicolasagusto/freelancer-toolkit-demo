'use client';

import { createClient } from '@/utils/supabase/client';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'image';
  color: string;
  is_pinned: boolean;
  image_url?: string;
  list_items?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  category?: string;
  tags?: string[];
  folder_id?: string | null;
  reminder_date?: string;
  reminder_time?: string;
  reminder_location?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to get user data - reutilizada de snippets
async function getUserData(clerkUserId: string, userEmail?: string) {
  const supabase = createClient();
  
  console.log('Getting user data for notes:', clerkUserId);
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (userError || !userData) {
    console.log('User not found, creating:', clerkUserId, userEmail);
    
    // Usar upsert para evitar errores de duplicado
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .upsert([{
        clerk_user_id: clerkUserId,
        email: userEmail || '',
        first_name: '',
        last_name: '',
        username: userEmail?.split('@')[0] || clerkUserId,
        image_url: '',
        preferences: { language: 'es', theme: 'dark' }
      }], {
        onConflict: 'clerk_user_id'
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      throw new Error('Could not create user: ' + createError.message);
    }

    console.log('User created successfully:', newUser);
    return newUser;
  }

  console.log('User found:', userData);
  return userData;
}

// Obtener todas las notas del usuario
export async function getNotes(folderId?: string | null, clerkUserId?: string, userEmail?: string): Promise<Note[]> {
  try {
    if (!clerkUserId) {
      console.error('No clerk user ID provided');
      return [];
    }

    console.log('Loading notes for user:', clerkUserId, 'folder:', folderId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    console.log('User data for notes:', userData);

    // Construir query para notas
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userData.id)
      .order('updated_at', { ascending: false });

    if (folderId === null) {
      query = query.is('folder_id', null);
    } else if (folderId) {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    console.log('Notes loaded:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getNotes:', error);
    return [];
  }
}

// Obtener una nota por ID
export async function getNoteById(noteId: string, clerkUserId?: string, userEmail?: string): Promise<Note | null> {
  try {
    if (!clerkUserId) {
      console.error('No clerk user ID provided');
      return null;
    }

    console.log('Loading note by ID:', noteId, 'for user:', clerkUserId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', userData.id)
      .single();

    if (error) {
      console.error('Error fetching note:', error);
      return null;
    }

    console.log('Note loaded:', data);
    return data;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    return null;
  }
}

// Crear una nueva nota
export async function createNote(noteData: {
  title: string;
  content: string;
  type: 'text' | 'list' | 'image';
  color?: string;
  is_pinned?: boolean;
  image_url?: string;
  list_items?: Array<{ id: string; text: string; completed: boolean }>;
  category?: string;
  tags?: string[];
  folder_id?: string | null;
  reminder_date?: string;
  reminder_time?: string;
  reminder_location?: string;
}, clerkUserId?: string, userEmail?: string): Promise<Note | null> {
  try {
    if (!clerkUserId) {
      throw new Error('No clerk user ID provided');
    }

    const supabase = createClient();
    console.log('Creating note with data:', noteData);
    
    const userData = await getUserData(clerkUserId, userEmail);

    // Crear nota directamente
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        title: noteData.title,
        content: noteData.content,
        type: noteData.type,
        color: noteData.color || '#FFFFFF',
        is_pinned: noteData.is_pinned || false,
        image_url: noteData.image_url,
        list_items: noteData.list_items || [],
        category: noteData.category || 'general',
        tags: noteData.tags || [],
        folder_id: noteData.folder_id,
        reminder_date: noteData.reminder_date,
        reminder_time: noteData.reminder_time,
        reminder_location: noteData.reminder_location,
        user_id: userData.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    console.log('Note created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
}

// Actualizar una nota existente
export async function updateNote(noteId: string, updates: Partial<Note>): Promise<Note | null> {
  try {
    const supabase = createClient();
    console.log('Updating note:', noteId, 'with data:', updates);
    
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return null;
    }

    console.log('Note updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateNote:', error);
    return null;
  }
}

// Eliminar una nota
export async function deleteNote(noteId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    console.log('Deleting note:', noteId);
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      return false;
    }

    console.log('Note deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteNote:', error);
    return false;
  }
}

// Cambiar estado de pin de una nota
export async function toggleNotePin(noteId: string): Promise<Note | null> {
  try {
    const supabase = createClient();
    console.log('Toggling pin for note:', noteId);
    
    // Primero obtener el estado actual
    const { data: currentNote, error: fetchError } = await supabase
      .from('notes')
      .select('is_pinned')
      .eq('id', noteId)
      .single();

    if (fetchError || !currentNote) {
      console.error('Error fetching current note state:', fetchError);
      return null;
    }

    // Alternar el estado
    const { data, error } = await supabase
      .from('notes')
      .update({ is_pinned: !currentNote.is_pinned })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling note pin:', error);
      return null;
    }

    console.log('Note pin toggled successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in toggleNotePin:', error);
    return null;
  }
}

// Duplicar una nota
export async function duplicateNote(noteId: string, clerkUserId?: string): Promise<Note | null> {
  try {
    if (!clerkUserId) {
      throw new Error('No clerk user ID provided');
    }

    const supabase = createClient();
    console.log('Duplicating note:', noteId);
    
    // Obtener la nota original
    const { data: originalNote, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (fetchError || !originalNote) {
      console.error('Error fetching original note:', fetchError);
      return null;
    }

    // Crear copia con título modificado
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...originalNote,
        id: undefined, // Let DB generate new ID
        title: `${originalNote.title} (Copia)`,
        is_pinned: false, // Duplicates are not pinned by default
        created_at: undefined, // Let DB set current time
        updated_at: undefined, // Let DB set current time
      }])
      .select()
      .single();

    if (error) {
      console.error('Error duplicating note:', error);
      return null;
    }

    console.log('Note duplicated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in duplicateNote:', error);
    return null;
  }
}