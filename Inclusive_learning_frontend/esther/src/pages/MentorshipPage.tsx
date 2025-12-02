import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoIcon,
  Message as MessageIcon,
  Star as StarIcon,
  Add as AddIcon,
  Event as CalendarIcon,
} from '@mui/icons-material';
import { CalendarService, type CalendarEvent } from '../services/calendarService';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

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

export const MentorshipPage: React.FC = () => {
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [message, setMessage] = useState('');

  const mentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: ['Web Development', 'Accessibility'],
      rating: 4.9,
      experience: '5+ years',
      avatar: 'SJ',
      bio: 'Passionate about inclusive web development and helping learners with disabilities succeed in tech.',
      availability: 'Mon-Fri 9AM-5PM',
      languages: ['English', 'Spanish'],
      students: 45,
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialization: ['Digital Literacy', 'Computer Skills'],
      rating: 4.8,
      experience: '3+ years',
      avatar: 'MC',
      bio: 'Specializes in teaching computer basics to seniors and people with cognitive disabilities.',
      availability: 'Tue-Sat 10AM-6PM',
      languages: ['English', 'Mandarin'],
      students: 32,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      specialization: ['Tailoring', 'Vocational Skills'],
      rating: 5.0,
      experience: '8+ years',
      avatar: 'ER',
      bio: 'Master tailor with experience in adaptive clothing design for people with mobility challenges.',
      availability: 'Mon-Thu 1PM-8PM',
      languages: ['English', 'Spanish', 'Portuguese'],
      students: 28,
    },
  ];

  const sessions = [
    {
      id: 1,
      mentor: 'Sarah Johnson',
      topic: 'HTML Accessibility',
      date: '2024-01-15',
      time: '2:00 PM',
      status: 'upcoming',
      type: 'video',
    },
    {
      id: 2,
      mentor: 'Michael Chen',
      topic: 'Email Setup',
      date: '2024-01-12',
      time: '10:00 AM',
      status: 'completed',
      type: 'chat',
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleBookSession = () => {
    const mentor = mentors.find(m => m.id === selectedMentor);
    if (mentor) {
      // Create calendar event
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      
      const calendarEvent: CalendarEvent = {
        title: `Mentoring Session with ${mentor.name}`,
        description: `Specializations: ${mentor.specialization.join(', ')}\nLanguages: ${mentor.languages.join(', ')}`,
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        location: 'Online Session',
        attendees: ['user@example.com', `${mentor.name.toLowerCase().replace(' ', '.')}@example.com`]
      };
      
      CalendarService.sendEmailInvite(calendarEvent, 'user@example.com', `${mentor.name.toLowerCase().replace(' ', '.')}@example.com`);
      
      alert(`Session booked with ${mentor.name}! Calendar invite sent.`);
      speak(`Session booked with ${mentor.name}`);
      setOpenBooking(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent: ${message}`);
      speak('Message sent successfully');
      setMessage('');
    }
  };

  const joinVideoCall = (sessionId: number) => {
    alert(`Joining video call for session ${sessionId}`);
    speak('Joining video call');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Mentorship Program
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Find Mentors" />
          <Tab label="My Sessions" />
          <Tab label="Messages" />
        </Tabs>
      </Box>

      {/* Find Mentors Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {mentors.map((mentor) => (
            <Grid item xs={12} md={6} lg={4} key={mentor.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                      {mentor.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{mentor.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={mentor.rating} readOnly size="small" />
                        <Typography variant="body2">({mentor.rating})</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {mentor.bio}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Specializations:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {mentor.specialization.map((spec) => (
                        <Chip key={spec} label={spec} size="small" />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Experience:</strong> {mentor.experience}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Students:</strong> {mentor.students}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Languages:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {mentor.languages.map((lang) => (
                        <Chip key={lang} label={lang} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {mentor.availability}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        setSelectedMentor(mentor.id);
                        setOpenBooking(true);
                      }}
                    >
                      Book Session
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedMentor(mentor.id);
                        setCurrentTab(2);
                      }}
                    >
                      <MessageIcon />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* My Sessions Tab */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
           <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Sessions</Typography>
                <List>
                  {sessions.filter(s => s.status === 'upcoming').map((session) => (
                    <ListItem key={session.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar>
                          {session.type === 'video' ? <VideoIcon /> : <MessageIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${session.topic} with ${session.mentor}`}
                        secondary={`${session.date} at ${session.time}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => joinVideoCall(session.id)}
                          disabled={session.status !== 'upcoming'}
                        >
                          {session.type === 'video' ? 'Join Call' : 'Open Chat'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CalendarIcon />}
                          onClick={() => {
                            const sessionDate = new Date(`${session.date}T14:00:00`);
                            const calendarEvent: CalendarEvent = {
                              title: `${session.topic} with ${session.mentor}`,
                              description: `Session Type: ${session.type}`,
                              startDate: sessionDate,
                              endDate: new Date(sessionDate.getTime() + 60 * 60 * 1000),
                              location: 'Online Session'
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

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Past Sessions</Typography>
                <List>
                  {sessions.filter(s => s.status === 'completed').map((session) => (
                    <ListItem key={session.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <StarIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${session.topic} with ${session.mentor}`}
                        secondary={`Completed on ${session.date}`}
                      />
                      <Button variant="outlined">
                        Rate Session
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

           <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Learning Progress</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Web Development</Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                  <Typography variant="caption">75% Complete</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Digital Literacy</Typography>
                  <LinearProgress variant="determinate" value={45} sx={{ mb: 1 }} />
                  <Typography variant="caption">45% Complete</Typography>
                </Box>

                <Typography variant="h6" sx={{ mb: 2 }}>Quick Stats</Typography>
                <Typography variant="body2">Total Sessions: 12</Typography>
                <Typography variant="body2">Hours Learned: 24</Typography>
                <Typography variant="body2">Certificates: 2</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Messages Tab */}
      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
           <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>My Mentor</Typography>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>SJ</Avatar>
                      <Box>
                        <Typography variant="h6">Sarah Johnson</Typography>
                        <Typography variant="body2" color="success.main">● Online</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Web Development Mentor</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>Next session: Today 2:00 PM</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => alert('Starting video session...')}
                      >
                        Join Session
                      </Button>
                      <Button variant="outlined" size="small">
                        Reschedule
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
                
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Feedback</Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>HTML Accessibility Session</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      "Great progress on semantic HTML! Focus on ARIA labels next."
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 days ago
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>

           <Grid item xs={12} md={8}>
            <Card sx={{ height: 500 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Chat with Sarah Johnson</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => speak('Reading chat messages')}
                    >
                      Read Aloud
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => alert('Opening symbol board...')}
                    >
                      Symbols
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2"><strong>Sarah:</strong> How are you progressing with the HTML course?</Typography>
                    <Typography variant="caption" color="text.secondary">2:15 PM</Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1, ml: 4 }}>
                    <Typography variant="body2"><strong>You:</strong> Great! I finished the accessibility module.</Typography>
                    <Typography variant="caption" color="text.secondary">2:16 PM</Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2"><strong>Sarah:</strong> Excellent! Let's practice ARIA labels in our next session.</Typography>
                    <Typography variant="caption" color="text.secondary">2:17 PM</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="contained" onClick={handleSendMessage}>
                    Send
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Booking Dialog */}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book a Session</DialogTitle>
        <DialogContent>
          {selectedMentor && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {mentors.find(m => m.id === selectedMentor)?.name}
              </Typography>

              <TextField
                fullWidth
                label="Session Topic"
                sx={{ mb: 2 }}
                placeholder="What would you like to learn?"
              />
              <TextField
                fullWidth
                label="Preferred Date"
                type="date"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBookSession}>
            Book Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
// mentorship
