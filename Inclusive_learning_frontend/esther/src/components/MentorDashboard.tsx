import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  VideoCall as VideoIcon,
  Message as MessageIcon,
  Assessment as AnalyticsIcon,
  Upload as UploadIcon,
  Feedback as FeedbackIcon,
  Event as CalendarIcon,
} from '@mui/icons-material';
import { CalendarService, CalendarEvent } from '../services/calendarService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const MentorDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const assignedLearners = [
    {
      id: 1,
      name: 'Alice Johnson',
      course: 'Web Development',
      disabilities: ['Visual Impairment'],
      progress: 75,
      lastSession: '2024-01-10',
      needsSupport: ['Screen Reader', 'High Contrast'],
      avatar: 'AJ'
    },
    {
      id: 2,
      name: 'Bob Chen',
      course: 'Digital Literacy',
      disabilities: ['Hearing Impairment'],
      progress: 45,
      lastSession: '2024-01-08',
      needsSupport: ['Captions', 'Sign Language'],
      avatar: 'BC'
    },
    {
      id: 3,
      name: 'Carol Martinez',
      course: 'Communication Skills',
      disabilities: ['Speech Impairment'],
      progress: 60,
      lastSession: '2024-01-12',
      needsSupport: ['Text-to-Speech', 'Symbol Board'],
      avatar: 'CM'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      learner: 'Alice Johnson',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Video Call',
      accessibility: ['Screen Reader', 'Audio Description']
    },
    {
      id: 2,
      learner: 'Bob Chen',
      date: '2024-01-16',
      time: '10:00 AM',
      type: 'Text Chat',
      accessibility: ['Captions', 'Visual Alerts']
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleGiveFeedback = () => {
    if (feedbackText.trim()) {
      alert(`Feedback sent to learner ${selectedLearner}`);
      setFeedbackText('');
      setOpenFeedback(false);
    }
  };

  const uploadResource = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Resource "${file.name}" uploaded successfully!`);
      }
    };
    input.click();
  };

  const scheduleSession = (learner: any) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow
    
    const calendarEvent: CalendarEvent = {
      title: `Mentoring Session with ${learner.name}`,
      description: `Course: ${learner.course}\nAccessibility Needs: ${learner.needsSupport.join(', ')}\nDisabilities: ${learner.disabilities.join(', ')}`,
      startDate: tomorrow,
      endDate: new Date(tomorrow.getTime() + 60 * 60 * 1000),
      location: 'Online Session',
      attendees: [`${learner.name.toLowerCase().replace(' ', '.')}@example.com`, 'mentor@example.com']
    };

    CalendarService.sendEmailInvite(calendarEvent, `${learner.name.toLowerCase().replace(' ', '.')}@example.com`, 'mentor@example.com');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Mentor Dashboard</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="My Learners" />
          <Tab label="Sessions" />
          <Tab label="Analytics" />
          <Tab label="Resources" />
        </Tabs>
      </Box>

      {/* My Learners Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {assignedLearners.map((learner) => (
            <Grid item xs={12} md={6} lg={4} key={learner.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>{learner.avatar}</Avatar>
                    <Box>
                      <Typography variant="h6">{learner.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {learner.course}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Progress: {learner.progress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={learner.progress} />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Accessibility Needs:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {learner.needsSupport.map((need) => (
                        <Chip key={need} label={need} size="small" color="primary" />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Disabilities:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {learner.disabilities.map((disability) => (
                        <Chip key={disability} label={disability} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Last Session: {learner.lastSession}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VideoIcon />}
                      onClick={() => alert(`Starting session with ${learner.name}`)}
                    >
                      Start Session
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MessageIcon />}
                      onClick={() => alert(`Opening chat with ${learner.name}`)}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CalendarIcon />}
                      onClick={() => scheduleSession(learner)}
                    >
                      Schedule
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FeedbackIcon />}
                      onClick={() => {
                        setSelectedLearner(learner.id);
                        setOpenFeedback(true);
                      }}
                    >
                      Feedback
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Sessions Tab */}
      <TabPanel value={currentTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Sessions</Typography>
            <List>
              {upcomingSessions.map((session) => (
                <ListItem key={session.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar>
                      {session.type === 'Video Call' ? <VideoIcon /> : <MessageIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${session.learner} - ${session.type}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">{session.date} at {session.time}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {session.accessibility.map((acc) => (
                            <Chip key={acc} label={acc} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained">Join Session</Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<CalendarIcon />}
                      onClick={() => {
                        const sessionDate = new Date(`${session.date}T${session.time.includes('PM') && !session.time.startsWith('12') ? 
                          String(parseInt(session.time.split(':')[0]) + 12) + ':' + session.time.split(':')[1].split(' ')[0] :
                          session.time.replace(' AM', '').replace(' PM', '')}`);
                        
                        const calendarEvent: CalendarEvent = {
                          title: `Session with ${session.learner}`,
                          description: `Type: ${session.type}\nAccessibility: ${session.accessibility.join(', ')}`,
                          startDate: sessionDate,
                          endDate: new Date(sessionDate.getTime() + 60 * 60 * 1000),
                          location: session.type,
                          attendees: [`${session.learner.toLowerCase().replace(' ', '.')}@example.com`, 'mentor@example.com']
                        };
                        
                        const googleUrl = CalendarService.generateGoogleCalendarUrl(calendarEvent);
                        window.open(googleUrl, '_blank');
                      }}
                    >
                      Add to Calendar
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Learner Progress Overview</Typography>
                {assignedLearners.map((learner) => (
                  <Box key={learner.id} sx={{ mb: 2 }}>
                    <Typography variant="body2">{learner.name}</Typography>
                    <LinearProgress variant="determinate" value={learner.progress} sx={{ mb: 0.5 }} />
                    <Typography variant="caption">{learner.progress}% Complete</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Session Statistics</Typography>
                <Typography variant="body2">Total Sessions: 24</Typography>
                <Typography variant="body2">This Week: 6</Typography>
                <Typography variant="body2">Average Rating: 4.8/5</Typography>
                <Typography variant="body2">Response Time: 2 hours</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Resources Tab */}
      <TabPanel value={currentTab} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Learning Resources</Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={uploadResource}
              >
                Upload Resource
              </Button>
            </Box>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="HTML Accessibility Guide"
                  secondary="PDF • Uploaded 2 days ago"
                />
                <Button variant="outlined" size="small">Share</Button>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Screen Reader Demo Video"
                  secondary="MP4 • Uploaded 1 week ago"
                />
                <Button variant="outlined" size="small">Share</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Feedback Dialog */}
      <Dialog open={openFeedback} onClose={() => setOpenFeedback(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Give Feedback</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Provide constructive feedback to help the learner improve..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedback(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGiveFeedback}>
            Send Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};