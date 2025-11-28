/**
 * Landing Page (Home Screen)
 * Clean, accessible welcome page with simple design
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Accessibility as AccessibilityIcon,
  TextIncrease as TextIncreaseIcon,
  Contrast as ContrastIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useTextToSpeech();
  const { settings, updateSettings } = useAccessibilityStore();

  const handleToggleAccessibility = (setting: string, value: boolean) => {
    updateSettings({ [setting]: value });
    if (value) {
      speak(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} enabled`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: settings.highContrastMode ? '#000' : '#f5f5f5',
        color: settings.highContrastMode ? '#fff' : '#333',
        fontSize: settings.fontSize === 'large' ? '1.2rem' : '1rem',
      }}
    >
      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Welcome Section */}
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: settings.highContrastMode ? '#333' : '#fff',
            color: settings.highContrastMode ? '#fff' : '#333',
            mb: 4,
          }}
        >
          <AccessibilityIcon
            sx={{
              fontSize: 64,
              color: settings.highContrastMode ? '#fff' : '#1976d2',
              mb: 2,
            }}
          />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: settings.fontSize === 'large' ? '3rem' : '2.5rem',
              fontWeight: 700,
              mb: 3,
              color: settings.highContrastMode ? '#fff' : '#1976d2',
            }}
          >
            Welcome to Inclusive Learning
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            A platform designed for everyone. Learn new skills, connect with mentors,
            and access education with full accessibility support.
          </Typography>

          {/* Main Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                fontSize: settings.fontSize === 'large' ? '1.2rem' : '1.1rem',
                py: 2,
                px: 4,
                backgroundColor: settings.highContrastMode ? '#fff' : '#1976d2',
                color: settings.highContrastMode ? '#000' : '#fff',
                '&:hover': {
                  backgroundColor: settings.highContrastMode ? '#ccc' : '#1565c0',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/signup')}
              sx={{
                fontSize: settings.fontSize === 'large' ? '1.2rem' : '1.1rem',
                py: 2,
                px: 4,
                borderColor: settings.highContrastMode ? '#fff' : '#1976d2',
                color: settings.highContrastMode ? '#fff' : '#1976d2',
                '&:hover': {
                  borderColor: settings.highContrastMode ? '#ccc' : '#1565c0',
                  backgroundColor: settings.highContrastMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.04)',
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Paper>

        {/* Accessibility Tools Panel */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            backgroundColor: settings.highContrastMode ? '#333' : '#fff',
            color: settings.highContrastMode ? '#fff' : '#333',
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
            }}
          >
            Accessibility Tools
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontSize: settings.fontSize === 'large' ? '1.1rem' : '0.9rem',
              color: settings.highContrastMode ? '#ccc' : '#666',
            }}
          >
            Press TAB to navigate between options
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.textToSpeechEnabled}
                  onChange={(e) => handleToggleAccessibility('textToSpeechEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextIncreaseIcon />
                  <Typography sx={{ fontSize: settings.fontSize === 'large' ? '1.1rem' : '1rem' }}>
                    Text-to-Speech
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrastMode}
                  onChange={(e) => handleToggleAccessibility('highContrastMode', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContrastIcon />
                  <Typography sx={{ fontSize: settings.fontSize === 'large' ? '1.1rem' : '1rem' }}>
                    High Contrast Mode
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.fontSize === 'large'}
                  onChange={(e) => updateSettings({ fontSize: e.target.checked ? 'large' : 'medium' })}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextIncreaseIcon />
                  <Typography sx={{ fontSize: settings.fontSize === 'large' ? '1.1rem' : '1rem' }}>
                    Large Text Size
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};