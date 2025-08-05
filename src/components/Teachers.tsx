import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Container,
  SelectChangeEvent,
  Chip,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save, Clear, Phone, Email, Home, School } from '@mui/icons-material';

// Define interfaces for form data
interface TeacherFormData {
  teacherName: string;
  employeeId: string;
  department: string;
  designation: string;
  dateOfJoining: Date | null;
  qualification: string;
  email: string;
  phoneNumber: string;
  address: string;
  subjects: string[];
  classTeacherFor: string;
  isActive: boolean;
}

interface TeachersProps {
  readOnly?: boolean;
}

const Teachers: React.FC<TeachersProps> = ({ readOnly = false }) => {
  // Initial form state
  const initialFormState: TeacherFormData = {
    teacherName: '',
    employeeId: '',
    department: '',
    designation: '',
    dateOfJoining: null,
    qualification: '',
    email: '',
    phoneNumber: '',
    address: '',
    subjects: [],
    classTeacherFor: '',
    isActive: true
  };

  // State for form data
  const [formData, setFormData] = useState<TeacherFormData>(initialFormState);

  // Department options
  const departments = ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Arts', 'Physical Education'];
  
  // Designation options
  const designations = ['Junior Teacher', 'Senior Teacher', 'Head of Department', 'Vice Principal', 'Principal'];

  // Subject options
  const subjectOptions = [
    'English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 
    'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education', 
    'Arts', 'Music', 'Economics', 'Business Studies'
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle subjects multi-select
  const handleSubjectsChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      subjects: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dateOfJoining: date,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would typically send the data to an API
    alert('Teacher information saved successfully!');
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormState);
  };

  // Create common input props
  const getInputProps = () => ({
    InputProps: {
      readOnly: readOnly,
      sx: readOnly ? { bgcolor: 'action.hover' } : {}
    },
    disabled: readOnly
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Teacher Information Form
        </Typography>

        {readOnly && (
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'info.light', 
              color: 'info.contrastText', 
              p: 2, 
              mb: 3,
              borderRadius: 1
            }}
          >
            <Typography>
              You are in view-only mode. As a student or teacher, you can only view this information but cannot edit it.
            </Typography>
          </Paper>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Teacher Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Teacher Name"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                {...getInputProps()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                {...getInputProps()}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  label="Department"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designation"
                  value={formData.designation}
                  label="Designation"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {designations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Joining"
                  value={formData.dateOfJoining}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      ...getInputProps()
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="e.g., M.Sc., B.Ed."
                {...getInputProps()}
              />
            </Grid>
          </Grid>

          {/* Contact Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                  sx: readOnly ? { bgcolor: 'action.hover' } : {}
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                  sx: readOnly ? { bgcolor: 'action.hover' } : {}
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Residential Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={3}
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  ),
                  sx: readOnly ? { bgcolor: 'action.hover' } : {}
                }}
                disabled={readOnly}
              />
            </Grid>
          </Grid>

          {/* Teaching Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Teaching Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Subjects Taught</InputLabel>
                <Select
                  multiple
                  name="subjects"
                  value={formData.subjects}
                  label="Subjects Taught"
                  onChange={handleSubjectsChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {subjectOptions.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Class Teacher For"
                name="classTeacherFor"
                value={formData.classTeacherFor}
                onChange={handleInputChange}
                placeholder="e.g., 10-A"
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <School color="action" />
                    </InputAdornment>
                  ),
                  sx: readOnly ? { bgcolor: 'action.hover' } : {}
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    color="primary"
                    disabled={readOnly}
                  />
                }
                label="Active Status"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {!readOnly && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Teachers;
