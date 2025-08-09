import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  School, 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person,
  MenuBook,
  Assignment,
  Grade,
  Settings,
  Logout,
  Language,
  Schedule,
  MonetizationOn
} from '@mui/icons-material';
import { useState } from 'react';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import SimpleBrowser from './components/SimpleBrowser';
import Students from './components/Students';
import Teachers from './components/Teachers';
import RolesManagement from './components/RolesManagement';
import Courses from './components/Courses';
import UserApprovalManagement from './components/UserApprovalManagement';
import TimeTable from './components/TimeTable';
import Attendance from './components/Attendance';
import Grades from './components/Grades';
import SchoolSetup from './components/SchoolSetup';
import FeesManagement from './components/FeesManagement';

// Import AuthProvider and useAuth
import AuthProvider from './context/AuthContext';
import { useAuth } from './context/useAuth';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Loading...</Typography>
    </Box>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Loading...</Typography>
    </Box>;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Navigation component
const Navigation = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
  };
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Students', icon: <Person />, path: '/students' },
    { text: 'Teachers', icon: <Person />, path: '/teachers' },
    { text: 'Courses', icon: <MenuBook />, path: '/courses' },
    { text: 'TimeTable', icon: <Schedule />, path: '/timetable' },
    { text: 'Attendance', icon: <Assignment />, path: '/attendance' },
    { text: 'Grades', icon: <Grade />, path: '/grades' },
    { text: 'Fees', icon: <MonetizationOn />, path: '/fees' },
    { text: 'Browser', icon: <Language />, path: '/browser' },
    { text: 'Admin Panel', icon: <Settings />, path: '/admin', adminOnly: true },
  ];
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              School ERP System
            </Link>
          </Typography>
          
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.name[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
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
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as <strong>{user.name}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose} component={Link} to="/dashboard">Dashboard</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleClose} component={Link} to="/admin">Admin Panel</MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <School sx={{ mr: 1 }} />
            <Typography variant="h6">School ERP</Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              (!item.adminOnly || user?.role === 'admin') && (
                <ListItem button key={item.text} component={Link} to={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Navigation />
      
      <Box sx={{ mt: 3, px: 3 }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/browser" element={<ProtectedRoute><SimpleBrowser /></ProtectedRoute>} />
          
          {/* Placeholder routes for future implementation */}
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
          <Route path="/fees" element={<ProtectedRoute><FeesManagement /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><TimeTable /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><div>Admin Panel - Coming Soon</div></AdminRoute>} />
          <Route path="/admin/user-approvals" element={<AdminRoute><UserApprovalManagement /></AdminRoute>} />
          <Route path="/roles" element={<AdminRoute><RolesManagement /></AdminRoute>} />
          <Route path="/school-setup/*" element={<AdminRoute><SchoolSetup /></AdminRoute>} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
