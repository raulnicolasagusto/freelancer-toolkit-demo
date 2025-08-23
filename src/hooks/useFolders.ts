'use client';

import { useState, useEffect } from 'react';
import { getFolders, buildFolderTree, type Folder } from '@/lib/snippets';
import { useAuth, useUser } from '@clerk/nextjs';

export function useFolders(type: 'snippets' | 'notes') {
  const { userId } = useAuth();
  const { user } = useUser();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderTree, setFolderTree] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFolders = async () => {
    if (!userId) {
      setFolders([]);
      setFolderTree([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      const foldersData = await getFolders(type, userId, userEmail);
      setFolders(foldersData);
      
      // Build tree structure
      const tree = buildFolderTree(foldersData);
      setFolderTree(tree);
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Error al cargar carpetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [type, userId]);

  useEffect(() => {
    // Escuchar eventos de carpetas creadas y eliminadas
    const handleFolderCreated = () => {
      loadFolders();
    };

    const handleFolderDeleted = () => {
      loadFolders();
    };

    window.addEventListener('folder-created', handleFolderCreated);
    window.addEventListener('folder-deleted', handleFolderDeleted);
    
    return () => {
      window.removeEventListener('folder-created', handleFolderCreated);
      window.removeEventListener('folder-deleted', handleFolderDeleted);
    };
  }, []);

  return {
    folders,
    folderTree,
    loading,
    error,
    refetch: loadFolders
  };
}