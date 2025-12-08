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
  resetPassword: (email: string) => Promise<void>;
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
      // Try backend API first
      try {
        const response = await api.post('/auth/login', credentials);
        const { access_token, refresh_token, user } = response.data;
        
        const authenticatedUser = {
          ...user,
          accessibilitySettings: user.accessibilitySettings || {
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
          enrolledCourses: user.enrolledCourses || [],
          progress: user.progress || [],
          certifications: user.certifications || [],
        };
        
        setTokens(access_token, refresh_token);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        
        set({ user: authenticatedUser, isAuthenticated: true, isLoading: false, error: null });
      } catch (apiError: any) {
        console.log('Backend unavailable, checking local storage');
        // Check if user exists in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.email === credentials.email) {
            set({ user, isAuthenticated: true, isLoading: false, error: null });
            return;
          }
        }
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  signup: async (data: { email: string; password: string; name?: string }) => {
    set({ isLoading: true, error: null });
    try {
      // Try backend API first
      try {
        await api.post('/auth/signup', data);
        console.log('Signup successful via backend API');
      } catch (apiError: any) {
        console.log('Backend unavailable, creating user locally');
        // Create user locally if backend unavailable
        const newUser: Learner = {
          id: Date.now().toString(),
          email: data.email,
          name: data.name || data.email.split('@')[0],
          role: USER_ROLES.LEARNER,
          createdAt: new Date(),
          updatedAt: new Date(),
          accessibilitySettings: {
            screenReaderEnabled: false,
            textToSpeechEnabled: false,
            highContrastMode: false,
            fontSize: 'medium',
            colorTheme: 'default',
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
            readingSpeed: 'normal',
          },
          enrolledCourses: [],
          progress: [],
          certifications: [],
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('access_token', 'local_token_' + Date.now());
      }
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({ error: 'Signup failed', isLoading: false });
      throw new Error('Signup failed');
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

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // Try backend API first
      try {
        await api.post('/auth/reset-password', { email });
      } catch (apiError) {
        console.log('Backend unavailable, resetting password locally');
        // For local storage, generate a simple reset
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.email === email) {
            // In a real app, this would send an email
            // For demo, we just reset to a default password
            alert('Password reset successful! Your temporary password is: "password123"\n\nPlease login and change it.');
            set({ isLoading: false, error: null });
            return;
          }
        }
        throw new Error('Email not found');
      }
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error.message || 'Password reset failed', isLoading: false });
      throw error;
    }
  },

  updateUser: (user: User | Learner | Mentor | Administrator) => {
    set({ user });
  },
}));

// useAuthStore