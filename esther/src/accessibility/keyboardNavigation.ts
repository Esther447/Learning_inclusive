/**
 * Keyboard Navigation Service
 * Provides keyboard-only navigation support for mobility-impaired learners
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export class KeyboardNavigationService {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled: boolean = false;

  constructor() {
    this.setupDefaultShortcuts();
  }

  /**
   * Enable keyboard navigation
   */
  enable(): void {
    this.isEnabled = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Disable keyboard navigation
   */
  disable(): void {
    this.isEnabled = false;
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Register a keyboard shortcut
   */
  registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregisterShortcut(key: string, ctrl?: boolean, alt?: boolean, shift?: boolean): void {
    const shortcutKey = this.buildShortcutKey(key, ctrl, alt, shift);
    this.shortcuts.delete(shortcutKey);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isEnabled) return;

    const key = this.buildShortcutKey(
      event.key.toLowerCase(),
      event.ctrlKey,
      event.altKey,
      event.shiftKey
    );

    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
    }
  };

  /**
   * Build shortcut key string
   */
  private buildShortcutKey(
    key: string,
    ctrl?: boolean,
    alt?: boolean,
    shift?: boolean
  ): string {
    const parts: string[] = [];
    if (ctrl) parts.push('ctrl');
    if (alt) parts.push('alt');
    if (shift) parts.push('shift');
    parts.push(key);
    return parts.join('+');
  }

  /**
   * Get shortcut key from shortcut object
   */
  private getShortcutKey(shortcut: KeyboardShortcut): string {
    return this.buildShortcutKey(
      shortcut.key,
      shortcut.ctrl,
      shortcut.alt,
      shortcut.shift
    );
  }

  /**
   * Setup default keyboard shortcuts
   */
  private setupDefaultShortcuts(): void {
    // Navigation shortcuts
    this.registerShortcut({
      key: 'h',
      description: 'Go to home',
      action: () => {
        window.location.href = '/';
      },
    });

    this.registerShortcut({
      key: 'c',
      description: 'Go to courses',
      action: () => {
        window.location.href = '/courses';
      },
    });

    this.registerShortcut({
      key: 'm',
      description: 'Go to mentorship',
      action: () => {
        window.location.href = '/mentorship';
      },
    });

    this.registerShortcut({
      key: 'p',
      description: 'Go to profile',
      action: () => {
        window.location.href = '/profile';
      },
    });

    // Accessibility shortcuts
    this.registerShortcut({
      key: 's',
      ctrl: true,
      description: 'Toggle screen reader',
      action: () => {
        // Toggle screen reader mode
        document.dispatchEvent(new CustomEvent('toggle-screen-reader'));
      },
    });

    this.registerShortcut({
      key: 't',
      ctrl: true,
      description: 'Toggle text-to-speech',
      action: () => {
        document.dispatchEvent(new CustomEvent('toggle-tts'));
      },
    });
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }
}

// Singleton instance
export const keyboardNavigationService = new KeyboardNavigationService();

