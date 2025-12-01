import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid2 as Grid,
  TextField,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  VideoCall as VideoIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Send as SendIcon,
  Share as ShareIcon,
  Draw as DrawIcon,
  ClosedCaption as CaptionIcon,
  VolumeUp as SpeakIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface LiveSessionProps {
  sessionType: 'video' | 'audio' | 'chat';
  learnerNeeds: string[];
  mentorName: string;
  learnerName: string;
}

export const LiveSession: React.FC<LiveSessionProps> = ({
  sessionType,
  learnerNeeds,
  mentorName,
  learnerName,
}) => {
  const { speak } = useTextToSpeech();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: mentorName, content: 'Hello! Ready to start our session?', time: '2:00 PM' },
    { sender: learnerName, content: 'Yes, I\'m ready!', time: '2:01 PM' }
  ]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showCaptions, setShowCaptions] = useState(learnerNeeds.includes('Captions'));
  const [showSymbolBoard, setShowSymbolBoard] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const symbols = [
    { icon: '👍', text: 'Yes', category: 'response' },
    { icon: '👎', text: 'No', category: 'response' },
    { icon: '❓', text: 'I don\'t understand', category: 'help' },
    { icon: '🔄', text: 'Please repeat', category: 'help' },
    { icon: '💡', text: 'I have an idea', category: 'response' },
    { icon: '✋', text: 'Wait', category: 'response' },
    { icon: '📝', text: 'Can you write it?', category: 'help' },
    { icon: '🎯', text: 'Example please', category: 'help' },
    { icon: '😊', text: 'Happy', category: 'emotion' },
    { icon: '😕', text: 'Confused', category: 'emotion' },
    { icon: '🤔', text: 'Thinking', category: 'emotion' },
    { icon: '✅', text: 'Finished', category: 'status' }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: learnerName,
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      if (learnerNeeds.includes('Text-to-Speech')) {
        speak(`Message sent: ${message}`);
      }
    }
  };

  const sendSymbol = (symbol: typeof symbols[0]) => {
    const newMessage = {
      sender: learnerName,
      content: `${symbol.icon} ${symbol.text}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    
    if (learnerNeeds.includes('Text-to-Speech')) {
      speak(symbol.text);
    }
  };

  const shareResource = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newMessage = {
          sender: mentorName,
          content: `📎 Shared file: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        speak(`File shared: ${file.name}`);
      }
    };
    input.click();
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{mentorName.charAt(0)}</Avatar>
          <Box>
            <Typography variant="h6">Session with {mentorName}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {learnerNeeds.map((need) => (
                <Chip key={need} label={need} size="small" color="primary" />
              ))}
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showCaptions ? 'contained' : 'outlined'}
            startIcon={<CaptionIcon />}
            onClick={() => {
              setShowCaptions(!showCaptions);
              speak(showCaptions ? 'Captions disabled' : 'Captions enabled');
            }}
          >
            Captions
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccessibilityIcon />}
            onClick={() => setShowSymbolBoard(!showSymbolBoard)}
          >
            Symbols
          </Button>
        </Box>
      </Paper>

      <Grid container sx={{ flex: 1 }}>
        {/* Video/Audio Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Video Display */}
            <Box sx={{ flex: 1, bgcolor: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sessionType === 'video' ? (
                <Box sx={{ color: 'white', textAlign: 'center' }}>
                  <VideoIcon sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6">Video Call Active</Typography>
                  {showCaptions && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 20, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      p: 1,
                      borderRadius: 1
                    }}>
                      <Typography variant="body2">
                        [Live Captions] Welcome to our mentorship session...
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : sessionType === 'audio' ? (
                <Box sx={{ color: 'white', textAlign: 'center' }}>
                  <MicIcon sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6">Audio Call Active</Typography>
                </Box>
              ) : (
                <Box sx={{ color: 'white', textAlign: 'center' }}>
                  <Typography variant="h6">Text Chat Session</Typography>
                </Box>
              )}
            </Box>

            {/* Controls */}
            {(sessionType === 'video' || sessionType === 'audio') && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: 'grey.100' }}>
                <IconButton
                  color={isMicOn ? 'primary' : 'error'}
                  onClick={() => {
                    setIsMicOn(!isMicOn);
                    speak(isMicOn ? 'Microphone muted' : 'Microphone unmuted');
                  }}
                >
                  {isMicOn ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
                
                {sessionType === 'video' && (
                  <IconButton
                    color={isVideoOn ? 'primary' : 'error'}
                    onClick={() => {
                      setIsVideoOn(!isVideoOn);
                      speak(isVideoOn ? 'Camera off' : 'Camera on');
                    }}
                  >
                    {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                  </IconButton>
                )}
                
                <IconButton onClick={() => setWhiteboardOpen(true)}>
                  <DrawIcon />
                </IconButton>
                
                <IconButton onClick={shareResource}>
                  <ShareIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Chat Area */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Chat</Typography>
              
              {/* Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: msg.sender === learnerName ? 'primary.light' : 'grey.100',
                      alignSelf: msg.sender === learnerName ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {msg.sender}
                    </Typography>
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {msg.time}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Message Input */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton onClick={sendMessage} color="primary">
                  <SendIcon />
                </IconButton>
                <IconButton onClick={() => speak(message)}>
                  <SpeakIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Symbol Communication Board */}
      {showSymbolBoard && (
        <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Communication Symbols</Typography>
          <Grid container spacing={1}>
            {symbols.map((symbol, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  onClick={() => sendSymbol(symbol)}
                  sx={{ 
                    minWidth: 80, 
                    height: 60, 
                    flexDirection: 'column',
                    fontSize: '1.2em'
                  }}
                >
                  <Box>{symbol.icon}</Box>
                  <Typography variant="caption">{symbol.text}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Whiteboard Dialog */}
      <Dialog open={whiteboardOpen} onClose={() => setWhiteboardOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Shared Whiteboard</DialogTitle>
        <DialogContent>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ border: '1px solid #ccc', width: '100%' }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="outlined">Clear</Button>
            <Button variant="outlined">Save</Button>
            <Button variant="contained" onClick={() => setWhiteboardOpen(false)}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
