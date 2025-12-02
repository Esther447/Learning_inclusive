/**
 * Profile Page
 * User profile with accessibility preferences
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { settings, updateSettings } = useAccessibilityStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = () => {
    if (user) {
      updateUser({ ...user, ...profileData });
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleAccessibilityChange = (setting: string, value: any) => {
    updateSettings({ [setting]: value });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
         <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user?.name}</Typography>
                  <Chip label={user?.role} color="primary" size="small" />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Accessibility Settings */}
         <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <AccessibilityIcon sx={{ mr: 1 }} />
                Accessibility Settings
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.textToSpeechEnabled}
                      onChange={(e) => handleAccessibilityChange('textToSpeechEnabled', e.target.checked)}
                    />
                  }
                  label="Text-to-Speech"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.highContrastMode}
                      onChange={(e) => handleAccessibilityChange('highContrastMode', e.target.checked)}
                    />
                  }
                  label="High Contrast Mode"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.screenReaderEnabled}
                      onChange={(e) => handleAccessibilityChange('screenReaderEnabled', e.target.checked)}
                    />
                  }
                  label="Screen Reader Support"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.keyboardOnlyNavigation}
                      onChange={(e) => handleAccessibilityChange('keyboardOnlyNavigation', e.target.checked)}
                    />
                  }
                  label="Keyboard Navigation"
                />

                <FormControl fullWidth>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={settings.fontSize}
                    onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                    <MenuItem value="extra-large">Extra Large</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Color Theme</InputLabel>
                  <Select
                    value={settings.colorTheme}
                    onChange={(e) => handleAccessibilityChange('colorTheme', e.target.value)}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="high-contrast">High Contrast</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => alert('Settings saved automatically!')}
                >
                  Test Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
