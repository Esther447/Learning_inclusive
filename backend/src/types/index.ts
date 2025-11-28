export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: 'learner' | 'mentor' | 'administrator';
  disabilityType?: string[];
  accessibilitySettings?: AccessibilitySettings;
  enrolledCourses: string[];
  progress: LearnerProgress[];
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
  brailleDisplaySupport: boolean;
  captionsEnabled: boolean;
  transcriptsEnabled: boolean;
  signLanguageEnabled: boolean;
  volumeBoost: number;
  voiceOutputEnabled: boolean;
  symbolBasedCommunication: boolean;
  alternativeInputMethods: string[];
  keyboardOnlyNavigation: boolean;
  voiceCommandNavigation: boolean;
  switchControlEnabled: boolean;
  simplifiedNavigation: boolean;
  chunkedContent: boolean;
  visualCues: boolean;
  remindersEnabled: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';
}

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

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructorId: string;
  modules: CourseModule[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessibilityFeatures: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  _id: string;
  title: string;
  content: ModuleContent[];
  order: number;
  estimatedTime: number;
}

export interface ModuleContent {
  _id: string;
  type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz';
  content: string;
  altText?: string;
  captions?: string;
  transcript?: string;
  signLanguageVideoUrl?: string;
}