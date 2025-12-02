/**
 * Dashboard Page
 * Role-based dashboard (Learner, Mentor, Administrator)
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';

const drawerWidth = 240;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings, updateSettings } = useAccessibilityStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([1, 2, 3]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleEnrollCourse = (courseId: number) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      alert('Successfully enrolled in course!');
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const handleToggleAccessibility = (setting: string) => {
    const currentValue = settings[setting as keyof typeof settings];
    if (typeof currentValue === 'boolean') {
      updateSettings({ [setting]: !currentValue });
    } else if (setting === 'fontSize') {
      updateSettings({ fontSize: settings.fontSize === 'large' ? 'medium' : 'large' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sample data
  const sampleCourses = [
    { id: 1, title: 'Web Development Basics', progress: 75, thumbnail: '📱' },
    { id: 2, title: 'Digital Literacy', progress: 45, thumbnail: '💻' },
    { id: 3, title: 'Communication Skills', progress: 90, thumbnail: '🗣️' },
  ];
  
  const [courses] = useState(sampleCourses);

  const availableCourses = [
    { id: 4, title: 'Mobile App Development', category: 'Technology', thumbnail: '📱' },
    { id: 5, title: 'Graphic Design', category: 'Creative', thumbnail: '🎨' },
    { id: 6, title: 'Business Skills', category: 'Professional', thumbnail: '💼' },
  ];

  const notifications = [
    'New course "Advanced JavaScript" is available',
    'Assignment due tomorrow in Web Development',
    'Group meeting scheduled for Friday',
  ];

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Courses', icon: <BookIcon />, path: '/courses' },
      { text: 'Groups', icon: <GroupIcon />, path: '/groups' },
      { text: 'Profile', icon: <SettingsIcon />, path: '/profile' },
    ];

    if (user?.role === 'mentor') {
      return [
        ...baseItems,
        { text: 'Create Course', icon: <AddIcon />, path: '/create-course' },
        { text: 'Student Progress', icon: <AssessmentIcon />, path: '/student-progress' },
      ];
    }

    if (user?.role === 'administrator') {
      return [
        ...baseItems,
        { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'System Monitor', icon: <AssessmentIcon />, path: '/admin/monitor' },
      ];
    }

    return baseItems;
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Inclusive Learning
        </Typography>
      </Toolbar>
      <List>
        {getNavigationItems().map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: settings.highContrastMode ? '#555' : '#f5f5f5',
              },
            }}
          >
            <ListItemIcon sx={{ color: settings.highContrastMode ? '#fff' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: settings.fontSize === 'large' ? '1.1rem' : '1rem',
                  color: settings.highContrastMode ? '#fff' : 'inherit',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const renderLearnerDashboard = () => (
    <Grid container spacing={3}>
      {/* My Courses */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ mb: 3, backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              My Courses
            </Typography>
            <Grid container spacing={2}>
              {sampleCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: settings.highContrastMode ? '#444' : '#f9f9f9',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                          {course.thumbnail}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: settings.fontSize === 'large' ? '1.2rem' : '1rem',
                            color: settings.highContrastMode ? '#fff' : 'inherit',
                          }}
                        >
                          {course.title}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: settings.highContrastMode ? '#ccc' : '#666' }}
                      >
                        {course.progress}% Complete
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Available Courses */}
        <Card sx={{ backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              Available Courses
            </Typography>
            <Grid container spacing={2}>
              {availableCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: settings.highContrastMode ? '#444' : '#f9f9f9',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                          {course.thumbnail}
                        </Typography>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: settings.fontSize === 'large' ? '1.2rem' : '1rem',
                              color: settings.highContrastMode ? '#fff' : 'inherit',
                            }}
                          >
                            {course.title}
                          </Typography>
                          <Chip label={course.category} size="small" />
                        </Box>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        onClick={() => handleEnrollCourse(course.id)}
                      >
                        {enrolledCourses.includes(course.id) ? 'Continue Course' : 'Enroll Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
        {/* Notifications */}
        <Card sx={{ mb: 3, backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.3rem' : '1.1rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Notifications
            </Typography>
            <List dense>
              {notifications.map((notification, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={notification}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: settings.fontSize === 'large' ? '1rem' : '0.875rem',
                        color: settings.highContrastMode ? '#ccc' : '#666',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Accessibility Tools */}
        <Card sx={{ backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.3rem' : '1.1rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              Accessibility Tools
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate('/profile')}
            >
              Adjust Settings
            </Button>
            <Button 
              variant={settings.textToSpeechEnabled ? "contained" : "outlined"} 
              fullWidth 
              sx={{ mb: 1 }}
              onClick={() => handleToggleAccessibility('textToSpeechEnabled')}
            >
              {settings.textToSpeechEnabled ? 'TTS: ON' : 'Text-to-Speech'}
            </Button>
            <Button 
              variant={settings.highContrastMode ? "contained" : "outlined"} 
              fullWidth
              onClick={() => handleToggleAccessibility('highContrastMode')}
            >
              {settings.highContrastMode ? 'Contrast: ON' : 'High Contrast'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderMentorDashboard = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ mb: 3, backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
                  color: settings.highContrastMode ? '#fff' : 'inherit',
                }}
              >
                My Courses
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-course')}
              >
                Create Course
              </Button>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: settings.highContrastMode ? '#ccc' : '#666', mb: 2 }}
            >
              Manage your courses and track student progress
            </Typography>
            {/* Course management interface would go here */}
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.3rem' : '1.1rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              Student Progress
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: settings.highContrastMode ? '#ccc' : '#666' }}
            >
              View detailed analytics and student performance
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Card sx={{ backgroundColor: settings.highContrastMode ? '#333' : '#fff' }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontSize: settings.fontSize === 'large' ? '1.5rem' : '1.25rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              System Overview
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: settings.highContrastMode ? '#ccc' : '#666' }}
            >
              Monitor platform usage, manage users, and oversee course approvals
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'mentor':
        return renderMentorDashboard();
      case 'administrator':
        return renderAdminDashboard();
      default:
        return renderLearnerDashboard();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: settings.highContrastMode ? '#000' : '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: settings.highContrastMode ? '#333' : '#1976d2',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Avatar 
            sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
            onClick={handleLogout}
            title="Click to logout"
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: settings.highContrastMode ? '#222' : '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: settings.highContrastMode ? '#222' : '#fff',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontSize: settings.fontSize === 'large' ? '2.5rem' : '2rem',
                color: settings.highContrastMode ? '#fff' : 'inherit',
              }}
            >
              Welcome back, {user?.name}!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: settings.fontSize === 'large' ? '1.1rem' : '1rem',
                color: settings.highContrastMode ? '#ccc' : '#666',
              }}
            >
              {user?.role === 'learner' && 'Continue your learning journey'}
              {user?.role === 'mentor' && 'Manage your courses and students'}
              {user?.role === 'administrator' && 'Monitor and manage the platform'}
            </Typography>
          </Box>

          {renderDashboardContent()}
        </Container>
      </Box>
    </Box>
  );
};