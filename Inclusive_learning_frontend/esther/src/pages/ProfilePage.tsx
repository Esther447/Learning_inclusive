import React from 'react';
import {
<<<<<<< HEAD
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
=======
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    TextField,
    Avatar,
    Button,
>>>>>>> 057eeb401a084d1154eddfb8769e31d000f9ab83
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // ✅ Correct Grid2 import
import { useAccessibilityStore } from '../store/accessibilityStore';

export const ProfilePage: React.FC = () => {
    const { updateSettings } = useAccessibilityStore();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            <Grid container spacing={4}>
                {/* LEFT COLUMN */}
                <Grid xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ width: 120, height: 120, margin: '0 auto' }} />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                John Doe
                            </Typography>
                            <Typography color="text.secondary">Student</Typography>

                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Learning Preference Description"
                                    placeholder="Describe your learning preferences..."
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>

<<<<<<< HEAD
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
=======
                        <CardActions>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() =>
                                    updateSettings({
                                        fontSize: 'medium',
                                        highContrastMode: false, // ✅ only existing keys
                                    })
                                }
                            >
                                Analyze Preferences
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
>>>>>>> 057eeb401a084d1154eddfb8769e31d000f9ab83

                {/* RIGHT COLUMN */}
                <Grid xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid xs={12} sm={6}>
                                    <TextField fullWidth label="Full Name" defaultValue="John Doe" />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField fullWidth label="Email" defaultValue="john@example.com" />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField fullWidth label="Phone" defaultValue="+123456789" />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Bio"
                                        placeholder="Write something about yourself..."
                                    />
                                </Grid>
                            </Grid>

<<<<<<< HEAD
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
=======
                            <Button variant="contained" sx={{ mt: 3 }}>
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
>>>>>>> 057eeb401a084d1154eddfb8769e31d000f9ab83
};
