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
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { Quiz as QuizIcon, CheckCircle, Timer, TrendingUp } from '@mui/icons-material';
import { useCourseStore } from '../store/courseStore';

export const QuizzesPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById } = useCourseStore();
  const course = getCourseById(courseId || '');
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!course) return <Alert severity="error">Course not found</Alert>;

  const quizzes = course.modules?.map((module, idx) => ({
    id: `quiz-${module.id}`,
    moduleId: module.id,
    title: `${module.title} - Quiz`,
    description: `Test your knowledge of ${module.title}`,
    questions: 5,
    duration: 15,
    passingScore: 70,
    attempts: 0,
    maxAttempts: 3,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    questions_data: [
      { id: 1, question: `What is the main concept in ${module.title}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0 },
      { id: 2, question: `Which technique is used in ${module.title}?`, options: ['Technique 1', 'Technique 2', 'Technique 3', 'Technique 4'], correct: 1 },
      { id: 3, question: `What is the best practice for ${module.title}?`, options: ['Practice A', 'Practice B', 'Practice C', 'Practice D'], correct: 2 },
      { id: 4, question: `How do you apply ${module.title} concepts?`, options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'], correct: 1 },
      { id: 5, question: `What is the key takeaway from ${module.title}?`, options: ['Takeaway A', 'Takeaway B', 'Takeaway C', 'Takeaway D'], correct: 0 },
    ]
  })) || [];

  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setShowResults(false);
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions_data.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correct) correct++;
    });
    return Math.round((correct / selectedQuiz.questions_data.length) * 100);
  };

  if (selectedQuiz && !showResults) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="600">{selectedQuiz.title}</Typography>
              <Chip icon={<Timer />} label={`${selectedQuiz.duration} min`} color="primary" />
            </Box>
            
            {selectedQuiz.questions_data.map((q: any, idx: number) => (
              <Box key={q.id} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Question {idx + 1}: {q.question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={answers[idx] ?? ''} onChange={(e) => setAnswers({ ...answers, [idx]: parseInt(e.target.value) })}>
                    {q.options.map((option: string, optIdx: number) => (
                      <FormControlLabel key={optIdx} value={optIdx} control={<Radio />} label={option} />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setSelectedQuiz(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < selectedQuiz.questions_data.length}>
                Submit Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= selectedQuiz.passingScore;
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: passed ? 'success.main' : 'error.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="600" gutterBottom>
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </Typography>
            <Typography variant="h2" color={passed ? 'success.main' : 'error.main'} fontWeight="700" sx={{ my: 3 }}>
              {score}%
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Passing Score: {selectedQuiz.passingScore}%
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button variant="outlined" onClick={() => { setSelectedQuiz(null); setShowResults(false); }}>
                Back to Quizzes
              </Button>
              {!passed && (
                <Button variant="contained" onClick={() => { setAnswers({}); setShowResults(false); }}>
                  Retake Quiz
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="700" gutterBottom>Quizzes</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test your knowledge with module quizzes
      </Typography>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <QuizIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="600">{quiz.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{quiz.description}</Typography>
                  </Box>
                </Box>
                <Chip label={`${quiz.attempts}/${quiz.maxAttempts} attempts`} size="small" />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Typography variant="body2"><strong>{quiz.questions}</strong> questions</Typography>
                <Typography variant="body2"><strong>{quiz.duration}</strong> minutes</Typography>
                <Typography variant="body2"><strong>{quiz.passingScore}%</strong> to pass</Typography>
              </Box>

              <Button variant="contained" onClick={() => handleStartQuiz(quiz)} disabled={quiz.attempts >= quiz.maxAttempts}>
                {quiz.attempts >= quiz.maxAttempts ? 'Max Attempts Reached' : 'Start Quiz'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
