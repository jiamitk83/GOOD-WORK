import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  InputAdornment,
  Link as MuiLink,
  Alert
} from '@mui/material';
import {
  School,
  EmailOutlined
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };
  
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail()) {
      // In a real application, this would be an API call to request a password reset
      console.log('Password reset requested for:', email);
      
      // Show success message
      setResetSent(true);
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
            Forgot Password
          </Typography>
          
          {resetSent ? (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset instructions have been sent to your email.
              </Alert>
              
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Please check your email and follow the instructions to reset your password.
              </Typography>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Return to Login
                </MuiLink>
              </Box>
            </>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleInputChange}
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <MuiLink component={Link} to="/login" variant="body2">
                    Back to Login
                  </MuiLink>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
