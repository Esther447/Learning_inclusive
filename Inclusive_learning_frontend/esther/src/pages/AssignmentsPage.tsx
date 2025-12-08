import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Assignment, Upload, CheckCircle, Schedule, AttachFile } from '@mui/icons-material';
import { useCourseStore } from '../store/courseStore';

export const AssignmentsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById } = useCourseStore();
  const course = getCourseById(courseId || '');
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState('');
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  if (!course) return <Alert severity="error">Course not found</Alert>;

  const assignments = course.modules?.map((module, idx) => ({
    id: `assignment-${module.id}`,
    moduleId: module.id,
    title: `${module.title} - Practical Assignment`,
    description: `Apply what you've learned in ${module.title} by completing this hands-on assignment.`,
    instructions: `
1. Review all lessons in ${module.title}
2. Complete the practical exercises
3. Document your work and findings
4. Submit your assignment below
    `,
    points: 100,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    submissionType: 'text',
    status: submitted[`assignment-${module.id}`] ? 'submitted' : 'pending',
  })) || [];

  const handleSubmit = () => {
    if (!selectedAssignment || !submission.trim()) return;
    setSubmitted({ ...submitted, [selectedAssignment.id]: true });
    setSelectedAssignment(null);
    setSubmission('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'success';
      case 'graded': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const days = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (selectedAssignment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight="600" gutterBottom>{selectedAssignment.title}</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>{selectedAssignment.description}</Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="600" gutterBottom>Instructions</Typography>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', mb: 3 }}>
              {selectedAssignment.instructions}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip icon={<Schedule />} label={`Due: ${selectedAssignment.dueDate.toLocaleDateString()}`} />
              <Chip label={`${selectedAssignment.points} points`} color="primary" />
            </Box>

            <Typography variant="h6" fontWeight="600" gutterBottom>Your Submission</Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              placeholder="Write your assignment submission here..."
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
              <Button 
                variant="contained" 
                startIcon={<Upload />} 
                onClick={handleSubmit}
                disabled={!submission.trim()}
              >
                Submit Assignment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="700" gutterBottom>Assignments</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete assignments to demonstrate your understanding
      </Typography>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0;
          
          return (
            <Card key={assignment.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Assignment color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="600">{assignment.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{assignment.description}</Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={assignment.status} 
                    color={getStatusColor(assignment.status) as any}
                    icon={assignment.status === 'submitted' ? <CheckCircle /> : undefined}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Schedule />} 
                    label={isOverdue ? 'Overdue' : `Due in ${daysUntilDue} days`}
                    color={isOverdue ? 'error' : daysUntilDue <= 3 ? 'warning' : 'default'}
                    size="small"
                  />
                  <Chip label={`${assignment.points} points`} size="small" variant="outlined" />
                </Box>

                {assignment.status === 'submitted' ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Assignment submitted successfully! Waiting for instructor review.
                  </Alert>
                ) : null}

                <Button 
                  variant={assignment.status === 'submitted' ? 'outlined' : 'contained'}
                  onClick={() => setSelectedAssignment(assignment)}
                  disabled={assignment.status === 'submitted'}
                >
                  {assignment.status === 'submitted' ? 'View Submission' : 'Start Assignment'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};
