import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Tabs,
  Tab,
  Paper,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  Help as HelpIcon,
  Lightbulb as HintIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';

interface PracticeEnvironmentProps {
  courseId: string;
  moduleId: string;
  exerciseType: 'html' | 'css' | 'javascript' | 'general';
  initialCode?: string;
  expectedOutput?: string;
  instructions: string;
  hints?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`practice-tabpanel-${index}`}
      aria-labelledby={`practice-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const PracticeEnvironment: React.FC<PracticeEnvironmentProps> = ({
  courseId,
  moduleId,
  exerciseType,
  initialCode = '',
  expectedOutput = '',
  instructions,
  hints = [],
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedVersions, setSavedVersions] = useState<Array<{ code: string; timestamp: Date }>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const runCode = () => {
    setIsRunning(true);
    
    try {
      if (exerciseType === 'html' || exerciseType === 'css') {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(code);
            doc.close();
          }
        }
        setOutput('Code executed successfully! Check the preview.');
      } else if (exerciseType === 'javascript') {
        try {
          const result = new Function(code)();
          setOutput(String(result || 'Code executed successfully!'));
        } catch (error) {
          setOutput(`Error: ${error}`);
        }
      } else {
        setOutput('Code saved and validated!');
      }
      
      if (expectedOutput && code.includes(expectedOutput)) {
        setIsCompleted(true);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    const newVersion = {
      code,
      timestamp: new Date(),
    };
    setSavedVersions(prev => [...prev, newVersion]);
    
    // Save to localStorage
    localStorage.setItem(
      `practice_${courseId}_${moduleId}`,
      JSON.stringify({ code, timestamp: new Date() })
    );
    
    alert('Code saved successfully!');
  };

  const resetCode = () => {
    if (confirm('Are you sure you want to reset your code? This will restore the initial template.')) {
      setCode(initialCode);
      setOutput('');
      setIsCompleted(false);
    }
  };

  const showNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    } else {
      alert('No more hints available. Try experimenting with the code!');
    }
  };

  const getLanguageForHighlighting = () => {
    switch (exerciseType) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'text';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Practice Environment - {exerciseType.toUpperCase()}
            </Typography>
            {isCompleted && (
              <Chip 
                icon={<CheckIcon />} 
                label="Completed" 
                color="success" 
                sx={{ ml: 'auto' }} 
              />
            )}
          </Box>

          {/* Instructions */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Instructions:</Typography>
            <Typography variant="body2">{instructions}</Typography>
          </Alert>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Code Editor" />
              <Tab label="Preview" />
              <Tab label="Output" />
            </Tabs>
          </Box>

          {/* Code Editor Tab */}
          <TabPanel value={currentTab} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<RunIcon />}
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={saveCode}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ResetIcon />}
                    onClick={resetCode}
                    color="warning"
                  >
                    Reset
                  </Button>
                  <Tooltip title="Get a hint">
                    <IconButton
                      onClick={() => setShowHints(true)}
                      disabled={hints.length === 0}
                    >
                      <HintIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Write your ${exerciseType} code here...`}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      fontSize: '14px',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel value={currentTab} index={1}>
            {(exerciseType === 'html' || exerciseType === 'css') ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <PreviewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Live Preview
                </Typography>
                <Paper sx={{ border: 1, borderColor: 'divider' }}>
                  <iframe
                    ref={iframeRef}
                    style={{
                      width: '100%',
                      height: '400px',
                      border: 'none',
                    }}
                    title="Code Preview"
                  />
                </Paper>
              </Box>
            ) : (
              <Alert severity="info">
                Preview is available for HTML and CSS exercises.
              </Alert>
            )}
          </TabPanel>

          {/* Output Tab */}
          <TabPanel value={currentTab} index={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>Console Output</Typography>
            <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#fff', minHeight: 200 }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {output || 'Run your code to see the output here...'}
              </Typography>
            </Paper>
          </TabPanel>

          {/* Expected Output */}
          {expectedOutput && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Expected Output:</Typography>
              <Typography variant="body2" component="pre">
                {expectedOutput}
              </Typography>
            </Alert>
          )}

          {/* Saved Versions */}
          {savedVersions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Saved Versions ({savedVersions.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {savedVersions.slice(-5).map((version, index) => (
                  <Chip
                    key={index}
                    label={version.timestamp.toLocaleTimeString()}
                    onClick={() => setCode(version.code)}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Hints Dialog */}
      <Dialog open={showHints} onClose={() => setShowHints(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <HintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Hints ({currentHint + 1} of {hints.length})
        </DialogTitle>
        <DialogContent>
          {hints.length > 0 ? (
            <Typography variant="body1">
              {hints[currentHint]}
            </Typography>
          ) : (
            <Typography variant="body1">
              No hints available for this exercise.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {currentHint < hints.length - 1 && (
            <Button onClick={showNextHint}>
              Next Hint
            </Button>
          )}
          <Button onClick={() => setShowHints(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};