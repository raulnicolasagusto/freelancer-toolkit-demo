"use client";

import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { THEME_COLORS } from '@/lib/theme-colors';
import { useEffect, useState } from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Evitar hidration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Rutas que no necesitan sidebar (páginas de auth)
  const authRoutes = ['/sign-in', '/sign-up'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Mientras no esté montado o cargando, mostrar loading premium
  if (!isMounted || !isLoaded) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
        <LoadingSpinner size="lg" text="Iniciando DevToolkit..." />
      </div>
    );
  }
  
  // Si es una ruta de auth o el usuario no está autenticado, mostrar sin sidebar
  if (isAuthRoute || !isSignedIn) {
    return <>{children}</>;
  }
  
  // Si el usuario está autenticado y no es ruta de auth, mostrar con sidebar y topbar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className={`flex-1 flex flex-col ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
          {/* Verificar si es una página que necesita altura completa */}
          {pathname.includes('/create') || pathname.includes('/edit') || pathname.includes('/snippets/create') ? (
            <div className="flex-1 h-full px-6 lg:px-8 pt-6 lg:pt-8">
              {children}
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-6 lg:p-8">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}