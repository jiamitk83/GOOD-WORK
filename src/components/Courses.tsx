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
  FormControlLabel,
  Switch,
  InputAdornment,
  Chip,
  Slider
} from '@mui/material';
import { 
  Save, 
  Clear, 
  Book, 
  Person,
  MenuBook
} from '@mui/icons-material';

// Define interfaces for form data
interface CourseFormData {
  courseCode: string;
  courseName: string;
  department: string;
  description: string;
  creditHours: number;
  classesPerWeek: number;
  isElective: boolean;
  prerequisites: string[];
  assignedTeachers: string[];
  forClasses: string[];
  academicYear: string;
  semester: string;
  isActive: boolean;
}

interface CoursesProps {
  readOnly?: boolean;
}

const Courses: React.FC<CoursesProps> = ({ readOnly = false }) => {
  // Initial form state
  const initialFormState: CourseFormData = {
    courseCode: '',
    courseName: '',
    department: '',
    description: '',
    creditHours: 3,
    classesPerWeek: 4,
    isElective: false,
    prerequisites: [],
    assignedTeachers: [],
    forClasses: [],
    academicYear: '',
    semester: '',
    isActive: true
  };

  // State for form data
  const [formData, setFormData] = useState<CourseFormData>(initialFormState);

  // Department options
  const departments = ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Arts', 'Physical Education'];
  
  // Classes options
  const classOptions = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  
  // Academic years
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  
  // Semesters
  const semesters = ['First Semester', 'Second Semester', 'Annual'];
  
  // Mock course list (in a real app, this would come from an API)
  const allCourses = [
    'Introduction to Computer Science', 
    'Advanced Mathematics', 
    'English Literature', 
    'Physics I', 
    'Chemistry Basics', 
    'World History',
    'Geography',
    'Economics 101'
  ];
  
  // Mock teachers list (in a real app, this would come from an API)
  const allTeachers = [
    'Dr. John Smith', 
    'Prof. Sarah Johnson', 
    'Mr. Michael Brown', 
    'Ms. Emily Davis', 
    'Dr. Robert Wilson',
    'Mrs. Jennifer Lee',
    'Mr. David Miller'
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

  // Handle multi-select changes
  const handleMultiSelectChange = (e: SelectChangeEvent<string[]>, field: keyof CourseFormData) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: typeof value === 'string' ? value.split(',') : value,
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

  // Handle slider changes
  const handleSliderChange = (name: keyof CourseFormData) => (_event: Event, newValue: number | number[]) => {
    setFormData({
      ...formData,
      [name]: newValue as number,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would typically send the data to an API
    alert('Course information saved successfully!');
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
          Course Information
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
          {/* Course Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Course Code"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                placeholder="e.g., CS101"
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Book color="action" />
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
                label="Course Name"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MenuBook color="action" />
                    </InputAdornment>
                  ),
                  sx: readOnly ? { bgcolor: 'action.hover' } : {}
                }}
                disabled={readOnly}
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
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicYear"
                  value={formData.academicYear}
                  label="Academic Year"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                {...getInputProps()}
              />
            </Grid>
          </Grid>

          {/* Course Details */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Course Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Credit Hours: {formData.creditHours}</Typography>
              <Slider
                value={formData.creditHours}
                onChange={handleSliderChange('creditHours')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={6}
                disabled={readOnly}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Classes Per Week: {formData.classesPerWeek}</Typography>
              <Slider
                value={formData.classesPerWeek}
                onChange={handleSliderChange('classesPerWeek')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                disabled={readOnly}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={formData.semester}
                  label="Semester"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {semesters.map((semester) => (
                    <MenuItem key={semester} value={semester}>
                      {semester}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isElective}
                    onChange={handleSwitchChange}
                    name="isElective"
                    color="primary"
                    disabled={readOnly}
                  />
                }
                label="Elective Course"
              />
              
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
                label="Active Course"
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>

          {/* Prerequisites and Assignments */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Prerequisites & Assignments
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Prerequisites</InputLabel>
                <Select
                  multiple
                  name="prerequisites"
                  value={formData.prerequisites}
                  label="Prerequisites"
                  onChange={(e) => handleMultiSelectChange(e, 'prerequisites')}
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
                  {allCourses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Assigned Teachers</InputLabel>
                <Select
                  multiple
                  name="assignedTeachers"
                  value={formData.assignedTeachers}
                  label="Assigned Teachers"
                  onChange={(e) => handleMultiSelectChange(e, 'assignedTeachers')}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} icon={<Person />} />
                      ))}
                    </Box>
                  )}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {allTeachers.map((teacher) => (
                    <MenuItem key={teacher} value={teacher}>
                      {teacher}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>For Classes</InputLabel>
                <Select
                  multiple
                  name="forClasses"
                  value={formData.forClasses}
                  label="For Classes"
                  onChange={(e) => handleMultiSelectChange(e, 'forClasses')}
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
                  {classOptions.map((classOption) => (
                    <MenuItem key={classOption} value={classOption}>
                      {classOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default Courses;
