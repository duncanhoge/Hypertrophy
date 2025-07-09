import React from 'react';
import { Dumbbell } from 'lucide-react';
import { UserMenu } from './ui/UserMenu';

interface AppHeaderProps {
  title?: string;
  showUserMenu?: boolean;
}

export function AppHeader({ title, showUserMenu = true }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-theme-gold" />
          <span className="text-xl font-bold text-theme-gold">Hypertrophy Hub</span>
        </div>
        {title && (
          <>
            <div className="w-px h-6 bg-theme-gold/30"></div>
            <h1 className="text-lg font-semibold text-theme-gold-light">{title}</h1>
          </>
        )}
      </div>

      {/* User Menu */}
      {showUserMenu && <UserMenu />}
    </header>
  );
}