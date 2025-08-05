import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  People as PeopleIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface PendingUser {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: 'teacher' | 'student';
  requestDate: string;
  approved: boolean;
}

const UserManagement: React.FC = () => {
  const { approvePendingUser, rejectPendingUser, getPendingUsers } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    const pending = getPendingUsers();
    setPendingUsers(pending);
  };

  const handleApprove = (userId: number, username: string) => {
    approvePendingUser(userId);
    setMessage(`User "${username}" has been approved successfully!`);
    loadPendingUsers();
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReject = (userId: number, username: string) => {
    rejectPendingUser(userId);
    setMessage(`Registration request for "${username}" has been rejected.`);
    loadPendingUsers();
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const getUserTypeColor = (userType: string) => {
    return userType === 'teacher' ? 'primary' : 'secondary';
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              User Management
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {pendingUsers.length}
                </Typography>
                <Typography variant="body2">Pending Requests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main">
                  {pendingUsers.filter(u => u.userType === 'teacher').length}
                </Typography>
                <Typography variant="body2">Teacher Requests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary.main">
                  {pendingUsers.filter(u => u.userType === 'student').length}
                </Typography>
                <Typography variant="body2">Student Requests</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
      </Box>

      {/* Pending Registrations Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <PendingIcon sx={{ mr: 1 }} />
          Pending Registration Requests
        </Typography>

        {pendingUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No pending registration requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All registration requests have been processed.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>User Type</strong></TableCell>
                  <TableCell><strong>Request Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {user.username}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} 
                        color={getUserTypeColor(user.userType)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApprove(user.id, user.username)}
                        title="Approve Registration"
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleReject(user.id, user.username)}
                        title="Reject Registration"
                      >
                        <RejectIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Instructions */}
      <Paper sx={{ p: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          📋 User Management Instructions
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Approve:</strong> Click the green checkmark to approve a registration request
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Reject:</strong> Click the red X to reject a registration request
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Teacher Accounts:</strong> Can access teacher-specific features
        </Typography>
        <Typography variant="body2">
          • <strong>Student Accounts:</strong> Have limited access to view-only features
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserManagement;
