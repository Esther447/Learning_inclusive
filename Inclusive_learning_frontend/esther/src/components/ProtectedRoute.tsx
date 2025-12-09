import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';
import { Box, Typography, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Lock sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            // Redirect to appropriate dashboard based on role
            if (user.role === 'learner') window.location.href = '/dashboard';
            else if (user.role === 'mentor') window.location.href = '/mentor/dashboard';
            else if (user.role === 'administrator') window.location.href = '/admin/dashboard';
          }}
        >
          Go to My Dashboard
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};
