/**
 * Authentication Store
 * Manages user authentication state using Zustand
 */

import { create } from 'zustand';
import { api, setTokens } from '../services/api';
import type { User, Learner, Mentor, Administrator, LoginCredentials, RegisterData } from '../types';
import type { UserRole, DisabilityType } from '../types';
import { USER_ROLES, DISABILITY_TYPES } from '../types';

interface AuthState {
  user: User | Learner | Mentor | Administrator | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: { email: string; password: string; name?: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User | Learner | Mentor | Administrator) => void;
}

// Initialize auth state from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('access_token');
  const savedUser = localStorage.getItem('user');
  
  if (token && savedUser) {
    try {
      const user = JSON.parse(savedUser);
      return { user, isAuthenticated: true };
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
  return { user: null, isAuthenticated: false };
};

const initialAuth = initializeAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  isAuthenticated: initialAuth.isAuthenticated,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, refresh_token, user } = response.data;
      
      if (!user) {
        throw new Error('No user data in login response');
      }
      
      // Convert user response to Learner type with full object
      const authenticatedUser = {
        ...user,
        accessibilitySettings: {
          screenReaderEnabled: false,
          textToSpeechEnabled: false,
          highContrastMode: false,
          fontSize: 'medium' as const,
          colorTheme: 'default' as const,
          brailleDisplaySupport: false,
          captionsEnabled: true,
          transcriptsEnabled: true,
          signLanguageEnabled: false,
          volumeBoost: 0,
          voiceOutputEnabled: false,
          symbolBasedCommunication: false,
          alternativeInputMethods: [],
          keyboardOnlyNavigation: false,
          voiceCommandNavigation: false,
          switchControlEnabled: false,
          simplifiedNavigation: false,
          chunkedContent: false,
          visualCues: true,
          remindersEnabled: false,
          readingSpeed: 'normal' as const,
        },
        enrolledCourses: [],
        progress: [],
        certifications: [],
      };
      
      // Use setTokens to store both access and refresh tokens consistently
      setTokens(access_token, refresh_token);
      
      // Save user to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      set({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Handle validation errors from FastAPI
      let errorMessage = 'Login failed';
      if (error.response?.data) {
        if (Array.isArray(error.response.data.detail)) {
          // FastAPI validation errors format
          errorMessage = error.response.data.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw new Error(errorMessage);
    }
  },

  signup: async (data: { email: string; password: string; name?: string }) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/signup', data);
      // Signup successful - user should login manually
      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Handle validation errors from FastAPI
      let errorMessage = 'Signup failed';
      if (error.response?.data) {
        if (Array.isArray(error.response.data.detail)) {
          // FastAPI validation errors format
          errorMessage = error.response.data.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      const newUser: Learner = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: USER_ROLES.LEARNER,
        createdAt: new Date(),
        updatedAt: new Date(),
        accessibilitySettings: {
          screenReaderEnabled: data.disabilityType?.includes(DISABILITY_TYPES.VISUAL) ?? false,
          textToSpeechEnabled: data.disabilityType?.includes(DISABILITY_TYPES.VISUAL) ?? false,
          highContrastMode: data.disabilityType?.includes(DISABILITY_TYPES.VISUAL) ?? false,
          fontSize: 'medium',
          colorTheme: 'default',
          brailleDisplaySupport: false,
          captionsEnabled: data.disabilityType?.includes(DISABILITY_TYPES.HEARING) ?? true,
          transcriptsEnabled: data.disabilityType?.includes(DISABILITY_TYPES.HEARING) ?? true,
          signLanguageEnabled: data.disabilityType?.includes(DISABILITY_TYPES.HEARING) ?? false,
          volumeBoost: 0,
          voiceOutputEnabled: data.disabilityType?.includes(DISABILITY_TYPES.SPEECH) ?? false,
          symbolBasedCommunication: data.disabilityType?.includes(DISABILITY_TYPES.SPEECH) ?? false,
          alternativeInputMethods: [],
          keyboardOnlyNavigation: data.disabilityType?.includes(DISABILITY_TYPES.MOBILITY) ?? false,
          voiceCommandNavigation: data.disabilityType?.includes(DISABILITY_TYPES.MOBILITY) ?? false,
          switchControlEnabled: false,
          simplifiedNavigation: data.disabilityType?.includes(DISABILITY_TYPES.COGNITIVE) ?? false,
          chunkedContent: data.disabilityType?.includes(DISABILITY_TYPES.COGNITIVE) ?? false,
          visualCues: true,
          remindersEnabled: data.disabilityType?.includes(DISABILITY_TYPES.COGNITIVE) ?? false,
          readingSpeed: 'normal',
        },
        enrolledCourses: [],
        progress: [],
        certifications: [],
      };

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('access_token', 'mock_token_' + Date.now());
      
      set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  updateUser: (user: User | Learner | Mentor | Administrator) => {
    set({ user });
  },
}));

// useAuthStore