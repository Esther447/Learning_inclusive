import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Fullscreen as FullscreenIcon,
  ClosedCaption as CaptionIcon,
  Subtitles as SubtitleIcon,
  Speed as SpeedIcon,
  Translate as TranslateIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  captions?: Array<{
    language: string;
    url: string;
    label: string;
  }>;
  transcript?: string;
  signLanguageUrl?: string;
  audioDescription?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

interface Caption {
  start: number;
  end: number;
  text: string;
}

export const AccessibleVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  captions = [],
  transcript = '',
  signLanguageUrl = '',
  audioDescription = '',
  onProgress,
  onComplete,
}) => {
  const { settings } = useAccessibilityStore();
  const { speak } = useTextToSpeech();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(settings.captionsEnabled);
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState('en');
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(settings.textToSpeechEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock captions data - in real app, this would be loaded from caption files
  const mockCaptions: Caption[] = [
    { start: 0, end: 5, text: "Welcome to this video lesson on web development." },
    { start: 5, end: 10, text: "Today we'll learn about HTML fundamentals." },
    { start: 10, end: 15, text: "HTML stands for HyperText Markup Language." },
    { start: 15, end: 20, text: "It's the foundation of all web pages." },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);
      
      // Update captions
      if (showCaptions) {
        const caption = mockCaptions.find(
          cap => current >= cap.start && current <= cap.end
        );
        setCurrentCaption(caption?.text || '');
      }

      // Report progress
      if (onProgress && duration > 0) {
        onProgress((current / duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [duration, showCaptions, onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (newValue as number / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = newValue as number / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = () => {
    const content = `Video Transcript: ${title}\n\n${transcript}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <AccessibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {title}
        </Typography>

        {/* Video Container */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: '#000',
            }}
            poster="/api/placeholder/800/450"
          >
            <source src={videoUrl} type="video/mp4" />
            {captions.map((caption, index) => (
              <track
                key={index}
                kind="subtitles"
                src={caption.url}
                srcLang={caption.language}
                label={caption.label}
              />
            ))}
            Your browser does not support the video tag.
          </video>

          {/* Sign Language Video Overlay */}
          {showSignLanguage && signLanguageUrl && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                width: 200,
                height: 150,
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: 1,
              }}
            >
              <video
                style={{ width: '100%', height: '100%' }}
                src={signLanguageUrl}
                muted
              />
            </Box>
          )}

          {/* Captions Overlay */}
          {showCaptions && currentCaption && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 60,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: 1,
                borderRadius: 1,
                maxWidth: '80%',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">{currentCaption}</Typography>
            </Box>
          )}
        </Box>

        {/* Video Controls */}
        <Box sx={{ mb: 2 }}>
          {/* Progress Bar */}
          <Slider
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            sx={{ mb: 1 }}
            aria-label="Video progress"
          />

          {/* Control Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton onClick={togglePlay} size="large">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>

            <IconButton onClick={toggleMute}>
              {isMuted ? <MuteIcon /> : <VolumeIcon />}
            </IconButton>

            <Slider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              sx={{ width: 100 }}
              aria-label="Volume"
            />

            <Typography variant="body2" sx={{ minWidth: 80 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <IconButton onClick={toggleFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </Box>

          {/* Accessibility Controls */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showCaptions}
                  onChange={(e) => {
                    setShowCaptions(e.target.checked);
                    speak(e.target.checked ? 'Captions enabled' : 'Captions disabled');
                  }}
                />
              }
              label="Captions"
            />

            {signLanguageUrl && (
              <FormControlLabel
                control={
                  <Switch
                    checked={showSignLanguage}
                    onChange={(e) => {
                      setShowSignLanguage(e.target.checked);
                      speak(e.target.checked ? 'Sign language interpreter enabled' : 'Sign language interpreter disabled');
                    }}
                  />
                }
                label="Sign Language"
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={ttsEnabled}
                  onChange={(e) => {
                    setTtsEnabled(e.target.checked);
                    if (e.target.checked) {
                      speak('Text to speech enabled for video content');
                    }
                  }}
                />
              }
              label="Text-to-Speech"
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Speed</InputLabel>
              <Select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(e.target.value as number)}
                label="Speed"
              >
                <MenuItem value={0.5}>0.5x</MenuItem>
                <MenuItem value={0.75}>0.75x</MenuItem>
                <MenuItem value={1}>1x</MenuItem>
                <MenuItem value={1.25}>1.25x</MenuItem>
                <MenuItem value={1.5}>1.5x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
              </Select>
            </FormControl>

            {captions.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Captions</InputLabel>
                <Select
                  value={selectedCaptionLanguage}
                  onChange={(e) => setSelectedCaptionLanguage(e.target.value)}
                  label="Captions"
                >
                  {captions.map((caption) => (
                    <MenuItem key={caption.language} value={caption.language}>
                      {caption.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Features Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip icon={<CaptionIcon />} label="Captions Available" size="small" />
            {signLanguageUrl && (
              <Chip icon={<TranslateIcon />} label="Sign Language" size="small" />
            )}
            {transcript && (
              <Chip icon={<SubtitleIcon />} label="Transcript Available" size="small" />
            )}
            {audioDescription && (
              <Chip icon={<VolumeIcon />} label="Audio Description" size="small" />
            )}
          </Box>
        </Box>

        {/* Transcript Section */}
        {transcript && (
          <Accordion 
            expanded={showTranscript}
            onChange={(e, expanded) => setShowTranscript(expanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Video Transcript</Typography>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadTranscript();
                  speak('Transcript downloaded');
                }}
                sx={{ ml: 'auto', mr: 1 }}
              >
                Download
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {transcript || 'Transcript content would appear here...'}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Chapter Navigation (if available) */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Video Chapters
          </Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    speak('Jumping to introduction section');
                  }
                }}
              >
                <ListItemText primary="Introduction" secondary="0:00" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 60;
                    speak('Jumping to main content section');
                  }
                }}
              >
                <ListItemText primary="Main Content" secondary="1:00" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 180;
                    speak('Jumping to summary section');
                  }
                }}
              >
                <ListItemText primary="Summary" secondary="3:00" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};