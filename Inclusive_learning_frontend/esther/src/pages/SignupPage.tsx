import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  // Announce page for screen readers and TTS
  useEffect(() => {
    if (settings.textToSpeechEnabled) {
      speak('Create account page. Fill in your name, email, and password to create a new account.');
    }
  }, [settings.textToSpeechEnabled, speak]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    // Basic validation
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await signup({ email, password, name });
      // Redirect to login page after successful signup
      navigate('/login');
    } catch (err) {
      // Error is already handled by the store and displayed
      console.error('Signup failed:', err);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ py: 8 }}
      role="main"
      aria-label="Create account page"
    >
      <Paper sx={{ p: 4 }} role="region" aria-label="Sign up form">
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ mb: 3 }}
          component="h1"
          id="signup-page-title"
        >
          Create Account
        </Typography>

        {(error || localError) && (
          <Typography color="error" sx={{ mb: 2 }}>
            {localError || error}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          role="form"
          aria-labelledby="signup-page-title"
        >
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
            aria-label="Full name"
            aria-required="true"
            autoComplete="name"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            aria-label="Email address"
            aria-required="true"
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Password must be at least 6 characters"
            sx={{ mb: 3 }}
            aria-label="Password"
            aria-required="true"
            autoComplete="new-password"
            aria-describedby="password-helper"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" aria-hidden="true" /> : null}
            aria-label={isLoading ? 'Creating account, please wait' : 'Create account button'}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Button
          fullWidth
          variant="text"
          onClick={() => {
            if (settings.textToSpeechEnabled) {
              speak('Navigating to login page');
            }
            navigate('/login');
          }}
          sx={{ mt: 2 }}
          aria-label="Already have an account? Go to login page"
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Container>
  );
};