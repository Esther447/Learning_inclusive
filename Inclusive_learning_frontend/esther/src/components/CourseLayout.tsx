/**
 * Course Layout with Inside Course Navigation
 */

import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Campaign as AnnouncementsIcon,
  Assignment as AssignmentsIcon,
  Forum as DiscussionsIcon,
  Description as PagesIcon,
  MenuBook as SyllabusIcon,
  Quiz as QuizzesIcon,
  ViewModule as ModulesIcon,
  Group as CollaborationsIcon,
  CloudQueue as GoogleDriveIcon,
  Grade as GradesIcon,
  EmojiEvents as BadgesIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Accessibility as AccessibilityIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DRAWER_WIDTH = 260;
const TOPBAR_HEIGHT = 60;

interface CourseLayoutProps {
  children: React.ReactNode;
  courseTitle?: string;
}

export const CourseLayout: React.FC<CourseLayoutProps> = ({ children, courseTitle = 'Course' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuthStore();

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  const courseMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: `/courses/${courseId}` },
    { text: 'Smart Search', icon: <SearchIcon />, path: `/courses/${courseId}/search` },
    { text: 'Announcements', icon: <AnnouncementsIcon />, path: `/courses/${courseId}/announcements` },
    { text: 'Assignments', icon: <AssignmentsIcon />, path: `/courses/${courseId}/assignments` },
    { text: 'Discussions', icon: <DiscussionsIcon />, path: `/courses/${courseId}/discussions` },
    { text: 'Pages', icon: <PagesIcon />, path: `/courses/${courseId}/pages` },
    { text: 'Syllabus', icon: <SyllabusIcon />, path: `/courses/${courseId}/syllabus` },
    { text: 'Quizzes', icon: <QuizzesIcon />, path: `/courses/${courseId}/quizzes` },
    { text: 'Modules', icon: <ModulesIcon />, path: `/courses/${courseId}/modules` },
    { text: 'Collaborations', icon: <CollaborationsIcon />, path: `/courses/${courseId}/collaborations` },
    { text: 'Google Drive', icon: <GoogleDriveIcon />, path: `/courses/${courseId}/drive` },
    { text: 'Grades', icon: <GradesIcon />, path: `/courses/${courseId}/grades` },
    { text: 'Badges', icon: <BadgesIcon />, path: `/courses/${courseId}/badges` },
  ];

  const drawer = (
    <Box sx={{ mt: `${TOPBAR_HEIGHT}px`, height: `calc(100vh - ${TOPBAR_HEIGHT}px)`, overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <IconButton onClick={() => navigate('/courses')} size="small" sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="subtitle1" component="span" fontWeight="600">
          {courseTitle}
        </Typography>
      </Box>
      <List>
        {courseMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          height: TOPBAR_HEIGHT,
          bgcolor: 'white',
          color: 'text.primary',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px !important`, px: 2 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" fontWeight="bold" sx={{ mr: 4, color: 'primary.main' }}>
            Inclusive Learning
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            <Button onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none' }}>Dashboard</Button>
            <Button onClick={() => navigate('/courses')} sx={{ textTransform: 'none', fontWeight: 600 }}>Courses</Button>
            <Button onClick={() => navigate('/mentorship')} sx={{ textTransform: 'none' }}>Mentorship</Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" title="Accessibility Settings" onClick={() => navigate('/accessibility')}>
              <AccessibilityIcon />
            </IconButton>
            <Button
              onClick={handleUserMenuOpen}
              startIcon={<Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>{user?.name?.charAt(0) || 'U'}</Avatar>}
              sx={{ textTransform: 'none' }}
            >
              {user?.name || 'User'}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
              <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Course Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${TOPBAR_HEIGHT}px`,
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          bgcolor: 'white',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
