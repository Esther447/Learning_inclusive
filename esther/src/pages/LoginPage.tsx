/**
 * Login Page Component
 * Accessible login form
 */

import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const { speak } = useTextToSpeech();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      speak('Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      speak('Login successful');
      navigate('/courses');
    } catch (err) {
      setLocalError('Login failed. Please try again.');
      speak('Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 3 }}
          >
            Login
          </Typography>

          {(error || localError) && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error || localError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
              aria-required="true"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              aria-required="true"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                marginTop: 3,
                marginBottom: 2,
                padding: '12px',
                fontSize: '1.1rem',
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Register here
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Demo: Use any email and password to login
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

