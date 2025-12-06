import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Search,
  School,
  TrendingUp,
  EmojiEvents,
  Assignment,
  PlayArrow,
  Notifications,
  Campaign,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';

export const NewDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, enrolledCourses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const enrolledCoursesData = courses.filter(c => enrolledCourses.includes(c.id));

  const quickActions = [
    { icon: <School />, label: 'My Courses', count: enrolledCoursesData.length, color: '#1976d2' },
    { icon: <TrendingUp />, label: 'In Progress', count: enrolledCoursesData.length, color: '#2e7d32' },
    { icon: <EmojiEvents />, label: 'Certificates', count: 0, color: '#ed6c02' },
    { icon: <Assignment />, label: 'Assignments', count: 0, color: '#9c27b0' },
  ];

  const announcements = [
    { title: 'Welcome to Inclusive Learning!', date: 'Today', content: 'Start your learning journey with accessible courses.' },
    { title: 'New Course Available', date: 'Yesterday', content: 'Check out our latest Mobile Development course.' },
  ];

  const recommendedCourses = courses.filter(c => !enrolledCourses.includes(c.id)).slice(0, 3);

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100%', p: 3 }}>
      <Container maxWidth="xl">
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || 'Learner'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your learning journey
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search courses, modules, lessons..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">{action.count}</Typography>
                      <Typography variant="body2" color="text.secondary">{action.label}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: action.color, width: 56, height: 56 }}>
                      {action.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - My Courses */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">My Courses</Typography>
                  <Button variant="text" onClick={() => navigate('/courses')}>View All</Button>
                </Box>

                {enrolledCoursesData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No courses enrolled yet
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
                      Browse Courses
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {enrolledCoursesData.map((course) => (
                      <Card key={course.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                              <School />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight="600" gutterBottom>
                                {course.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {course.description?.substring(0, 100)}...
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                                    <Typography variant="caption" fontWeight="600">0%</Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 1 }} />
                                </Box>
                                <Chip label={course.difficulty} size="small" color="primary" variant="outlined" />
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              startIcon={<PlayArrow />}
                              onClick={() => navigate(`/courses/${course.id}`)}
                              sx={{ alignSelf: 'center' }}
                            >
                              Continue
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Recommended for You</Typography>
                <Grid container spacing={2}>
                  {recommendedCourses.map((course) => (
                    <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card variant="outlined" sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            {course.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                            {course.description?.substring(0, 60)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip label={course.category} size="small" />
                            <Chip label={course.difficulty} size="small" color="primary" variant="outlined" />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => navigate(`/courses`)}
                          >
                            View Course
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Announcements & Activity */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Announcements */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Campaign sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">Announcements</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {announcements.map((announcement, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        {announcement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {announcement.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {announcement.date}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
