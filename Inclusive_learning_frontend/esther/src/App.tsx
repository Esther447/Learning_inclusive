import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AccessibilityProvider } from './context/AccessibilityProvider';
import { useAccessibilityStore } from './store/accessibilityStore';
import { Navigation } from './components/Navigation';
import './App.css';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { CoursesPage } from './pages/CoursesPage';
import { CoursePage } from './pages/CoursePage';
import { EnhancedProfilePage } from './pages/EnhancedProfilePage';
import { GroupsPage } from './pages/GroupsPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { QuizPage } from './pages/QuizPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
// import MentorshipPage from './pages/MentorshipPage';
// import ProfilePage from './pages/ProfilePage';

function App() {
  const { settings } = useAccessibilityStore();

  // Create theme based on accessibility settings
  const theme = createTheme({
    palette: {
      mode: settings.colorTheme === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: settings.colorTheme === 'dark' ? '#121212' : '#f8f9fa',
        paper: settings.colorTheme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      contrastThreshold: settings.highContrastMode ? 4.5 : 3,
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 
        settings.fontSize === 'small' ? 14 :
        settings.fontSize === 'medium' ? 16 :
        settings.fontSize === 'large' ? 18 : 20,
      h1: {
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AccessibilityProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/register" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:courseId" element={<CoursePage />} />
                <Route path="/profile" element={<EnhancedProfilePage />} />
                <Route path="/groups" element={<GroupsPage />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
                <Route path="/quiz/:courseId" element={<QuizPage />} />
                <Route path="/mentorship" element={<div>Mentorship Page - Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
