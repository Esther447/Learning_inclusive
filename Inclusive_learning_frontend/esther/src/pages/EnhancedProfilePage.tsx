import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Accessibility as AccessibilityIcon,
  Security as SecurityIcon,
  Visibility as PreviewIcon,
  Group as GroupIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useAuthStore } from '../store/authStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export const EnhancedProfilePage: React.FC = () => {
  const { settings, updateSettings } = useAccessibilityStore();
  const { user } = useAuthStore();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '(555) 123-4567',
    phoneCode: '+1',
    country: 'United States',
    bio: 'Passionate learner focused on web development and accessibility.',
    role: user?.role || 'learner',
    profilePicture: null as File | null,
  });

  const [activityData, setActivityData] = useState({
    profileViews: 24,
    lastLogin: new Date().toLocaleString(),
    previousLogin: new Date(Date.now() - 86400000).toLocaleString(),
    memberSince: 'Jan 2024',
    coursesCompleted: 2,
    totalSessions: 12,
    messagesExchanged: 45,
  });

  const [mentorProfile, setMentorProfile] = useState({
    name: 'Sarah Johnson',
    specialty: 'Web Development & Accessibility',
    languages: ['English', 'Spanish'],
    availability: 'Mon-Fri 9AM-5PM',
    status: 'Available',
    lastSeen: new Date().toLocaleString(),
  });

  // Auto-update mentor profile when they log in
  React.useEffect(() => {
    const updateMentorStatus = () => {
      setMentorProfile(prev => ({
        ...prev,
        lastSeen: new Date().toLocaleString(),
        status: 'Available'
      }));
    };
    
    // Simulate mentor login updates every 30 seconds
    const interval = setInterval(updateMentorStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const countries = [
    { code: 'AD', name: 'Andorra', phoneCode: '+376' },
    { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971' },
    { code: 'AF', name: 'Afghanistan', phoneCode: '+93' },
    { code: 'AG', name: 'Antigua and Barbuda', phoneCode: '+1268' },
    { code: 'AL', name: 'Albania', phoneCode: '+355' },
    { code: 'AM', name: 'Armenia', phoneCode: '+374' },
    { code: 'AO', name: 'Angola', phoneCode: '+244' },
    { code: 'AR', name: 'Argentina', phoneCode: '+54' },
    { code: 'AT', name: 'Austria', phoneCode: '+43' },
    { code: 'AU', name: 'Australia', phoneCode: '+61' },
    { code: 'AZ', name: 'Azerbaijan', phoneCode: '+994' },
    { code: 'BA', name: 'Bosnia and Herzegovina', phoneCode: '+387' },
    { code: 'BB', name: 'Barbados', phoneCode: '+1246' },
    { code: 'BD', name: 'Bangladesh', phoneCode: '+880' },
    { code: 'BE', name: 'Belgium', phoneCode: '+32' },
    { code: 'BF', name: 'Burkina Faso', phoneCode: '+226' },
    { code: 'BG', name: 'Bulgaria', phoneCode: '+359' },
    { code: 'BH', name: 'Bahrain', phoneCode: '+973' },
    { code: 'BI', name: 'Burundi', phoneCode: '+257' },
    { code: 'BJ', name: 'Benin', phoneCode: '+229' },
    { code: 'BN', name: 'Brunei', phoneCode: '+673' },
    { code: 'BO', name: 'Bolivia', phoneCode: '+591' },
    { code: 'BR', name: 'Brazil', phoneCode: '+55' },
    { code: 'BS', name: 'Bahamas', phoneCode: '+1242' },
    { code: 'BT', name: 'Bhutan', phoneCode: '+975' },
    { code: 'BW', name: 'Botswana', phoneCode: '+267' },
    { code: 'BY', name: 'Belarus', phoneCode: '+375' },
    { code: 'BZ', name: 'Belize', phoneCode: '+501' },
    { code: 'CA', name: 'Canada', phoneCode: '+1' },
    { code: 'CD', name: 'DR Congo', phoneCode: '+243' },
    { code: 'CF', name: 'Central African Republic', phoneCode: '+236' },
    { code: 'CG', name: 'Republic of the Congo', phoneCode: '+242' },
    { code: 'CH', name: 'Switzerland', phoneCode: '+41' },
    { code: 'CI', name: 'Côte d\'Ivoire', phoneCode: '+225' },
    { code: 'CL', name: 'Chile', phoneCode: '+56' },
    { code: 'CM', name: 'Cameroon', phoneCode: '+237' },
    { code: 'CN', name: 'China', phoneCode: '+86' },
    { code: 'CO', name: 'Colombia', phoneCode: '+57' },
    { code: 'CR', name: 'Costa Rica', phoneCode: '+506' },
    { code: 'CU', name: 'Cuba', phoneCode: '+53' },
    { code: 'CV', name: 'Cape Verde', phoneCode: '+238' },
    { code: 'CY', name: 'Cyprus', phoneCode: '+357' },
    { code: 'CZ', name: 'Czech Republic', phoneCode: '+420' },
    { code: 'DE', name: 'Germany', phoneCode: '+49' },
    { code: 'DJ', name: 'Djibouti', phoneCode: '+253' },
    { code: 'DK', name: 'Denmark', phoneCode: '+45' },
    { code: 'DM', name: 'Dominica', phoneCode: '+1767' },
    { code: 'DO', name: 'Dominican Republic', phoneCode: '+1809' },
    { code: 'DZ', name: 'Algeria', phoneCode: '+213' },
    { code: 'EC', name: 'Ecuador', phoneCode: '+593' },
    { code: 'EE', name: 'Estonia', phoneCode: '+372' },
    { code: 'EG', name: 'Egypt', phoneCode: '+20' },
    { code: 'ER', name: 'Eritrea', phoneCode: '+291' },
    { code: 'ES', name: 'Spain', phoneCode: '+34' },
    { code: 'ET', name: 'Ethiopia', phoneCode: '+251' },
    { code: 'FI', name: 'Finland', phoneCode: '+358' },
    { code: 'FJ', name: 'Fiji', phoneCode: '+679' },
    { code: 'FR', name: 'France', phoneCode: '+33' },
    { code: 'GA', name: 'Gabon', phoneCode: '+241' },
    { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
    { code: 'GD', name: 'Grenada', phoneCode: '+1473' },
    { code: 'GE', name: 'Georgia', phoneCode: '+995' },
    { code: 'GH', name: 'Ghana', phoneCode: '+233' },
    { code: 'GM', name: 'Gambia', phoneCode: '+220' },
    { code: 'GN', name: 'Guinea', phoneCode: '+224' },
    { code: 'GQ', name: 'Equatorial Guinea', phoneCode: '+240' },
    { code: 'GR', name: 'Greece', phoneCode: '+30' },
    { code: 'GT', name: 'Guatemala', phoneCode: '+502' },
    { code: 'GW', name: 'Guinea-Bissau', phoneCode: '+245' },
    { code: 'GY', name: 'Guyana', phoneCode: '+592' },
    { code: 'HN', name: 'Honduras', phoneCode: '+504' },
    { code: 'HR', name: 'Croatia', phoneCode: '+385' },
    { code: 'HT', name: 'Haiti', phoneCode: '+509' },
    { code: 'HU', name: 'Hungary', phoneCode: '+36' },
    { code: 'ID', name: 'Indonesia', phoneCode: '+62' },
    { code: 'IE', name: 'Ireland', phoneCode: '+353' },
    { code: 'IL', name: 'Israel', phoneCode: '+972' },
    { code: 'IN', name: 'India', phoneCode: '+91' },
    { code: 'IQ', name: 'Iraq', phoneCode: '+964' },
    { code: 'IR', name: 'Iran', phoneCode: '+98' },
    { code: 'IS', name: 'Iceland', phoneCode: '+354' },
    { code: 'IT', name: 'Italy', phoneCode: '+39' },
    { code: 'JM', name: 'Jamaica', phoneCode: '+1876' },
    { code: 'JO', name: 'Jordan', phoneCode: '+962' },
    { code: 'JP', name: 'Japan', phoneCode: '+81' },
    { code: 'KE', name: 'Kenya', phoneCode: '+254' },
    { code: 'KG', name: 'Kyrgyzstan', phoneCode: '+996' },
    { code: 'KH', name: 'Cambodia', phoneCode: '+855' },
    { code: 'KM', name: 'Comoros', phoneCode: '+269' },
    { code: 'KN', name: 'Saint Kitts and Nevis', phoneCode: '+1869' },
    { code: 'KP', name: 'North Korea', phoneCode: '+850' },
    { code: 'KR', name: 'South Korea', phoneCode: '+82' },
    { code: 'KW', name: 'Kuwait', phoneCode: '+965' },
    { code: 'KZ', name: 'Kazakhstan', phoneCode: '+7' },
    { code: 'LA', name: 'Laos', phoneCode: '+856' },
    { code: 'LB', name: 'Lebanon', phoneCode: '+961' },
    { code: 'LC', name: 'Saint Lucia', phoneCode: '+1758' },
    { code: 'LI', name: 'Liechtenstein', phoneCode: '+423' },
    { code: 'LK', name: 'Sri Lanka', phoneCode: '+94' },
    { code: 'LR', name: 'Liberia', phoneCode: '+231' },
    { code: 'LS', name: 'Lesotho', phoneCode: '+266' },
    { code: 'LT', name: 'Lithuania', phoneCode: '+370' },
    { code: 'LU', name: 'Luxembourg', phoneCode: '+352' },
    { code: 'LV', name: 'Latvia', phoneCode: '+371' },
    { code: 'LY', name: 'Libya', phoneCode: '+218' },
    { code: 'MA', name: 'Morocco', phoneCode: '+212' },
    { code: 'MC', name: 'Monaco', phoneCode: '+377' },
    { code: 'MD', name: 'Moldova', phoneCode: '+373' },
    { code: 'ME', name: 'Montenegro', phoneCode: '+382' },
    { code: 'MG', name: 'Madagascar', phoneCode: '+261' },
    { code: 'MK', name: 'North Macedonia', phoneCode: '+389' },
    { code: 'ML', name: 'Mali', phoneCode: '+223' },
    { code: 'MM', name: 'Myanmar', phoneCode: '+95' },
    { code: 'MN', name: 'Mongolia', phoneCode: '+976' },
    { code: 'MR', name: 'Mauritania', phoneCode: '+222' },
    { code: 'MT', name: 'Malta', phoneCode: '+356' },
    { code: 'MU', name: 'Mauritius', phoneCode: '+230' },
    { code: 'MV', name: 'Maldives', phoneCode: '+960' },
    { code: 'MW', name: 'Malawi', phoneCode: '+265' },
    { code: 'MX', name: 'Mexico', phoneCode: '+52' },
    { code: 'MY', name: 'Malaysia', phoneCode: '+60' },
    { code: 'MZ', name: 'Mozambique', phoneCode: '+258' },
    { code: 'NA', name: 'Namibia', phoneCode: '+264' },
    { code: 'NE', name: 'Niger', phoneCode: '+227' },
    { code: 'NG', name: 'Nigeria', phoneCode: '+234' },
    { code: 'NI', name: 'Nicaragua', phoneCode: '+505' },
    { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
    { code: 'NO', name: 'Norway', phoneCode: '+47' },
    { code: 'NP', name: 'Nepal', phoneCode: '+977' },
    { code: 'NZ', name: 'New Zealand', phoneCode: '+64' },
    { code: 'OM', name: 'Oman', phoneCode: '+968' },
    { code: 'PA', name: 'Panama', phoneCode: '+507' },
    { code: 'PE', name: 'Peru', phoneCode: '+51' },
    { code: 'PG', name: 'Papua New Guinea', phoneCode: '+675' },
    { code: 'PH', name: 'Philippines', phoneCode: '+63' },
    { code: 'PK', name: 'Pakistan', phoneCode: '+92' },
    { code: 'PL', name: 'Poland', phoneCode: '+48' },
    { code: 'PT', name: 'Portugal', phoneCode: '+351' },
    { code: 'PY', name: 'Paraguay', phoneCode: '+595' },
    { code: 'QA', name: 'Qatar', phoneCode: '+974' },
    { code: 'RO', name: 'Romania', phoneCode: '+40' },
    { code: 'RS', name: 'Serbia', phoneCode: '+381' },
    { code: 'RU', name: 'Russia', phoneCode: '+7' },
    { code: 'RW', name: 'Rwanda', phoneCode: '+250' },
    { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966' },
    { code: 'SB', name: 'Solomon Islands', phoneCode: '+677' },
    { code: 'SC', name: 'Seychelles', phoneCode: '+248' },
    { code: 'SD', name: 'Sudan', phoneCode: '+249' },
    { code: 'SE', name: 'Sweden', phoneCode: '+46' },
    { code: 'SG', name: 'Singapore', phoneCode: '+65' },
    { code: 'SI', name: 'Slovenia', phoneCode: '+386' },
    { code: 'SK', name: 'Slovakia', phoneCode: '+421' },
    { code: 'SL', name: 'Sierra Leone', phoneCode: '+232' },
    { code: 'SM', name: 'San Marino', phoneCode: '+378' },
    { code: 'SN', name: 'Senegal', phoneCode: '+221' },
    { code: 'SO', name: 'Somalia', phoneCode: '+252' },
    { code: 'SR', name: 'Suriname', phoneCode: '+597' },
    { code: 'SS', name: 'South Sudan', phoneCode: '+211' },
    { code: 'ST', name: 'São Tomé and Príncipe', phoneCode: '+239' },
    { code: 'SV', name: 'El Salvador', phoneCode: '+503' },
    { code: 'SY', name: 'Syria', phoneCode: '+963' },
    { code: 'SZ', name: 'Eswatini', phoneCode: '+268' },
    { code: 'TD', name: 'Chad', phoneCode: '+235' },
    { code: 'TG', name: 'Togo', phoneCode: '+228' },
    { code: 'TH', name: 'Thailand', phoneCode: '+66' },
    { code: 'TJ', name: 'Tajikistan', phoneCode: '+992' },
    { code: 'TL', name: 'Timor-Leste', phoneCode: '+670' },
    { code: 'TM', name: 'Turkmenistan', phoneCode: '+993' },
    { code: 'TN', name: 'Tunisia', phoneCode: '+216' },
    { code: 'TO', name: 'Tonga', phoneCode: '+676' },
    { code: 'TR', name: 'Turkey', phoneCode: '+90' },
    { code: 'TT', name: 'Trinidad and Tobago', phoneCode: '+1868' },
    { code: 'TV', name: 'Tuvalu', phoneCode: '+688' },
    { code: 'TW', name: 'Taiwan', phoneCode: '+886' },
    { code: 'TZ', name: 'Tanzania', phoneCode: '+255' },
    { code: 'UA', name: 'Ukraine', phoneCode: '+380' },
    { code: 'UG', name: 'Uganda', phoneCode: '+256' },
    { code: 'US', name: 'United States', phoneCode: '+1' },
    { code: 'UY', name: 'Uruguay', phoneCode: '+598' },
    { code: 'UZ', name: 'Uzbekistan', phoneCode: '+998' },
    { code: 'VA', name: 'Vatican City', phoneCode: '+39' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', phoneCode: '+1784' },
    { code: 'VE', name: 'Venezuela', phoneCode: '+58' },
    { code: 'VN', name: 'Vietnam', phoneCode: '+84' },
    { code: 'VU', name: 'Vanuatu', phoneCode: '+678' },
    { code: 'WS', name: 'Samoa', phoneCode: '+685' },
    { code: 'YE', name: 'Yemen', phoneCode: '+967' },
    { code: 'ZA', name: 'South Africa', phoneCode: '+27' },
    { code: 'ZM', name: 'Zambia', phoneCode: '+260' },
    { code: 'ZW', name: 'Zimbabwe', phoneCode: '+263' },
  ];

  const userRole = profile.role;

  const courses = [
    { name: 'Web Development', progress: 75, status: 'In Progress' },
    { name: 'Digital Literacy', progress: 100, status: 'Completed' },
    { name: 'Communication Skills', progress: 45, status: 'In Progress' },
  ];

  const mentees = [
    { name: 'Alice Johnson', course: 'Web Development', progress: 60 },
    { name: 'Bob Chen', course: 'Digital Literacy', progress: 80 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    updateActivity('profile_view');
  };

  const updateActivity = (action: string) => {
    setActivityData(prev => ({
      ...prev,
      profileViews: action === 'profile_view' ? prev.profileViews + 1 : prev.profileViews,
      lastLogin: action === 'login' ? new Date().toLocaleString() : prev.lastLogin,
      previousLogin: action === 'login' ? prev.lastLogin : prev.previousLogin,
      messagesExchanged: action === 'message_sent' ? prev.messagesExchanged + 1 : prev.messagesExchanged,
      totalSessions: action === 'session_booked' ? prev.totalSessions + 1 : prev.totalSessions,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    updateActivity('profile_updated');
    alert('Profile updated successfully!');
  };

  const handlePreviewMode = (mode: string) => {
    setPreviewMode(mode);
    switch (mode) {
      case 'high-contrast':
        updateSettings({ highContrastMode: true });
        break;
      case 'screen-reader':
        updateSettings({ textToSpeechEnabled: true });
        break;
      case 'captions':
        updateSettings({ captionsEnabled: true });
        break;
      default:
        break;
    }
    alert(`Preview mode: ${mode || 'Normal'}`);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setProfile({
        ...profile,
        country: country.name,
        phoneCode: country.phoneCode
      });
      updateActivity('profile_updated');
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile({ ...profile, profilePicture: file });
    }
  };

  const bookSession = () => {
    updateActivity('session_booked');
    alert('Session booked! Activity updated.');
  };

  const sendMessage = () => {
    updateActivity('message_sent');
    alert('Message sent! Activity updated.');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar 
                sx={{ width: 80, height: 80, fontSize: '2rem' }}
                src={profile.profilePicture ? URL.createObjectURL(profile.profilePicture) : undefined}
              >
                {!profile.profilePicture && profile.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              {isEditing && (
                <Button
                  component="label"
                  sx={{ 
                    position: 'absolute', 
                    bottom: -5, 
                    right: -5, 
                    minWidth: 'auto', 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%' 
                  }}
                  variant="contained"
                  size="small"
                >
                  📷
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </Button>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4">{profile.name}</Typography>
              <Chip 
                label={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} 
                color="primary" 
                sx={{ mb: 1 }} 
              />
              <Typography variant="body1" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'outlined' : 'contained'}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Preview Mode Alert */}
      {previewMode && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" onClick={() => handlePreviewMode('')}>
              Exit Preview
            </Button>
          }
        >
          Preview Mode Active: {previewMode}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab icon={<PersonIcon />} label="Personal" />
          <Tab icon={<AccessibilityIcon />} label="Accessibility" />
          {userRole === 'learner' && <Tab icon={<SchoolIcon />} label="Learning" />}
          {userRole === 'mentor' && <Tab icon={<GroupIcon />} label="Mentees" />}
          {userRole === 'administrator' && <Tab icon={<AnalyticsIcon />} label="Admin" />}
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<PreviewIcon />} label="Preview" />
        </Tabs>
      </Box>

      {/* Personal Information Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl sx={{ minWidth: 80 }}>
                        <InputLabel>Code</InputLabel>
                        <Select
                          value={profile.phoneCode}
                          label="Code"
                          disabled={!isEditing}
                          onChange={(e) => setProfile({ ...profile, phoneCode: e.target.value })}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.phoneCode}>
                              {country.code} {country.phoneCode}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Phone Number"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        fullWidth
                        placeholder="(555) 123-4567"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={countries.find(c => c.name === profile.country)?.code || 'US'}
                        label="Country"
                        disabled={!isEditing}
                        onChange={(e) => handleCountryChange(e.target.value)}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                {isEditing && (
                  <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Activity Summary</Typography>
                <Typography variant="body2">Profile Views: {activityData.profileViews}</Typography>
                <Typography variant="body2">Last Login: {activityData.lastLogin}</Typography>
                <Typography variant="body2">Previous: {activityData.previousLogin}</Typography>
                <Typography variant="body2">Member Since: {activityData.memberSince}</Typography>
                <Typography variant="body2">Courses Completed: {activityData.coursesCompleted}</Typography>
                <Typography variant="body2">Total Sessions: {activityData.totalSessions}</Typography>
                <Typography variant="body2">Messages: {activityData.messagesExchanged}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Accessibility Preferences Tab */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Content Preferences</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Preferred Content Type</InputLabel>
                  <Select 
                    value="text" 
                    label="Preferred Content Type"
                    onChange={(e) => alert(`Content preference changed to: ${e.target.value}`)}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="video-captions">Video with Captions</MenuItem>
                    <MenuItem value="sign-language">Sign Language Video</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Display Preferences</Typography>
                <FormControlLabel
                  control={<Switch checked={settings.highContrastMode} onChange={(e) => updateSettings({ highContrastMode: e.target.checked })} />}
                  label="High Contrast Mode"
                />
                <FormControlLabel
                  control={<Switch checked={settings.fontSize === 'large'} onChange={(e) => updateSettings({ fontSize: e.target.checked ? 'large' : 'medium' })} />}
                  label="Large Text Size"
                />
                <FormControlLabel
                  control={<Switch onChange={(e) => alert(`Dyslexia font ${e.target.checked ? 'enabled' : 'disabled'}`)} />}
                  label="Dyslexia-Friendly Font"
                />
                <FormControlLabel
                  control={<Switch onChange={(e) => alert(`Animations ${e.target.checked ? 'reduced' : 'normal'}`)} />}
                  label="Reduce Animations"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Assistance Tools</Typography>
                <FormControlLabel
                  control={<Switch checked={settings.captionsEnabled} onChange={(e) => updateSettings({ captionsEnabled: e.target.checked })} />}
                  label="Always Show Captions"
                />
                <FormControlLabel
                  control={<Switch checked={settings.transcriptsEnabled} onChange={(e) => updateSettings({ transcriptsEnabled: e.target.checked })} />}
                  label="Always Show Transcripts"
                />
                <FormControlLabel
                  control={<Switch checked={settings.textToSpeechEnabled} onChange={(e) => updateSettings({ textToSpeechEnabled: e.target.checked })} />}
                  label="Text-to-Speech Enabled"
                />
                <FormControlLabel
                  control={<Switch checked={settings.keyboardOnlyNavigation} onChange={(e) => updateSettings({ keyboardOnlyNavigation: e.target.checked })} />}
                  label="Keyboard-Only Mode"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Learning Progress Tab (Learners) */}
      {userRole === 'learner' && (
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>My Courses</Typography>
                  {courses.map((course, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">{course.name}</Typography>
                        <Chip label={course.status} color={course.status === 'Completed' ? 'success' : 'primary'} size="small" />
                      </Box>
                      <LinearProgress variant="determinate" value={course.progress} sx={{ mb: 1 }} />
                      <Typography variant="body2">{course.progress}% Complete</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>My Mentor</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>SJ</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{mentorProfile.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{mentorProfile.specialty}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                        {mentorProfile.languages.map((lang) => (
                          <Chip key={lang} label={lang} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                        🟢 {mentorProfile.status}: {mentorProfile.availability}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Last seen: {mentorProfile.lastSeen}
                      </Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 1 }}
                    onClick={sendMessage}
                  >
                    📧 Contact Mentor
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={bookSession}
                  >
                    📅 Book Session
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      )}

      {/* Mentees Tab (Mentors) */}
      {userRole === 'mentor' && (
        <TabPanel value={currentTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Mentees</Typography>
              <List>
                {mentees.map((mentee, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>{mentee.name.split(' ').map(n => n[0]).join('')}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={mentee.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">{mentee.course}</Typography>
                          <LinearProgress variant="determinate" value={mentee.progress} sx={{ mt: 0.5 }} />
                          <Typography variant="caption">{mentee.progress}% Complete</Typography>
                        </Box>
                      }
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => alert(`Opening ${mentee.name}'s profile...`)}
                    >
                      View Profile
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      )}

      {/* Admin Tab (Administrators) */}
      {userRole === 'administrator' && (
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>System Overview</Typography>
                  <Typography variant="body2">Total Learners: 1,247</Typography>
                  <Typography variant="body2">Total Mentors: 89</Typography>
                  <Typography variant="body2">Active Courses: 12</Typography>
                  <Typography variant="body2">Active Groups: 34</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 1 }}
                    onClick={() => alert('Opening User Management Dashboard...')}
                  >
                    User Management
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 1 }}
                    onClick={() => alert('Opening Course Approvals...')}
                  >
                    Course Approvals
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 1 }}
                    onClick={() => alert('Generating Accessibility Report...')}
                  >
                    Accessibility Reports
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => alert('Opening System Settings...')}
                  >
                    System Settings
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      )}

      {/* Security Tab */}
      <TabPanel value={currentTab} index={userRole === 'learner' ? 3 : userRole === 'mentor' ? 3 : 3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Account Security</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Current Password" type="password" fullWidth sx={{ mb: 2 }} />
                <TextField label="New Password" type="password" fullWidth sx={{ mb: 2 }} />
                <TextField label="Confirm Password" type="password" fullWidth sx={{ mb: 2 }} />
                <Button 
                  variant="contained"
                  onClick={() => {
                    // Basic validation would go here
                    alert('Password updated successfully!');
                  }}
                >
                  Update Password
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Login History</Typography>
                <Typography variant="body2">Last login: {activityData.lastLogin}</Typography>
                <Typography variant="body2">Previous: {activityData.previousLogin}</Typography>
                <FormControlLabel
                  control={
                    <Switch 
                      onChange={(e) => {
                        const passwordFields = document.querySelectorAll('input[type="password"]');
                        passwordFields.forEach((field: any) => {
                          field.type = e.target.checked ? 'text' : 'password';
                        });
                        alert(`Password visibility ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  }
                  label="Show password when typing"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Preview Mode Tab */}
      <TabPanel value={currentTab} index={userRole === 'learner' ? 4 : userRole === 'mentor' ? 4 : 4}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Accessibility Preview Mode</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Preview how the platform appears with different accessibility settings.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant={previewMode === 'screen-reader' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => handlePreviewMode('screen-reader')}
                >
                  Screen Reader Mode
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant={previewMode === 'high-contrast' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => handlePreviewMode('high-contrast')}
                >
                  High Contrast Mode
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant={previewMode === 'captions' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => handlePreviewMode('captions')}
                >
                  Caption-Only Mode
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant={previewMode === 'low-vision' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => handlePreviewMode('low-vision')}
                >
                  Low Vision Simulation
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </Container>
  );
};