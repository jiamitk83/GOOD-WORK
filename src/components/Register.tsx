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
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack
} from '@mui/material';
import { School, PersonAdd, Person, MenuBook, SupervisorAccount, LockOutlined } from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

const Register: React.FC = () => {
  const [userRole, setUserRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Role-specific fields
  const [studentId, setStudentId] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [position, setPosition] = useState('');
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, isLoading, error } = useAuth();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!userRole) {
      errors.userRole = 'Please select your role';
      isValid = false;
    }

    if (!name.trim()) {
      errors.name = 'Full name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Role-specific validations
    if (userRole === 'student') {
      if (!studentId) {
        errors.studentId = 'Student ID is required';
        isValid = false;
      }
      if (!grade) {
        errors.grade = 'Grade is required';
        isValid = false;
      }
      if (!section) {
        errors.section = 'Section is required';
        isValid = false;
      }
    } else if (userRole === 'teacher') {
      if (!employeeId) {
        errors.employeeId = 'Employee ID is required';
        isValid = false;
      }
      if (!department) {
        errors.department = 'Department is required';
        isValid = false;
      }
      if (!subject) {
        errors.subject = 'Subject specialization is required';
        isValid = false;
      }
    } else if (userRole === 'staff') {
      if (!employeeId) {
        errors.employeeId = 'Employee ID is required';
        isValid = false;
      }
      if (!department) {
        errors.department = 'Department is required';
        isValid = false;
      }
      if (!position) {
        errors.position = 'Position is required';
        isValid = false;
      }
    }

    if (!agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // In a real app, you would send the complete user data including role-specific fields
        const success = await register(name, email, password);
        if (success) {
          setRegistrationSuccess(true);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <Person />;
      case 'teacher': return <MenuBook />;
      case 'staff': return <SupervisorAccount />;
      default: return <Person />;
    }
  };

  const renderRoleSpecificFields = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="studentId"
                label="Student ID"
                name="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                error={!!formErrors.studentId}
                helperText={formErrors.studentId}
                placeholder="STU001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.grade}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={grade}
                  label="Grade"
                  onChange={(e) => setGrade(e.target.value)}
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={`Grade ${i + 1}`}>
                      Grade {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.grade && (
                  <Typography variant="caption" color="error">
                    {formErrors.grade}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="section"
                label="Section"
                name="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                error={!!formErrors.section}
                helperText={formErrors.section}
                placeholder="A, B, C, etc."
              />
            </Grid>
          </>
        );
      
      case 'teacher':
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="employeeId"
                label="Teacher ID"
                name="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                error={!!formErrors.employeeId}
                helperText={formErrors.employeeId}
                placeholder="TCH001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="department"
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                error={!!formErrors.department}
                helperText={formErrors.department}
                placeholder="Mathematics, Science, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="subject"
                label="Subject Specialization"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
                placeholder="Mathematics, Physics, Chemistry, etc."
              />
            </Grid>
          </>
        );
      
      case 'staff':
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="employeeId"
                label="Staff ID"
                name="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                error={!!formErrors.employeeId}
                helperText={formErrors.employeeId}
                placeholder="STF001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="department"
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                error={!!formErrors.department}
                helperText={formErrors.department}
                placeholder="Administration, IT, Library, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="position"
                label="Position"
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                error={!!formErrors.position}
                helperText={formErrors.position}
                placeholder="Administrator, Librarian, IT Support, etc."
              />
            </Grid>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
        
        {registrationSuccess ? (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom color="success.main">
              Registration Successful! 🎉
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Thank you for registering!</strong>
              </Typography>
              <Typography variant="body2">
                Your account has been created and is now <strong>pending admin approval</strong>. 
                You will receive an email notification once your account has been reviewed and approved by our administrators.
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary" paragraph>
              This approval process typically takes 1-2 business days. Please check your email regularly for updates.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained"
                startIcon={<LockOutlined />}
              >
                Go to Login
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  setRegistrationSuccess(false);
                  setUserRole('');
                  setName('');
                  setEmail('');
                  setPhone('');
                  setPassword('');
                  setConfirmPassword('');
                  setAgreeToTerms(false);
                  // Reset role-specific fields
                  setStudentId('');
                  setGrade('');
                  setSection('');
                  setEmployeeId('');
                  setDepartment('');
                  setSubject('');
                  setPosition('');
                  setFormErrors({});
                }}
              >
                Register Another Account
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              Sign up to access the School ERP System
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            {/* Role Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!formErrors.userRole}>
                <InputLabel id="user-role-label">I am registering as...</InputLabel>
                <Select
                  labelId="user-role-label"
                  id="user-role"
                  value={userRole}
                  label="I am registering as..."
                  onChange={(e) => {
                    setUserRole(e.target.value);
                    setFormErrors({});
                  }}
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
                      Staff Member
                    </Box>
                  </MenuItem>
                </Select>
                {formErrors.userRole && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {formErrors.userRole}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {userRole && (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      Personal Information
                    </Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    InputProps={{
                      startAdornment: getRoleIcon(userRole),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    placeholder="+1 (555) 123-4567"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Information
                    </Typography>
                  </Divider>
                </Grid>

                {renderRoleSpecificFields()}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="I agree to the terms and conditions and privacy policy"
                  />
                  {formErrors.agreeToTerms && (
                    <Typography variant="caption" color="error" display="block">
                      {formErrors.agreeToTerms}
                    </Typography>
                  )}
                </Grid>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !userRole}
            startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAdd />}
          >
            {isLoading ? 'Creating Account...' : `Create ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account`}
          </Button>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" component="span" color="primary">
                  Sign In
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
        </>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
