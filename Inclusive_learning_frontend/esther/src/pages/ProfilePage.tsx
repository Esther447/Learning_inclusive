import React from 'react';
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
} from '@mui/material';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const ProfilePage: React.FC = () => {
    const { updateSettings } = useAccessibilityStore();

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
                            <Avatar sx={{ width: 120, height: 120, margin: '0 auto' }} />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                John Doe
                            </Typography>
                            <Typography color="text.secondary">Student</Typography>

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

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                <Box>
                                    <TextField fullWidth label="Full Name" defaultValue="John Doe" />
                                </Box>
                                <Box>
                                    <TextField fullWidth label="Email" defaultValue="john@example.com" />
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <TextField fullWidth label="Phone" defaultValue="+123456789" />
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

                            <Button variant="contained" sx={{ mt: 3 }}>
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
};

