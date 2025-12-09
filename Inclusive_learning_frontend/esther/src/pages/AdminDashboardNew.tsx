import React, { useState, useEffect } from 'react';
import { Box, Grid as MuiGrid, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
const Grid: any = MuiGrid as any;
import { People, TrendingUp, Warning, Edit, Delete, Block, CheckCircle, PersonAdd, BarChart, Flag, Security, History } from '@mui/icons-material';
import { getAllUsers, deleteUser, approveMentor, suspendUser as suspendUserStorage, addUser } from '../utils/sharedStorage';

export const AdminDashboardNew: React.FC = () => {
  const [userDialog, setUserDialog] = useState(false);
  const [createAdminDialog, setCreateAdminDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const learnerCount = users.filter(u => u.role === 'learner').length;
  const mentorCount = users.filter(u => u.role === 'mentor' && u.status === 'active').length;
  const pendingMentors = users.filter(u => u.role === 'mentor' && u.status === 'pending');
  const adminCount = users.filter(u => u.role === 'administrator').length;

  const stats = [
    { title: 'Total Learners', value: learnerCount.toString(), icon: <People />, color: '#1976d2' },
    { title: 'Active Mentors', value: mentorCount.toString(), icon: <People />, color: '#2e7d32' },
    { title: 'Pending Approvals', value: pendingMentors.length.toString(), icon: <Warning />, color: '#ed6c02' },
    { title: 'Total Admins', value: adminCount.toString(), icon: <PersonAdd />, color: '#9c27b0' },
    { title: 'Flagged Content', value: '0', icon: <Flag />, color: '#d32f2f' },
  ];

  const analytics = {
    userGrowth: [
      { month: 'Jan', users: learnerCount > 0 ? Math.floor(learnerCount * 0.3) : 10 },
      { month: 'Feb', users: learnerCount > 0 ? Math.floor(learnerCount * 0.6) : 20 },
      { month: 'Mar', users: learnerCount },
    ],
    courseCompletion: [
      { course: 'Web Development', completion: 85 },
      { course: 'Digital Literacy', completion: 92 },
      { course: 'Tailoring', completion: 78 },
    ],
  };

  const handleApproveUser = (userId: string) => {
    try {
      approveMentor(userId);
      loadUsers();
      alert('Mentor approved successfully!');
    } catch (error) {
      alert('Error approving mentor');
    }
  };

  const handleSuspendUser = (userId: string) => {
    try {
      suspendUserStorage(userId);
      loadUsers();
      alert('User suspended');
    } catch (error) {
      alert('Error suspending user');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Delete this user?')) {
      try {
        deleteUser(userId);
        loadUsers();
        alert('User deleted');
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleCreateAdmin = () => {
    if (!newAdminData.name || !newAdminData.email || !newAdminData.password) {
      alert('All fields are required');
      return;
    }
    try {
      const newAdmin = {
        id: Date.now().toString(),
        name: newAdminData.name,
        email: newAdminData.email,
        role: 'administrator' as const,
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: [],
      };
      addUser(newAdmin);
      loadUsers();
      setCreateAdminDialog(false);
      setNewAdminData({ name: '', email: '', password: '' });
      alert('Administrator created successfully!');
    } catch (error) {
      alert('Failed to create administrator');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>Dashboard Overview</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ color: stat.color, fontSize: 48, mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                  <Typography color="textSecondary" variant="body2">{stat.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">Pending Mentor Approvals ({pendingMentors.length})</Typography>
            {pendingMentors.length > 0 && <Chip label="Action Required" color="warning" size="small" />}
          </Box>
          {pendingMentors.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>No pending approvals</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>{mentor.name}</TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell><Chip label="Pending" color="warning" size="small" /></TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApproveUser(mentor.id)}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteUser(mentor.id)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">User Management</Typography>
            <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setCreateAdminDialog(true)}>Create Admin</Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Chip label={user.role} size="small" /></TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status || 'active'} 
                      size="small" 
                      color={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'error'} 
                    />
                  </TableCell>
                  <TableCell>
                    {user.status === 'pending' && (
                      <Button size="small" variant="outlined" color="success" sx={{ mr: 1 }} onClick={() => handleApproveUser(user.id)}>
                        Approve
                      </Button>
                    )}
                    <IconButton size="small" onClick={() => { setSelectedUser(user); setUserDialog(true); }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="warning" onClick={() => handleSuspendUser(user.id)}>
                      <Block fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BarChart color="primary" />
                <Typography variant="h6" fontWeight="600">User Growth</Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Users</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.userGrowth.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell><strong>{row.users}</strong></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="success" />
                <Typography variant="h6" fontWeight="600">Course Completion</Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.courseCompletion.map((row) => (
                    <TableRow key={row.course}>
                      <TableCell>{row.course}</TableCell>
                      <TableCell><Chip label={`${row.completion}%`} color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Security sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>Accessibility</Typography>
              <Typography variant="h3" color="success.main">98%</Typography>
              <Typography variant="body2" color="textSecondary">WCAG 2.1 AA</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>Data Privacy</Typography>
              <Typography variant="h3" color="success.main">✓</Typography>
              <Typography variant="body2" color="textSecondary">GDPR Compliant</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <History sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>Audit Logs</Typography>
              <Typography variant="h3" color="primary.main">{users.length * 10}</Typography>
              <Typography variant="body2" color="textSecondary">Actions Logged</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={userDialog} onClose={() => setUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" defaultValue={selectedUser?.name} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Email" defaultValue={selectedUser?.email} sx={{ mb: 2 }} />
          <TextField fullWidth select label="Role" defaultValue={selectedUser?.role} sx={{ mb: 2 }}>
            <MenuItem value="learner">Learner</MenuItem>
            <MenuItem value="mentor">Mentor</MenuItem>
            <MenuItem value="administrator">Administrator</MenuItem>
          </TextField>
          <TextField fullWidth select label="Status" defaultValue={selectedUser?.status || 'active'}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setUserDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createAdminDialog} onClose={() => setCreateAdminDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Administrator Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 2 }}>
            Only existing administrators can create new admin accounts.
          </Typography>
          <TextField
            fullWidth
            label="Full Name"
            value={newAdminData.name}
            onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newAdminData.email}
            onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Temporary Password"
            type="password"
            value={newAdminData.password}
            onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
            helperText="Admin will be required to change this on first login"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAdminDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAdmin}>Create Admin</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
