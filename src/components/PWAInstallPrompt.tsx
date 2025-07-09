import React, { useState } from 'react';
import { Download, X, Smartphone, Monitor, Zap } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { Card } from './ui/Card';
import { PrimaryButton, SecondaryButton } from './ui/Button';
import { IconButton } from './ui/IconButton';

export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card className="bg-gradient-to-br from-theme-gold/20 to-theme-gold/5 border-theme-gold/40 mb-6 relative">
      <div className="absolute top-4 right-4">
        <IconButton
          onClick={handleDismiss}
          ariaLabel="Dismiss install prompt"
          className="p-2 text-theme-gold-dark hover:text-theme-gold"
        >
          <X size={16} />
        </IconButton>
      </div>

      <div className="pr-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-theme-gold/20 rounded-nested-container flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-theme-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-theme-gold mb-2">
              Install Hypertrophy Hub
            </h3>
            <p className="text-theme-gold-dark mb-4">
              Get the full app experience with offline access, faster loading, and native app features.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-theme-black-lighter rounded-2x-nested-container">
            <Zap className="w-5 h-5 text-theme-gold flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-theme-gold">Lightning Fast</div>
              <div className="text-xs text-theme-gold-dark">Instant loading</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-theme-black-lighter rounded-2x-nested-container">
            <Smartphone className="w-5 h-5 text-theme-gold flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-theme-gold">Works Offline</div>
              <div className="text-xs text-theme-gold-dark">No internet needed</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-theme-black-lighter rounded-2x-nested-container">
            <Monitor className="w-5 h-5 text-theme-gold flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-theme-gold">Native Feel</div>
              <div className="text-xs text-theme-gold-dark">Like a real app</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton
            onClick={handleInstall}
            ariaLabel="Install Hypertrophy Hub"
          >
            <Download size={16} className="mr-2" />
            Install App
          </PrimaryButton>
          
          <SecondaryButton
            onClick={handleDismiss}
            ariaLabel="Maybe later"
          >
            Maybe Later
          </SecondaryButton>
        </div>
      </div>
    </Card>
  );
}