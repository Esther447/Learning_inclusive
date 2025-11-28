/**
 * Course Store
 * Manages courses, enrollment, and progress
 */

import { create } from 'zustand';
import type { Course, LearnerProgress } from '../types';
import { CourseCategory } from '../types';

interface CourseState {
  courses: Course[];
  enrolledCourses: string[];
  progress: Record<string, LearnerProgress>;
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, moduleId: string, percentage: number) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getEnrolledCourses: () => Course[];
}

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course is designed with full accessibility support.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor1',
    modules: [
      {
        id: 'm1',
        title: 'HTML Basics',
        content: [
          {
            id: 'c1',
            type: 'text',
            content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 30,
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        content: [
          {
            id: 'c2',
            type: 'text',
            content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
            altText: undefined,
          },
        ],
        order: 2,
        estimatedTime: 45,
      },
    ],
    duration: 10,
    difficulty: 'beginner',
    accessibilityFeatures: ['screen-reader', 'captions', 'text-to-speech', 'keyboard-navigation'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Digital Literacy for Beginners',
    description: 'Master essential digital skills including using computers, internet navigation, and basic software applications.',
    category: CourseCategory.LITERACY,
    instructorId: 'mentor2',
    modules: [
      {
        id: 'm3',
        title: 'Computer Basics',
        content: [
          {
            id: 'c3',
            type: 'text',
            content: 'Learn the fundamentals of using a computer, including the operating system and basic applications.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 60,
      },
    ],
    duration: 8,
    difficulty: 'beginner',
    accessibilityFeatures: ['screen-reader', 'captions', 'simplified-ui'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '3',
    title: 'Vocational Skills: Tailoring',
    description: 'Learn professional tailoring skills including pattern making, cutting, and sewing techniques.',
    category: CourseCategory.VOCATIONAL,
    instructorId: 'mentor3',
    modules: [
      {
        id: 'm4',
        title: 'Introduction to Tailoring',
        content: [
          {
            id: 'c4',
            type: 'text',
            content: 'Discover the art of tailoring and learn essential skills for creating custom garments.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 90,
      },
    ],
    duration: 20,
    difficulty: 'intermediate',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '4',
    title: 'Communication Skills',
    description: 'Develop effective communication skills for personal and professional success.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor4',
    modules: [
      {
        id: 'm5',
        title: 'Verbal Communication',
        content: [
          {
            id: 'c5',
            type: 'text',
            content: 'Learn how to communicate effectively through speech and presentation.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 45,
      },
    ],
    duration: 6,
    difficulty: 'beginner',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language', 'text-to-speech'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Build mobile applications using modern frameworks and tools. Includes accessibility best practices.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor1',
    modules: [
      {
        id: 'm6',
        title: 'Introduction to Mobile Development',
        content: [
          {
            id: 'c6',
            type: 'text',
            content: 'Explore the world of mobile app development and learn to create accessible mobile applications.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 60,
      },
    ],
    duration: 15,
    difficulty: 'advanced',
    accessibilityFeatures: ['screen-reader', 'captions', 'text-to-speech', 'keyboard-navigation'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '6',
    title: 'Entrepreneurship Basics',
    description: 'Learn how to start and manage your own business. Perfect for aspiring entrepreneurs.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor5',
    modules: [
      {
        id: 'm7',
        title: 'Business Planning',
        content: [
          {
            id: 'c7',
            type: 'text',
            content: 'Create a comprehensive business plan and learn the fundamentals of entrepreneurship.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 90,
      },
    ],
    duration: 12,
    difficulty: 'intermediate',
    accessibilityFeatures: ['screen-reader', 'captions', 'simplified-ui'],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25'),
  },
];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  enrolledCourses: [],
  progress: {},
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Load enrolled courses from localStorage
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      const enrolled = savedEnrollments ? JSON.parse(savedEnrollments) : [];
      
      set({
        courses: mockCourses,
        enrolledCourses: enrolled,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        isLoading: false,
      });
    }
  },

  enrollInCourse: async (courseId: string) => {
    try {
      const { enrolledCourses } = get();
      if (enrolledCourses.includes(courseId)) {
        return; // Already enrolled
      }

      const newEnrollments = [...enrolledCourses, courseId];
      localStorage.setItem('enrolledCourses', JSON.stringify(newEnrollments));

      // Initialize progress
      const newProgress: LearnerProgress = {
        courseId,
        moduleId: '',
        completionPercentage: 0,
        lastAccessed: new Date(),
        completedModules: [],
        quizScores: [],
      };

      set((state) => ({
        enrolledCourses: newEnrollments,
        progress: {
          ...state.progress,
          [courseId]: newProgress,
        },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enroll in course',
      });
    }
  },

  updateProgress: (courseId: string, moduleId: string, percentage: number) => {
    set((state) => {
      const currentProgress = state.progress[courseId] || {
        courseId,
        moduleId: '',
        completionPercentage: 0,
        lastAccessed: new Date(),
        completedModules: [],
        quizScores: [],
      };

      return {
        progress: {
          ...state.progress,
          [courseId]: {
            ...currentProgress,
            moduleId,
            completionPercentage: percentage,
            lastAccessed: new Date(),
            completedModules: percentage === 100 
              ? [...new Set([...currentProgress.completedModules, moduleId])]
              : currentProgress.completedModules,
          },
        },
      };
    });
  },

  getCourseById: (courseId: string) => {
    return get().courses.find((course) => course.id === courseId);
  },

  getEnrolledCourses: () => {
    const { courses, enrolledCourses } = get();
    return courses.filter((course) => enrolledCourses.includes(course.id));
  },
}));

