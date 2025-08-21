'use client';

import { createClient } from '@/utils/supabase/client';

export interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  type: 'snippets' | 'notes';
  color: string;
  icon: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  language: string;
  code: string;
  type: 'snippet' | 'markdown';
  observations?: string;
  tabs?: any[];
  folder_id?: string | null;
  tags?: string[];
  is_public: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to get user data - simplified
async function getUserData(clerkUserId: string, userEmail?: string) {
  const supabase = createClient();
  
  console.log('Getting user data for:', clerkUserId);
  
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

// Funciones para Folders
export async function getFolders(type: 'snippets' | 'notes', clerkUserId?: string, userEmail?: string): Promise<Folder[]> {
  try {
    if (!clerkUserId) {
      console.error('No clerk user ID provided');
      return [];
    }

    console.log('Loading folders for user:', clerkUserId, 'type:', type);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    console.log('User data for folders:', userData);

    // Obtener carpetas del usuario
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userData.id)
      .eq('type', type)
      .order('name');

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    console.log('Folders loaded:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getFolders:', error);
    return [];
  }
}

export async function createFolder(folderData: {
  name: string;
  type: 'snippets' | 'notes';
  parent_folder_id?: string | null;
  color?: string;
  icon?: string;
}, clerkUserId?: string, userEmail?: string): Promise<Folder | null> {
  try {
    if (!clerkUserId) {
      throw new Error('No clerk user ID provided');
    }

    const supabase = createClient();
    console.log('Creating folder with data:', folderData);
    
    const userData = await getUserData(clerkUserId, userEmail);

    // Crear carpeta directamente
    const { data, error } = await supabase
      .from('folders')
      .insert([{
        name: folderData.name,
        type: folderData.type,
        parent_folder_id: folderData.parent_folder_id || null,
        color: folderData.color || '#6366f1',
        icon: folderData.icon || 'folder',
        user_id: userData.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      throw error;
    }

    console.log('Folder created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createFolder:', error);
    throw error;
  }
}

export async function updateFolder(folderId: string, updates: Partial<Folder>): Promise<Folder | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', folderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating folder:', error);
    return null;
  }

  return data;
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId);

  if (error) {
    console.error('Error deleting folder:', error);
    return false;
  }

  return true;
}

// Funciones para Snippets
export async function getSnippets(folderId?: string | null, clerkUserId?: string, userEmail?: string): Promise<Snippet[]> {
  try {
    if (!clerkUserId) {
      console.error('No clerk user ID provided');
      return [];
    }

    console.log('Loading snippets for user:', clerkUserId, 'folder:', folderId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    console.log('User data for snippets:', userData);

    // Construir query para snippets
    let query = supabase
      .from('snippets')
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
      console.error('Error fetching snippets:', error);
      return [];
    }

    console.log('Snippets loaded:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getSnippets:', error);
    return [];
  }
}

export async function getSnippetById(snippetId: string, clerkUserId?: string, userEmail?: string): Promise<Snippet | null> {
  try {
    if (!clerkUserId) {
      console.error('No clerk user ID provided');
      return null;
    }

    console.log('Loading snippet by ID:', snippetId, 'for user:', clerkUserId);
    const supabase = createClient();
    const userData = await getUserData(clerkUserId, userEmail);

    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('id', snippetId)
      .eq('user_id', userData.id)
      .single();

    if (error) {
      console.error('Error fetching snippet:', error);
      return null;
    }

    console.log('Snippet loaded:', data);
    return data;
  } catch (error) {
    console.error('Error in getSnippetById:', error);
    return null;
  }
}

export async function createSnippet(snippetData: {
  title: string;
  type: 'snippet' | 'markdown';
  code: string;
  language?: string;
  description?: string;
  observations?: string;
  tabs?: any[];
  folder_id?: string | null;
  tags?: string[];
  is_public?: boolean;
  is_favorite?: boolean;
}, clerkUserId?: string): Promise<Snippet | null> {
  try {
    if (!clerkUserId) {
      throw new Error('No clerk user ID provided');
    }

    const supabase = createClient();
    console.log('Creating snippet with data:', snippetData);
    
    const userData = await getUserData(clerkUserId);

    // Crear snippet directamente
    const { data, error } = await supabase
      .from('snippets')
      .insert([{
        title: snippetData.title,
        type: snippetData.type,
        code: snippetData.code,
        language: snippetData.language || (snippetData.type === 'markdown' ? 'markdown' : 'javascript'),
        description: snippetData.description || '',
        observations: snippetData.observations,
        tabs: snippetData.tabs || [],
        folder_id: snippetData.folder_id,
        tags: snippetData.tags || [],
        is_public: snippetData.is_public || false,
        is_favorite: snippetData.is_favorite || false,
        user_id: userData.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating snippet:', error);
      throw error;
    }

    console.log('Snippet created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createSnippet:', error);
    throw error;
  }
}

export async function updateSnippet(snippetId: string, updates: Partial<Snippet>): Promise<Snippet | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('snippets')
    .update(updates)
    .eq('id', snippetId)
    .select()
    .single();

  if (error) {
    console.error('Error updating snippet:', error);
    return null;
  }

  return data;
}

export async function deleteSnippet(snippetId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', snippetId);

  if (error) {
    console.error('Error deleting snippet:', error);
    return false;
  }

  return true;
}

// Función helper para construir árbol de carpetas
export function buildFolderTree(folders: Folder[]): Folder[] {
  const folderMap = new Map<string, Folder & { children: Folder[] }>();
  const rootFolders: (Folder & { children: Folder[] })[] = [];

  // Crear mapa de carpetas con children
  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Construir árbol
  folders.forEach(folder => {
    const folderWithChildren = folderMap.get(folder.id)!;
    
    if (folder.parent_folder_id && folderMap.has(folder.parent_folder_id)) {
      const parent = folderMap.get(folder.parent_folder_id)!;
      parent.children.push(folderWithChildren);
    } else {
      rootFolders.push(folderWithChildren);
    }
  });

  return rootFolders;
}