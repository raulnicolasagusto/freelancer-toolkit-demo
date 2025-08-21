'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { THEME_COLORS } from '@/lib/theme-colors';
import { LoadingSpinner } from './LoadingSpinner';
import { Database, CheckCircle, XCircle, User } from 'lucide-react';

interface ConnectionStatus {
  supabase: boolean;
  clerk: boolean;
  tables: string[];
  error?: string;
}

export function DatabaseTest() {
  const { supabase, user, isLoaded, syncUserWithSupabase } = useSupabaseClient();
  const [status, setStatus] = useState<ConnectionStatus>({
    supabase: false,
    clerk: false,
    tables: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnections = async () => {
      setLoading(true);
      
      try {
        // Test Clerk connection
        const clerkStatus = isLoaded && !!user;
        
        // Test Supabase connection
        let supabaseStatus = false;
        let tables: string[] = [];
        let error: string | undefined;

        try {
          // Intentar hacer una consulta simple a Supabase
          const { data, error: supabaseError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(10);

          if (supabaseError) {
            error = supabaseError.message;
            supabaseStatus = false;
          } else {
            supabaseStatus = true;
            tables = data?.map(table => table.table_name) || [];
          }
        } catch (err) {
          error = err instanceof Error ? err.message : 'Error desconocido';
          supabaseStatus = false;
        }

        setStatus({
          supabase: supabaseStatus,
          clerk: clerkStatus,
          tables,
          error
        });

        // Si ambas conexiones funcionan, intentar sincronizar usuario
        if (clerkStatus && supabaseStatus && user) {
          await syncUserWithSupabase();
        }

      } catch (err) {
        setStatus({
          supabase: false,
          clerk: false,
          tables: [],
          error: err instanceof Error ? err.message : 'Error desconocido'
        });
      } finally {
        setLoading(false);
      }
    };

    testConnections();
  }, [supabase, user, isLoaded, syncUserWithSupabase]);

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.card.border} border`}>
        <LoadingSpinner size="md" text="Probando conexiones..." />
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${THEME_COLORS.dashboard.card.background} ${THEME_COLORS.dashboard.card.border} border`}>
      <div className="flex items-center space-x-3 mb-6">
        <Database className={`h-6 w-6 ${THEME_COLORS.icons.dashboard}`} />
        <h3 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title}`}>
          Estado de Conexiones
        </h3>
      </div>

      <div className="space-y-4">
        {/* Clerk Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <span className={`font-medium ${THEME_COLORS.dashboard.title}`}>
              Clerk Authentication
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {status.clerk ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm ${status.clerk ? 'text-green-600' : 'text-red-600'}`}>
              {status.clerk ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Supabase Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5" />
            <span className={`font-medium ${THEME_COLORS.dashboard.title}`}>
              Supabase Database
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {status.supabase ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm ${status.supabase ? 'text-green-600' : 'text-red-600'}`}>
              {status.supabase ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* User Info */}
        {status.clerk && user && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className={`font-medium mb-2 ${THEME_COLORS.dashboard.title}`}>
              Usuario Actual
            </h4>
            <div className={`text-sm ${THEME_COLORS.dashboard.subtitle} space-y-1`}>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
            </div>
          </div>
        )}

        {/* Tables Info */}
        {status.supabase && status.tables.length > 0 && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <h4 className={`font-medium mb-2 ${THEME_COLORS.dashboard.title}`}>
              Tablas Disponibles ({status.tables.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {status.tables.map(table => (
                <span 
                  key={table}
                  className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded"
                >
                  {table}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Info */}
        {status.error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
            <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">
              Error de Conexión
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300">
              {status.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}