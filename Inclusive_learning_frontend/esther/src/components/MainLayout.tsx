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
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  School as CoursesIcon,
  CalendarMonth as CalendarIcon,
  Inbox as InboxIcon,
  History as HistoryIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Accessibility as AccessibilityIcon,
  People as MentorshipIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DRAWER_WIDTH = 230;
const TOPBAR_HEIGHT = 60;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuthStore();

  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Account', icon: <AccountIcon />, path: '/profile' },
    { text: 'Courses', icon: <CoursesIcon />, path: '/courses' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Inbox', icon: <InboxIcon />, path: '/inbox' },
    { text: 'History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
  ];

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

  const drawer = (
    <Box sx={{ mt: `${TOPBAR_HEIGHT}px`, height: `calc(100vh - ${TOPBAR_HEIGHT}px)`, overflow: 'auto' }}>
      <List sx={{ px: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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
            <Button onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none', fontWeight: location.pathname === '/dashboard' ? 600 : 400 }}>Dashboard</Button>
            <Button onClick={() => navigate('/courses')} sx={{ textTransform: 'none', fontWeight: location.pathname === '/courses' ? 600 : 400 }}>Courses</Button>
            <Button onClick={() => navigate('/mentorship')} sx={{ textTransform: 'none', fontWeight: location.pathname === '/mentorship' ? 600 : 400 }}>Mentorship</Button>
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

      {/* Sidebar */}
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
