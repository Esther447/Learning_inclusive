import React, { useState } from 'react';
import { Box, Grid as MuiGrid, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Avatar, List, ListItem, ListItemAvatar, ListItemText, LinearProgress } from '@mui/material';
import { People, Event, QuestionAnswer, Assignment, VideoCall, Send, Schedule, Star } from '@mui/icons-material';
const Grid: any = MuiGrid as any;

export const MentorDashboard: React.FC = () => {
  const [sessionDialog, setSessionDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);

  const stats = [
    { title: 'Active Learners', value: '12', icon: <People />, color: '#1976d2' },
    { title: 'Sessions Today', value: '2', icon: <Event />, color: '#2e7d32' },
    { title: 'Pending Questions', value: '5', icon: <QuestionAnswer />, color: '#ed6c02' },
    { title: 'Courses Mentoring', value: '3', icon: <Assignment />, color: '#9c27b0' },
  ];

  const learners = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', courses: ['Web Dev'], progress: 75, lastSession: '2024-01-10', status: 'active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', courses: ['Mobile Dev'], progress: 45, lastSession: '2024-01-08', status: 'needs-attention' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', courses: ['Web Dev'], progress: 90, lastSession: '2024-01-12', status: 'active' },
  ];

  const sessions = [
    { id: 1, learner: 'Alice Johnson', date: '2024-01-20', time: '10:00 AM', topic: 'JavaScript Basics', status: 'scheduled' },
    { id: 2, learner: 'Bob Smith', date: '2024-01-20', time: '2:00 PM', topic: 'React Components', status: 'scheduled' },
  ];

  const messages = [
    { id: 1, from: 'Alice Johnson', message: 'Can we reschedule our session?', time: '10 mins ago', unread: true },
    { id: 2, from: 'Bob Smith', message: 'Thank you for the feedback!', time: '1 hour ago', unread: false },
    { id: 3, from: 'Carol White', message: 'I have a question about the assignment', time: '2 hours ago', unread: true },
  ];

  const feedback = [
    { id: 1, learner: 'Alice Johnson', rating: 5, comment: 'Very helpful and patient!', date: '2024-01-15' },
    { id: 2, learner: 'Bob Smith', rating: 4, comment: 'Good explanations', date: '2024-01-14' },
  ];

  return (
    <Box sx={{ p: 3 }}>
        {/* Quick Stats */}
        <Typography variant="h5" fontWeight="600" gutterBottom>Quick Overview</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ color: stat.color, fontSize: 48, mb: 1 }}>{stat.icon}</Box>
                    <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                    <Typography color="textSecondary" variant="body2">{stat.title}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* My Learners */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>My Learners</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Last Session</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learners.map((learner) => (
                  <TableRow key={learner.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>{learner.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2">{learner.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{learner.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {learner.courses.map((course, i) => (
                        <Chip key={i} label={course} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={learner.progress} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                        <Typography variant="body2">{learner.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{learner.lastSession}</TableCell>
                    <TableCell>
                      <Chip 
                        label={learner.status} 
                        size="small" 
                        color={learner.status === 'active' ? 'success' : 'warning'} 
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ mr: 1 }}
                        onClick={() => { setSelectedLearner(learner); setSessionDialog(true); }}
                      >
                        Schedule
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => { setSelectedLearner(learner); setMessageDialog(true); }}
                      >
                        Message
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">Upcoming Sessions</Typography>
              <Button variant="contained" startIcon={<Schedule />} size="small">
                Schedule New
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Learner</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.learner}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>{session.topic}</TableCell>
                    <TableCell>
                      <Chip label={session.status} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <VideoCall />
                      </IconButton>
                      <Button size="small">Reschedule</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Communication & Messages */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>Recent Messages</Typography>
                <List>
                  {messages.map((msg) => (
                    <ListItem 
                      key={msg.id} 
                      sx={{ 
                        bgcolor: msg.unread ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>{msg.from.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={msg.from}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {msg.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {msg.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>Send Message</Typography>
                <TextField fullWidth select size="small" SelectProps={{ displayEmpty: true }} sx={{ mb: 2 }}>
                  <MenuItem value="">Select Learner</MenuItem>
                  {learners.map((l) => (
                    <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Type your message..."
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" startIcon={<Send />}>
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance & Feedback */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>My Performance</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Overall Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <Typography variant="h2">4.8</Typography>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Based on 24 reviews
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} sx={{ color: '#f57c00', fontSize: 20 }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>Recent Feedback</Typography>
                {feedback.map((item) => (
                  <Card key={item.id} sx={{ mb: 2 }} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">{item.learner}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} sx={{ color: '#f57c00', fontSize: 18 }} />
                          ))}
                        </Box>
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {item.comment}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.date}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      {/* Schedule Session Dialog */}
      <Dialog open={sessionDialog} onClose={() => setSessionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Session with {selectedLearner?.name}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Topic" sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth type="time" label="Time" InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Notes" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSessionDialog(false)}>Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onClose={() => setMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to {selectedLearner?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Type your message..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} onClick={() => setMessageDialog(false)}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
