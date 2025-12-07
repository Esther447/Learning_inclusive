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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, refresh_token, user } = response.data;
      
      // Use setTokens to store both access and refresh tokens consistently
      setTokens(access_token, refresh_token);
      
      set({
        user,
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