import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Snackbar,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Person,
  School,
  Settings,
  Security,
  Dashboard,
  Group,
  Notifications,
  Add,
  Delete,
  Edit,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

// Initial user data - to be replaced with API call in production
const initialUsers = [
  { id: 1, name: 'System Administrator', email: 'admin@example.com', role: 'Admin', active: true },
  { id: 2, name: 'Teacher Account', email: 'teacher@example.com', role: 'Teacher', active: true },
  { id: 3, name: 'Staff Account', email: 'staff@example.com', role: 'Staff', active: true },
  { id: 4, name: 'Parent Account', email: 'parent@example.com', role: 'Parent', active: false },
];

// Initial system settings - to be replaced with API call in production
const initialSettings = [
  { id: 1, name: 'Enable SMS Notifications', value: true },
  { id: 2, name: 'Enable Email Notifications', value: true },
  { id: 3, name: 'Allow Parent Login', value: true },
  { id: 4, name: 'Allow Teacher Self Registration', value: false },
  { id: 5, name: 'Maintenance Mode', value: false },
];

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState(initialUsers);
  const [settings, setSettings] = useState(initialSettings);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    userId: null as string | null,
    action: '' as 'approve' | 'reject' | 'delete' | ''
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Teacher',
    active: true
  });
  
  // New state for student/teacher details dialog
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    title: '',
    type: '' as 'student' | 'teacher'
  });
  
  const { pendingUsers, approveUser, rejectUser } = useContext(AuthContext);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingToggle = (settingId: number) => {
    const updatedSetting = settings.find(s => s.id === settingId);
    setSettings(settings.map(setting => 
      setting.id === settingId ? { ...setting, value: !setting.value } : setting
    ));
    
    setSnackbar({
      open: true,
      message: `Setting "${updatedSetting?.name}" has been ${!updatedSetting?.value ? 'enabled' : 'disabled'}`,
      severity: 'success'
    });
  };

  const handleDeleteUser = (userId: string | number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      userId: userId.toString(),
      action: 'delete'
    });
  };

  const handleToggleUserStatus = (userId: number) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    setSnackbar({
      open: true,
      message: `User ${targetUser?.name} has been ${!targetUser?.active ? 'activated' : 'deactivated'}`,
      severity: 'info'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleRoleChange = (e: any) => {
    setNewUser({
      ...newUser,
      role: e.target.value,
    });
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newUserId = Math.max(...users.map(u => u.id)) + 1;
      setUsers([...users, { ...newUser, id: newUserId }]);
      setNewUser({
        name: '',
        email: '',
        role: 'Teacher',
        active: true
      });
      setSnackbar({
        open: true,
        message: 'User added successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
    }
  };
  
  const handleApproveUser = (userId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Approve User Registration',
      message: 'Are you sure you want to approve this user? They will be able to login to the system immediately.',
      userId: userId,
      action: 'approve'
    });
  };
  
  const handleRejectUser = (userId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Reject User Registration',
      message: 'Are you sure you want to reject this user? Their registration request will be removed.',
      userId: userId,
      action: 'reject'
    });
  };
  
  // Function to handle opening details dialog
  const handleOpenDetailsDialog = (type: 'student' | 'teacher') => {
    setDetailsDialog({
      open: true,
      title: type === 'student' ? 'Student Details' : 'Teacher Details',
      type
    });
  };

  // Function to close details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialog({
      open: false,
      title: '',
      type: 'student'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        <Typography variant="h4" sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          Admin Panel
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin panel tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Dashboard />} label="Dashboard" {...a11yProps(0)} />
            <Tab icon={<Person />} label="User Management" {...a11yProps(1)} />
            <Tab 
              icon={<CheckCircle />} 
              label={
                <Badge 
                  badgeContent={pendingUsers.length} 
                  color="warning"
                  sx={{ '& .MuiBadge-badge': { right: -10, top: 0 } }}
                >
                  User Approvals
                </Badge>
              } 
              {...a11yProps(2)} 
            />
            <Tab icon={<Settings />} label="System Settings" {...a11yProps(3)} />
            <Tab icon={<Security />} label="Roles & Permissions" {...a11yProps(4)} />
            <Tab icon={<School />} label="School Setup" {...a11yProps(5)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Group color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Users</Typography>
                  <Typography variant="h4">{users.length}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setTabValue(1)}>Manage Users</Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={pendingUsers.length > 0 ? { borderColor: 'warning.main', borderWidth: 2, borderStyle: 'solid' } : {}}>
                <CardContent>
                  <CheckCircle color={pendingUsers.length > 0 ? "warning" : "primary"} sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Pending Approvals</Typography>
                  <Typography variant="h4">{pendingUsers.length}</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => setTabValue(2)}
                    color={pendingUsers.length > 0 ? "warning" : "primary"}
                  >
                    {pendingUsers.length > 0 ? "Review Requests" : "Check Requests"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <School color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Students</Typography>
                  <Typography variant="h4">450</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                    onClick={() => handleOpenDetailsDialog('student')}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Person color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Teachers</Typography>
                  <Typography variant="h4">32</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                    onClick={() => handleOpenDetailsDialog('teacher')}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Notifications color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Notifications</Typography>
                  <Typography variant="h4">5</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Notifications feature coming soon!',
                        severity: 'info'
                      });
                    }}
                  >
                    View All
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            System Status
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">Recent Activities</Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="System backup completed" 
                      secondary="Today, 08:30 AM" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="New teacher account created" 
                      secondary="Yesterday, 04:15 PM" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="System settings updated" 
                      secondary="Yesterday, 11:20 AM" 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">System Information</Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="System Version" 
                      secondary="v2.5.0" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Last Update" 
                      secondary="July 28, 2025" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Database Status" 
                      secondary="Connected" 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add New User
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Teacher">Teacher</MenuItem>
                    <MenuItem value="Staff">Staff</MenuItem>
                    <MenuItem value="Parent">Parent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddUser}
                  fullWidth
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper>
            <List>
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText 
                      primary={user.name} 
                      secondary={`${user.email} | Role: ${user.role}`} 
                    />
                    <Switch
                      edge="end"
                      checked={user.active}
                      onChange={() => handleToggleUserStatus(user.id)}
                      inputProps={{
                        'aria-labelledby': `user-list-${user.id}`,
                      }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            User Approval Requests
          </Typography>
          
          {pendingUsers.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No pending approval requests.
              </Typography>
            </Paper>
          ) : (
            <Paper>
              <List>
                {pendingUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="approve"
                            color="success"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="reject"
                            color="error"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary={user.name} 
                        secondary={`${user.email} | Role: ${user.role}`} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            System Settings
          </Typography>
          
          <Paper>
            <List>
              {settings.map((setting) => (
                <React.Fragment key={setting.id}>
                  <ListItem>
                    <ListItemText 
                      primary={setting.name} 
                    />
                    <Switch
                      edge="end"
                      checked={setting.value}
                      onChange={() => handleSettingToggle(setting.id)}
                      inputProps={{
                        'aria-labelledby': `setting-list-${setting.id}`,
                      }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Roles & Permissions
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            <Typography>
              Configure access control and permissions for different user roles in the system.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              This section will include:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Role management (Admin, Teacher, Staff, Parent, etc.)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Permission assignment for each role" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Feature access control" />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography color="text.secondary">
                This feature is under development and will be available in the next update.
              </Typography>
            </Box>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            School Setup
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            <Typography>
              Configure school-specific settings and customizations.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              This section will include:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="School profile and contact information" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="Academic year configuration" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="Class and section setup" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="Subject configuration" />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography color="text.secondary">
                This feature is under development and will be available in the next update.
              </Typography>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({...confirmDialog, open: false})}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({...confirmDialog, open: false})} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (confirmDialog.action === 'approve' && confirmDialog.userId) {
                approveUser(confirmDialog.userId);
                setSnackbar({
                  open: true,
                  message: 'User has been approved successfully',
                  severity: 'success'
                });
              } else if (confirmDialog.action === 'reject' && confirmDialog.userId) {
                rejectUser(confirmDialog.userId);
                setSnackbar({
                  open: true,
                  message: 'User has been rejected',
                  severity: 'info'
                });
              } else if (confirmDialog.action === 'delete' && confirmDialog.userId) {
                handleDeleteUser(Number(confirmDialog.userId));
                setSnackbar({
                  open: true,
                  message: 'User has been deleted',
                  severity: 'info'
                });
              }
              setConfirmDialog({...confirmDialog, open: false});
            }} 
            color={confirmDialog.action === 'reject' || confirmDialog.action === 'delete' ? "error" : "primary"}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Details Dialog for Students/Teachers */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{detailsDialog.title}</DialogTitle>
        <DialogContent>
          {detailsDialog.type === 'student' ? (
            <Box>
              <Typography variant="h6" gutterBottom>Student Statistics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Total Students" secondary="450" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Active Students" secondary="430" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Inactive Students" secondary="20" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="New Enrollments (This Month)" secondary="15" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Graduating Students" secondary="45" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Average Attendance Rate" secondary="92%" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleCloseDetailsDialog();
                    // Navigate to Students component
                    window.location.href = '#/students';
                  }}
                >
                  Go to Student Management
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>Teacher Statistics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Total Teachers" secondary="32" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Full-time Teachers" secondary="28" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Part-time Teachers" secondary="4" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="New Hires (This Month)" secondary="2" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Department Heads" secondary="5" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Average Class Load" secondary="4.5 classes" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleCloseDetailsDialog();
                    // Navigate to Teachers component
                    window.location.href = '#/teachers';
                  }}
                >
                  Go to Teacher Management
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
