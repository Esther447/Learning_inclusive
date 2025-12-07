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
    Chip,
} from '@mui/material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useAuthStore } from '../store/authStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
    const { settings, updateSettings } = useAccessibilityStore();
    const { user, updateUser } = useAuthStore();
    const { speak } = useTextToSpeech();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Announce page for screen readers and TTS
    useEffect(() => {
        if (settings.textToSpeechEnabled && user) {
            speak(`Profile page. Edit your profile information for ${user.name || 'user'}.`);
        }
    }, [settings.textToSpeechEnabled, user, speak]);
    
    // Form state - initialize from user data
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [learningPreferences, setLearningPreferences] = useState('');

    // Update form when user changes
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Get user's initials for avatar
    const getInitials = () => {
        if (user?.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'learner':
                return 'Learner';
            case 'mentor':
                return 'Mentor/Instructor';
            case 'administrator':
                return 'Administrator';
            default:
                return 'User';
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Update user profile via API
            const response = await api.put('/users/me', {
                name: name.trim() || undefined,
                email: email.trim() || undefined,
            });

            // Update local user state
            if (!user) return;

            updateUser({
                ...user,
                name: name.trim() !== '' ? name.trim() : user.name || '',
                email: email.trim() !== '' ? email.trim() : user.email || '',
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Profile updated successfully!
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* LEFT COLUMN */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar 
                                sx={{ 
                                    width: 120, 
                                    height: 120, 
                                    margin: '0 auto',
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem'
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                {user?.name || 'User'}
                            </Typography>
                            <Chip 
                                label={getRoleLabel(user?.role)} 
                                color="primary" 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                {user?.email || 'No email'}
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Learning Preference Description"
                                    placeholder="Describe your learning preferences..."
                                    variant="outlined"
                                    value={learningPreferences}
                                    onChange={(e) => setLearningPreferences(e.target.value)}
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

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                <Box>
                                    <TextField 
                                        fullWidth 
                                        label="Full Name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </Box>
                                <Box>
                                    <TextField 
                                        fullWidth 
                                        label="Email" 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@gmail.com"
                                    />
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <TextField 
                                        fullWidth 
                                        label="Phone" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1234567890"
                                    />
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Bio"
                                        placeholder="Write something about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </Box>
                            </Box>

                            <Button 
                                variant="contained" 
                                sx={{ mt: 3 }}
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
};
