import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, error, user } = useAuthStore();
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Announce page for screen readers and TTS
  useEffect(() => {
    if (settings.textToSpeechEnabled) {
      speak(tab === 0 ? 'Login page. Enter your email and password to sign in.' : 'Sign up page. Create a new account.');
    }
  }, [tab, settings.textToSpeechEnabled, speak]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Get updated user after login
      const currentUser = useAuthStore.getState().user;
      // Redirect based on role
      if (currentUser?.role === 'administrator') {
        navigate('/admin/dashboard');
      } else if (currentUser?.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password, name });
      // Switch to login tab after successful signup
      setTab(0);
      // Clear form fields
      setName('');
      setPassword('');
      setEmail('');
    } catch (err) {
      console.error('Signup failed');
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ py: 8 }}
      role="main"
      aria-label="Login and sign up page"
    >
      <Paper sx={{ p: 4 }} role="region" aria-label="Authentication form">
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ mb: 3 }}
          component="h1"
          id="login-page-title"
        >
          Welcome
        </Typography>

        <Tabs 
          value={tab} 
          onChange={(_, v) => {
            setTab(v);
            if (settings.textToSpeechEnabled) {
              speak(v === 0 ? 'Switched to login tab' : 'Switched to sign up tab');
            }
          }} 
          sx={{ mb: 3 }}
          aria-label="Authentication tabs"
        >
          <Tab label="Login" aria-controls="login-panel" id="login-tab" />
          <Tab label="Sign Up" aria-controls="signup-panel" id="signup-tab" />
        </Tabs>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {tab === 0 ? (
          <Box 
            component="form" 
            onSubmit={handleLogin}
            role="form"
            aria-labelledby="login-tab"
            id="login-panel"
          >
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
              sx={{ mb: 3 }}
              aria-label="Password"
              aria-required="true"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" aria-hidden="true" /> : null}
              aria-label={isLoading ? 'Logging in, please wait' : 'Login button'}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        ) : (
          <Box 
            component="form" 
            onSubmit={handleSignup}
            role="form"
            aria-labelledby="signup-tab"
            id="signup-panel"
          >
            <TextField
              fullWidth
              label="Name"
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
        )}

      </Paper>
    </Container>
  );
};