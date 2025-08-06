import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Stack,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  TablePagination
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  MenuBook,
  SupervisorAccount,
  Email,
  Phone,
  AccessTime,
  AdminPanelSettings,
  School,
  Refresh
} from '@mui/icons-material';
import { apiClient } from '../services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: 'student' | 'teacher' | 'staff';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  profile?: {
    phone?: string;
  };
  studentInfo?: {
    studentId: string;
    grade: string;
    section: string;
  };
  teacherInfo?: {
    employeeId: string;
    department: string;
    subject: string[];
  };
  staffInfo?: {
    employeeId: string;
    department: string;
    position: string;
  };
}

interface ApprovalStats {
  overall: {
    pending: number;
    approved: number;
    rejected: number;
  };
  byUserType: {
    [key: string]: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

const UserApprovalManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'student' | 'teacher' | 'staff'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filter, userTypeFilter, page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const params: any = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      if (filter !== 'all') params.status = filter;
      if (userTypeFilter !== 'all') params.userType = userTypeFilter;

      const response = await apiClient.admin.getUsers(params);
      setUsers(response.data.data.users);
    } catch (error) {
      showAlert('error', 'Failed to fetch users');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.admin.getApprovalStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await apiClient.admin.approveUser(userId);
      showAlert('success', 'User approved successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      showAlert('error', 'Failed to approve user');
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      showAlert('error', 'Please provide a rejection reason');
      return;
    }

    try {
      await apiClient.admin.rejectUser(selectedUser._id, {
        reason: rejectionReason
      });
      showAlert('success', 'User rejected successfully');
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (error) {
      showAlert('error', 'Failed to reject user');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) {
      showAlert('error', 'Please select users to approve');
      return;
    }

    try {
      await apiClient.admin.bulkApprove({
        userIds: selectedUsers
      });
      showAlert('success', `${selectedUsers.length} users approved successfully`);
      setSelectedUsers([]);
      fetchUsers();
      fetchStats();
    } catch (error) {
      showAlert('error', 'Failed to bulk approve users');
    }
  };

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case 'student': return <Person />;
      case 'teacher': return <MenuBook />;
      case 'staff': return <SupervisorAccount />;
      default: return <Person />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const renderUserDetails = (user: User) => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Personal Information</Typography>
            <Typography variant="body2"><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
            <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body2"><strong>Username:</strong> {user.username}</Typography>
            {user.profile?.phone && (
              <Typography variant="body2"><strong>Phone:</strong> {user.profile.phone}</Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} Information
            </Typography>
            
            {user.userType === 'student' && user.studentInfo && (
              <>
                <Typography variant="body2"><strong>Student ID:</strong> {user.studentInfo.studentId}</Typography>
                <Typography variant="body2"><strong>Grade:</strong> {user.studentInfo.grade}</Typography>
                <Typography variant="body2"><strong>Section:</strong> {user.studentInfo.section}</Typography>
              </>
            )}
            
            {user.userType === 'teacher' && user.teacherInfo && (
              <>
                <Typography variant="body2"><strong>Employee ID:</strong> {user.teacherInfo.employeeId}</Typography>
                <Typography variant="body2"><strong>Department:</strong> {user.teacherInfo.department}</Typography>
                <Typography variant="body2"><strong>Subjects:</strong> {user.teacherInfo.subject?.join(', ')}</Typography>
              </>
            )}
            
            {user.userType === 'staff' && user.staffInfo && (
              <>
                <Typography variant="body2"><strong>Employee ID:</strong> {user.staffInfo.employeeId}</Typography>
                <Typography variant="body2"><strong>Department:</strong> {user.staffInfo.department}</Typography>
                <Typography variant="body2"><strong>Position:</strong> {user.staffInfo.position}</Typography>
              </>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Registration Details</Typography>
            <Typography variant="body2"><strong>Registration Date:</strong> {new Date(user.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body2"><strong>Status:</strong> {user.approvalStatus}</Typography>
            
            {user.approvedBy && (
              <Typography variant="body2">
                <strong>Processed By:</strong> {user.approvedBy.firstName} {user.approvedBy.lastName} ({user.approvedBy.email})
              </Typography>
            )}
            
            {user.approvedAt && (
              <Typography variant="body2">
                <strong>Processed At:</strong> {new Date(user.approvedAt).toLocaleString()}
              </Typography>
            )}
            
            {user.rejectionReason && (
              <Typography variant="body2" color="error">
                <strong>Rejection Reason:</strong> {user.rejectionReason}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
          User Approval Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            fetchUsers();
            fetchStats();
          }}
        >
          Refresh
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">
                  <Badge badgeContent={stats.overall.pending} color="warning">
                    <AccessTime />
                  </Badge>
                  <Box component="span" sx={{ ml: 1 }}>Pending</Box>
                </Typography>
                <Typography variant="h4">{stats.overall.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  <CheckCircle sx={{ mr: 1 }} />
                  Approved
                </Typography>
                <Typography variant="h4">{stats.overall.approved}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">
                  <Cancel sx={{ mr: 1 }} />
                  Rejected
                </Typography>
                <Typography variant="h4">{stats.overall.rejected}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary.main">
                  <School sx={{ mr: 1 }} />
                  Total
                </Typography>
                <Typography variant="h4">
                  {stats.overall.pending + stats.overall.approved + stats.overall.rejected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              label="Status"
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={userTypeFilter}
              label="User Type"
              onChange={(e) => setUserTypeFilter(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>

          {selectedUsers.length > 0 && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={handleBulkApprove}
            >
              Approve Selected ({selectedUsers.length})
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(user => user._id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getUserIcon(user.userType)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getUserIcon(user.userType)}
                    label={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ mr: 0.5, fontSize: 16 }} />
                      {user.email}
                    </Typography>
                    {user.profile?.phone && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 0.5, fontSize: 16 }} />
                        {user.profile.phone}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.approvalStatus}
                    color={getStatusColor(user.approvalStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    {user.approvalStatus === 'pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(user._id)}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedUser(user);
                              setRejectDialogOpen(true);
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={-1}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* View User Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          User Details
          {selectedUser && (
            <Chip
              label={selectedUser.approvalStatus}
              color={getStatusColor(selectedUser.approvalStatus) as any}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedUser && renderUserDetails(selectedUser)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedUser?.approvalStatus === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  handleApprove(selectedUser._id);
                  setViewDialogOpen(false);
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  setViewDialogOpen(false);
                  setRejectDialogOpen(true);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject User Registration</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to reject the registration for{' '}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
            ?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Reject User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserApprovalManagement;
