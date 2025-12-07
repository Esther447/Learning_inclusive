/**
 * Accessibility Toolbar Component
 * Provides quick access to accessibility features
 */

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Drawer,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Divider,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  VolumeUp as VolumeUpIcon,
  Contrast as ContrastIcon,
  TextFields as TextFieldsIcon,
  Subtitles as SubtitlesIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const AccessibilityToolbar: React.FC = () => {
  const { settings, updateSettings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggle = (setting: string, value: boolean, label: string) => {
    updateSettings({ [setting]: value });
    speak?.(value ? `${label} enabled` : `${label} disabled`);
  };

  const handleFontSizeChange = (_: Event, value: number | number[]) => {
    const sizes = ['small', 'medium', 'large', 'x-large'];
    const fontSize = sizes[value as number];
    updateSettings({ fontSize });
    speak?.(`Font size changed to ${fontSize}`);
  };

  const getFontSizeValue = () => {
    const sizes = ['small', 'medium', 'large', 'x-large'];
    return sizes.indexOf(settings.fontSize);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <Tooltip title="Accessibility Settings">
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: 3,
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: 6,
            },
            zIndex: 1000,
          }}
          aria-label="Open accessibility settings"
        >
          <AccessibilityIcon />
        </IconButton>
      </Tooltip>

      {/* Accessibility Settings Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Accessibility Settings
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close accessibility settings">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Visual Settings */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContrastIcon /> Visual
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.highContrastMode}
              onChange={(e) => handleToggle('highContrastMode', e.target.checked, 'High contrast mode')}
            />
          }
          label="High Contrast Mode"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.screenReaderEnabled}
              onChange={(e) => handleToggle('screenReaderEnabled', e.target.checked, 'Screen reader')}
            />
          }
          label="Screen Reader Support"
        />

        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextFieldsIcon fontSize="small" /> Font Size
          </Typography>
          <Slider
            value={getFontSizeValue()}
            onChange={handleFontSizeChange}
            min={0}
            max={3}
            step={1}
            marks={[
              { value: 0, label: 'S' },
              { value: 1, label: 'M' },
              { value: 2, label: 'L' },
              { value: 3, label: 'XL' },
            ]}
            aria-label="Font size"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Audio Settings */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolumeUpIcon /> Audio
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.textToSpeechEnabled}
              onChange={(e) => handleToggle('textToSpeechEnabled', e.target.checked, 'Text to speech')}
            />
          }
          label="Text-to-Speech"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.captionsEnabled}
              onChange={(e) => handleToggle('captionsEnabled', e.target.checked, 'Captions')}
            />
          }
          label="Enable Captions"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.signLanguageEnabled}
              onChange={(e) => handleToggle('signLanguageEnabled', e.target.checked, 'Sign language')}
            />
          }
          label="Sign Language Videos"
        />

        <Divider sx={{ my: 3 }} />

        {/* Navigation Settings */}
        <Typography variant="h6" gutterBottom>
          Navigation
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.keyboardOnlyNavigation}
              onChange={(e) => handleToggle('keyboardOnlyNavigation', e.target.checked, 'Keyboard navigation')}
            />
          }
          label="Keyboard-Only Navigation"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.voiceCommandNavigation}
              onChange={(e) => handleToggle('voiceCommandNavigation', e.target.checked, 'Voice commands')}
            />
          }
          label="Voice Command Navigation"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.simplifiedNavigation}
              onChange={(e) => handleToggle('simplifiedNavigation', e.target.checked, 'Simplified navigation')}
            />
          }
          label="Simplified Navigation"
        />

        <Divider sx={{ my: 3 }} />

        {/* Reset Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            updateSettings({
              highContrastMode: false,
              textToSpeechEnabled: false,
              fontSize: 'medium',
              screenReaderEnabled: false,
              captionsEnabled: true,
              keyboardOnlyNavigation: false,
            });
            speak?.('Accessibility settings reset to default');
          }}
        >
          Reset to Default
        </Button>
      </Drawer>
    </>
  );
};
