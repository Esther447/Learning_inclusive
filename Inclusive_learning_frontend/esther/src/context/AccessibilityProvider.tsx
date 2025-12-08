/**
 * Accessibility Context Provider
 * Provides accessibility features throughout the application
 */

import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { keyboardNavigationService } from '../accessibility/keyboardNavigation';

interface AccessibilityContextType {
  // Methods will be exposed through the context
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { settings } = useAccessibilityStore();

  useEffect(() => {
    // Enable/disable keyboard navigation based on settings
    if (settings.keyboardOnlyNavigation) {
      keyboardNavigationService.enable();
    } else {
      keyboardNavigationService.disable();
    }

    // Apply high contrast mode
    if (settings.highContrastMode) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }

    // Apply font size
    document.documentElement.setAttribute('data-font-size', settings.fontSize || 'medium');

    // Apply color theme
    document.documentElement.setAttribute('data-theme', settings.colorTheme);

    // Apply simplified navigation
    if (settings.simplifiedNavigation) {
      document.documentElement.setAttribute('data-simplified', 'true');
    } else {
      document.documentElement.removeAttribute('data-simplified');
    }

    return () => {
      keyboardNavigationService.disable();
    };
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{}}>
      {children}
    </AccessibilityContext.Provider>
  );
};

