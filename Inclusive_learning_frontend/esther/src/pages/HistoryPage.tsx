import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, LinearProgress, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { School, CheckCircle, EmojiEvents, Assignment, Quiz, VideoLibrary } from '@mui/icons-material';
import { useCourseStore } from '../store/courseStore';

interface HistoryEvent {
  id: string;
  type: 'enrollment' | 'completion' | 'quiz' | 'assignment' | 'badge' | 'lesson';
  title: string;
  description: string;
  date: Date;
  courseTitle?: string;
  score?: number;
}

export const HistoryPage: React.FC = () => {
  const { courses, enrolledCourses } = useCourseStore();
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    badges: 0,
    quizzesPassed: 0
  });

  useEffect(() => {
    // Generate history from enrolled courses and localStorage
    const generateHistory = () => {
      const events: HistoryEvent[] = [];
      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
      const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
      
      // Add enrollment events
      enrolledCourses.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (course) {
          events.push({
            id: `enroll-${courseId}`,
            type: 'enrollment',
            title: 'Enrolled in Course',
            description: course.title,
            courseTitle: course.title,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
          });
        }
      });

      // Add lesson completion events
      completedLessons.forEach((lessonId: string, index: number) => {
        const course = courses.find(c => 
          c.modules?.some(m => m.lessons?.some(l => l.id === lessonId))
        );
        if (course) {
          const module = course.modules?.find(m => m.lessons?.some(l => l.id === lessonId));
          const lesson = module?.lessons?.find(l => l.id === lessonId);
          if (lesson) {
            events.push({
              id: `lesson-${lessonId}`,
              type: 'lesson',
              title: 'Completed Lesson',
              description: lesson.title,
              courseTitle: course.title,
              date: new Date(Date.now() - (completedLessons.length - index) * 24 * 60 * 60 * 1000)
            });
          }
        }
      });

      // Add quiz results
      Object.entries(quizResults).forEach(([quizId, result]: [string, any]) => {
        events.push({
          id: `quiz-${quizId}`,
          type: 'quiz',
          title: 'Completed Quiz',
          description: `Score: ${result.score}/${result.total}`,
          score: Math.round((result.score / result.total) * 100),
          date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
        });
      });

      // Sort by date (most recent first)
      events.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setHistory(events);

      // Calculate stats
      const totalLessons = courses.reduce((acc, c) => 
        acc + (c.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0), 0
      );
      
      setStats({
        totalCourses: enrolledCourses.length,
        completedCourses: 0, // Would track from backend
        totalLessons,
        completedLessons: completedLessons.length,
        badges: 2, // Would track from backend
        quizzesPassed: Object.values(quizResults).filter((r: any) => r.score / r.total >= 0.7).length
      });
    };

    generateHistory();
  }, [courses, enrolledCourses]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <School />;
      case 'completion': return <CheckCircle />;
      case 'quiz': return <Quiz />;
      case 'assignment': return <Assignment />;
      case 'badge': return <EmojiEvents />;
      case 'lesson': return <VideoLibrary />;
      default: return <School />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'primary';
      case 'completion': return 'success';
      case 'quiz': return 'info';
      case 'assignment': return 'warning';
      case 'badge': return 'secondary';
      case 'lesson': return 'primary';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Learning History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Track your learning journey and achievements
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {stats.totalCourses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courses Enrolled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.completedLessons}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lessons Completed
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.completedLessons / stats.totalLessons) * 100} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {stats.quizzesPassed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quizzes Passed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Timeline */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Activity Timeline</Typography>
            {history.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No activity yet. Start learning to see your history!
                </Typography>
              </Box>
            ) : (
              <List>
                {history.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 56, mt: 1 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: `${getColor(event.type)}.light`,
                            color: `${getColor(event.type)}.main`
                          }}
                        >
                          {getIcon(event.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {event.title}
                            </Typography>
                            <Chip 
                              label={event.type} 
                              size="small" 
                              color={getColor(event.type) as any}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                              {formatDate(event.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                            {event.courseTitle && (
                              <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>
                                Course: {event.courseTitle}
                              </Typography>
                            )}
                            {event.score !== undefined && (
                              <Box sx={{ mt: 1, maxWidth: 200 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={event.score} 
                                  color={event.score >= 70 ? 'success' : 'warning'}
                                  sx={{ height: 6, borderRadius: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Score: {event.score}%
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
