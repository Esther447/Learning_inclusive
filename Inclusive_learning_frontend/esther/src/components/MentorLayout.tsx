import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Badge, Menu, MenuItem } from '@mui/material';
import { Dashboard, People, School, Message, Event, Folder, BarChart, Settings, Logout, Notifications } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DRAWER_WIDTH = 260;

interface MentorLayoutProps {
  children: React.ReactNode;
}

export const MentorLayout: React.FC<MentorLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/mentor/dashboard' },
    { text: 'My Learners', icon: <People />, path: '/mentor/learners' },
    { text: 'My Courses', icon: <School />, path: '/mentor/courses' },
    { text: 'Messages', icon: <Message />, path: '/mentor/messages' },
    { text: 'Sessions', icon: <Event />, path: '/mentor/sessions' },
    { text: 'Resources', icon: <Folder />, path: '/mentor/resources' },
    { text: 'Analytics', icon: <BarChart />, path: '/mentor/analytics' },
    { text: 'Profile & Settings', icon: <Settings />, path: '/mentor/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
            Mentor Dashboard
          </Typography>
          <IconButton>
            <Badge badgeContent={5} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, cursor: 'pointer' }} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{user?.name?.charAt(0)}</Avatar>
            <Typography variant="body2">{user?.name}</Typography>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}><Settings sx={{ mr: 1, fontSize: 20 }} /> Settings</MenuItem>
            <MenuItem onClick={() => { logout(); navigate('/login'); }}><Logout sx={{ mr: 1, fontSize: 20 }} /> Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1e293b',
            color: 'white',
            pt: 8,
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.2)' },
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f7fa', pt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};
