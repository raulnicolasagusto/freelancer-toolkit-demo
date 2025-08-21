'use client';

// API simulada para desarrollo - reemplazar con Supabase cuando esté configurado

export interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  type: 'snippets' | 'notes';
  color: string;
  icon: string;
  children?: Folder[];
}

export interface Snippet {
  id: string;
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

// Storage temporal en localStorage
const FOLDERS_KEY = 'devtoolkit_folders';
const SNIPPETS_KEY = 'devtoolkit_snippets';

// Funciones para Folders
export async function getFolders(type: 'snippets' | 'notes'): Promise<Folder[]> {
  try {
    const stored = localStorage.getItem(FOLDERS_KEY);
    const allFolders: Folder[] = stored ? JSON.parse(stored) : [];
    return allFolders.filter(f => f.type === type);
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

export async function createFolder(folderData: {
  name: string;
  type: 'snippets' | 'notes';
  parent_folder_id?: string | null;
  color?: string;
  icon?: string;
}): Promise<Folder> {
  try {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderData.name,
      type: folderData.type,
      parent_folder_id: folderData.parent_folder_id || null,
      color: folderData.color || '#6366f1',
      icon: folderData.icon || 'folder'
    };

    const stored = localStorage.getItem(FOLDERS_KEY);
    const folders: Folder[] = stored ? JSON.parse(stored) : [];
    folders.push(newFolder);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));

    console.log('Folder created in localStorage:', newFolder);
    return newFolder;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// Funciones para Snippets
export async function getSnippets(folderId?: string | null): Promise<Snippet[]> {
  try {
    const stored = localStorage.getItem(SNIPPETS_KEY);
    const allSnippets: Snippet[] = stored ? JSON.parse(stored) : [];
    
    if (folderId === null) {
      return allSnippets.filter(s => !s.folder_id);
    } else if (folderId) {
      return allSnippets.filter(s => s.folder_id === folderId);
    }
    
    return allSnippets;
  } catch (error) {
    console.error('Error getting snippets:', error);
    return [];
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
}): Promise<Snippet> {
  try {
    const newSnippet: Snippet = {
      id: Date.now().toString(),
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const stored = localStorage.getItem(SNIPPETS_KEY);
    const snippets: Snippet[] = stored ? JSON.parse(stored) : [];
    snippets.push(newSnippet);
    localStorage.setItem(SNIPPETS_KEY, JSON.stringify(snippets));

    console.log('Snippet created in localStorage:', newSnippet);
    return newSnippet;
  } catch (error) {
    console.error('Error creating snippet:', error);
    throw error;
  }
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