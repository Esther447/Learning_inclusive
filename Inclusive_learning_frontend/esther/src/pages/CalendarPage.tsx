import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { CalendarToday, Assignment, Quiz, Event, Add, Google } from '@mui/icons-material';
import { useCourseStore } from '../store/courseStore';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'quiz' | 'assignment' | 'lesson' | 'deadline';
  course: string;
  description?: string;
}

export const CalendarPage: React.FC = () => {
  const { courses, enrolledCourses } = useCourseStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [addEventDialog, setAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'assignment' as 'quiz' | 'assignment' | 'lesson' | 'deadline',
    course: '',
    description: ''
  });

  useEffect(() => {
    // Generate events from enrolled courses
    const generateEvents = () => {
      const generatedEvents: CalendarEvent[] = [];
      const now = new Date();

      enrolledCourses.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (course) {
          // Add assignment deadlines
          course.assignments?.forEach((assignment, index) => {
            const dueDate = new Date(now.getTime() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
            generatedEvents.push({
              id: `assign-${assignment.id}`,
              date: dueDate,
              title: assignment.title,
              type: 'assignment',
              course: course.title,
              description: assignment.description
            });
          });

          // Add quiz dates
          course.quizzes?.forEach((quiz, index) => {
            const quizDate = new Date(now.getTime() + (index + 1) * 5 * 24 * 60 * 60 * 1000);
            generatedEvents.push({
              id: `quiz-${quiz.id}`,
              date: quizDate,
              title: quiz.title,
              type: 'quiz',
              course: course.title,
              description: quiz.description
            });
          });
        }
      });

      // Load custom events from localStorage
      const customEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      customEvents.forEach((event: any) => {
        generatedEvents.push({
          ...event,
          date: new Date(event.date)
        });
      });

      // Sort by date
      generatedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(generatedEvents);
    };

    generateEvents();
  }, [courses, enrolledCourses]);

  const handleAddEvent = () => {
    const event: CalendarEvent = {
      id: `custom-${Date.now()}`,
      date: new Date(newEvent.date),
      title: newEvent.title,
      type: newEvent.type,
      course: newEvent.course,
      description: newEvent.description
    };

    // Save to localStorage
    const customEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    customEvents.push(event);
    localStorage.setItem('calendarEvents', JSON.stringify(customEvents));

    setEvents([...events, event].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setAddEventDialog(false);
    setNewEvent({ title: '', date: '', type: 'assignment', course: '', description: '' });
  };

  const addToGoogleCalendar = (event: CalendarEvent) => {
    const startDate = event.date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(event.date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.course)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const getRelativeDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Past';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `In ${days} days`;
    if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
    return date.toLocaleDateString();
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'primary';
      case 'assignment': return 'secondary';
      case 'lesson': return 'info';
      case 'deadline': return 'error';
      default: return 'default';
    }
  };

  const upcomingEvents = events.filter(e => e.date >= new Date());
  const pastEvents = events.filter(e => e.date < new Date());

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your assignments, quizzes, and important dates
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddEventDialog(true)}
          >
            Add Event
          </Button>
        </Box>

        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <Alert severity="info">
            No events scheduled. Enroll in courses or add custom events to get started!
          </Alert>
        )}

        {upcomingEvents.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Events ({upcomingEvents.length})
                </Typography>
              </Box>
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem 
                    key={event.id} 
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      mb: 2,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {event.type === 'quiz' ? <Quiz color="primary" /> : 
                       event.type === 'assignment' ? <Assignment color="secondary" /> : 
                       <Event color="info" />}
                    </Box>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {event.course}
                          </Typography>
                          {event.description && ` — ${event.description}`}
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={getRelativeDate(event.date)} 
                        size="small" 
                        color={getRelativeDate(event.date) === 'Today' ? 'error' : 'default'} 
                      />
                      <Button
                        size="small"
                        startIcon={<Google />}
                        onClick={() => addToGoogleCalendar(event)}
                      >
                        Add to Google
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {pastEvents.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Past Events ({pastEvents.length})
              </Typography>
              <List>
                {pastEvents.slice(0, 5).map((event) => (
                  <ListItem 
                    key={event.id} 
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      mb: 2,
                      opacity: 0.6
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {event.type === 'quiz' ? <Quiz /> : <Assignment />}
                    </Box>
                    <ListItemText
                      primary={event.title}
                      secondary={event.course}
                    />
                    <Chip label={event.date.toLocaleDateString()} size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Add Event Dialog */}
        <Dialog open={addEventDialog} onClose={() => setAddEventDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Custom Event</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                label="Event Type"
              >
                <MenuItem value="assignment">Assignment</MenuItem>
                <MenuItem value="quiz">Quiz</MenuItem>
                <MenuItem value="lesson">Lesson</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Course/Category"
              value={newEvent.course}
              onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddEventDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.date || !newEvent.course}
            >
              Add Event
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
