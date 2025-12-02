/**
 * Accessibility Settings Store (Clean Fixed Version)
 */

import { create } from 'zustand';
import type { AccessibilitySettings } from '../types';

interface AccessibilityState {
    settings: AccessibilitySettings;
    updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
    resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
    screenReaderEnabled: false,
    textToSpeechEnabled: false,
    highContrastMode: false,
    fontSize: 'medium',
    colorTheme: 'default',
    brailleDisplaySupport: false,
    captionsEnabled: true,
    transcriptsEnabled: true,
    signLanguageEnabled: false,
    volumeBoost: 0,
    voiceOutputEnabled: false,
    symbolBasedCommunication: false,
    alternativeInputMethods: [],
    keyboardOnlyNavigation: false,
    voiceCommandNavigation: false,
    switchControlEnabled: false,
    simplifiedNavigation: false,
    chunkedContent: false,
    visualCues: true,
    remindersEnabled: false,
    readingSpeed: 'normal',
};

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
    settings: defaultSettings,

    updateSettings: (newSettings) =>
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        })),

    resetSettings: () => set({ settings: defaultSettings }),
}));
