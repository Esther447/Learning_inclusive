/**
 * Custom hook for Text-to-Speech functionality
 */

import { useCallback } from 'react';
import { textToSpeechService } from '../accessibility/textToSpeech';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const useTextToSpeech = () => {
  const { settings } = useAccessibilityStore();

  const speak = useCallback(
    (text: string) => {
      if (settings.textToSpeechEnabled && textToSpeechService.isAvailable()) {
        textToSpeechService.speak(text, {
          rate: settings.readingSpeed === 'slow' ? 0.8 : settings.readingSpeed === 'fast' ? 1.2 : 1.0,
        });
      }
    },
    [settings.textToSpeechEnabled, settings.readingSpeed]
  );

  const stop = useCallback(() => {
    textToSpeechService.stop();
  }, []);

  const pause = useCallback(() => {
    textToSpeechService.pause();
  }, []);

  const resume = useCallback(() => {
    textToSpeechService.resume();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isAvailable: textToSpeechService.isAvailable(),
    isEnabled: settings.textToSpeechEnabled,
  };
};

