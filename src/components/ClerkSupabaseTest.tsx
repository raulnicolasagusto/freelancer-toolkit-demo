'use client';

import { useUser, useSession } from '@clerk/nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';

export function ClerkSupabaseTest() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      if (!isLoaded) return;

      try {
        const info: any = {
          clerkStatus: {
            isLoaded,
            hasUser: !!user,
            userId: user?.id,
            email: user?.emailAddresses[0]?.emailAddress,
            hasSession: !!session
          },
          sessionToken: null,
          supabaseTest: null
        };

        // Test 1: Obtener token de Clerk
        if (session) {
          try {
            const token = await session.getToken();
            info.sessionToken = {
              exists: !!token,
              length: token?.length || 0,
              preview: token ? `${token.substring(0, 20)}...` : null
            };

            // Test 2: Crear cliente Supabase con token
            if (token) {
              const supabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                  accessToken: async () => token,
                }
              );

              // Test 3: Probar query con JWT
              const { data: jwtData, error: jwtError } = await supabase
                .rpc('debug_jwt');
              
              info.supabaseTest = {
                jwtContent: jwtData,
                jwtError: jwtError?.message,
                hasJWT: !!jwtData
              };

              // Test 4: Intentar insertar usuario
              if (user && jwtData) {
                const userData = {
                  clerk_user_id: user.id,
                  email: user.emailAddresses[0]?.emailAddress,
                  first_name: user.firstName,
                  last_name: user.lastName,
                  username: user.username,
                  image_url: user.imageUrl,
                  created_at: user.createdAt,
                  updated_at: user.updatedAt
                };

                const { data: insertData, error: insertError } = await supabase
                  .from('users')
                  .upsert(userData, {
                    onConflict: 'clerk_user_id'
                  })
                  .select()
                  .single();

                info.userSync = {
                  success: !insertError,
                  error: insertError?.message,
                  userData: insertData
                };
              }
            }
          } catch (tokenError) {
            info.sessionToken = { error: tokenError instanceof Error ? tokenError.message : 'Token error' };
          }
        }

        setDebugInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    runTests();
  }, [user, session, isLoaded]);

  if (!isLoaded) {
    return (
      <div className={`p-6 rounded-lg ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.card.border} border`}>
        <p>Cargando Clerk...</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.card.border} border`}>
      <h3 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title} mb-4`}>
        🔍 Diagnóstico Clerk + Supabase
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {debugInfo && (
        <div className="space-y-4">
          {/* Clerk Status */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h4 className="font-semibold mb-2">1. Estado de Clerk</h4>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(debugInfo.clerkStatus, null, 2)}
            </pre>
          </div>

          {/* Session Token */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
            <h4 className="font-semibold mb-2">2. Token de Sesión</h4>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(debugInfo.sessionToken, null, 2)}
            </pre>
          </div>

          {/* Supabase Test */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
            <h4 className="font-semibold mb-2">3. Test Supabase JWT</h4>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(debugInfo.supabaseTest, null, 2)}
            </pre>
          </div>

          {/* User Sync */}
          {debugInfo.userSync && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <h4 className="font-semibold mb-2">4. Sincronización Usuario</h4>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(debugInfo.userSync, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p>No hay usuario logueado. Inicia sesión para ver el diagnóstico.</p>
        </div>
      )}
    </div>
  );
}