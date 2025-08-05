import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper
} from '@mui/material';
import { 
  School, 
  Person, 
  MenuBook, 
  Assignment, 
  Grade,
  AdminPanelSettings,
  AccountCircle,
  Payments,
  People,
  Schedule
} from '@mui/icons-material';
import Students from './components/Students';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Teachers from './components/Teachers';
import Courses from './components/Courses';
import Attendance from './components/Attendance';
import Grades from './components/Grades';
import FeesManagement from './components/FeesManagement';
import ParentsManagement from './components/ParentsManagement';
import TimeTable from './components/TimeTable';
import { AuthContext, AuthProvider } from './context/AuthContext';

const Dashboard = () => {
  const { user, hasEditPermission } = useContext(AuthContext);
  const canEdit = hasEditPermission();
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        School ERP Dashboard
        {user && (
          <Typography variant="subtitle1" component="span" sx={{ ml: 2 }}>
            Welcome, {user.name} ({user.role})
          </Typography>
        )}
      </Typography>
      
      {!canEdit && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography>
            As a {user?.role}, you have read-only access to the system. You can view information but cannot make changes.
          </Typography>
        </Paper>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <School color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Students</Typography>
              <Typography>Manage student records</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/students"
              >
                {canEdit ? "Manage Students" : "View Students"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Person color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Teachers</Typography>
              <Typography>Manage teacher profiles</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/teachers"
              >
                {canEdit ? "Manage Teachers" : "View Teachers"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <MenuBook color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Courses</Typography>
              <Typography>Manage course catalog</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/courses"
              >
                {canEdit ? "Manage Courses" : "View Courses"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Assignment color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Attendance</Typography>
              <Typography>Track attendance records</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/attendance"
              >
                {canEdit ? "Manage Attendance" : "View Attendance"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Grade color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Grades</Typography>
              <Typography>Manage student grades</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/grades"
              >
                {canEdit ? "Manage Grades" : "View Grades"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Payments color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Fees Management</Typography>
              <Typography>Manage student fees</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/fees"
              >
                {canEdit ? "Manage Fees" : "View Fees"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <People color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Parents</Typography>
              <Typography>Manage parent information</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/parents"
              >
                {canEdit ? "Manage Parents" : "View Parents"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Schedule color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Time Table</Typography>
              <Typography>Manage school schedules</Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small"
                component={Link}
                to="/timetable"
              >
                {canEdit ? "Manage Time Table" : "View Time Table"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <AdminPanelSettings color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Admin Panel</Typography>
              <Typography>System administration</Typography>
            </CardContent>
            <CardActions>
              {canEdit ? (
                <Button size="small" component={Link} to="/admin">Access Admin Panel</Button>
              ) : (
                <Button size="small" disabled>Admin Access Only</Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const AppContent = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Admin-only route component
  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated || user?.role !== 'admin') {
      console.log('Unauthorized access attempt to admin route');
      return <Navigate to="/" replace />;
    }
    return children;
  };
  
  // Read-only route component for students and teachers
  const ReadOnlyRoute = ({ children }: { children: JSX.Element }) => {
    const { hasEditPermission } = useContext(AuthContext);
    const childrenWithProps = React.cloneElement(children, { readOnly: !hasEditPermission() });
    return (
      <ProtectedRoute>
        {childrenWithProps}
      </ProtectedRoute>
    );
  };
  
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <School sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              School ERP System
            </Typography>
            
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/">Dashboard</Button>
                {user?.role === 'admin' && (
                  <Button color="inherit" component={Link} to="/admin">Admin</Button>
                )}
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        
        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ReadOnlyRoute>
                <Students />
              </ReadOnlyRoute>
            } />
            
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            
            <Route path="/teachers" element={
              <ReadOnlyRoute>
                <Teachers />
              </ReadOnlyRoute>
            } />
            
            <Route path="/courses" element={
              <ReadOnlyRoute>
                <Courses />
              </ReadOnlyRoute>
            } />
            
            <Route path="/attendance" element={
              <ReadOnlyRoute>
                <Attendance />
              </ReadOnlyRoute>
            } />
            
            <Route path="/grades" element={
              <ReadOnlyRoute>
                <Grades />
              </ReadOnlyRoute>
            } />
            
            <Route path="/fees" element={
              <ReadOnlyRoute>
                <FeesManagement />
              </ReadOnlyRoute>
            } />
            
            <Route path="/parents" element={
              <ReadOnlyRoute>
                <ParentsManagement />
              </ReadOnlyRoute>
            } />
            
            <Route path="/timetable" element={
              <ReadOnlyRoute>
                <TimeTable />
              </ReadOnlyRoute>
            } />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
