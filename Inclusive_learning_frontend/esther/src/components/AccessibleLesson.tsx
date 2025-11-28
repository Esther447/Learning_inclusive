import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as SpeakIcon,
  Lightbulb as HintIcon,
  CheckCircle as CompleteIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface LessonStep {
  id: string;
  title: string;
  content: string;
  type: 'learn' | 'practice' | 'quiz' | 'summary';
  duration: number;
  hints?: string[];
  example?: string;
  practice?: {
    question: string;
    answer: string;
    options?: string[];
  };
}

interface AccessibleLessonProps {
  title: string;
  steps: LessonStep[];
  onComplete: () => void;
}

export const AccessibleLesson: React.FC<AccessibleLessonProps> = ({
  title,
  steps,
  onComplete,
}) => {
  const { settings } = useAccessibilityStore();
  const { speak, stop } = useTextToSpeech();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentStep = steps[activeStep];
  const progress = (completedSteps.length / steps.length) * 100;

  useEffect(() => {
    if (settings.textToSpeechEnabled && currentStep) {
      speak(`Step ${activeStep + 1}: ${currentStep.title}`);
    }
  }, [activeStep, currentStep, settings.textToSpeechEnabled, speak]);

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
    setShowHint(false);
    setUserAnswer('');
    setIsCorrect(null);
  };

  const handlePracticeSubmit = () => {
    if (currentStep.practice) {
      const correct = userAnswer.toLowerCase().trim() === 
                     currentStep.practice.answer.toLowerCase().trim();
      setIsCorrect(correct);
      
      if (correct) {
        setTimeout(handleStepComplete, 1500);
      }
    }
  };

  const speakContent = () => {
    const content = currentStep.content + 
                   (currentStep.example ? ` Example: ${currentStep.example}` : '');
    speak(content);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
          <Typography variant="body2">
            Progress: {completedSteps.length}/{steps.length} steps completed
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {step.title}
                  <Chip 
                    label={step.type} 
                    size="small" 
                    color={step.type === 'practice' ? 'primary' : 'default'}
                  />
                  <Chip label={`${step.duration}min`} size="small" variant="outlined" />
                </Box>
              </StepLabel>
              
              <StepContent>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  {/* Content */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {step.content}
                    </Typography>
                    
                    {step.example && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">Example:</Typography>
                        <Typography variant="body2">{step.example}</Typography>
                      </Alert>
                    )}
                  </Box>

                  {/* Practice Section */}
                  {step.type === 'practice' && step.practice && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Practice:</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {step.practice.question}
                      </Typography>
                      
                      {step.practice.options ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          {step.practice.options.map((option, idx) => (
                            <Button
                              key={idx}
                              variant={userAnswer === option ? 'contained' : 'outlined'}
                              onClick={() => setUserAnswer(option)}
                              sx={{ justifyContent: 'flex-start' }}
                            >
                              {option}
                            </Button>
                          ))}
                        </Box>
                      ) : (
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                      
                      <Button
                        variant="contained"
                        onClick={handlePracticeSubmit}
                        disabled={!userAnswer}
                        sx={{ mr: 1 }}
                      >
                        Submit Answer
                      </Button>
                      
                      {isCorrect !== null && (
                        <Alert 
                          severity={isCorrect ? 'success' : 'error'} 
                          sx={{ mt: 2 }}
                        >
                          {isCorrect ? 'Correct! Well done!' : 'Try again. Check the hint if needed.'}
                        </Alert>
                      )}
                    </Box>
                  )}

                  {/* Controls */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={handleStepComplete}
                      startIcon={<CompleteIcon />}
                      disabled={step.type === 'practice' && !isCorrect}
                    >
                      {completedSteps.includes(step.id) ? 'Completed' : 'Mark Complete'}
                    </Button>
                    
                    <Tooltip title="Read aloud">
                      <IconButton onClick={speakContent}>
                        <SpeakIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {step.hints && step.hints.length > 0 && (
                      <Tooltip title="Show hint">
                        <IconButton onClick={() => setShowHint(!showHint)}>
                          <HintIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        startIcon={<PrevIcon />}
                        onClick={() => setActiveStep(index - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {index < steps.length - 1 && completedSteps.includes(step.id) && (
                      <Button
                        variant="outlined"
                        endIcon={<NextIcon />}
                        onClick={() => setActiveStep(index + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </Box>

                  {/* Hints */}
                  {showHint && step.hints && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Hint:</Typography>
                      <Typography variant="body2">{step.hints[0]}</Typography>
                    </Alert>
                  )}
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {progress === 100 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            🎉 Congratulations! You've completed this lesson!
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};