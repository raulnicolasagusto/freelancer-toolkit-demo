'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { User, Loader2 } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';

export function UserProfileButton() {
  const { user, isLoaded } = useUser();

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`
        w-8 h-8 rounded-full 
        ${THEME_COLORS.topBar.actions.button.background}
        flex items-center justify-center
        ${THEME_COLORS.transitions.all}
      `}>
        <Loader2 className={`h-4 w-4 ${THEME_COLORS.topBar.actions.button.text} animate-spin`} />
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar icono genérico
  if (!user) {
    return (
      <button
        className={`
          w-8 h-8 rounded-full 
          ${THEME_COLORS.topBar.actions.button.background}
          ${THEME_COLORS.topBar.actions.button.text}
          ${THEME_COLORS.topBar.actions.button.textHover}
          flex items-center justify-center
          ${THEME_COLORS.transitions.all}
        `}
        title={t('topBar.actions.profile')}
      >
        <User className="h-4 w-4" />
      </button>
    );
  }

  // Usuario autenticado - usar UserButton de Clerk
  return (
    <div className="flex items-center">
      <UserButton
        appearance={{
          elements: {
            avatarBox: `
              w-8 h-8 rounded-full
              ring-2 ring-transparent
              hover:ring-blue-500/20
              ${THEME_COLORS.transitions.all}
            `,
            userButtonPopoverCard: `
              ${THEME_COLORS.topBar.search.results.background}
              ${THEME_COLORS.topBar.search.results.border}
              ${THEME_COLORS.topBar.search.results.shadow}
            `,
            userButtonPopoverActions: `
              ${THEME_COLORS.topBar.search.results.background}
            `,
            userButtonPopoverActionButton: `
              ${THEME_COLORS.topBar.search.results.item.background}
              ${THEME_COLORS.topBar.search.results.item.text}
              ${THEME_COLORS.transitions.all}
            `,
            userButtonPopoverActionButtonText: `
              ${THEME_COLORS.topBar.search.results.item.text}
            `,
            userButtonPopoverFooter: `
              ${THEME_COLORS.topBar.search.results.background}
              ${THEME_COLORS.topBar.search.results.border}
            `
          }
        }}
        afterSignOutUrl="/sign-in"
        showName={false}
      />
    </div>
  );
}