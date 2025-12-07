import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { Email, Phone, Chat, Help, Send } from '@mui/icons-material';

export const HelpPage: React.FC = () => {
  const [emailDialog, setEmailDialog] = useState(false);
  const [chatDialog, setChatDialog] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendEmail = () => {
    // Simulate sending email
    const mailtoLink = `mailto:support@inclusivelearning.rw?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(`Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\n${emailForm.message}`)}`;
    window.location.href = mailtoLink;
    setEmailDialog(false);
    setShowSuccess(true);
    setEmailForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleCall = () => {
    window.location.href = 'tel:+250788123456';
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { sender: 'You', text: chatMessage }]);
      setChatMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'Support', 
          text: 'Thank you for your message. A support agent will respond shortly. For immediate assistance, please call +250 788 123 456.' 
        }]);
      }, 1000);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We're here to help you succeed in your learning journey
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Email sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Email Support</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Send us an email and we'll respond within 24 hours
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 2 }}>
                  support@inclusivelearning.rw
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setEmailDialog(true)}
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Phone sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Call Us</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Speak directly with our support team
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  +250 788 123 456
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Mon-Fri: 8AM - 6PM EAT
                </Typography>
                <Button 
                  variant="contained" 
                  color="success"
                  fullWidth
                  onClick={handleCall}
                >
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Chat sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Live Chat</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get instant help from our support team
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 2 }}>
                  Average response: 2 minutes
                </Typography>
                <Button 
                  variant="contained" 
                  color="info"
                  fullWidth
                  onClick={() => setChatDialog(true)}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Help sx={{ verticalAlign: 'middle', mr: 1 }} />
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                How do I enroll in a course?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Navigate to the Courses page, browse available courses, and click "Enroll" on any course you're interested in.
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                How do I track my progress?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your progress is automatically tracked. Visit your Dashboard to see completion percentages and achievements.
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Are courses accessible for people with disabilities?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Yes! All courses include captions, transcripts, keyboard navigation, and screen reader support. Visit Accessibility Settings to customize your experience.
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                How do I get a certificate?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Complete all course modules and pass the final assessment with 70% or higher to receive your certificate.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Email Dialog */}
        <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Email to Support</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Your Name"
              value={emailForm.name}
              onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Your Email"
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subject"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={emailForm.message}
              onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSendEmail}
              disabled={!emailForm.name || !emailForm.email || !emailForm.subject || !emailForm.message}
              startIcon={<Send />}
            >
              Send Email
            </Button>
          </DialogActions>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={chatDialog} onClose={() => setChatDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Live Chat Support</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 300, overflowY: 'auto', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              {chatMessages.length === 0 ? (
                <Alert severity="info">
                  Welcome to Inclusive Learning support! How can we help you today?
                </Alert>
              ) : (
                chatMessages.map((msg, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      mb: 1, 
                      p: 1, 
                      bgcolor: msg.sender === 'You' ? 'primary.light' : 'white',
                      borderRadius: 1,
                      textAlign: msg.sender === 'You' ? 'right' : 'left'
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">{msg.sender}</Typography>
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                ))
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button 
                variant="contained" 
                onClick={handleSendChatMessage}
                disabled={!chatMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChatDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          message="Email sent successfully!"
        />
      </Container>
    </Box>
  );
};
