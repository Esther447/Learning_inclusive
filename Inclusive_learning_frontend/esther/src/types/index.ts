/**
 * Type definitions for Inclusive Learning & Skills Platform
 * Based on SRS Class Diagram
 */

// --------------------
// Base User class
// --------------------
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// User roles
// --------------------
export const USER_ROLES = {
  LEARNER: 'learner',
  MENTOR: 'mentor',
  ADMINISTRATOR: 'administrator',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// --------------------
// Learner, Mentor, Administrator
// --------------------
export type Learner = Omit<User, 'role'> & {
  role: typeof USER_ROLES.LEARNER;
  disabilityType?: DisabilityType[];
  accessibilitySettings: AccessibilitySettings;
  enrolledCourses: string[];
  progress: LearnerProgress[];
  certifications: Certification[];
  mentorshipGroupId?: string;
};

export type Mentor = Omit<User, 'role'> & {
  role: typeof USER_ROLES.MENTOR;
  specialization: string[];
  assignedLearners: string[];
  courses: string[];
  bio?: string;
};

export type Administrator = Omit<User, 'role'> & {
  role: typeof USER_ROLES.ADMINISTRATOR;
  permissions: Permission[];
};

// --------------------
// Disability types
// --------------------
export const DISABILITY_TYPES = {
  VISUAL: 'visual',
  HEARING: 'hearing',
  SPEECH: 'speech',
  MOBILITY: 'mobility',
  COGNITIVE: 'cognitive',
} as const;

export type DisabilityType = typeof DISABILITY_TYPES[keyof typeof DISABILITY_TYPES];

// --------------------
// Accessibility Settings
// --------------------
export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrastMode: boolean;
  fontSize: string; // 'small' | 'medium' | 'large' | 'extra-large'
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
  brailleDisplaySupport: boolean;

  captionsEnabled: boolean;
  transcriptsEnabled: boolean;
  signLanguageEnabled: boolean;
  volumeBoost: number;

  audioDescriptions?: boolean;
  speechRate?: number;

  voiceOutputEnabled: boolean;
  symbolBasedCommunication: boolean;
  alternativeInputMethods: string[];

  keyboardOnlyNavigation: boolean;
  voiceCommandNavigation: boolean;
  switchControlEnabled: boolean;
  keyboardNavigationEnabled?: boolean;
  focusIndicators?: boolean;

  simplifiedNavigation: boolean;
  chunkedContent: boolean;
  visualCues: boolean;
  remindersEnabled: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';

  reducedMotion?: boolean;
  dyslexiaFont?: boolean;
  signLanguage?: boolean;
  simplifiedContent?: boolean;
}

// --------------------
// Resource and Links
// --------------------
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

// --------------------
// Course & Module
// --------------------
export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  instructorId: string;
  modules: CourseModule[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessibilityFeatures: AccessibilityFeature[];
  learningOutcomes?: string[];
  resources?: Resource[];
  externalLinks?: ExternalLink[];
  createdAt: Date;
  updatedAt: Date;
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
  estimatedTime: number;
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
  altText?: string;
  captions?: string;
  transcript?: string;
  signLanguageVideoUrl?: string;
}

// --------------------
// Accessibility Features
// --------------------
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

// --------------------
// Progress & Certification
// --------------------
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

export interface Certification {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: Date;
  certificateUrl: string;
  verificationCode: string;
}

// --------------------
// Mentorship
// --------------------
export interface MentorshipGroup {
  id: string;
  name: string;
  mentorId: string;
  learnerIds: string[];
  description?: string;
  createdAt: Date;
}

// --------------------
// Permissions
// --------------------
export const Permission = {
  MANAGE_USERS: 'manage-users',
  MANAGE_COURSES: 'manage-courses',
  MANAGE_MENTORS: 'manage-mentors',
  VIEW_ANALYTICS: 'view-analytics',
  MANAGE_ACCESSIBILITY: 'manage-accessibility',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// --------------------
// API & Auth
// --------------------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
