/**
 * Type definitions for Inclusive Learning & Skills Platform
 * Based on SRS Class Diagram
 */

// Base User class
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// User roles
export const UserRoleValues = {
  LEARNER: 'learner',
  MENTOR: 'mentor',
  ADMINISTRATOR: 'administrator',
} as const;

export type UserRole = typeof UserRoleValues[keyof typeof UserRoleValues];

// Re-export for convenience
export const UserRole = UserRoleValues;

// Learner extends User
export type Learner = Omit<User, 'role'> & {
  role: typeof UserRoleValues.LEARNER;
  disabilityType?: DisabilityType[];
  accessibilitySettings: AccessibilitySettings;
  enrolledCourses: string[]; // Course IDs
  progress: LearnerProgress[];
  certifications: Certification[];
  mentorshipGroupId?: string;
};

// Mentor extends User
export type Mentor = Omit<User, 'role'> & {
  role: typeof UserRoleValues.MENTOR;
  specialization: string[];
  assignedLearners: string[]; // Learner IDs
  courses: string[]; // Course IDs they teach
  bio?: string;
};

// Administrator extends User
export type Administrator = Omit<User, 'role'> & {
  role: typeof UserRoleValues.ADMINISTRATOR;
  permissions: Permission[];
};

// Disability types
export const DisabilityType = {
  VISUAL: 'visual', // Blind/low vision
  HEARING: 'hearing', // Deaf/hard of hearing
  SPEECH: 'speech', // Non-verbal
  MOBILITY: 'mobility', // Limited mobility
  COGNITIVE: 'cognitive', // Cognitive disabilities
} as const;

export type DisabilityType = typeof DisabilityType[keyof typeof DisabilityType];

// Accessibility Settings (Composition with Learner)
export interface AccessibilitySettings {
  // Visual accessibility
  screenReaderEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrastMode: boolean;
  // Allow broader fontSize values used across the app
  fontSize: string; // e.g. 'small' | 'medium' | 'large' | 'extra-large'
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
  brailleDisplaySupport: boolean;

  // Hearing accessibility
  captionsEnabled: boolean;
  transcriptsEnabled: boolean;
  signLanguageEnabled: boolean;
  volumeBoost: number; // 0-100

  // Backwards-compatible / UI-friendly aliases and additional options
  audioDescriptions?: boolean; // alias used in pages
  speechRate?: number; // playback rate for TTS (e.g. 1 = normal)

  // Speech accessibility
  voiceOutputEnabled: boolean;
  symbolBasedCommunication: boolean;
  alternativeInputMethods: string[];

  // Mobility accessibility
  keyboardOnlyNavigation: boolean;
  voiceCommandNavigation: boolean;
  switchControlEnabled: boolean;

  // UI-friendly aliases
  keyboardNavigationEnabled?: boolean;
  focusIndicators?: boolean;

  // Cognitive accessibility
  simplifiedNavigation: boolean;
  chunkedContent: boolean;
  visualCues: boolean;
  remindersEnabled: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';

  // Additional preferences used in pages
  reducedMotion?: boolean;
  dyslexiaFont?: boolean;
  signLanguage?: boolean; // shorthand used in UI
  simplifiedContent?: boolean; // shorthand used in UI
}

// Resource and Link types
export interface Resource {
  name: string;
  type: 'pdf' | 'video' | 'slides' | 'code' | 'image' | 'doc' | 'other';
  url: string;
  description?: string;
}

export interface ExternalLink {
  name: string;
  url: string;
  description?: string;
}

// Course
export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  instructorId: string; // Mentor ID
  modules: CourseModule[];
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessibilityFeatures: AccessibilityFeature[];
  learningOutcomes?: string[];
  resources?: Resource[];
  externalLinks?: ExternalLink[];
  createdAt: Date;
  updatedAt: Date;
  // Optional assignments and quizzes for calendar and scheduling
  assignments?: Array<{ id: string; title: string; description?: string; dueDate?: Date }>;
  quizzes?: Array<{ id: string; title: string; description?: string; dueDate?: Date }>;
}

export const CourseCategory = {
  TECHNOLOGY: 'technology',
  VOCATIONAL: 'vocational',
  SOFT_SKILLS: 'soft-skills',
  LITERACY: 'literacy',
} as const;

export type CourseCategory = typeof CourseCategory[keyof typeof CourseCategory];

export interface CourseModule {
  id: string;
  title: string;
  content: ModuleContent[];
  order: number;
  estimatedTime: number; // in minutes
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  videoUrl?: string;
  slides?: Resource[];
  materials?: Resource[];
  externalLinks?: ExternalLink[];
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  title: string;
  content: string;
  type: 'learn' | 'practice' | 'quiz' | 'summary';
  duration: number;
  hints?: string[];
  example?: string;
  practice?: {
    question: string;
    answer: string;
    options?: string[];
  };
}

export interface ModuleContent {
  id: string;
  type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz';
  content: string;
  altText?: string; // For images
  captions?: string; // For videos/audio
  transcript?: string; // For audio/video
  signLanguageVideoUrl?: string; // For video content
}

export const AccessibilityFeature = {
  SCREEN_READER: 'screen-reader',
  CAPTIONS: 'captions',
  TRANSCRIPTS: 'transcripts',
  SIGN_LANGUAGE: 'sign-language',
  TEXT_TO_SPEECH: 'text-to-speech',
  KEYBOARD_NAVIGATION: 'keyboard-navigation',
  VOICE_CONTROL: 'voice-control',
  SIMPLIFIED_UI: 'simplified-ui',
} as const;

export type AccessibilityFeature = typeof AccessibilityFeature[keyof typeof AccessibilityFeature];

// Learner Progress
export interface LearnerProgress {
  courseId: string;
  moduleId: string;
  completionPercentage: number;
  lastAccessed: Date;
  completedModules: string[];
  quizScores: QuizScore[];
}

export interface QuizScore {
  quizId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
}

// Certification
export interface Certification {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: Date;
  certificateUrl: string;
  verificationCode: string;
}

// Mentorship Group
export interface MentorshipGroup {
  id: string;
  name: string;
  mentorId: string;
  learnerIds: string[];
  description?: string;
  createdAt: Date;
}

// Permission (for Administrators)
export const Permission = {
  MANAGE_USERS: 'manage-users',
  MANAGE_COURSES: 'manage-courses',
  MANAGE_MENTORS: 'manage-mentors',
  VIEW_ANALYTICS: 'view-analytics',
  MANAGE_ACCESSIBILITY: 'manage-accessibility',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  disabilityType?: DisabilityType[];
}

export interface AuthResponse {
  user: User | Learner | Mentor | Administrator;
  token: string;
}

