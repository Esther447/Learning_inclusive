import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  VideoCall as VideoIcon,
  Message as ChatIcon,
  Phone as VoiceIcon,
  AccessTime as TimeIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { CalendarService, CalendarEvent } from '../services/calendarService';

interface SessionBookingProps {
  mentorId: number;
  mentorName: string;
  mentorEmail?: string;
  userEmail?: string;
  onBookingComplete: (bookingData: any) => void;
}

export const SessionBooking: React.FC<SessionBookingProps> = ({
  mentorId,
  mentorName,
  mentorEmail = 'mentor@example.com',
  userEmail = 'user@example.com',
  onBookingComplete,
}) => {
  const { speak } = useTextToSpeech();
  const [activeStep, setActiveStep] = useState(0);
  const [sessionType, setSessionType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const sessionTypes = [
    { value: 'video', label: 'Video Call', icon: <VideoIcon />, description: 'Face-to-face interaction with screen sharing' },
    { value: 'voice', label: 'Voice Call', icon: <VoiceIcon />, description: 'Audio-only conversation' },
    { value: 'chat', label: 'Text Chat', icon: <ChatIcon />, description: 'Written conversation with file sharing' }
  ];

  const accessibilityOptions = [
    { value: 'captions', label: 'Live Captions', description: 'Real-time speech-to-text captions' },
    { value: 'sign-language', label: 'Sign Language Interpreter', description: 'Professional interpreter available' },
    { value: 'screen-reader', label: 'Screen Reader Support', description: 'Optimized for screen reader users' },
    { value: 'high-contrast', label: 'High Contrast Mode', description: 'Enhanced visual contrast' },
    { value: 'text-to-speech', label: 'Text-to-Speech', description: 'Audio reading of text content' },
    { value: 'symbol-board', label: 'Symbol Communication Board', description: 'Visual symbols for non-verbal communication' },
    { value: 'slow-pace', label: 'Slower Pace', description: 'Extra time for processing information' },
    { value: 'breaks', label: 'Regular Breaks', description: 'Scheduled breaks during session' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const steps = [
    'Session Type',
    'Date & Time',
    'Accessibility Needs',
    'Confirmation'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    speak(`Step ${activeStep + 2} of ${steps.length}`);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAccessibilityChange = (option: string) => {
    setAccessibilityNeeds(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleBooking = () => {
    const bookingData = {
      mentorId,
      mentorName,
      sessionType,
      date,
      time,
      topic,
      accessibilityNeeds,
      specialRequests
    };
    
    // Generate calendar invite
    generateCalendarInvite(bookingData);
    onBookingComplete(bookingData);
    speak('Session booked successfully and calendar invite sent');
  };

  const generateCalendarInvite = (bookingData: any) => {
    const startDateTime = new Date(`${bookingData.date}T${convertTo24Hour(bookingData.time)}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session
    
    const calendarEvent: CalendarEvent = {
      title: `Learning Session: ${bookingData.topic || 'General Discussion'}`,
      description: `Session with ${bookingData.mentorName}\n` +
                  `Type: ${sessionTypes.find(t => t.value === bookingData.sessionType)?.label}\n` +
                  `Accessibility Features: ${bookingData.accessibilityNeeds.join(', ') || 'None'}\n` +
                  `Special Requests: ${bookingData.specialRequests || 'None'}`,
      startDate: startDateTime,
      endDate: endDateTime,
      location: sessionTypes.find(t => t.value === bookingData.sessionType)?.label || 'Online Session',
      attendees: [userEmail, mentorEmail]
    };

    // Send email invite with calendar attachment
    CalendarService.sendEmailInvite(calendarEvent, userEmail, mentorEmail);
    
    // Also open Google Calendar as backup
    const googleUrl = CalendarService.generateGoogleCalendarUrl(calendarEvent);
    setTimeout(() => window.open(googleUrl, '_blank'), 1000);
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0: return sessionType !== '';
      case 1: return date !== '' && time !== '';
      case 2: return true; // Accessibility needs are optional
      case 3: return true;
      default: return false;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Book a Session with {mentorName}
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Session Type */}
          <Step>
            <StepLabel>Choose Session Type</StepLabel>
            <StepContent>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {sessionTypes.map((type) => (
                  <Grid item xs={12} sm={4} key={type.value}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: sessionType === type.value ? 2 : 1,
                        borderColor: sessionType === type.value ? 'primary.main' : 'divider'
                      }}
                      onClick={() => {
                        setSessionType(type.value);
                        speak(`Selected ${type.label}`);
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 1 }}>{type.icon}</Box>
                        <Typography variant="h6">{type.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {type.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <TextField
                fullWidth
                label="Session Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What would you like to learn or discuss?"
                sx={{ mb: 2 }}
              />

              <Box>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepComplete(0)}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Date & Time */}
          <Step>
            <StepLabel>Select Date & Time</StepLabel>
            <StepContent>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Preferred Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Time</InputLabel>
                    <Select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      label="Preferred Time"
                    >
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Sessions are typically 60 minutes long. Your mentor will confirm availability.
                </Typography>
              </Alert>

              <Box>
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepComplete(1)}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Accessibility Needs */}
          <Step>
            <StepLabel>Accessibility Requirements</StepLabel>
            <StepContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AccessibilityIcon sx={{ mr: 1 }} />
                Select any accessibility features you need for this session. All features are provided at no extra cost.
              </Alert>

              <FormGroup>
                <Grid container spacing={1}>
                  {accessibilityOptions.map((option) => (
                    <Grid item xs={12} sm={6} key={option.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={accessibilityNeeds.includes(option.value)}
                            onChange={() => handleAccessibilityChange(option.value)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>

              <TextField
                fullWidth
                label="Special Requests"
                multiline
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any additional accommodations or specific needs?"
                sx={{ mt: 2, mb: 2 }}
              />

              <Box>
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 4: Confirmation */}
          <Step>
            <StepLabel>Confirm Booking</StepLabel>
            <StepContent>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Session Summary</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Mentor:</strong></Typography>
                      <Typography variant="body2"><strong>Type:</strong></Typography>
                      <Typography variant="body2"><strong>Date:</strong></Typography>
                      <Typography variant="body2"><strong>Time:</strong></Typography>
                      <Typography variant="body2"><strong>Topic:</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">{mentorName}</Typography>
                      <Typography variant="body2">{sessionTypes.find(t => t.value === sessionType)?.label}</Typography>
                      <Typography variant="body2">{date}</Typography>
                      <Typography variant="body2">{time}</Typography>
                      <Typography variant="body2">{topic || 'General discussion'}</Typography>
                    </Grid>
                  </Grid>

                  {accessibilityNeeds.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}><strong>Accessibility Features:</strong></Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {accessibilityNeeds.map((need) => {
                          const option = accessibilityOptions.find(opt => opt.value === need);
                          return option ? (
                            <Typography key={need} variant="caption" sx={{ 
                              bgcolor: 'primary.light', 
                              color: 'primary.contrastText',
                              px: 1, 
                              py: 0.5, 
                              borderRadius: 1 
                            }}>
                              {option.label}
                            </Typography>
                          ) : null;
                        })}
                      </Box>
                    </Box>
                  )}

                  {specialRequests && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2"><strong>Special Requests:</strong></Typography>
                      <Typography variant="body2">{specialRequests}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Alert severity="success" sx={{ mb: 2 }}>
                Your mentor will receive this booking request and confirm availability within 24 hours. Calendar invites will be sent via email and you can also add to Google Calendar.
              </Alert>

              <Box>
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleBooking}>
                  Confirm Booking & Send Calendar Invite
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
};