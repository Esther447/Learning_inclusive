/**
 * Authentication Store
 * Manages user authentication state using Zustand
 */

import { create } from 'zustand';
import { api } from '../services/api';
import type { User, Learner, Mentor, Administrator, LoginCredentials, RegisterData } from '../types';
import { UserRole, DisabilityType } from '../types';

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
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
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
      // Auto-login after signup
      await useAuthStore.getState().login({ email: data.email, password: data.password });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
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
        role: UserRole.LEARNER,
        createdAt: new Date(),
        updatedAt: new Date(),
        accessibilitySettings: {
          screenReaderEnabled: data.disabilityType?.includes(DisabilityType.VISUAL) ?? false,
          textToSpeechEnabled: data.disabilityType?.includes(DisabilityType.VISUAL) ?? false,
          highContrastMode: data.disabilityType?.includes(DisabilityType.VISUAL) ?? false,
          fontSize: 'medium',
          colorTheme: 'default',
          brailleDisplaySupport: false,
          captionsEnabled: data.disabilityType?.includes(DisabilityType.HEARING) ?? true,
          transcriptsEnabled: data.disabilityType?.includes(DisabilityType.HEARING) ?? true,
          signLanguageEnabled: data.disabilityType?.includes(DisabilityType.HEARING) ?? false,
          volumeBoost: 0,
          voiceOutputEnabled: data.disabilityType?.includes(DisabilityType.SPEECH) ?? false,
          symbolBasedCommunication: data.disabilityType?.includes(DisabilityType.SPEECH) ?? false,
          alternativeInputMethods: [],
          keyboardOnlyNavigation: data.disabilityType?.includes(DisabilityType.MOBILITY) ?? false,
          voiceCommandNavigation: data.disabilityType?.includes(DisabilityType.MOBILITY) ?? false,
          switchControlEnabled: false,
          simplifiedNavigation: data.disabilityType?.includes(DisabilityType.COGNITIVE) ?? false,
          chunkedContent: data.disabilityType?.includes(DisabilityType.COGNITIVE) ?? false,
          visualCues: true,
          remindersEnabled: data.disabilityType?.includes(DisabilityType.COGNITIVE) ?? false,
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
    localStorage.removeItem('token');
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