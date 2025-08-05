import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  School,
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  Person,
  Phone
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  
  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Account Information
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    
    // Step 2: Personal Information
    firstName: '',
    lastName: '',
    phoneNumber: '',
    
    // Step 3: Role-specific Information
    // For students
    gradeLevel: '',
    studentId: '',
    // For teachers
    subject: '',
    qualification: '',
    // For parents
    childName: '',
    relationToChild: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gradeLevel: '',
    studentId: '',
    subject: '',
    qualification: '',
    childName: '',
    relationToChild: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // We use registrationError display in the UI
  const [registrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const steps = ['Account Information', 'Personal Information', 'Role-specific Information'];
  
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
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validateStep1 = () => {
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
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    } else {
      newErrors.confirmPassword = '';
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const validateStep2 = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    } else {
      newErrors.firstName = '';
    }
    
    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    } else {
      newErrors.lastName = '';
    }
    
    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
      valid = false;
    } else {
      newErrors.phoneNumber = '';
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const validateStep3 = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (formData.role === 'student') {
      // Student ID validation
      if (!formData.studentId) {
        newErrors.studentId = 'Student ID is required';
        valid = false;
      } else {
        newErrors.studentId = '';
      }
      
      // Grade level validation
      if (!formData.gradeLevel) {
        newErrors.gradeLevel = 'Grade level is required';
        valid = false;
      } else {
        newErrors.gradeLevel = '';
      }
    } else if (formData.role === 'teacher') {
      // Subject validation
      if (!formData.subject) {
        newErrors.subject = 'Subject is required';
        valid = false;
      } else {
        newErrors.subject = '';
      }
      
      // Qualification validation
      if (!formData.qualification) {
        newErrors.qualification = 'Qualification is required';
        valid = false;
      } else {
        newErrors.qualification = '';
      }
    } else if (formData.role === 'parent') {
      // Child name validation
      if (!formData.childName) {
        newErrors.childName = 'Child name is required';
        valid = false;
      } else {
        newErrors.childName = '';
      }
      
      // Relation to child validation
      if (!formData.relationToChild) {
        newErrors.relationToChild = 'Relation to child is required';
        valid = false;
      } else {
        newErrors.relationToChild = '';
      }
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleNext = () => {
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateStep2()) {
      setActiveStep(2);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep3()) {
      // Create a user object from form data
      const userId = Math.floor(Math.random() * 10000).toString();
      const newUser = {
        id: userId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        approved: false // New users start as unapproved
      };
      
      // Register the user (add to pending users)
      registerUser(newUser);
      
      // Show success message
      setRegistrationSuccess(true);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };
  
  const renderStep1 = () => (
    <>
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
        autoComplete="new-password"
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
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-select-label">Register As</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          name="role"
          value={formData.role}
          label="Register As"
          onChange={handleSelectChange}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="parent">Parent</MenuItem>
        </Select>
        <FormHelperText>
          Select your role in the school
        </FormHelperText>
      </FormControl>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
        autoComplete="given-name"
        value={formData.firstName}
        onChange={handleInputChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="family-name"
        value={formData.lastName}
        onChange={handleInputChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="phoneNumber"
        label="Phone Number"
        name="phoneNumber"
        autoComplete="tel"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
  
  const renderStep3 = () => {
    if (formData.role === 'student') {
      return (
        <>
          <TextField
            margin="normal"
            required
            fullWidth
            id="studentId"
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            error={!!errors.studentId}
            helperText={errors.studentId}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="grade-level-label">Grade Level</InputLabel>
            <Select
              labelId="grade-level-label"
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              label="Grade Level"
              onChange={handleSelectChange}
              error={!!errors.gradeLevel}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                <MenuItem key={grade} value={grade}>
                  Grade {grade}
                </MenuItem>
              ))}
            </Select>
            {errors.gradeLevel && (
              <FormHelperText error>{errors.gradeLevel}</FormHelperText>
            )}
          </FormControl>
        </>
      );
    } else if (formData.role === 'teacher') {
      return (
        <>
          <TextField
            margin="normal"
            required
            fullWidth
            id="subject"
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            error={!!errors.subject}
            helperText={errors.subject}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="qualification"
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            error={!!errors.qualification}
            helperText={errors.qualification}
          />
        </>
      );
    } else if (formData.role === 'parent') {
      return (
        <>
          <TextField
            margin="normal"
            required
            fullWidth
            id="childName"
            label="Child's Name"
            name="childName"
            value={formData.childName}
            onChange={handleInputChange}
            error={!!errors.childName}
            helperText={errors.childName}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="relation-label">Relation to Child</InputLabel>
            <Select
              labelId="relation-label"
              id="relationToChild"
              name="relationToChild"
              value={formData.relationToChild}
              label="Relation to Child"
              onChange={handleSelectChange}
              error={!!errors.relationToChild}
            >
              <MenuItem value="Mother">Mother</MenuItem>
              <MenuItem value="Father">Father</MenuItem>
              <MenuItem value="Guardian">Guardian</MenuItem>
            </Select>
            {errors.relationToChild && (
              <FormHelperText error>{errors.relationToChild}</FormHelperText>
            )}
          </FormControl>
        </>
      );
    }
    
    return null;
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
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
            Registration
          </Typography>
          
          {registrationError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registrationError}
            </Alert>
          )}
          
          {registrationSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Registration successful! Your account is pending admin approval. You will be redirected to the login page.
            </Alert>
          )}
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {activeStep === 0 && renderStep1()}
            {activeStep === 1 && renderStep2()}
            {activeStep === 2 && renderStep3()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mt: 1, mr: 1 }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, ml: 1 }}
                    disabled={registrationSuccess}
                  >
                    Register
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Already have an account? Sign In
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
