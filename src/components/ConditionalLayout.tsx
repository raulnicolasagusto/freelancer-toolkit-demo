"use client";

import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
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
  
  // Mientras no esté montado o cargando, mostrar loading simple
  if (!isMounted || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className={`w-16 h-16 ${THEME_COLORS.logo.background} rounded-2xl flex items-center justify-center mb-4`}>
            <div className="w-8 h-8 bg-white/20 rounded"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Si es una ruta de auth o el usuario no está autenticado, mostrar sin sidebar
  if (isAuthRoute || !isSignedIn) {
    return <>{children}</>;
  }
  
  // Si el usuario está autenticado y no es ruta de auth, mostrar con sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={`flex-1 overflow-auto ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}