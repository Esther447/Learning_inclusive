import { create } from 'zustand';
import type { User, Learner, Mentor, Administrator, LoginCredentials, RegisterData } from '../types';
import { api, setTokens } from "../services/api";
import {jwtDecode} from "jwt-decode";
import type { AxiosError } from 'axios';

interface AuthState {
  user: User | Learner | Mentor | Administrator | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
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
      const resp = await api.post("/auth/login", credentials);
      const { access_token, refresh_token, user } = resp.data;

      setTokens(access_token, refresh_token);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || err.message || "Login failed";
      set({ error: msg, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const resp = await api.post("/auth/register", data);
      const { access_token, refresh_token, user } = resp.data;

      setTokens(access_token, refresh_token);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || err.message || "Registration failed";
      set({ error: msg, isAuthenticated: false, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false, error: null });
  },

  updateUser: (user: User | Learner | Mentor | Administrator) => {
    set({ user });
  },
}));

// Decode JWT to get basic info (id, role, exp)
export function getCurrentUserFromToken() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    return jwtDecode<{ id: string; role: string; exp: number }>(token);
  } catch {
    return null;
  }
}

// Fetch full current user from backend
export async function fetchCurrentUser() {
  try {
    const resp = await api.get("users/profile");
    return resp.data;
  } catch {
    return null;
  }
}

// Optional: initialize auth state on app start
export async function initializeAuth() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const decoded = jwtDecode<{ id: string; role: string; exp: number }>(token);
  if (decoded) {
    const user = await fetchCurrentUser();
    if (user) {
      useAuthStore.getState().updateUser(user);
      useAuthStore.setState({ isAuthenticated: true });
    } else {
      useAuthStore.getState().logout();
    }
  }
}
