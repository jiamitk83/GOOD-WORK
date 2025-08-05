import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert
} from '@mui/material';
import {
  School,
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'teacher',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleRoleChange = (e: any) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else {
      newErrors.email = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else {
      newErrors.password = '';
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Admin login for demonstration purposes
      if (formData.role === 'admin' && formData.email === 'admin@example.com' && formData.password === 'admin123') {
        const loginSuccess = login({
          id: '1',
          name: 'System Administrator',
          email: formData.email,
          role: 'admin',
          approved: true
        });
        
        if (loginSuccess) {
          navigate('/admin');
        }
        return;
      }
      
      // Check approved users from localStorage
      const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
      const approvedUser = approvedUsers.find((user: any) => 
        user.email === formData.email && 
        user.role === formData.role
      );
      
      if (approvedUser) {
        // In a real implementation, we would verify the password hash here
        const loginSuccess = login(approvedUser);
        if (loginSuccess) {
          navigate('/');
        }
        return;
      }
      
      // Check if user is pending approval
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const isPending = pendingUsers.some((user: any) => 
        user.email === formData.email && 
        user.role === formData.role
      );
      
      if (isPending) {
        setLoginError('Your account is pending admin approval. Please try again later.');
      } else {
        // If we get here, login failed
        setLoginError('Invalid email, password, or role combination');
      }
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <School color="primary" sx={{ fontSize: 40 }} />
          </Box>
          
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            School ERP System
          </Typography>
          
          <Typography component="h2" variant="h6" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign In
          </Typography>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Login As</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={formData.role}
                label="Login As"
                onChange={handleRoleChange}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
              </Select>
              <FormHelperText>
                Select your role in the school
              </FormHelperText>
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
            <Grid container>
              <Grid item xs>
                <MuiLink component={Link} to="/forgot-password" variant="body2">
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={Link} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
              Please contact your administrator if you need assistance.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 12 }}>
              Admin Access: admin@example.com / admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
