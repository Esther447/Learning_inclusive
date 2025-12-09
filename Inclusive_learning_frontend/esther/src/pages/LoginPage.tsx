import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Tabs, Tab, CircularProgress, MenuItem, Grid as MuiGrid, Card, CardContent } from '@mui/material';
import { School, Accessibility, People, EmojiObjects } from '@mui/icons-material';
const Grid: any = MuiGrid as any;
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
  const [role, setRole] = useState<'learner' | 'mentor' | 'administrator'>('learner');

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
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'administrator') {
        navigate('/admin/dashboard');
      } else if (currentUser?.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password, name, role });
      if (role === 'mentor') {
        alert('Your mentor account has been created and is pending admin approval. You will be notified once approved.');
        setTab(0);
        return;
      }
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup failed:', err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Welcome to Inclusive Learning
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            Accessible Education for Everyone in Rwanda
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <School sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Quality Courses</Typography>
                <Typography variant="body2" color="textSecondary">Technology, Vocational & Soft Skills</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <Accessibility sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Fully Accessible</Typography>
                <Typography variant="body2" color="textSecondary">Screen readers, captions & more</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <People sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Expert Mentors</Typography>
                <Typography variant="body2" color="textSecondary">Get guidance from professionals</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <EmojiObjects sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Interactive Learning</Typography>
                <Typography variant="body2" color="textSecondary">Hands-on projects & quizzes</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} role="region" aria-label="Authentication form">
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ mb: 1, fontWeight: 600 }}
          component="h1"
          id="login-page-title"
        >
          Get Started
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Join thousands of learners building their future
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
              sx={{ mb: 2 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/forgot-password')}
              aria-label="Forgot password"
            >
              Forgot Password?
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
              select
              label="I am a..."
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              sx={{ mb: 2 }}
              aria-label="Select your role"
              helperText={role === 'mentor' ? 'Mentor accounts require admin approval' : ''}
            >
              <MenuItem value="learner">Learner</MenuItem>
              <MenuItem value="mentor">Mentor (Requires Approval)</MenuItem>
            </TextField>
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
      </Container>
    </Box>
  );
};