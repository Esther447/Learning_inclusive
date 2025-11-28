import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { Accessibility as AccessibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AccessibleButton } from './AccessibleButton';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useAuthStore, fetchCurrentUser } from '../store/authStore';
import type { User, Learner, Mentor, Administrator } from '../types';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAccessibilityStore();

  // ✅ Hooks inside the component
  const [user, setUser] = useState<User | Learner | Mentor | Administrator | null>(null);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser().then(u => {
      if (mounted) setUser(u);
    });
    return () => { mounted = false; };
  }, []);

  const handleToggleHighContrast = () => {
    updateSettings({ highContrastMode: !settings.highContrastMode });
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessibilityIcon sx={{ fontSize: 32 }} />
          <Button onClick={() => navigate('/')} sx={{ fontWeight: 600, color: 'white', textTransform: 'none', fontSize: '1.25rem' }}>
            Inclusive Learning
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/courses')} sx={{ textTransform: 'none', fontWeight: 500 }}>Courses</Button>
          <Button color="inherit" onClick={() => navigate('/mentorship')} sx={{ textTransform: 'none', fontWeight: 500 }}>Mentorship</Button>

          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/profile')} sx={{ textTransform: 'none', fontWeight: 500 }}>
                {user?.name || 'Profile'}
              </Button>
              <AccessibleButton
                color="inherit"
                onClick={() => { logout(); navigate('/'); }}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Logout
              </AccessibleButton>
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
                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.8)', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
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
