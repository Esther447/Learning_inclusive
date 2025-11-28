/**
 * Quiz / Evaluation Page
 * Accessible quiz interface with one question at a time
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  VolumeUp as VolumeIcon,
  TextIncrease as TextIncreaseIcon,
  Contrast as ContrastIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useNavigate } from 'react-router-dom';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const questions = [
    {
      id: 1,
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlink and Text Markup Language'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'Which CSS property is used to change text color?',
      options: [
        'font-color',
        'text-color',
        'color',
        'background-color'
      ],
      correct: 2
    },
    {
      id: 3,
      question: 'What is the purpose of alt text in images?',
      options: [
        'To make images load faster',
        'To provide alternative text for screen readers',
        'To add captions to images',
        'To compress image files'
      ],
      correct: 1
    }
  ];

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] || '');
    } else {
      // Quiz completed
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const handleReadQuestion = () => {
    const question = questions[currentQuestion];
    const text = `Question ${currentQuestion + 1}: ${question.question}. Options: ${question.options.join(', ')}`;
    speak(text);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (parseInt(answer) === questions[index].correct) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const score = calculateScore();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!showResults ? (
        <>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Web Development Quiz
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1">
                Question {currentQuestion + 1} of {questions.length}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon />
                <Typography variant="body1">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {/* Accessibility Tools */}
          <Card sx={{ mb: 3, backgroundColor: settings.highContrastMode ? '#333' : '#f9f9f9' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Accessibility Tools
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<VolumeIcon />}
                  onClick={handleReadQuestion}
                >
                  Read Question Aloud
                </Button>
                <Button
                  variant={settings.fontSize === 'large' ? 'contained' : 'outlined'}
                  startIcon={<TextIncreaseIcon />}
                  onClick={() => updateSettings({ fontSize: settings.fontSize === 'large' ? 'medium' : 'large' })}
                >
                  Large Text
                </Button>
                <Button
                  variant={settings.highContrastMode ? 'contained' : 'outlined'}
                  startIcon={<ContrastIcon />}
                  onClick={() => updateSettings({ highContrastMode: !settings.highContrastMode })}
                >
                  High Contrast
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Question */}
          <Card
            sx={{
              mb: 4,
              backgroundColor: settings.highContrastMode ? '#333' : '#fff',
              color: settings.highContrastMode ? '#fff' : '#333',
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontSize: settings.fontSize === 'large' ? '2rem' : '1.5rem',
                }}
              >
                {questions[currentQuestion].question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={
                        <Typography
                          sx={{
                            fontSize: settings.fontSize === 'large' ? '1.2rem' : '1rem',
                            py: 1,
                          }}
                        >
                          {option}
                        </Typography>
                      }
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selectedAnswer === index.toString() ? 'primary.main' : 'divider',
                        backgroundColor: selectedAnswer === index.toString() 
                          ? (settings.highContrastMode ? '#555' : '#e3f2fd')
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: settings.highContrastMode ? '#444' : '#f5f5f5',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </Box>
        </>
      ) : (
        /* Results */
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, color: 'primary.main' }}>
              {score}/{questions.length}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              You scored {Math.round((score / questions.length) * 100)}%
            </Typography>
            
            {score === questions.length && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Perfect score! Excellent work!
              </Alert>
            )}
            
            {score >= questions.length * 0.7 && score < questions.length && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Great job! You passed the quiz.
              </Alert>
            )}
            
            {score < questions.length * 0.7 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                You might want to review the material and try again.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer('');
                  setAnswers([]);
                  setShowResults(false);
                }}
              >
                Retake Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};