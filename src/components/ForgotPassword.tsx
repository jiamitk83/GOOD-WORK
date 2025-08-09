import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { School, Email, Person, MenuBook, SupervisorAccount } from '@mui/icons-material';

const ForgotPassword: React.FC = () => {
  const [userRole, setUserRole] = useState('');
  const [resetType, setResetType] = useState('email'); // 'email' or 'id'
  const [identifier, setIdentifier] = useState(''); // email or ID number
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ userRole?: string; identifier?: string }>({});
  
  const validateForm = (): boolean => {
    const errors: { userRole?: string; identifier?: string } = {};
    let isValid = true;

    if (!userRole) {
      errors.userRole = 'Please select your role';
      isValid = false;
    }

    if (!identifier) {
      errors.identifier = resetType === 'email' ? 'Email is required' : 'ID number is required';
      isValid = false;
    } else if (resetType === 'email' && !/\S+@\S+\.\S+/.test(identifier)) {
      errors.identifier = 'Please enter a valid email address';
      isValid = false;
    } else if (resetType === 'id' && identifier.length < 3) {
      errors.identifier = 'ID must be at least 3 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would call an API endpoint here
      // For production, we'll call the appropriate API endpoint
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
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
        return resetType === 'email' ? 'student@school.edu' : 'Student ID (e.g., STU001)';
      case 'teacher':
        return resetType === 'email' ? 'teacher@school.edu' : 'Teacher ID (e.g., TCH001)';
      case 'staff':
        return resetType === 'email' ? 'staff@school.edu' : 'Staff ID (e.g., STF001)';
      case 'admin':
        return resetType === 'email' ? 'admin@school.edu' : 'Admin ID (e.g., ADM001)';
      default:
        return resetType === 'email' ? 'Enter your email' : 'Enter your ID';
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary" textAlign="center">
          Enter your email address and we'll send you instructions to reset your password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions have been sent to your {resetType === 'email' ? 'email' : 'registered contact information'}.
            </Alert>
            <Typography variant="body1" paragraph>
              {resetType === 'email' 
                ? 'Please check your inbox and follow the instructions to reset your password.'
                : 'Please check your registered email address for password reset instructions.'
              }
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/login"
                variant="contained"
              >
                Return to Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSuccess(false);
                  setIdentifier('');
                  setUserRole('');
                  setError(null);
                }}
              >
                Reset Another Account
              </Button>
            </Stack>
          </Box>
        ) : (
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
                  setIdentifier(''); // Clear identifier when role changes
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

            {/* Reset Type Selection */}
            {userRole && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reset password using:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Email Address"
                    onClick={() => {
                      setResetType('email');
                      setIdentifier('');
                    }}
                    color={resetType === 'email' ? 'primary' : 'default'}
                    variant={resetType === 'email' ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ID`}
                    onClick={() => {
                      setResetType('id');
                      setIdentifier('');
                    }}
                    color={resetType === 'id' ? 'primary' : 'default'}
                    variant={resetType === 'id' ? 'filled' : 'outlined'}
                  />
                </Stack>
              </Box>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label={resetType === 'email' ? 'Email Address' : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ID`}
              name="identifier"
              autoComplete={resetType === 'email' ? 'email' : 'username'}
              autoFocus={!!userRole}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={!!formErrors.identifier}
              helperText={formErrors.identifier}
              placeholder={getPlaceholderText()}
              disabled={!userRole}
              InputProps={{
                startAdornment: userRole ? getRoleIcon(userRole) : null,
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !userRole}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Email />}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Back to Login
                  </Typography>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Create New Account
                  </Typography>
                </Link>
              </Stack>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
