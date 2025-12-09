import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Collapse, AppBar, Toolbar, Typography, IconButton, Avatar, Badge, Menu, MenuItem } from '@mui/material';
import { Dashboard, People, School, Assignment, Support, BarChart, Accessibility, Settings, Logout, ExpandLess, ExpandMore, PersonAdd, Notifications, SupervisorAccount } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DRAWER_WIDTH = 260;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [usersOpen, setUsersOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/admin/dashboard' },
    {
      text: 'Users',
      icon: <People />,
      hasSubmenu: true,
      open: usersOpen,
      toggle: () => setUsersOpen(!usersOpen),
      submenu: [
        { text: 'All Users', path: '/admin/users' },
        { text: 'Learners', path: '/admin/learners' },
        { text: 'Mentors', path: '/admin/mentors' },
        { text: 'Mentor Approvals', path: '/admin/mentor-approvals' },
        { text: 'Administrators', path: '/admin/administrators' },
      ],
    },
    {
      text: 'Courses',
      icon: <School />,
      hasSubmenu: true,
      open: coursesOpen,
      toggle: () => setCoursesOpen(!coursesOpen),
      submenu: [
        { text: 'All Courses', path: '/admin/courses' },
        { text: 'Create Course', path: '/admin/courses/create' },
        { text: 'Modules & Lessons', path: '/admin/modules' },
        { text: 'Resources Library', path: '/admin/resources' },
      ],
    },
    { text: 'Enrollment', icon: <Assignment />, path: '/admin/enrollment' },
    { text: 'Support Center', icon: <Support />, path: '/admin/support' },
    { text: 'Analytics & Reports', icon: <BarChart />, path: '/admin/analytics' },
    { text: 'Accessibility Tools', icon: <Accessibility />, path: '/admin/accessibility' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
            Inclusive Learning Admin
          </Typography>
          <IconButton>
            <Badge badgeContent={12} color="error">
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
            <React.Fragment key={index}>
              <ListItemButton
                onClick={() => item.hasSubmenu ? item.toggle?.() : navigate(item.path!)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.2)' },
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.hasSubmenu && (item.open ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              {item.hasSubmenu && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu?.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        sx={{ pl: 7, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                        onClick={() => navigate(subItem.path)}
                        selected={location.pathname === subItem.path}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
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
