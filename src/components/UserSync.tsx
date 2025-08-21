'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { syncUserToDatabase } from '@/lib/user-sync';

export default function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        console.log('User loaded, syncing to database:', user);
        
        try {
          const success = await syncUserToDatabase({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
            imageUrl: user.imageUrl || ''
          });

          if (success) {
            console.log('User synced successfully to database');
          } else {
            console.error('Failed to sync user to database');
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };

    syncUser();
  }, [user, isLoaded]);

  // Este componente no renderiza nada, solo maneja la sincronización
  return null;
}