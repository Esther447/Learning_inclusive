/**
 * Bootstrap initial admin account
 * This should only run once when the system is first set up
 */

import { USER_ROLES } from '../types';

const INITIAL_ADMIN = {
  id: 'admin-001',
  email: 'gervaistumukunde@gmail.com',
  name: 'Gervais Tumukunde',
  role: USER_ROLES.ADMINISTRATOR,
  status: 'active',
  permissions: ['manage-users', 'manage-courses', 'manage-mentors', 'view-analytics', 'manage-accessibility'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  requirePasswordChange: true, // Force password change on first login
};

const INITIAL_PASSWORD = 'heros2025@';

export const bootstrapInitialAdmin = () => {
  // Check if admin already exists
  const existingAdmin = localStorage.getItem('admin_bootstrapped');
  
  if (!existingAdmin) {
    // Store initial admin credentials
    const adminCredentials = {
      email: INITIAL_ADMIN.email,
      password: INITIAL_PASSWORD,
    };
    
    localStorage.setItem('initial_admin_credentials', JSON.stringify(adminCredentials));
    localStorage.setItem('initial_admin_user', JSON.stringify(INITIAL_ADMIN));
    localStorage.setItem('admin_bootstrapped', 'true');
    
    console.log('✅ Initial admin account bootstrapped');
    console.log('Email:', INITIAL_ADMIN.email);
    console.log('Password: heros2025@');
    console.log('⚠️ Please change password immediately after first login');
  }
};

export const getInitialAdmin = () => {
  const adminUser = localStorage.getItem('initial_admin_user');
  const adminCreds = localStorage.getItem('initial_admin_credentials');
  
  if (adminUser && adminCreds) {
    return {
      user: JSON.parse(adminUser),
      credentials: JSON.parse(adminCreds),
    };
  }
  return null;
};
