'use client';

import { THEME_COLORS } from '@/lib/theme-colors';
import { Breadcrumb } from './Breadcrumb';
import { SearchBar } from './SearchBar';
import { UserProfileButton } from './UserProfileButton';
import { NotificationButton, SettingsButton } from './ActionButtons';

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <header 
      className={`
        ${THEME_COLORS.topBar.background} 
        ${THEME_COLORS.topBar.border}
        px-6 py-4 flex items-center justify-between
        ${className || ''}
      `}
    >
      {/* Left side - Breadcrumbs */}
      <div className="flex items-center flex-1">
        <Breadcrumb />
      </div>

      {/* Right side - Search + Actions */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <SearchBar />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationButton />
          
          {/* Settings */}
          <SettingsButton />
          
          {/* User Profile */}
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
}