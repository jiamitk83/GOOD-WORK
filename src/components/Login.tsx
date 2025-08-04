import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { School, Login as LoginIcon } from '@mui/icons-material';

interface LoginProps {
  onLogin: (userType: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Demo credentials for different user types
    const credentials = {
      admin: { username: 'admin', password: 'admin123' },
      teacher: { username: 'teacher', password: 'teacher123' },
      student: { username: 'student', password: 'student123' }
    };

    const validCredentials = credentials[userType as keyof typeof credentials];
    
    if (username === validCredentials.username && password === validCredentials.password) {
      onLogin(userType, username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" gutterBottom>
              School ERP
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                value={userType}
                label="User Type"
                onChange={(e) => setUserType(e.target.value)}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign In
            </Button>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                Admin: admin / admin123
              </Typography>
              <Typography variant="caption" display="block">
                Teacher: teacher / teacher123
              </Typography>
              <Typography variant="caption" display="block">
                Student: student / student123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
