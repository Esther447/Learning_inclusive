/**
 * Mentor Dashboard
 * Allows mentors to manage their courses and modules
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  instructor_id: string;
  duration: number;
  modules: Module[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  content: any[];
  order: number;
  estimated_time: number;
}

export const MentorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState(0);

  // Announce page for screen readers and TTS
  useEffect(() => {
    if (settings.textToSpeechEnabled) {
      speak('Mentor dashboard. Manage your courses and modules.');
    }
  }, [settings.textToSpeechEnabled, speak]);
  
  // Course creation dialog
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'beginner',
    duration: 0,
  });
  
  // Module management
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 0,
    estimated_time: 0,
  });
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  useEffect(() => {
    if (user?.role === 'mentor' || user?.role === 'administrator') {
      fetchMyCourses();
    }
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/courses/instructor/my-courses');
      setCourses(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      setError(null);
      const response = await api.post('/courses', courseForm);
      setSuccess('Course created successfully!');
      setCourseDialogOpen(false);
      setCourseForm({ title: '', description: '', category: 'general', difficulty: 'beginner', duration: 0 });
      fetchMyCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create course');
    }
  };

  const handleAddModule = async () => {
    if (!selectedCourse) return;
    
    try {
      setError(null);
      await api.post(`/courses/${selectedCourse.id}/modules`, moduleForm);
      setSuccess('Module added successfully!');
      setModuleDialogOpen(false);
      setModuleForm({ title: '', description: '', order: 0, estimated_time: 0 });
      setEditingModule(null);
      fetchMyCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add module');
    }
  };

  const handleUpdateModule = async () => {
    if (!selectedCourse || !editingModule) return;
    
    try {
      setError(null);
      await api.put(`/courses/${selectedCourse.id}/modules/${editingModule.id}`, moduleForm);
      setSuccess('Module updated successfully!');
      setModuleDialogOpen(false);
      setModuleForm({ title: '', description: '', order: 0, estimated_time: 0 });
      setEditingModule(null);
      fetchMyCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update module');
    }
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    
    try {
      setError(null);
      await api.delete(`/courses/${courseId}/modules/${moduleId}`);
      setSuccess('Module deleted successfully!');
      fetchMyCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete module');
    }
  };

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      setError(null);
      await api.patch(`/courses/${courseId}/publish`);
      setSuccess(`Course ${currentStatus ? 'unpublished' : 'published'} successfully!`);
      fetchMyCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update course status');
    }
  };

  const openModuleDialog = (course: Course, module?: Module) => {
    setSelectedCourse(course);
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title,
        description: module.description || '',
        order: module.order,
        estimated_time: module.estimated_time,
      });
    } else {
      setEditingModule(null);
      setModuleForm({
        title: '',
        description: '',
        order: (course.modules?.length || 0) + 1,
        estimated_time: 0,
      });
    }
    setModuleDialogOpen(true);
  };

  if (user?.role !== 'mentor' && user?.role !== 'administrator') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">You must be a mentor to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Mentor Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCourseDialogOpen(true)}
        >
          Create Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="My Courses" />
        <Tab label="Manage Modules" />
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : tab === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Modules</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No courses yet. Create your first course to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {course.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={course.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.difficulty}
                        size="small"
                        color={
                          course.difficulty === 'beginner' ? 'success' :
                          course.difficulty === 'intermediate' ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                    <TableCell>{course.modules?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={course.is_published ? 'Published' : 'Draft'}
                        color={course.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePublish(course.id, course.is_published)}
                          title={course.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {course.is_published ? <UnpublishedIcon /> : <PublishIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/course/${course.id}`)}
                          title="View Course"
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          {courses.length === 0 ? (
            <Alert severity="info">Create a course first to manage modules.</Alert>
          ) : (
            courses.map((course) => (
              <Accordion key={course.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <SchoolIcon sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.modules?.length || 0} modules
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModuleDialog(course);
                      }}
                      sx={{ mr: 2 }}
                    >
                      Add Module
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {course.modules && course.modules.length > 0 ? (
                    <List>
                      {course.modules
                        .sort((a, b) => a.order - b.order)
                        .map((module) => (
                          <ListItem
                            key={module.id}
                            secondaryAction={
                              <Box>
                                <IconButton
                                  edge="end"
                                  onClick={() => openModuleDialog(course, module)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDeleteModule(course.id, module.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <BookIcon fontSize="small" />
                                  <Typography variant="subtitle1">
                                    {module.title} (Order: {module.order})
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  {module.description || 'No description'} • ~{module.estimated_time} min
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No modules yet. Add your first module!</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      )}

      {/* Create Course Dialog */}
      <Dialog open={courseDialogOpen} onClose={() => setCourseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Title"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={courseForm.category}
              onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="vocational">Vocational</MenuItem>
              <MenuItem value="soft-skills">Soft Skills</MenuItem>
              <MenuItem value="literacy">Literacy</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={courseForm.difficulty}
              onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Duration (hours)"
            type="number"
            value={courseForm.duration}
            onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) || 0 })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCourse} variant="contained" disabled={!courseForm.title}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Module Title"
            value={moduleForm.title}
            onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={moduleForm.description}
            onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={moduleForm.order}
            onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Estimated Time (minutes)"
            type="number"
            value={moduleForm.estimated_time}
            onChange={(e) => setModuleForm({ ...moduleForm, estimated_time: parseInt(e.target.value) || 0 })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setModuleDialogOpen(false);
            setEditingModule(null);
          }}>Cancel</Button>
          <Button
            onClick={editingModule ? handleUpdateModule : handleAddModule}
            variant="contained"
            disabled={!moduleForm.title}
          >
            {editingModule ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
