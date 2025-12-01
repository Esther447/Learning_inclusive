/**
 * Groups Page
 * Collaboration area with group management
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const GroupsPage: React.FC = () => {
  const { settings } = useAccessibilityStore();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const groups = [
    {
      id: 1,
      name: 'Web Development Study Group',
      members: ['Alice', 'Bob', 'Charlie'],
      lastMessage: 'Great progress on the HTML assignment!',
      unread: 2,
    },
    {
      id: 2,
      name: 'Accessibility Advocates',
      members: ['Diana', 'Eve', 'Frank', 'Grace'],
      lastMessage: 'New WCAG guidelines discussion',
      unread: 0,
    },
    {
      id: 3,
      name: 'Digital Literacy Mentors',
      members: ['Henry', 'Iris'],
      lastMessage: 'Meeting scheduled for Friday',
      unread: 1,
    },
  ];

  const messages = [
    { id: 1, sender: 'Alice', content: 'How is everyone doing with the CSS assignment?', time: '10:30 AM' },
    { id: 2, sender: 'Bob', content: 'I finished the flexbox section. Need help with grid.', time: '10:45 AM' },
    { id: 3, sender: 'You', content: 'I can help with CSS Grid! Let me share some resources.', time: '11:00 AM' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent: ${message}`);
      setMessage('');
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      alert(`Group "${newGroupName}" created successfully!`);
      setNewGroupName('');
      setOpenCreateGroup(false);
    }
  };

  const handleJoinGroup = (groupId: number) => {
    alert(`Joined group ${groupId}!`);
  };

  const handleFileShare = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`File "${file.name}" shared with the group!`);
      }
    };
    input.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Groups</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateGroup(true)}
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Groups List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Groups
              </Typography>
              <List>
                {groups.map((group) => (
                  <ListItemButton
                    key={group.id}
                    selected={selectedGroup === group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: selectedGroup === group.id ? 'primary.light' : 'transparent',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <GroupIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{group.name}</Typography>
                          {group.unread > 0 && (
                            <Chip label={group.unread} color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {group.lastMessage}
                          </Typography>
                          <AvatarGroup max={4} sx={{ mt: 1 }}>
                            {group.members.map((member, index) => (
                              <Avatar key={index} sx={{ width: 24, height: 24 }}>
                                {member.charAt(0)}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedGroup ? (
            <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {groups.find(g => g.id === selectedGroup)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {groups.find(g => g.id === selectedGroup)?.members.length} members
                </Typography>
              </CardContent>

              {/* Messages */}
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: msg.sender === 'You' ? 'primary.main' : 'grey.100',
                        color: msg.sender === 'You' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {msg.sender}
                      </Typography>
                      <Typography variant="body1">{msg.content}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {msg.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleFileShare}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    <AttachIcon />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </Card>
          ) : (
            <Card sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a group to start chatting
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Create Group Dialog */}
      <Dialog open={openCreateGroup} onClose={() => setOpenCreateGroup(false)}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateGroup(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
