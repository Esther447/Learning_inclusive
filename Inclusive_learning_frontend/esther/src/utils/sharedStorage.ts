/**
 * Shared Storage System
 * Simulates a backend database using localStorage
 * Allows Admin and Mentor dashboards to sync data
 */

import type { User } from '../types';

const STORAGE_KEYS = {
  ALL_USERS: 'all_users',
  PENDING_MENTORS: 'pending_mentors',
  CURRENT_USER: 'user',
};

// Get all users from shared storage
export const getAllUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
  return data ? JSON.parse(data) : [];
};

// Save all users to shared storage
export const saveAllUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
};

// Add a new user to shared storage
export const addUser = (user: User) => {
  const users = getAllUsers();
  const exists = users.find(u => u.email === user.email);
  if (!exists) {
    users.push(user);
    saveAllUsers(users);
  }
};

// Update user in shared storage
export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveAllUsers(users);
    
    // Update current user if it's the same
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUser) {
      const current = JSON.parse(currentUser);
      if (current.id === userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
      }
    }
  }
};

// Delete user from shared storage
export const deleteUser = (userId: string) => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== userId);
  saveAllUsers(filtered);
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.email === email) || null;
};

// Get pending mentors
export const getPendingMentors = (): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === 'mentor' && u.status === 'pending');
};

// Approve mentor
export const approveMentor = (mentorId: string) => {
  updateUser(mentorId, { status: 'active' as const });
};

// Suspend user
export const suspendUser = (userId: string) => {
  updateUser(userId, { status: 'suspended' as const });
};

// Initialize shared storage with current user
export const syncCurrentUserToShared = () => {
  const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (currentUser) {
    const user = JSON.parse(currentUser);
    addUser(user);
  }
};
