/**
 * Application Constants
 */

export const APP_NAME = 'Inclusive Learning & Skills Platform';
export const APP_VERSION = '1.0.0';

// API endpoints (to be configured)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// WCAG 2.1 AA Compliance
export const WCAG_LEVEL = 'AA';
export const MIN_CONTRAST_RATIO = 4.5;

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'rw', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Maximum file sizes
export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_AUDIO_SIZE_MB = 100;
export const MAX_IMAGE_SIZE_MB = 10;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

