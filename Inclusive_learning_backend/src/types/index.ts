export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: 'learner' | 'mentor' | 'administrator';
  createdAt: Date;
  updatedAt: Date;
}

export interface Learner extends Omit<User, 'role'> {
  role: 'learner';
  disabilityType?: string[];
  accessibilitySettings: AccessibilitySettings;
  enrolledCourses: string[];
  progress: LearnerProgress[];
  certifications: string[];
}

export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
  captionsEnabled: boolean;
  keyboardOnlyNavigation: boolean;
  simplifiedNavigation: boolean;
}

export interface LearnerProgress {
  courseId: string;
  completionPercentage: number;
  lastAccessed: Date;
  completedModules: string[];
}

export interface Course {
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
}