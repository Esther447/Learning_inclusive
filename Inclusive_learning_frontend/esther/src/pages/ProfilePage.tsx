import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    TextField,
    Avatar,
    Button,
    Alert,
} from '@mui/material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
    const { updateSettings } = useAccessibilityStore();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user, isAuthenticated, navigate]);

    const handleSaveProfile = () => {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* LEFT COLUMN */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ width: 120, height: 120, margin: '0 auto', bgcolor: 'primary.main', fontSize: '3rem' }}>
                                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                {user?.name || 'User'}
                            </Typography>
                            <Typography color="text.secondary">{user?.role || 'Learner'}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                {user?.email}
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Learning Preference Description"
                                    placeholder="Describe your learning preferences..."
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() =>
                                    updateSettings({
                                        fontSize: 'medium',
                                        highContrastMode: false,
                                    })
                                }
                            >
                                Analyze Preferences
                            </Button>
                        </CardActions>
                    </Card>
                </Box>

                {/* RIGHT COLUMN */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.666%' } }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>

                            {successMessage && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {successMessage}
                                </Alert>
                            )}

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                <Box>
                                    <TextField 
                                        fullWidth 
                                        label="Full Name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Box>
                                <Box>
                                    <TextField 
                                        fullWidth 
                                        label="Email" 
                                        value={email}
                                        disabled
                                        helperText="Email cannot be changed"
                                    />
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <TextField 
                                        fullWidth 
                                        label="Role" 
                                        value={user?.role || 'learner'}
                                        disabled
                                    />
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Bio"
                                        placeholder="Write something about yourself..."
                                    />
                                </Box>
                            </Box>

                            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSaveProfile}>
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
};

