import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LogoutButton } from './LogoutButton';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  const userEmail = user.email || 'User';
  const displayName = userEmail.split('@')[0]; // Use part before @ as display name

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 p-2 bg-theme-black-lighter hover:bg-theme-black border border-theme-gold/30 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-theme-gold/20 rounded-full flex items-center justify-center">
          <User size={16} className="text-theme-gold" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-theme-gold truncate max-w-32">
            {displayName}
          </div>
          <div className="text-xs text-theme-gold-dark truncate max-w-32">
            {userEmail}
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-theme-gold-dark transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-theme-black-light border border-theme-gold/20 rounded-nested-container shadow-lg z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-theme-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-theme-gold/20 rounded-full flex items-center justify-center">
                <User size={20} className="text-theme-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-theme-gold truncate">
                  {displayName}
                </div>
                <div className="text-xs text-theme-gold-dark truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Account Settings (placeholder for future) */}
            <button
              className="w-full flex items-center gap-3 p-3 text-theme-gold-dark hover:text-theme-gold hover:bg-theme-gold/10 rounded-2x-nested-container transition-colors duration-150"
              onClick={() => {
                setIsOpen(false);
                // TODO: Implement account settings
                alert('Account settings coming soon!');
              }}
            >
              <Settings size={16} />
              <span className="text-sm">Account Settings</span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-theme-gold/20"></div>

            {/* Logout */}
            <div className="p-1">
              <LogoutButton variant="full" showText className="w-full justify-start" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}