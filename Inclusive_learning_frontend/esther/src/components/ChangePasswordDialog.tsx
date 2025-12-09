import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Typography } from '@mui/material';
import { useAuthStore } from '../store/authStore';

interface ChangePasswordDialogProps {
  open: boolean;
  required?: boolean;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, required = false }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { changePassword, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      alert('Password changed successfully!');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <Dialog open={open} onClose={required ? undefined : () => {}} maxWidth="sm" fullWidth disableEscapeKeyDown={required}>
      <DialogTitle>
        {required ? 'Change Password Required' : 'Change Password'}
      </DialogTitle>
      <DialogContent>
        {required && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            For security reasons, you must change your password before continuing.
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            helperText="Minimum 8 characters"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        {!required && <Button onClick={() => window.history.back()}>Cancel</Button>}
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
