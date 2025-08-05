import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Divider,
  Container,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save, Clear } from '@mui/icons-material';

// Define interfaces for form data
interface StudentFormData {
  studentName: string;
  admissionNumber: string;
  classSection: string;
  house: string;
  dateOfBirth: Date | null;
  bloodGroup: string;
  classTeacherName: string;
  busRouteNumber: string;
  busStop: string;
  residentialAddress: string;
  mothersName: string;
  mothersOccupation: string;
  mothersOfficeAddress: string;
  mothersMobile: string;
  mothersEmail: string;
  fathersName: string;
  fathersOccupation: string;
  fathersOfficeAddress: string;
  fathersMobile: string;
  fathersEmail: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  hasSiblingInSchool: boolean;
  siblingNameWithClass: string;
  hasChronicDisease: boolean;
  chronicDiseaseDetails: string;
}

interface StudentsProps {
  readOnly?: boolean;
}

const Students: React.FC<StudentsProps> = ({ readOnly = false }) => {
  // Initial form state
  const initialFormState: StudentFormData = {
    studentName: '',
    admissionNumber: '',
    classSection: '',
    house: '',
    dateOfBirth: null,
    bloodGroup: '',
    classTeacherName: '',
    busRouteNumber: '',
    busStop: '',
    residentialAddress: '',
    mothersName: '',
    mothersOccupation: '',
    mothersOfficeAddress: '',
    mothersMobile: '',
    mothersEmail: '',
    fathersName: '',
    fathersOccupation: '',
    fathersOfficeAddress: '',
    fathersMobile: '',
    fathersEmail: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    hasSiblingInSchool: false,
    siblingNameWithClass: '',
    hasChronicDisease: false,
    chronicDiseaseDetails: '',
  };

  // State for form data
  const [formData, setFormData] = useState<StudentFormData>(initialFormState);

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // House options
  const houses = ['Red', 'Blue', 'Green', 'Yellow'];

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

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      dateOfBirth: date,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would typically send the data to an API
    alert('Student information saved successfully!');
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
          Student Information Form
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
          {/* Student Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                {...getInputProps()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Admission Number"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleInputChange}
                {...getInputProps()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Class/Section"
                name="classSection"
                value={formData.classSection}
                onChange={handleInputChange}
                placeholder="e.g., 10-A"
                {...getInputProps()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>House</InputLabel>
                <Select
                  name="house"
                  value={formData.house}
                  label="House"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {houses.map((house) => (
                    <MenuItem key={house} value={house}>
                      {house}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      ...getInputProps()
                    } 
                  }}
                  readOnly={readOnly}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  label="Blood Group"
                  onChange={handleSelectChange}
                  inputProps={{
                    readOnly: readOnly
                  }}
                >
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Class Teacher's Name"
                name="classTeacherName"
                value={formData.classTeacherName}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Transportation Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Transportation Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bus Route Number"
                name="busRouteNumber"
                value={formData.busRouteNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Bus Stop"
                name="busStop"
                value={formData.busStop}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Residential Address"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Mother's Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Mother's Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Mother's Name"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Occupation"
                name="mothersOccupation"
                value={formData.mothersOccupation}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Office Address"
                name="mothersOfficeAddress"
                value={formData.mothersOfficeAddress}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Mobile"
                name="mothersMobile"
                value={formData.mothersMobile}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email ID"
                name="mothersEmail"
                type="email"
                value={formData.mothersEmail}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Father's Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Father's Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Father's Name"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Occupation"
                name="fathersOccupation"
                value={formData.fathersOccupation}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Office Address"
                name="fathersOfficeAddress"
                value={formData.fathersOfficeAddress}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Mobile"
                name="fathersMobile"
                value={formData.fathersMobile}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email ID"
                name="fathersEmail"
                type="email"
                value={formData.fathersEmail}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Emergency Contact Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Emergency Contact Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Emergency Contact Person Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Emergency Contact Number"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Additional Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasSiblingInSchool}
                    onChange={handleCheckboxChange}
                    name="hasSiblingInSchool"
                    disabled={readOnly}
                  />
                }
                label="Brother/Sister in School"
              />
            </Grid>
            {formData.hasSiblingInSchool && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of the Brother/Sister with Class"
                  name="siblingNameWithClass"
                  value={formData.siblingNameWithClass}
                  onChange={handleInputChange}
                  {...getInputProps()}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasChronicDisease}
                    onChange={handleCheckboxChange}
                    name="hasChronicDisease"
                    disabled={readOnly}
                  />
                }
                label="Any Chronic Disease"
              />
            </Grid>
            {formData.hasChronicDisease && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chronic Disease Details"
                  name="chronicDiseaseDetails"
                  value={formData.chronicDiseaseDetails}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  {...getInputProps()}
                />
              </Grid>
            )}
          </Grid>

          {/* Form Actions */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleReset}
              disabled={readOnly}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              disabled={readOnly}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Students;