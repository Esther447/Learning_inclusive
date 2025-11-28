/**
 * Home Page Component
 * Modern, accessible home page
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  Hearing as HearingIcon,
  Visibility as VisibilityIcon,
  Keyboard as KeyboardIcon,
  VolumeUp as VolumeUpIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AccessibleButton } from '../components/AccessibleButton';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAccessibilityStore } from '../store/accessibilityStore';

const features = [
  {
    icon: <VisibilityIcon sx={{ fontSize: 48 }} />,
    title: 'Screen Reader Support',
    description: 'Full compatibility with JAWS, NVDA, and other screen readers for blind and low vision users.',
  },
  {
    icon: <VolumeUpIcon sx={{ fontSize: 48 }} />,
    title: 'Text-to-Speech',
    description: 'Convert all text content to speech with customizable reading speed and voice options.',
  },
  {
    icon: <HearingIcon sx={{ fontSize: 48 }} />,
    title: 'Captions & Transcripts',
    description: 'Real-time captions and full transcripts for all video and audio content.',
  },
  {
    icon: <KeyboardIcon sx={{ fontSize: 48 }} />,
    title: 'Keyboard Navigation',
    description: 'Complete keyboard-only navigation with customizable shortcuts for mobility-impaired users.',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 48 }} />,
    title: 'Simplified Learning',
    description: 'Chunked content and simplified navigation for learners with cognitive disabilities.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 48 }} />,
    title: 'Mentorship Support',
    description: 'Connect with mentors and peers for guidance and community support.',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useTextToSpeech();
  const { settings, updateSettings } = useAccessibilityStore();

  const handleToggleTTS = () => {
    updateSettings({ textToSpeechEnabled: !settings.textToSpeechEnabled });
    if (!settings.textToSpeechEnabled) {
      speak('Text to speech has been enabled');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero-section"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: { xs: '60px 20px', md: '100px 20px' },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                marginBottom: 3,
                lineHeight: 1.2,
              }}
            >
              Inclusive Learning & Skills Platform
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                marginBottom: 4,
                opacity: 0.95,
                lineHeight: 1.6,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Empowering people with disabilities in Rwanda through accessible education,
              interactive courses, and mentorship support.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <AccessibleButton
                variant="contained"
                size="large"
                announceOnClick
                announcementText="Navigate to courses"
                onClick={() => {
                  navigate('/courses');
                }}
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  padding: '14px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Browse Courses
              </AccessibleButton>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/mentorship')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  padding: '14px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Join Mentorship
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        className="section"
        sx={{
          padding: { xs: '60px 20px', md: '80px 20px' },
          backgroundColor: '#f8f9fa',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              marginBottom: 2,
              color: '#1a1a1a',
            }}
          >
            Accessibility Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontSize: '1.2rem',
              color: '#666',
              marginBottom: 6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Our platform is designed with WCAG 2.1 AA compliance to ensure equal access for all learners.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      color: '#1976d2',
                      marginBottom: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: '#1a1a1a',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          padding: { xs: '60px 20px', md: '80px 20px' },
          backgroundColor: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                padding: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#1976d2',
                  marginBottom: 1,
                }}
              >
                70%
              </Typography>
              <Typography variant="h6" sx={{ color: '#666' }}>
                of people with disabilities face education barriers
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                padding: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#1976d2',
                  marginBottom: 1,
                }}
              >
                20%
              </Typography>
              <Typography variant="h6" sx={{ color: '#666' }}>
                currently access vocational training opportunities
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                padding: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#1976d2',
                  marginBottom: 1,
                }}
              >
                WCAG 2.1
              </Typography>
              <Typography variant="h6" sx={{ color: '#666' }}>
                AA compliance for maximum accessibility
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          padding: { xs: '60px 20px', md: '80px 20px' },
          backgroundColor: '#1976d2',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              marginBottom: 4,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            Join our inclusive learning community and gain access to courses, mentorship,
            and certifications designed for everyone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                navigate('/login');
              }}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                padding: '14px 32px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleToggleTTS}
              sx={{
                borderColor: 'white',
                color: 'white',
                padding: '14px 32px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {settings.textToSpeechEnabled ? 'Disable' : 'Enable'} TTS
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
