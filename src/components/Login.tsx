import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { School, LockOutlined, Person, SupervisorAccount, MenuBook } from '@mui/icons-material';
import { useAuth } from '../context/useAuth';
import { useResponsive } from '../utils/responsive';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState('email'); // 'email' or 'id'
  const [userRole, setUserRole] = useState(''); // 'student', 'teacher', 'staff', 'admin'
  const [loginId, setLoginId] = useState(''); // email or ID number
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ loginId?: string; password?: string; userRole?: string }>({});
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const validateForm = (): boolean => {
    const errors: { loginId?: string; password?: string; userRole?: string } = {};
    let isValid = true;

    if (!userRole) {
      errors.userRole = 'Please select your role';
      isValid = false;
    }

    if (!loginId) {
      errors.loginId = loginType === 'email' ? 'Email is required' : 'ID number is required';
      isValid = false;
    } else if (loginType === 'email' && !/\S+@\S+\.\S+/.test(loginId)) {
      errors.loginId = 'Please enter a valid email address';
      isValid = false;
    } else if (loginType === 'id' && loginId.length < 3) {
      errors.loginId = 'ID must be at least 3 characters';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await login(loginId, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <Person />;
      case 'teacher': return <MenuBook />;
      case 'staff': return <SupervisorAccount />;
      case 'admin': return <SupervisorAccount />;
      default: return <Person />;
    }
  };

  const getPlaceholderText = () => {
    if (!userRole) return 'Select your role first';
    
    switch (userRole) {
      case 'student':
        return loginType === 'email' ? 'student@school.edu' : 'Student ID (e.g., STU001)';
      case 'teacher':
        return loginType === 'email' ? 'teacher@school.edu' : 'Teacher ID (e.g., TCH001)';
      case 'staff':
        return loginType === 'email' ? 'staff@school.edu' : 'Staff ID (e.g., STF001)';
      case 'admin':
        return loginType === 'email' ? 'admin@school.edu' : 'Admin ID (e.g., ADM001)';
      default:
        return loginType === 'email' ? 'Enter your email' : 'Enter your ID';
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: isMobile ? 4 : 8,
        px: isMobile ? 2 : 3,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={isMobile ? 0 : 3} 
        sx={{ 
          p: isMobile ? 3 : 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: isMobile ? '100%' : 500,
          bgcolor: isMobile ? 'transparent' : 'background.paper'
        }}
      >
        <School sx={{ fontSize: isMobile ? 32 : 40, color: 'primary.main', mb: 2 }} />
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom align="center">
          School ERP System
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary" align="center">
          Sign in to access your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          {/* Role Selection */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="user-role-label">I am a...</InputLabel>
            <Select
              labelId="user-role-label"
              id="user-role"
              value={userRole}
              label="I am a..."
              onChange={(e) => {
                setUserRole(e.target.value);
                setLoginId(''); // Clear login ID when role changes
                setFormErrors({});
              }}
              error={!!formErrors.userRole}
            >
              <MenuItem value="student">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  Student
                </Box>
              </MenuItem>
              <MenuItem value="teacher">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MenuBook fontSize="small" />
                  Teacher
                </Box>
              </MenuItem>
              <MenuItem value="staff">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupervisorAccount fontSize="small" />
                  Staff
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupervisorAccount fontSize="small" />
                  Administrator
                </Box>
              </MenuItem>
            </Select>
            {formErrors.userRole && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {formErrors.userRole}
              </Typography>
            )}
          </FormControl>

          {/* Login Type Selection */}
          {userRole && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Login with:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Email Address"
                  onClick={() => {
                    setLoginType('email');
                    setLoginId('');
                  }}
                  color={loginType === 'email' ? 'primary' : 'default'}
                  variant={loginType === 'email' ? 'filled' : 'outlined'}
                />
                <Chip
                  label={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ID`}
                  onClick={() => {
                    setLoginType('id');
                    setLoginId('');
                  }}
                  color={loginType === 'id' ? 'primary' : 'default'}
                  variant={loginType === 'id' ? 'filled' : 'outlined'}
                />
              </Stack>
            </Box>
          )}

          {/* Login ID Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="loginId"
            label={loginType === 'email' ? 'Email Address' : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ID`}
            name="loginId"
            autoComplete={loginType === 'email' ? 'email' : 'username'}
            autoFocus={!!userRole}
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            error={!!formErrors.loginId}
            helperText={formErrors.loginId}
            placeholder={getPlaceholderText()}
            disabled={!userRole}
            InputProps={{
              startAdornment: userRole ? getRoleIcon(userRole) : null,
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={!userRole}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <LockOutlined />}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" component="span" color="primary">
                  Sign Up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ width: '100%', my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Quick Demo Login
          </Typography>
        </Divider>

        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setUserRole('admin');
                setLoginType('email');
                setLoginId('admin@school.edu');
                setPassword('admin123');
              }}
              startIcon={<SupervisorAccount />}
              fullWidth
            >
              Demo Admin Login
            </Button>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setUserRole('teacher');
                  setLoginType('id');
                  setLoginId('TCH001');
                  setPassword('teacher123');
                }}
                startIcon={<MenuBook />}
                size="small"
                sx={{ flex: 1 }}
              >
                Teacher Demo
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setUserRole('student');
                  setLoginType('id');
                  setLoginId('STU001');
                  setPassword('student123');
                }}
                startIcon={<Person />}
                size="small"
                sx={{ flex: 1 }}
              >
                Student Demo
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
