/**
 * Course Detail Page
 * Shows comprehensive course information including modules, instructor, and progress
 * Similar to Canvas LMS layout
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoIcon,
  Quiz as QuizIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
} from "@mui/icons-material";

import { useCourseStore } from "../store/courseStore";
import { useAuthStore } from "../store/authStore";
import { useAccessibilityStore } from "../store/accessibilityStore";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import type { Course, CourseModule } from "../types";
import { api } from "../services/api.ts";

// Mock instructor data - in production, fetch from API using instructorId
const getInstructorData = (instructorId: string) => {
  const instructors: Record<string, { name: string; email: string; bio: string; specialization: string[] }> = {
    'mentor1': {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      bio: 'Experienced web developer and accessibility advocate with 10+ years in inclusive education.',
      specialization: ['Web Development', 'Accessibility', 'Frontend Technologies']
    },
    'mentor2': {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@gmail.com',
      bio: 'Digital literacy expert specializing in assistive technologies and inclusive learning.',
      specialization: ['Digital Literacy', 'Assistive Technology']
    },
    'mentor3': {
      name: 'Ms. Amina Hassan',
      email: 'amina.hassan@gmail.com',
      bio: 'Vocational training specialist focused on skills development for people with disabilities.',
      specialization: ['Vocational Training', 'Skills Development']
    },
    'mentor4': {
      name: 'Dr. James Wilson',
      email: 'james.wilson@gmail.com',
      bio: 'Communication skills trainer with expertise in alternative communication methods.',
      specialization: ['Communication', 'Soft Skills']
    },
    'mentor5': {
      name: 'Ms. Lisa Martinez',
      email: 'lisa.martinez@gmail.com',
      bio: 'Mobile app developer and accessibility consultant.',
      specialization: ['Mobile Development', 'Accessibility']
    },
    'mentor6': {
      name: 'Dr. David Kim',
      email: 'david.kim@gmail.com',
      bio: 'Business skills and entrepreneurship trainer.',
      specialization: ['Business Skills', 'Entrepreneurship']
    },
    'mentor7': {
      name: 'Prof. Emily Brown',
      email: 'emily.brown@gmail.com',
      bio: 'Graphic design instructor with focus on accessible design principles.',
      specialization: ['Graphic Design', 'Accessible Design']
    },
  };
  
  return instructors[instructorId] || {
    name: 'Instructor',
    email: 'instructor@gmail.com',
    bio: 'Course instructor',
    specialization: []
  };
};

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseById, enrolledCourses, progress, fetchCourses, unenrollFromCourse, enrollInCourse } = useCourseStore();
  const { isAuthenticated } = useAuthStore();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [instructor, setInstructor] = useState<{ name: string; email: string; bio: string; specialization: string[] } | null>(null);
  const [isEnrolledState, setIsEnrolledState] = useState(false);
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();

  // Load courses and enrollments from store on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Announce page content for screen readers and TTS
  useEffect(() => {
    if (course && settings.textToSpeechEnabled) {
      speak(`Course page: ${course.title}. ${course.description}`);
    }
  }, [course, settings.textToSpeechEnabled, speak]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Course ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const res = await api.get(`/courses/${courseId}`);
          const apiCourse = res.data;
          // Transform API response to match Course type
          // Note: API returns instructor_id as UUID, we'll use it as string
          const transformedCourse: Course = {
            id: apiCourse.id,
            title: apiCourse.title,
            description: apiCourse.description || '',
            category: apiCourse.category as any,
            instructorId: apiCourse.instructorId || apiCourse.instructor_id || '',
            modules: apiCourse.modules || [],
            duration: apiCourse.duration || 0,
            difficulty: apiCourse.difficulty as 'beginner' | 'intermediate' | 'advanced',
            accessibilityFeatures: apiCourse.accessibilityFeatures || [],
            createdAt: apiCourse.createdAt ? new Date(apiCourse.createdAt) : new Date(),
            updatedAt: apiCourse.updatedAt ? new Date(apiCourse.updatedAt) : new Date(),
          };
          setCourse(transformedCourse);
          
          // Try to fetch instructor data
          const instructorId = apiCourse.instructorId || apiCourse.instructor_id;
          if (instructorId) {
            try {
              const instructorRes = await api.get(`/users/${instructorId}`);
              const instructorData = instructorRes.data;
              setInstructor({
                name: instructorData.name || 'Instructor',
                email: instructorData.email || 'instructor@gmail.com',
                bio: 'Course instructor',
                specialization: []
              });
            } catch {
              // Fallback to mock data
              setInstructor(getInstructorData(String(instructorId)));
            }
          }
        } catch (apiError) {
          // Fallback to store
          const courseFromStore = getCourseById(courseId);
          if (courseFromStore) {
            setCourse(courseFromStore);
            setInstructor(getInstructorData(courseFromStore.instructorId));
          } else {
            setError("Course not found");
          }
        }
        
      } catch (err) {
        setError("Failed to load course");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, getCourseById]);

  // Check enrollment status when course is loaded
  useEffect(() => {
    if (!course) {
      // If course not loaded yet, check localStorage
      if (courseId) {
        const savedEnrollments = localStorage.getItem('enrolledCourses');
        if (savedEnrollments) {
          try {
            const enrolled = JSON.parse(savedEnrollments);
            const normalizeId = (id: string) => String(id).toLowerCase().trim();
            const urlCourseIdStr = normalizeId(courseId);
            const isEnrolled = enrolled.some((id: string) => normalizeId(id) === urlCourseIdStr);
            setIsEnrolledState(isEnrolled);
          } catch (e) {
            console.error('Error parsing saved enrollments', e);
          }
        }
      }
      return;
    }
    
    if (!isAuthenticated) {
      // Not authenticated, check localStorage only
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      if (savedEnrollments) {
        try {
          const enrolled = JSON.parse(savedEnrollments);
          const normalizeId = (id: string) => String(id).toLowerCase().trim();
          const courseIdStr = normalizeId(course.id);
          const urlCourseIdStr = normalizeId(courseId || '');
          const isEnrolled = enrolled.some((id: string) => {
            const normalizedId = normalizeId(id);
            return normalizedId === courseIdStr || normalizedId === urlCourseIdStr;
          });
          setIsEnrolledState(isEnrolled);
        } catch (e) {
          console.error('Error parsing saved enrollments', e);
        }
      }
      return;
    }
    
    // Authenticated - check backend API
    const checkEnrollment = async () => {
      try {
        const enrollRes = await api.get('/enrollments/me');
        const backendEnrollments = enrollRes.data || [];
        console.log('Backend enrollments response:', backendEnrollments);
        
        const normalizeId = (id: string) => String(id).toLowerCase().trim();
        const enrolledCourseIds = backendEnrollments.map((e: any) => {
          const id = e.courseId || e.course_id || e.courseId;
          return normalizeId(String(id));
        });
        
        const courseIdToCheck = normalizeId(course.id);
        const urlCourseIdToCheck = normalizeId(courseId || '');
        
        const isEnrolled = enrolledCourseIds.some((id: string) => 
          id === courseIdToCheck || id === urlCourseIdToCheck
        );
        
        console.log('Enrollment check result:', {
          courseId: course.id,
          urlCourseId: courseId,
          courseIdToCheck,
          urlCourseIdToCheck,
          enrolledCourseIds,
          isEnrolled
        });
        
        setIsEnrolledState(isEnrolled);
        
        // Also update localStorage with all enrolled course IDs (original format)
        const originalEnrolledIds = backendEnrollments.map((e: any) => String(e.courseId || e.course_id || e.courseId));
        if (originalEnrolledIds.length > 0) {
          localStorage.setItem('enrolledCourses', JSON.stringify(originalEnrolledIds));
          fetchCourses(); // Sync store
        }
      } catch (err) {
        // If backend check fails, rely on store/localStorage
        console.log('Could not verify enrollment from backend, using store', err);
        const savedEnrollments = localStorage.getItem('enrolledCourses');
        if (savedEnrollments) {
          try {
            const enrolled = JSON.parse(savedEnrollments);
            const normalizeId = (id: string) => String(id).toLowerCase().trim();
            const courseIdStr = normalizeId(course.id);
            const urlCourseIdStr = normalizeId(courseId || '');
            const isEnrolled = enrolled.some((id: string) => {
              const normalizedId = normalizeId(id);
              return normalizedId === courseIdStr || normalizedId === urlCourseIdStr;
            });
            setIsEnrolledState(isEnrolled);
          } catch (e) {
            console.error('Error parsing saved enrollments', e);
          }
        }
      }
    };
    
    checkEnrollment();
  }, [course, isAuthenticated, courseId, fetchCourses]);

  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleStartModule = (moduleId: string) => {
    if (!isEnrolled) {
      alert('Please enroll in this course to access modules.');
      return;
    }
    // Navigate to course page and expand the module
    // The module will be expanded when the page loads if we pass it in state
    navigate(`/course/${courseId}`, { state: { expandModule: moduleId } });
    // Scroll to the module after navigation
    setTimeout(() => {
      const moduleElement = document.getElementById(`module-${moduleId}`);
      if (moduleElement) {
        moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Expand the module accordion
        setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
      }
    }, 100);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon />;
      case 'quiz':
        return <QuizIcon />;
      case 'interactive':
        return <CodeIcon />;
      case 'text':
        return <DescriptionIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
  return (
    <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Course not found"}</Alert>
        <Button onClick={() => navigate("/courses")} sx={{ mt: 2 }}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  // Check enrollment from both store and state
  // Normalize IDs for comparison (handle UUIDs and string IDs)
  const normalizeId = (id: string | undefined | null) => {
    if (!id) return '';
    return String(id).toLowerCase().trim();
  };
  
  const courseIdStr = normalizeId(course.id);
  const urlCourseIdStr = normalizeId(courseId);
  
  // Check enrollment from store (localStorage)
  const isEnrolledFromStore = enrolledCourses.some((id: string) => {
    const normalizedId = normalizeId(id);
    return normalizedId === courseIdStr || normalizedId === urlCourseIdStr;
  });
  
  // Final enrollment status
  const isEnrolled = isEnrolledState || isEnrolledFromStore;
  
  // Debug logging - only log when not enrolled to reduce console noise
  if (!isEnrolled) {
    console.log('Enrollment status check (NOT ENROLLED):', {
      courseId: course.id,
      urlCourseId: courseId,
      courseIdStr,
      urlCourseIdStr,
      enrolledCourses,
      isEnrolledState,
      isEnrolledFromStore,
      isEnrolled,
      progressKeys: Object.keys(progress)
    });
  }
  
  // Get progress - try both normalized and original IDs
  const courseProgress = progress[courseIdStr] || progress[course.id] || progress[urlCourseIdStr] || progress[courseId || ''];
  const progressPercentage = courseProgress?.completionPercentage || 0;
  const instructorData = instructor || getInstructorData(course.instructorId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Course Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Chip 
                label={course.category} 
                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {course.title}
              </Typography>
              <Typography
                variant="h6" 
                sx={{ opacity: 0.9, mb: 2 }}
                aria-label={`Course description: ${course.description}`}
              >
                {course.description}
              </Typography>

              {/* Course Metadata */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon />
                  <Typography>{course.duration} hours</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BookIcon />
                  <Typography>{course.modules.length} Modules</Typography>
                </Box>
              <Chip
                  label={course.difficulty} 
                  color={getDifficultyColor(course.difficulty) as any}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          {isEnrolled && courseProgress && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Course Progress</Typography>
                <Typography variant="body2">{progressPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white'
                  }
                }} 
              />
            </Box>
          )}
          
          {!isEnrolled && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Alert severity="info" sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.1)' }}>
                You are not enrolled in this course. Enroll to access modules and track your progress.
              </Alert>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await enrollInCourse(course.id);
                    // Update enrollment state without reloading page
                    setIsEnrolledState(true);
                    // Refresh courses to update enrollment status
                    await fetchCourses();
                    alert('Successfully enrolled!');
                  } catch (err) {
                    alert('Failed to enroll: ' + (err as Error).message);
                  }
                }}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                Enroll Now
              </Button>
            </Box>
          )}
          
          {isEnrolled && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  if (confirm('Are you sure you want to unenroll from this course? Your progress will be saved but you will lose access to course materials.')) {
                    try {
                      await unenrollFromCourse(course.id);
                      // Update enrollment state without reloading page
                      setIsEnrolledState(false);
                      // Refresh courses to update enrollment status
                      await fetchCourses();
                      // Optionally navigate back to courses page or show success message
                      // navigate('/courses');
                    } catch (err) {
                      alert('Failed to unenroll: ' + (err as Error).message);
                    }
                  }
                }}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)', 
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  } 
                }}
              >
                Unenroll from Course
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Main Content - Modules */}
        <Grid item xs={12} md={8}>
          <Card role="region" aria-label="Course modules">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BookIcon sx={{ mr: 1, fontSize: 28 }} aria-hidden="true" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="modules-heading">
                  Course Modules
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {course.modules.length === 0 ? (
                <Alert severity="info">No modules available for this course yet.</Alert>
              ) : (
                <Box>
                  {course.modules
                    .sort((a, b) => a.order - b.order)
                    .map((module: CourseModule, index: number) => {
                      const isCompleted = courseProgress?.completedModules?.includes(module.id) || false;
                      const isExpanded = expandedModules[module.id] || false;
                      
                      return (
                        <Accordion
                          id={`module-${module.id}`}
                          key={module.id}
                          expanded={isExpanded}
                          onChange={() => handleModuleToggle(module.id)}
                          sx={{ mb: 2 }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Box sx={{ 
                                minWidth: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                bgcolor: isCompleted ? 'success.main' : 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                fontWeight: 'bold'
                              }}>
                                {isCompleted ? <CheckCircleIcon /> : index + 1}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {module.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {module.content.length} items
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ~{module.estimatedTime} min
                                  </Typography>
                                  {isCompleted && (
                                    <Chip 
                                      icon={<CheckCircleIcon />} 
                                      label="Completed" 
                                      size="small" 
                                      color="success" 
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {module.content.map((contentItem, contentIndex) => (
                                <ListItem 
                                  key={contentItem.id}
                                  sx={{ 
                                    borderLeft: '3px solid',
                                    borderColor: 'primary.main',
                                    mb: 1,
                                    pl: 2
                                  }}
                                >
                                  <ListItemIcon>
                                    {getContentIcon(contentItem.type)}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {contentItem.type === 'text' ? 'Reading Material' :
                                         contentItem.type === 'video' ? 'Video Lesson' :
                                         contentItem.type === 'quiz' ? 'Quiz' :
                                         contentItem.type === 'interactive' ? 'Interactive Exercise' :
                                         'Content'}
                                      </Typography>
                                    }
                                    secondary={`Item ${contentIndex + 1} of ${module.content.length}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                            <Button
                              variant="contained"
                              startIcon={<PlayArrowIcon aria-hidden="true" />}
                              onClick={() => {
                                if (settings.textToSpeechEnabled) {
                                  speak(`Starting module: ${module.title}`);
                                }
                                handleStartModule(module.id);
                              }}
                              sx={{ mt: 2 }}
                              fullWidth
                              disabled={!isEnrolled}
                              aria-label={!isEnrolled ? `Enroll to access module: ${module.title}` : isCompleted ? `Review module: ${module.title}` : `Start module: ${module.title}`}
              >
                              {!isEnrolled ? 'Enroll to Access' : isCompleted ? 'Review Module' : 'Start Module'}
                            </Button>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Instructor & Course Info */}
        <Grid item xs={12} md={4} role="complementary" aria-label="Course sidebar information">
          {/* Instructor Card */}
          <Card sx={{ mb: 3 }} role="region" aria-label="Instructor information">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} aria-hidden="true" />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Instructor
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    mr: 2,
                    fontSize: '1.5rem'
                  }}
                >
                  {instructorData.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {instructorData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {instructorData.email}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                {instructorData.bio}
              </Typography>
              
              {instructorData.specialization.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Specializations:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {instructorData.specialization.map((spec, idx) => (
                      <Chip key={idx} label={spec} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Course Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Course Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duration" 
                    secondary={`${course.duration} hours`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BookIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Modules" 
                    secondary={course.modules.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Difficulty" 
                    secondary={
                      <Chip 
                        label={course.difficulty} 
                        size="small" 
                        color={getDifficultyColor(course.difficulty) as any}
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          {course.accessibilityFeatures && course.accessibilityFeatures.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Accessibility Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {course.accessibilityFeatures.map((feature, idx) => (
                    <Chip 
                      key={idx} 
                      label={feature.replace('-', ' ')} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
        ))}
      </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
