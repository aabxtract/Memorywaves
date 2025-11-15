'use client';

import { Web3Provider } from '@/contexts/Web3Context';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

/**
 * Applies the user's custom theme from localStorage on initial load.
 * This runs on the client after hydration.
 */
function ThemeApplier() {
  useEffect(() => {
    const themeJSON = localStorage.getItem('memory-weavers-theme');
    if (themeJSON) {
      try {
        const theme = JSON.parse(themeJSON);
        const root = document.documentElement;
        if (theme.background) root.style.setProperty('--background', theme.background);
        if (theme.primary) root.style.setProperty('--primary', theme.primary);
        if (theme.accent) root.style.setProperty('--accent', theme.accent);
      } catch (error) {
        console.error("Failed to parse theme from localStorage", error);
        localStorage.removeItem('memory-weavers-theme');
      }
    }
  }, []); // Runs once on mount

  return null; // This component only runs an effect
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
        <ThemeApplier />
        {children}
        <Toaster />
    </Web3Provider>
  );
}
