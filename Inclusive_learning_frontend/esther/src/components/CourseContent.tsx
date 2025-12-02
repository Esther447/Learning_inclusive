import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  LinearProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  Quiz as QuizIcon,
  Download as DownloadIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import type { ModuleContent } from '../types';

interface CourseContentProps {
  content: ModuleContent[];
  onContentComplete: (contentId: string) => void;
  completedContent: string[];
}

export const CourseContent: React.FC<CourseContentProps> = ({
  content,
  onContentComplete,
  completedContent,
}) => {
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { score: number; total: number }>>({});
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});

  const handleAccordionChange = (contentId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [contentId]: isExpanded
    }));
  };

  const handleQuizAnswer = (contentId: string, questionIndex: number, answerIndex: number) => {
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [`${contentId}-${questionIndex}`]: answerIndex
    }));
  };

  const submitQuiz = (contentId: string, quizData: any) => {
    const questions = JSON.parse(quizData);
    let correct = 0;
    
    questions.questions.forEach((question: any, index: number) => {
      const selectedAnswer = selectedQuizAnswers[`${contentId}-${index}`];
      if (selectedAnswer === question.correct) {
        correct++;
      }
    });

    const score = { score: correct, total: questions.questions.length };
    setQuizResults(prev => ({
      ...prev,
      [contentId]: score
    }));

    if (correct >= questions.questions.length * 0.7) { // 70% pass rate
      onContentComplete(contentId);
    }
  };

  const downloadResource = (contentId: string, title: string) => {
    // Simulate resource download
    const content = `Resource: ${title}\nContent ID: ${contentId}\nDownloaded on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = (item: ModuleContent) => {
    const isCompleted = completedContent.includes(item.id);

    switch (item.type) {
      case 'text':
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DocumentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Reading Material</Typography>
                {isCompleted && <CheckIcon sx={{ ml: 'auto', color: 'success.main' }} />}
              </Box>
              <Box dangerouslySetInnerHTML={{ __html: item.content }} />
              {item.altText && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                  Alt text: {item.altText}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={() => onContentComplete(item.id)}
                disabled={isCompleted}
                sx={{ mt: 2 }}
              >
                {isCompleted ? 'Completed' : 'Mark as Read'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'video':
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Video Lesson</Typography>
                {isCompleted && <CheckIcon sx={{ ml: 'auto', color: 'success.main' }} />}
              </Box>
              
              {/* Video Player Placeholder */}
              <Box sx={{
                width: '100%',
                height: 200,
                backgroundColor: '#000',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <Button variant="contained" size="large" startIcon={<PlayIcon />}>
                  Play Video
                </Button>
              </Box>

              {/* Video Features */}
              <Box sx={{ mb: 2 }}>
                <Chip label="Captions Available" size="small" sx={{ mr: 1 }} />
                {item.transcript && <Chip label="Transcript Available" size="small" sx={{ mr: 1 }} />}
                {item.signLanguageVideoUrl && <Chip label="Sign Language" size="small" />}
              </Box>

              {/* Transcript Accordion */}
              {item.transcript && (
                <Accordion 
                  expanded={expandedAccordions[`${item.id}-transcript`] || false}
                  onChange={handleAccordionChange(`${item.id}-transcript`)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>View Transcript</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{item.transcript}</Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              <Button
                variant="contained"
                onClick={() => onContentComplete(item.id)}
                disabled={isCompleted}
                sx={{ mt: 2 }}
              >
                {isCompleted ? 'Completed' : 'Mark as Watched'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'interactive':
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Interactive Exercise</Typography>
                {isCompleted && <CheckIcon sx={{ ml: 'auto', color: 'success.main' }} />}
              </Box>
              
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Box dangerouslySetInnerHTML={{ __html: item.content }} />
              </Paper>

              <Alert severity="info" sx={{ mb: 2 }}>
                Complete the interactive exercise above to practice your skills.
              </Alert>

              <Button
                variant="contained"
                onClick={() => onContentComplete(item.id)}
                disabled={isCompleted}
              >
                {isCompleted ? 'Completed' : 'Complete Exercise'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'quiz':
        const quizData = JSON.parse(item.content);
        const quizResult = quizResults[item.id];
        
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuizIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Knowledge Check</Typography>
                {isCompleted && <CheckIcon sx={{ ml: 'auto', color: 'success.main' }} />}
              </Box>

              {quizResult ? (
                <Alert 
                  severity={quizResult.score >= quizResult.total * 0.7 ? 'success' : 'warning'}
                  sx={{ mb: 2 }}
                >
                  Quiz Result: {quizResult.score}/{quizResult.total} 
                  ({Math.round((quizResult.score / quizResult.total) * 100)}%)
                  {quizResult.score >= quizResult.total * 0.7 ? ' - Passed!' : ' - Try again to pass (70% required)'}
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Answer all questions to check your understanding. You need 70% to pass.
                </Alert>
              )}

              {quizData.questions.map((question: any, qIndex: number) => (
                <Box key={qIndex} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {qIndex + 1}. {question.question}
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={selectedQuizAnswers[`${item.id}-${qIndex}`] || ''}
                      onChange={(e) => handleQuizAnswer(item.id, qIndex, parseInt(e.target.value))}
                    >
                      {question.options.map((option: string, oIndex: number) => (
                        <FormControlLabel
                          key={oIndex}
                          value={oIndex}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}

              <Button
                variant="contained"
                onClick={() => submitQuiz(item.id, item.content)}
                disabled={isCompleted}
                sx={{ mt: 2 }}
              >
                {quizResult ? 'Retake Quiz' : 'Submit Quiz'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'audio':
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Audio Content</Typography>
                {isCompleted && <CheckIcon sx={{ ml: 'auto', color: 'success.main' }} />}
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={item.content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>

              {item.transcript && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Audio Transcript</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{item.transcript}</Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              <Button
                variant="contained"
                onClick={() => onContentComplete(item.id)}
                disabled={isCompleted}
                sx={{ mt: 2 }}
              >
                {isCompleted ? 'Completed' : 'Mark as Listened'}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Course Content
      </Typography>
      
      {/* Progress Indicator */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Progress</Typography>
          <LinearProgress 
            variant="determinate" 
            value={(completedContent.length / content.length) * 100}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2">
            {completedContent.length} of {content.length} items completed
          </Typography>
        </CardContent>
      </Card>

      {/* Content Items */}
      {content.map(renderContent)}

      {/* Resources Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Additional Resources
          </Typography>
          
          <Grid2 container spacing={2}>
             <Grid2 xs={12} sm={6}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => downloadResource('resources', 'Course_Materials')}
                fullWidth
              >
                Download All Materials
              </Button>
            </Grid2>
             <Grid2 xs={12} sm={6}>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={() => downloadResource('exercises', 'Practice_Exercises')}
                fullWidth
              >
                Practice Exercises
              </Button>
            </Grid2>
          </Grid2>

          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            All resources are available in multiple formats for accessibility.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
