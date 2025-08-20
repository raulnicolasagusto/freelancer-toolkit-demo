'use client';

import { Bell, Settings } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';

interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function NotificationButton({ onClick, disabled = false }: ActionButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    } else {
      // Funcionalidad futura - por ahora solo log
      console.log('Notificaciones - Funcionalidad próximamente');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative w-8 h-8 rounded-full 
        ${THEME_COLORS.topBar.actions.button.background}
        ${THEME_COLORS.topBar.actions.button.text}
        ${THEME_COLORS.topBar.actions.button.textHover}
        flex items-center justify-center
        ${THEME_COLORS.transitions.all}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={t('topBar.actions.notifications')}
    >
      <Bell className="h-4 w-4" />
      
      {/* Badge de notificaciones (ejemplo con 3 notificaciones) */}
      <span className={`
        absolute -top-1 -right-1 w-5 h-5 
        ${THEME_COLORS.topBar.actions.notification.badge}
        ${THEME_COLORS.topBar.actions.notification.badgeText}
        text-xs rounded-full 
        flex items-center justify-center
        font-medium
      `}>
        3
      </span>
    </button>
  );
}

export function SettingsButton({ onClick, disabled = false }: ActionButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    } else {
      // Funcionalidad futura - por ahora solo log
      console.log('Settings - Funcionalidad próximamente');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-8 h-8 rounded-full 
        ${THEME_COLORS.topBar.actions.button.background}
        ${THEME_COLORS.topBar.actions.button.text}
        ${THEME_COLORS.topBar.actions.button.textHover}
        flex items-center justify-center
        ${THEME_COLORS.transitions.all}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={t('topBar.actions.settings')}
    >
      <Settings className="h-4 w-4" />
    </button>
  );
}