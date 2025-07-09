import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-nested-container px-4 py-2 flex items-center gap-2 text-red-200">
        <WifiOff size={16} />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  );
}