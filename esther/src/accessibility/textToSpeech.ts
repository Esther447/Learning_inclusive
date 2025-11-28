/**
 * Text-to-Speech Service
 * Provides TTS functionality for blind/low vision learners
 */

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private isEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isEnabled = true;
    }
  }

  /**
   * Speak text using browser's Web Speech API
   */
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  }): void {
    if (!this.synth || !this.isEnabled) {
      console.warn('Text-to-speech is not available');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    utterance.lang = options?.lang ?? 'en-US';

    this.synth.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  /**
   * Check if TTS is available
   */
  isAvailable(): boolean {
    return this.isEnabled;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }
}

// Singleton instance
export const textToSpeechService = new TextToSpeechService();

