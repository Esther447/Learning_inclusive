import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Button,
  Chip,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  PlayCircle,
  CheckCircle,
  Download,
  Forum,
  Article,
  VideoLibrary,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseById } = useCourseStore();
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const course = getCourseById(courseId || '');
  const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Course not found</Typography>
      </Container>
    );
  }

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setActiveTab(0);
  };

  const getAllLessons = () => {
    const allLessons: any[] = [];
    course?.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        allLessons.push({ ...lesson, moduleTitle: module.title });
      });
    });
    return allLessons;
  };

  const handleNextLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson?.id);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      // Auto-scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteAndNext = () => {
    if (selectedLesson && !completedLessons.includes(selectedLesson.id)) {
      handleLessonComplete(selectedLesson.id);
    }
    handleNextLesson();
  };

  const isLastLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson?.id);
    return currentIndex === allLessons.length - 1;
  };

  const renderLessonsTab = () => (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Lesson List Sidebar */}
      <Box sx={{ width: 350, flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>Course Content</Typography>
        {course.modules?.map((module, idx) => (
          <Accordion key={module.id} defaultExpanded={idx === 0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="600">{module.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense>
                {module.lessons?.map((lesson) => (
                  <ListItem key={lesson.id} disablePadding>
                    <ListItemButton 
                      selected={selectedLesson?.id === lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <Checkbox 
                        checked={completedLessons.includes(lesson.id)}
                        icon={<PlayCircle />}
                        checkedIcon={<CheckCircle color="success" />}
                        onClick={(e) => { e.stopPropagation(); handleLessonComplete(lesson.id); }}
                      />
                      <ListItemText 
                        primary={lesson.title}
                        secondary={`${lesson.duration || 5} min`}
                      />
                    </ListItemButton>
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No lessons available" />
                  </ListItem>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        )) || (
          <Alert severity="info">No modules available yet</Alert>
        )}
      </Box>

      {/* Lesson Content Viewer */}
      <Box sx={{ flex: 1 }}>
        {selectedLesson ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {selectedLesson.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {selectedLesson.type === 'video' && (
              <Box sx={{ mb: 3 }}>
                <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Video content would be displayed here
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {selectedLesson.content || 'Lesson content will be displayed here. This includes text explanations, examples, and interactive elements.'}
              </Typography>
            </Box>

            {selectedLesson.example && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>Example:</Typography>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {selectedLesson.example}
                </Typography>
              </Paper>
            )}

            {selectedLesson.code_example && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>Code Example:</Typography>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {selectedLesson.code_example}
                </Typography>
              </Paper>
            )}

            {selectedLesson.video_url && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>Video Tutorial:</Typography>
                <Link href={selectedLesson.video_url} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoLibrary /> Watch on YouTube
                </Link>
              </Box>
            )}

            {selectedLesson.slides && selectedLesson.slides.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>Slides & Materials:</Typography>
                <List dense>
                  {selectedLesson.slides.map((slide: any, idx: number) => (
                    <ListItem key={idx}>
                      <Download sx={{ mr: 1, fontSize: 20 }} />
                      <Link href={slide.url} target="_blank" rel="noopener">{slide.title}</Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {selectedLesson.external_resources && selectedLesson.external_resources.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>External Resources:</Typography>
                <List dense>
                  {selectedLesson.external_resources.map((resource: any, idx: number) => (
                    <ListItem key={idx}>
                      <Link href={resource.url} target="_blank" rel="noopener">{resource.title}</Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {selectedLesson.practice_activity && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>🎯 Practice Activity:</Typography>
                <Typography variant="body2" fontWeight="600">{selectedLesson.practice_activity.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{selectedLesson.practice_activity.description}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Estimated time: {selectedLesson.practice_activity.estimated_time}
                </Typography>
              </Paper>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                variant={completedLessons.includes(selectedLesson.id) ? 'outlined' : 'contained'}
                color={completedLessons.includes(selectedLesson.id) ? 'inherit' : 'success'}
                startIcon={completedLessons.includes(selectedLesson.id) ? <CheckCircle /> : null}
                onClick={() => handleLessonComplete(selectedLesson.id)}
              >
                {completedLessons.includes(selectedLesson.id) ? 'Completed ✓' : 'Mark as Complete'}
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {!isLastLesson() && (
                  <>
                    <Button 
                      variant="outlined" 
                      onClick={handleNextLesson}
                    >
                      Next Lesson →
                    </Button>
                    {!completedLessons.includes(selectedLesson.id) && (
                      <Button 
                        variant="contained" 
                        onClick={handleCompleteAndNext}
                      >
                        Complete & Next →
                      </Button>
                    )}
                  </>
                )}
                {isLastLesson() && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      if (!completedLessons.includes(selectedLesson.id)) {
                        handleLessonComplete(selectedLesson.id);
                      }
                      alert('🎉 Congratulations! You\'ve completed all lessons in this course!');
                    }}
                  >
                    {completedLessons.includes(selectedLesson.id) ? 'Course Complete! 🎓' : 'Complete Course 🎓'}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Article sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Select a lesson to start learning
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );

  const renderResourcesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Learning Resources</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>📄 Course Materials</Typography>
          <List>
            <ListItem>
              <Download sx={{ mr: 1 }} />
              <Link href="#" onClick={(e) => { e.preventDefault(); alert('Download feature coming soon'); }}>
                {course.title} - Complete Syllabus.pdf
              </Link>
            </ListItem>
            <ListItem>
              <Download sx={{ mr: 1 }} />
              <Link href="#" onClick={(e) => { e.preventDefault(); alert('Download feature coming soon'); }}>
                Study Guide and Practice Exercises.pdf
              </Link>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>🔗 External Resources</Typography>
          <List>
            {course.learningOutcomes?.slice(0, 3).map((outcome, idx) => (
              <ListItem key={idx}>
                <Link href="#" onClick={(e) => { e.preventDefault(); alert('External link feature coming soon'); }}>
                  Resource: {outcome}
                </Link>
              </ListItem>
            )) || <ListItem><Typography color="text.secondary">No external resources yet</Typography></ListItem>}
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>📚 Recommended Courses</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Continue your learning journey with these related courses
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
            Browse More Courses
          </Button>
        </CardContent>
      </Card>
    </Box>
  );

  const renderDiscussionsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Course Discussions</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Connect with {totalLessons * 10} other learners in this course
      </Alert>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Recent Discussions
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="How to approach Module 2?"
                secondary="Posted by Student A • 2 hours ago • 5 replies"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Best practices for this course?"
                secondary="Posted by Student B • 1 day ago • 12 replies"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Forum sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Have a question? Start a discussion
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => alert('Discussion feature coming soon')}>Start a Discussion</Button>
        </CardContent>
      </Card>
    </Box>
  );

  const renderHelpTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Help & Support</Typography>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">❓ Frequently Asked Questions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight="600">How do I access course materials?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              All materials are available in the Resources tab. You can download PDFs and access external links.
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight="600">How is my progress tracked?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Your progress is automatically saved as you complete lessons. Check the progress bar at the top.
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight="600">Can I download course content?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Yes, downloadable materials are available in the Resources tab.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>💬 Ask a Mentor</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Get personalized help from experienced mentors
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/mentorship')}>Contact Mentor</Button>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>📞 Contact Support</Typography>
          <Typography variant="body2">Email: support@inclusivelearning.rw</Typography>
          <Typography variant="body2">Phone: +250 XXX XXX XXX</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/help')}>Visit Help Center</Button>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip label={course.category} color="primary" />
          <Chip label={course.difficulty} />
          <Chip label={`${course.duration} hours`} variant="outlined" />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">Your Progress</Typography>
            <Typography variant="body2" fontWeight="600">{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 1 }} />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Lessons" />
          <Tab label="Resources" />
          <Tab label="Discussions" />
          <Tab label="Help & Support" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && renderLessonsTab()}
        {activeTab === 1 && renderResourcesTab()}
        {activeTab === 2 && renderDiscussionsTab()}
        {activeTab === 3 && renderHelpTab()}
      </Box>
    </Container>
  );
};
