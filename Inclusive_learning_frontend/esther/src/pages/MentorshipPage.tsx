import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Avatar, Chip, Grid } from '@mui/material';
import { People, VideoCall, Message } from '@mui/icons-material';

export const MentorshipPage: React.FC = () => {
  const mentors = [
    { id: 1, name: 'John Doe', expertise: 'Web Development', available: true },
    { id: 2, name: 'Jane Smith', expertise: 'Digital Literacy', available: true },
    { id: 3, name: 'Mike Johnson', expertise: 'Communication Skills', available: false },
  ];

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mentorship Program
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Connect with experienced mentors to guide your learning journey
        </Typography>

        <Grid container spacing={3}>
          {mentors.map((mentor) => (
            <Grid key={mentor.id} size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', mr: 2 }}>
                      {mentor.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600">{mentor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{mentor.expertise}</Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={mentor.available ? 'Available' : 'Busy'} 
                    color={mentor.available ? 'success' : 'default'} 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<Message />}>Message</Button>
                    <Button variant="outlined" size="small" startIcon={<VideoCall />}>Schedule</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
