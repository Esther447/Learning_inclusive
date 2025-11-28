/**
 * Navigation Component
 * Accessible navigation bar
 */

import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { Accessibility as AccessibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { settings, updateSettings } = useAccessibilityStore();

  const handleToggleHighContrast = () => {
    updateSettings({ highContrastMode: !settings.highContrastMode });
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessibilityIcon sx={{ fontSize: 32 }} />
          <Button
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 600,
              color: 'white',
              textTransform: 'none',
              fontSize: '1.25rem',
            }}
          >
            Inclusive Learning
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/courses')}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Courses
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/mentorship')}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Mentorship
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/profile')}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                {user?.name || 'Profile'}
              </Button>
              <Button
                color="inherit"
                onClick={logout}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
          )}

          <IconButton
            color="inherit"
            onClick={handleToggleHighContrast}
            aria-label="Toggle high contrast mode"
            title={settings.highContrastMode ? 'Disable high contrast' : 'Enable high contrast'}
          >
            <AccessibilityIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

