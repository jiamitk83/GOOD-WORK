import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  School, 
  Logout,
  AccountCircle,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MenuBook as BookIcon,
  Quiz as ExamIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Assignment as AttendanceIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Courses from './components/Courses';
import Examinations from './components/Examinations';
import FeesManagement from './components/FeesManagement';
import UserManagement from './components/UserManagement';
import Attendance from './components/Attendance';

const AppContent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <School sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              School ERP System
            </Typography>
            
            {/* Navigation Links */}
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              startIcon={<DashboardIcon />}
              sx={{ mr: 1 }}
            >
              Dashboard
            </Button>
            
            {(user?.userType === 'admin' || user?.userType === 'teacher') && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/students"
                startIcon={<School />}
                sx={{ mr: 1 }}
              >
                Students
              </Button>
            )}
            
            {user?.userType === 'admin' && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/teachers"
                startIcon={<PersonIcon />}
                sx={{ mr: 1 }}
              >
                Teachers
              </Button>
            )}
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/courses"
              startIcon={<BookIcon />}
              sx={{ mr: 1 }}
            >
              Courses
            </Button>

            {(user?.userType === 'admin' || user?.userType === 'teacher') && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/examinations"
                startIcon={<ExamIcon />}
                sx={{ mr: 1 }}
              >
                Examinations
              </Button>
            )}

            {user?.userType === 'admin' && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/fees"
                startIcon={<MoneyIcon />}
                sx={{ mr: 1 }}
              >
                Fees
              </Button>
            )}
            
            {user?.userType === 'admin' && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/users"
                startIcon={<PeopleIcon />}
                sx={{ mr: 1 }}
              >
                Users
              </Button>
            )}
            
            {(user?.userType === 'admin' || user?.userType === 'teacher') && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/attendance"
                startIcon={<AttendanceIcon />}
                sx={{ mr: 1 }}
              >
                Attendance
              </Button>
            )}
            <Box sx={{ ml: 2 }}>
              <Button
                color="inherit"
                onClick={handleMenu}
                startIcon={<AccountCircle />}
              >
                {user?.username}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar sx={{ mr: 2, width: 24, height: 24 }}>
                    {user?.username.charAt(0).toUpperCase()}
                  </Avatar>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/examinations" element={<Examinations />} />
            <Route path="/fees" element={<FeesManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/attendance" element={<Attendance />} />
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
