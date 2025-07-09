import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { Card } from './ui/Card';
import { PrimaryButton, SecondaryButton } from './ui/Button';

export function PWAUpdatePrompt() {
  const { isUpdateAvailable, updateApp } = usePWA();

  if (!isUpdateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    updateApp();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/40 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-nested-container flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-400 mb-2">
            Update Available
          </h3>
          <p className="text-blue-300 mb-4">
            A new version of Hypertrophy Hub is available with improvements and bug fixes.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={handleUpdate}
              ariaLabel="Update now"
              className="bg-blue-500 hover:bg-blue-400 text-white"
            >
              <RefreshCw size={16} className="mr-2" />
              Update Now
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {}}
              ariaLabel="Update later"
              className="text-blue-300 border-blue-500/30"
            >
              Later
            </SecondaryButton>
          </div>
        </div>
      </div>
    </Card>
  );
}