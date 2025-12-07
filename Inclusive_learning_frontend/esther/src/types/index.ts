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
export const USER_ROLES = {
  LEARNER: 'learner',
  MENTOR: 'mentor',
  ADMINISTRATOR: 'administrator',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Learner extends User
export type Learner = Omit<User, 'role'> & {
  role: typeof USER_ROLES.LEARNER;
  disabilityType?: DisabilityType[];
  accessibilitySettings: AccessibilitySettings;
  enrolledCourses: string[]; // Course IDs
  progress: LearnerProgress[];
  certifications: Certification[];
  mentorshipGroupId?: string;
};

// Mentor extends User
export type Mentor = Omit<User, 'role'> & {
  role: typeof USER_ROLES.MENTOR;
  specialization: string[];
  assignedLearners: string[]; // Learner IDs
  courses: string[]; // Course IDs they teach
  bio?: string;
};

// Administrator extends User
export type Administrator = Omit<User, 'role'> & {
  role: typeof USER_ROLES.ADMINISTRATOR;
  permissions: Permission[];
};

// Disability types
export const DISABILITY_TYPES = {
  VISUAL: 'visual', // Blind/low vision
  HEARING: 'hearing', // Deaf/hard of hearing
  SPEECH: 'speech', // Non-verbal
  MOBILITY: 'mobility', // Limited mobility
  COGNITIVE: 'cognitive', // Cognitive disabilities
} as const;

export type DisabilityType = (typeof DISABILITY_TYPES)[keyof typeof DISABILITY_TYPES];

// Accessibility Settings (Composition with Learner)
export interface AccessibilitySettings {
  // Visual accessibility
  screenReaderEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrastMode: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
  brailleDisplaySupport: boolean;

  // Hearing accessibility
  captionsEnabled: boolean;
  transcriptsEnabled: boolean;
  signLanguageEnabled?: boolean;
  signLanguage?: boolean; // Alias for UI compatibility
  volumeBoost: number; // 0-100

  // Speech accessibility
  voiceOutputEnabled: boolean;
  symbolBasedCommunication: boolean;
  alternativeInputMethods: string[];
  speechRate?: number; // 0.5-2.0

  // Mobility accessibility
  keyboardOnlyNavigation: boolean;
  keyboardNavigationEnabled?: boolean;
  voiceCommandNavigation: boolean;
  switchControlEnabled: boolean;

  // Cognitive accessibility
  simplifiedNavigation: boolean;
  simplifiedContent?: boolean;
  chunkedContent: boolean;
  visualCues: boolean;
  focusIndicators?: boolean;
  remindersEnabled: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';

  // Additional accessibility features
  reducedMotion?: boolean;
  dyslexiaFont?: boolean;
  audioDescriptions?: boolean;
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
  createdAt: Date;
  updatedAt: Date;
  learningOutcomes?: string[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
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
  steps: LessonStep[];
  duration?: number; // in minutes
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

// Assignment and Quiz types
export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  courseId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

