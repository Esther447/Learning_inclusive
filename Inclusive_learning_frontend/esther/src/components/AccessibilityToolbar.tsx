import React, { useState } from 'react';
import { Box, IconButton, Drawer, Typography, Switch, FormControlLabel, Slider, Button, Divider, Tooltip } from '@mui/material';
import { Accessibility, TextIncrease, TextDecrease, Contrast, VolumeUp, Brightness4, Brightness7, Close, Keyboard, Speed } from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const AccessibilityToolbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings } = useAccessibilityStore();
  const { speak, stop } = useTextToSpeech();

  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const current = sizes.indexOf(settings.fontSize);
    if (current < sizes.length - 1) {
      updateSettings({ fontSize: sizes[current + 1] });
      speak('Font size increased');
    }
  };

  const decreaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const current = sizes.indexOf(settings.fontSize);
    if (current > 0) {
      updateSettings({ fontSize: sizes[current - 1] });
      speak('Font size decreased');
    }
  };

  const toggleTheme = () => {
    const themes = ['default', 'dark', 'light', 'high-contrast'];
    const current = themes.indexOf(settings.colorTheme);
    const next = themes[(current + 1) % themes.length];
    updateSettings({ colorTheme: next as any });
    speak(`Theme changed to ${next}`);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <Tooltip title="Accessibility Options">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            zIndex: 1300,
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3,
          }}
          aria-label="Open accessibility options"
        >
          <Accessibility />
        </IconButton>
      </Tooltip>

      {/* Quick Access Toolbar */}
      <Box
        sx={{
          position: 'fixed',
          top: 70,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1200,
        }}
      >
        <Tooltip title="Increase Font Size">
          <IconButton
            onClick={increaseFontSize}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
            aria-label="Increase font size"
          >
            <TextIncrease />
          </IconButton>
        </Tooltip>
        <Tooltip title="Decrease Font Size">
          <IconButton
            onClick={decreaseFontSize}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
            aria-label="Decrease font size"
          >
            <TextDecrease />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Theme">
          <IconButton
            onClick={toggleTheme}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
            aria-label="Toggle theme"
          >
            {settings.colorTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Accessibility Settings Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Accessibility Settings
          </Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="Close accessibility settings">
            <Close />
          </IconButton>
        </Box>

        {/* Visual Settings */}
        <Typography variant="h6" gutterBottom>Visual</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.textToSpeechEnabled}
              onChange={(e) => {
                updateSettings({ textToSpeechEnabled: e.target.checked });
                speak(e.target.checked ? 'Text to speech enabled' : 'Text to speech disabled');
              }}
            />
          }
          label="Text-to-Speech"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.screenReaderEnabled}
              onChange={(e) => updateSettings({ screenReaderEnabled: e.target.checked })}
            />
          }
          label="Screen Reader Support"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.highContrastMode}
              onChange={(e) => {
                updateSettings({ highContrastMode: e.target.checked });
                speak(e.target.checked ? 'High contrast enabled' : 'High contrast disabled');
              }}
            />
          }
          label="High Contrast Mode"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            />
          }
          label="Reduce Motion"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.dyslexiaFont}
              onChange={(e) => updateSettings({ dyslexiaFont: e.target.checked })}
            />
          }
          label="Dyslexia-Friendly Font"
        />

        <Divider sx={{ my: 2 }} />

        {/* Audio Settings */}
        <Typography variant="h6" gutterBottom>Audio</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.captionsEnabled}
              onChange={(e) => updateSettings({ captionsEnabled: e.target.checked })}
            />
          }
          label="Captions"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.transcriptsEnabled}
              onChange={(e) => updateSettings({ transcriptsEnabled: e.target.checked })}
            />
          }
          label="Transcripts"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.signLanguageEnabled}
              onChange={(e) => updateSettings({ signLanguageEnabled: e.target.checked })}
            />
          }
          label="Sign Language"
        />
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Volume Boost</Typography>
          <Slider
            value={settings.volumeBoost}
            onChange={(_, value) => updateSettings({ volumeBoost: value as number })}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            aria-label="Volume boost"
          />
        </Box>
        {settings.textToSpeechEnabled && (
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Speech Rate</Typography>
            <Slider
              value={settings.speechRate || 1}
              onChange={(_, value) => updateSettings({ speechRate: value as number })}
              min={0.5}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
              aria-label="Speech rate"
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Navigation Settings */}
        <Typography variant="h6" gutterBottom>Navigation</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.keyboardOnlyNavigation}
              onChange={(e) => updateSettings({ keyboardOnlyNavigation: e.target.checked })}
            />
          }
          label="Keyboard-Only Navigation"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.voiceCommandNavigation}
              onChange={(e) => updateSettings({ voiceCommandNavigation: e.target.checked })}
            />
          }
          label="Voice Commands"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.focusIndicators}
              onChange={(e) => updateSettings({ focusIndicators: e.target.checked })}
            />
          }
          label="Enhanced Focus Indicators"
        />

        <Divider sx={{ my: 2 }} />

        {/* Cognitive Settings */}
        <Typography variant="h6" gutterBottom>Cognitive</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.simplifiedNavigation}
              onChange={(e) => updateSettings({ simplifiedNavigation: e.target.checked })}
            />
          }
          label="Simplified Navigation"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.simplifiedContent}
              onChange={(e) => updateSettings({ simplifiedContent: e.target.checked })}
            />
          }
          label="Simplified Content"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.visualCues}
              onChange={(e) => updateSettings({ visualCues: e.target.checked })}
            />
          }
          label="Visual Cues"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.remindersEnabled}
              onChange={(e) => updateSettings({ remindersEnabled: e.target.checked })}
            />
          }
          label="Reminders"
        />

        <Divider sx={{ my: 2 }} />

        {/* Reset Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            updateSettings({
              textToSpeechEnabled: false,
              screenReaderEnabled: false,
              highContrastMode: false,
              fontSize: 'medium',
              colorTheme: 'default',
              captionsEnabled: true,
              transcriptsEnabled: true,
              signLanguageEnabled: false,
              volumeBoost: 0,
              keyboardOnlyNavigation: false,
              voiceCommandNavigation: false,
              simplifiedNavigation: false,
              simplifiedContent: false,
              visualCues: true,
              remindersEnabled: false,
              reducedMotion: false,
              dyslexiaFont: false,
              focusIndicators: false,
              speechRate: 1,
            });
            speak('Accessibility settings reset to default');
          }}
        >
          Reset to Default
        </Button>
      </Drawer>
    </>
  );
};
