import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AccessibilityProvider } from './context/AccessibilityProvider';
import { useAccessibilityStore } from './store/accessibilityStore';
import { MainLayout } from './components/MainLayout';
import { CourseLayout } from './components/CourseLayout';
import { AdminLayout } from './components/AdminLayout';
import { MentorLayout } from './components/MentorLayout';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { bootstrapInitialAdmin } from './utils/bootstrapAdmin';
import './App.css';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CoursesPage } from './pages/CoursesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SignupPage } from './pages/SignupPage';
import { NewDashboardPage as DashboardPage } from './pages/NewDashboardPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AdminDashboardNew } from './pages/AdminDashboardNew';
import { MentorDashboard } from './pages/MentorDashboard';
import { Box, Typography } from '@mui/material';
import { HelpPage } from './pages/HelpPage';
import { CalendarPage } from './pages/CalendarPage';
import { InboxPage } from './pages/InboxPage';
import { HistoryPage } from './pages/HistoryPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { settings } = useAccessibilityStore();
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <button onClick={() => { setHasError(false); window.location.reload(); }}>Reload</button>
      </div>
    );
  }

  // Bootstrap initial admin on first load
  React.useEffect(() => {
    try {
      bootstrapInitialAdmin();
    } catch (error) {
      console.error('Bootstrap error:', error);
      setHasError(true);
    }
  }, []);

  // Apply accessibility classes to body
  React.useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // High contrast
    body.classList.toggle('high-contrast', settings.highContrastMode);
    
    // Dyslexia font
    body.classList.toggle('dyslexia-font', settings.dyslexiaFont || false);
    
    // Reduced motion
    body.classList.toggle('reduced-motion', settings.reducedMotion || false);
    html.classList.toggle('reduced-motion', settings.reducedMotion || false);
    
    // Enhanced focus
    body.classList.toggle('enhanced-focus', settings.focusIndicators || false);
    
    // Keyboard navigation
    body.classList.toggle('keyboard-nav', settings.keyboardOnlyNavigation);
    
    // Simplified content
    body.classList.toggle('simplified-content', settings.simplifiedContent || false);
    
    // Visual cues
    body.classList.toggle('visual-cues', settings.visualCues);
    
    // Theme
    body.setAttribute('data-theme', settings.colorTheme);
  }, [settings]);

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
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiListItemButton: {
        defaultProps: {
          disableRipple: true,
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

  const { isAuthenticated, user } = useAuthStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AccessibilityProvider>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AccessibilityToolbar />
        <Router>
          <Routes>
            {/* Public routes without sidebar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected routes with main sidebar */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['learner']}><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['learner', 'mentor', 'administrator']}><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute allowedRoles={['learner']}><MainLayout><CoursesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute allowedRoles={['learner', 'mentor']}><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute allowedRoles={['learner', 'mentor', 'administrator']}><MainLayout><InboxPage /></MainLayout></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['learner']}><MainLayout><HistoryPage /></MainLayout></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute allowedRoles={['learner', 'mentor', 'administrator']}><MainLayout><HelpPage /></MainLayout></ProtectedRoute>} />
            <Route path="/mentorship" element={<ProtectedRoute allowedRoles={['learner', 'mentor']}><MainLayout><MentorshipPage /></MainLayout></ProtectedRoute>} />
            <Route path="/accessibility" element={<ProtectedRoute allowedRoles={['learner', 'mentor', 'administrator']}><MainLayout><AccessibilityPage /></MainLayout></ProtectedRoute>} />
            
            {/* Admin routes with admin sidebar */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['administrator']}><AdminLayout><AdminDashboardNew /></AdminLayout></ProtectedRoute>} />
            
            {/* Mentor routes with mentor sidebar */}
            <Route path="/mentor/dashboard" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLayout><MentorDashboard /></MentorLayout></ProtectedRoute>} />
            
            {/* Course routes with course sidebar */}
            <Route path="/courses/:courseId" element={<ProtectedRoute allowedRoles={['learner']}><CourseLayout><CourseDetailPage /></CourseLayout></ProtectedRoute>} />
            <Route path="/courses/:courseId/search" element={<CourseLayout><div>Smart Search</div></CourseLayout>} />
            <Route path="/courses/:courseId/announcements" element={<CourseLayout><AnnouncementsPage /></CourseLayout>} />
            <Route path="/courses/:courseId/assignments" element={<CourseLayout><AssignmentsPage /></CourseLayout>} />
            <Route path="/courses/:courseId/discussions" element={<CourseLayout><div>Discussions</div></CourseLayout>} />
            <Route path="/courses/:courseId/pages" element={<CourseLayout><div>Pages</div></CourseLayout>} />
            <Route path="/courses/:courseId/syllabus" element={<CourseLayout><div>Syllabus</div></CourseLayout>} />
            <Route path="/courses/:courseId/quizzes" element={<CourseLayout><QuizzesPage /></CourseLayout>} />
            <Route path="/courses/:courseId/modules" element={<CourseLayout><div>Modules</div></CourseLayout>} />
            <Route path="/courses/:courseId/collaborations" element={<CourseLayout><div>Collaborations</div></CourseLayout>} />
            <Route path="/courses/:courseId/drive" element={<CourseLayout><div>Google Drive</div></CourseLayout>} />
            <Route path="/courses/:courseId/grades" element={<CourseLayout><div>Grades</div></CourseLayout>} />
            <Route path="/courses/:courseId/badges" element={<CourseLayout><div>Badges</div></CourseLayout>} />
            
            <Route path="*" element={
              <Navigate 
                to={
                  isAuthenticated 
                    ? user?.role === 'administrator' 
                      ? '/admin/dashboard' 
                      : user?.role === 'mentor' 
                        ? '/mentor/dashboard' 
                        : '/dashboard'
                    : '/'
                } 
                replace 
              />
            } />
          </Routes>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
