import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Switch, FormControlLabel, Button, Slider, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const AccessibilityPage: React.FC = () => {
  const { settings, updateSettings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const [showSaved, setShowSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
    speak(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Accessibility Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Customize your learning experience with these accessibility features
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Visual Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrastMode}
                  onChange={(e) => handleSettingChange('highContrastMode', e.target.checked)}
                />
              }
              label="High Contrast Mode"
            />
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography gutterBottom>Font Size</Typography>
              <Slider
                value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2}
                onChange={(_, v) => {
                  const size = v === 0 ? 'small' : v === 1 ? 'medium' : 'large';
                  updateSettings({ fontSize: size });
                  speak(`Font size set to ${size}`);
                }}
                step={1}
                marks={[
                  { value: 0, label: 'Small' },
                  { value: 1, label: 'Medium' },
                  { value: 2, label: 'Large' }
                ]}
                min={0}
                max={2}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.reducedMotion || false}
                  onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                />
              }
              label="Reduce Motion"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dyslexiaFont || false}
                  onChange={(e) => handleSettingChange('dyslexiaFont', e.target.checked)}
                />
              }
              label="Dyslexia-Friendly Font"
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Audio Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.textToSpeechEnabled}
                  onChange={(e) => handleSettingChange('textToSpeechEnabled', e.target.checked)}
                />
              }
              label="Text-to-Speech"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.captionsEnabled}
                  onChange={(e) => handleSettingChange('captionsEnabled', e.target.checked)}
                />
              }
              label="Video Captions"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.audioDescriptions || false}
                  onChange={(e) => handleSettingChange('audioDescriptions', e.target.checked)}
                />
              }
              label="Audio Descriptions"
            />
            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Speech Rate</InputLabel>
                <Select
                  value={settings.speechRate || 1}
                  onChange={(e) => {
                    updateSettings({ speechRate: e.target.value as number });
                    speak('Speech rate updated');
                  }}
                  label="Speech Rate"
                >
                  <MenuItem value={0.5}>0.5x (Slow)</MenuItem>
                  <MenuItem value={0.75}>0.75x</MenuItem>
                  <MenuItem value={1}>1x (Normal)</MenuItem>
                  <MenuItem value={1.25}>1.25x</MenuItem>
                  <MenuItem value={1.5}>1.5x (Fast)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Navigation</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.keyboardNavigationEnabled}
                  onChange={(e) => handleSettingChange('keyboardNavigationEnabled', e.target.checked)}
                />
              }
              label="Keyboard Navigation"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.focusIndicators || false}
                  onChange={(e) => handleSettingChange('focusIndicators', e.target.checked)}
                />
              }
              label="Enhanced Focus Indicators"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Content Preferences</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.signLanguage || false}
                  onChange={(e) => handleSettingChange('signLanguage', e.target.checked)}
                />
              }
              label="Sign Language Interpretation"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.simplifiedContent || false}
                  onChange={(e) => handleSettingChange('simplifiedContent', e.target.checked)}
                />
              }
              label="Simplified Content"
            />
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowSaved(true);
              speak('Settings saved successfully');
            }}
          >
            Save Settings
          </Button>
          <Button 
            variant="outlined"
            onClick={() => {
              updateSettings({
                highContrastMode: false,
                fontSize: 'medium',
                textToSpeechEnabled: false,
                captionsEnabled: true,
                keyboardNavigationEnabled: true
              });
              speak('Settings reset to default');
            }}
          >
            Reset to Default
          </Button>
        </Box>

        <Snackbar
          open={showSaved}
          autoHideDuration={3000}
          onClose={() => setShowSaved(false)}
          message="Settings saved successfully"
        />
      </Container>
    </Box>
  );
};
