import React from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip } from '@mui/material';
import { Mail, Person } from '@mui/icons-material';

export const InboxPage: React.FC = () => {
  const messages = [
    { from: 'Mentor John', subject: 'Great progress on Module 2!', time: '2 hours ago', unread: true },
    { from: 'Admin Team', subject: 'New course available: Mobile Development', time: '1 day ago', unread: true },
    { from: 'Mentor Sarah', subject: 'Assignment feedback', time: '2 days ago', unread: false },
  ];

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Inbox
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Messages from mentors and administrators
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Mail sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Messages
            </Typography>
            <Chip label={`${messages.filter(m => m.unread).length} unread`} size="small" color="primary" sx={{ ml: 2 }} />
          </Box>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2, bgcolor: msg.unread ? 'action.hover' : 'transparent' }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={msg.unread ? 'bold' : 'normal'}>{msg.subject}</Typography>}
                  secondary={`From: ${msg.from} • ${msg.time}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};
