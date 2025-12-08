import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { Campaign, Schedule, Person } from '@mui/icons-material';
import { useCourseStore } from '../store/courseStore';

export const AnnouncementsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById } = useCourseStore();
  const course = getCourseById(courseId || '');

  if (!course) return <Alert severity="error">Course not found</Alert>;

  const announcements = [
    {
      id: 'welcome',
      title: `Welcome to ${course.title}!`,
      content: `Welcome to ${course.title}! We're excited to have you in this course. This course includes ${course.modules?.length || 0} modules covering essential topics. Make sure to check the syllabus and complete all lessons. If you need help, use the discussion board or contact your instructor.`,
      author: 'Course Instructor',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      priority: 'high',
    },
    ...course.modules?.map((module, idx) => ({
      id: `module-${module.id}`,
      title: `Module ${idx + 1}: ${module.title} Now Available`,
      content: `Module ${idx + 1} - ${module.title} is now available! This module covers important concepts and includes ${module.lessons?.length || 0} lessons. Estimated completion time: ${module.estimatedTime || 60} minutes. Don't forget to complete the quiz and assignment for this module.`,
      author: 'Course Instructor',
      date: new Date(Date.now() - (course.modules!.length - idx) * 3 * 24 * 60 * 60 * 1000),
      priority: idx === 0 ? 'high' : 'normal',
    })) || [],
    {
      id: 'resources',
      title: 'Course Resources Available',
      content: `All course materials, slides, and external resources are now available in the Resources tab. Make sure to download the materials and review them alongside the video lessons. All materials are accessible and screen reader compatible.`,
      author: 'Course Instructor',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      priority: 'normal',
    },
    {
      id: 'accessibility',
      title: 'Accessibility Features',
      content: `This course is fully accessible with screen reader support, captions, keyboard navigation, and text-to-speech. If you need any accommodations or have accessibility concerns, please contact support.`,
      author: 'Support Team',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      priority: 'normal',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'normal': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Campaign color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight="700">Announcements</Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with course news and important information
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        You have {announcements.length} announcements. Check back regularly for updates.
      </Alert>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {announcements.map((announcement) => (
          <Card key={announcement.id} sx={{ position: 'relative' }}>
            {announcement.priority === 'high' && (
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Chip label="Important" color="error" size="small" />
              </Box>
            )}
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {announcement.author}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(announcement.date)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {announcement.content}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
