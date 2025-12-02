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
import Grid2 from '@mui/material/Grid2';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const ProfilePage: React.FC = () => {
    const { updateSettings } = useAccessibilityStore();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            <Grid2 container spacing={4}>
                {/* LEFT COLUMN */}
                <Grid2 xs={12} md={4}>
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
                </Grid2>

                {/* RIGHT COLUMN */}
                <Grid2 xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>

                            <Grid2 container spacing={2}>
                                <Grid2 xs={12} sm={6}>
                                    <TextField fullWidth label="Full Name" defaultValue="John Doe" />
                                </Grid2>
                                <Grid2 xs={12} sm={6}>
                                    <TextField fullWidth label="Email" defaultValue="john@example.com" />
                                </Grid2>
                                <Grid2 xs={12}>
                                    <TextField fullWidth label="Phone" defaultValue="+123456789" />
                                </Grid2>
                                <Grid2 xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Bio"
                                        placeholder="Write something about yourself..."
                                    />
                                </Grid2>
                            </Grid2>

                            <Button variant="contained" sx={{ mt: 3 }}>
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    );
};

