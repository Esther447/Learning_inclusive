import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AccessibilityProvider } from './context/AccessibilityProvider';
import { useAccessibilityStore } from './store/accessibilityStore';
import { MainLayout } from './components/MainLayout';
import { CourseLayout } from './components/CourseLayout';
import './App.css';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { CoursesPage } from './pages/CoursesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SignupPage } from './pages/SignupPage';
import { NewDashboardPage as DashboardPage } from './pages/NewDashboardPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
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

  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AccessibilityProvider>
        <Router>
          <Routes>
            {/* Public routes without sidebar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/register" element={<SignupPage />} />
            
            {/* Protected routes with main sidebar */}
            <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/courses" element={<MainLayout><CoursesPage /></MainLayout>} />
            <Route path="/calendar" element={<MainLayout><CalendarPage /></MainLayout>} />
            <Route path="/inbox" element={<MainLayout><InboxPage /></MainLayout>} />
            <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />
            <Route path="/help" element={<MainLayout><HelpPage /></MainLayout>} />
            <Route path="/mentorship" element={<MainLayout><MentorshipPage /></MainLayout>} />
            <Route path="/accessibility" element={<MainLayout><AccessibilityPage /></MainLayout>} />
            <Route path="/admin/dashboard" element={<MainLayout><AdminDashboard /></MainLayout>} />
            
            {/* Course routes with course sidebar */}
            <Route path="/courses/:courseId" element={<CourseLayout><CourseDetailPage /></CourseLayout>} />
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
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
          </Routes>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
