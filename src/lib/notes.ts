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
  is_deleted?: boolean;
  deleted_at?: string | null;
  deletion_type?: string | null;
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

// Datos de ejemplo para nuevos usuarios
const EXAMPLE_NOTES_DATA = [
  // Nota fija con imagen
  {
    title: '',
    content: 'prueba 2',
    type: 'image' as const,
    color: '#A7C8E0',
    is_pinned: true,
    image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTlmMmZmIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNzUiIHI9IjMwIiBmaWxsPSIjYzNkZGZkIi8+PHRleHQgeD0iNTAlIiB5PSI4NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzMzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIGRlIHBydWViYSAyPC90ZXh0Pjwvc3ZnPg==',
    category: 'general'
  },
  // Notas normales
  {
    title: '',
    content: 'Te damos la bienvenida a Google Keep\n\nCaptura tus ideas.\n\nAgrega notas, listas, fotos y audios a Keep.',
    type: 'text' as const,
    color: '#FFF8C4',
    is_pinned: false,
    category: 'general'
  },
  {
    title: '',
    content: 'Todo en un solo lugar\n\nSin importar la forma en la que accedas a Keep, todas las notas siempre están sincronizadas.\n\nEn la Web\nhttps://keep.google.com\n\nEn Android\nhttps://g.co/keep\n\nEn Chrome\nhttps://g.co/keepinchrome',
    type: 'text' as const,
    color: '#FFB5A0',
    is_pinned: false,
    category: 'general'
  },
  {
    title: '',
    content: 'Crear una lista',
    type: 'list' as const,
    color: '#A7CCBB',
    is_pinned: false,
    list_items: [
      { id: '1', text: '1 elemento completado', completed: true },
      { id: '2', text: 'Los elementos marcados pasan de forma automática al final de la...', completed: false }
    ],
    category: 'general'
  },
  {
    title: '',
    content: '¿Ya no usas más una nota?\n\nPresiona el botón para archivar o desliza el dedo para que desaparezca en Android.\n\n¡Pruébalo! Puedes buscarla cuando quieras.',
    type: 'text' as const,
    color: '#E8F5E8',
    is_pinned: false,
    category: 'general'
  }
];

// Función para crear notas de ejemplo para nuevos usuarios
export async function createExampleNotes(clerkUserId: string, userEmail?: string): Promise<void> {
  try {
    console.log('Creating example notes for new user:', clerkUserId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    // Verificar si el usuario ya tiene notas
    const { data: existingNotes, error: checkError } = await supabase
      .from('notes')
      .select('id')
      .eq('user_id', userData.id)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing notes:', checkError);
      return;
    }

    // Si ya tiene notas, no crear las de ejemplo
    if (existingNotes && existingNotes.length > 0) {
      console.log('User already has notes, skipping example creation');
      return;
    }

    // Crear todas las notas de ejemplo (sin columnas de papelera hasta que se ejecute el SQL)
    const notesToInsert = EXAMPLE_NOTES_DATA.map(note => ({
      ...note,
      user_id: userData.id,
      folder_id: null,
      tags: [],
      reminder_date: null,
      reminder_time: null,
      reminder_location: null
    }));

    const { data, error } = await supabase
      .from('notes')
      .insert(notesToInsert)
      .select();

    if (error) {
      console.error('Error creating example notes:', error);
      return;
    }

    console.log('Example notes created successfully:', data?.length, 'notes');
  } catch (error) {
    console.error('Error in createExampleNotes:', error);
  }
}

// Obtener todas las notas del usuario (excluyendo las eliminadas)
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

    // Construir query base
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userData.id);

    if (folderId === null) {
      query = query.is('folder_id', null);
    } else if (folderId) {
      query = query.eq('folder_id', folderId);
    }

    // Intentar con filtro de papelera primero
    try {
      const { data, error } = await query
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('updated_at', { ascending: false });

      if (error && (error.message?.includes('is_deleted') || error.message?.includes('deleted_at'))) {
        // Las columnas no existen, intentar sin filtro
        console.log('Trash columns not found, loading all notes without filter');
        const { data: fallbackData, error: fallbackError } = await query
          .order('updated_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Error fetching notes (fallback):', fallbackError);
          return [];
        }
        
        console.log('Notes loaded (fallback):', fallbackData);
        return fallbackData || [];
      }

      if (error) {
        console.error('Error fetching notes:', error);
        return [];
      }

      console.log('Notes loaded:', data);
      return data || [];
    } catch (error: any) {
      // Fallback: intentar sin filtro de papelera
      console.log('Fallback: loading notes without trash filter');
      try {
        const { data, error: fallbackError } = await query
          .order('updated_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Error fetching notes (fallback):', fallbackError);
          return [];
        }
        
        return data || [];
      } catch {
        console.error('Error in getNotes fallback:', error);
        return [];
      }
    }
  } catch (error) {
    console.error('Error in getNotes:', error);
    return [];
  }
}

// Obtener notas en la papelera
export async function getTrashedNotes(clerkUserId: string, userEmail?: string): Promise<Note[]> {
  try {
    console.log('Loading trashed notes for user:', clerkUserId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    // Verificar si las columnas de papelera existen
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userData.id)
        .eq('is_deleted', true) // Solo notas eliminadas
        .not('deleted_at', 'is', null) // Con fecha de eliminación
        .order('deleted_at', { ascending: false });

      if (error && error.message.includes('deleted_at')) {
        // Las columnas no existen, devolver array vacío
        console.log('Trash columns not found, returning empty array');
        return [];
      }

      if (error) {
        console.error('Error fetching trashed notes:', error);
        return [];
      }

      console.log('Trashed notes loaded:', data);
      return data || [];
    } catch (error: any) {
      if (error.message?.includes('deleted_at') || error.message?.includes('is_deleted')) {
        console.log('Trash columns not found, returning empty array');
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getTrashedNotes:', error);
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

    // Crear nota directamente (sin columnas de papelera hasta que se ejecute el SQL)
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

// Mover una nota a la papelera (eliminación suave)
export async function moveNoteToTrash(noteId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    console.log('Moving note to trash:', noteId);
    
    // Verificar si las columnas de papelera existen
    const { data: columns } = await supabase
      .from('notes')
      .select('is_deleted')
      .limit(1);
    
    if (columns !== null) {
      // Las columnas existen, usar eliminación suave
      const { error } = await supabase
        .from('notes')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deletion_type: 'soft'
        })
        .eq('id', noteId);

      if (error) {
        console.error('Error moving note to trash:', error);
        return false;
      }
    } else {
      // Las columnas no existen, usar eliminación permanente
      console.warn('Trash columns not found, deleting permanently');
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note permanently:', error);
        return false;
      }
    }

    console.log('Note moved to trash successfully');
    return true;
  } catch (error) {
    console.error('Error in moveNoteToTrash:', error);
    // Si hay error con columnas de papelera, intentar eliminación permanente
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      return !deleteError;
    } catch {
      return false;
    }
  }
}

// Eliminar una nota permanentemente
export async function deleteNotePermanently(noteId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    console.log('Deleting note permanently:', noteId);
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note permanently:', error);
      return false;
    }

    console.log('Note deleted permanently');
    return true;
  } catch (error) {
    console.error('Error in deleteNotePermanently:', error);
    return false;
  }
}

// Restaurar una nota de la papelera
export async function restoreNote(noteId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    console.log('Restoring note from trash:', noteId);
    
    const { error } = await supabase
      .from('notes')
      .update({
        is_deleted: false,
        deleted_at: null,
        deletion_type: null
      })
      .eq('id', noteId);

    if (error) {
      console.error('Error restoring note:', error);
      return false;
    }

    console.log('Note restored successfully');
    return true;
  } catch (error) {
    console.error('Error in restoreNote:', error);
    return false;
  }
}

// Eliminar una nota (función legacy que mantiene compatibilidad)
export async function deleteNote(noteId: string): Promise<boolean> {
  // Por defecto, mover a papelera
  return moveNoteToTrash(noteId);
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