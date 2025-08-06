import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Save, PhotoCamera, Edit } from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';

interface SchoolProfile {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  establishmentYear: string;
  schoolType: string;
  affiliation: string;
  affiliationNumber: string;
  logo: string | null;
}

const SchoolProfileForm: React.FC = () => {
  const { user, checkPermission } = useAuth();
  
  // Sample school profile data
  const [profile, setProfile] = useState<SchoolProfile>({
    name: 'Greenfield International School',
    code: 'GIS001',
    address: '123 Education Street',
    city: 'Anytown',
    state: 'State',
    country: 'Country',
    postalCode: '123456',
    phone: '+1 (555) 123-4567',
    email: 'info@greenfieldschool.edu',
    website: 'www.greenfieldschool.edu',
    principalName: 'Dr. John Smith',
    establishmentYear: '1995',
    schoolType: 'Private',
    affiliation: 'International Baccalaureate (IB)',
    affiliationNumber: 'IB12345',
    logo: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Check if user has permission to edit school profile
  const canEditProfile = user?.role === 'admin' || checkPermission('manage_school_settings');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    // In a real app, we would save the profile to the backend
    setSnackbarMessage('School profile updated successfully');
    setSnackbarOpen(true);
    setIsEditing(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server
      // and get a URL back. Here we're just using a local URL.
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!canEditProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">School Profile</Typography>
        {canEditProfile && !isEditing && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profile.logo || undefined}
              alt={profile.name}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            {isEditing && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="School Code"
                  name="code"
                  value={profile.code}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Establishment Year"
                  name="establishmentYear"
                  value={profile.establishmentYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>School Type</InputLabel>
                  <Select
                    name="schoolType"
                    value={profile.schoolType}
                    label="School Type"
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                    <MenuItem value="Charter">Charter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={profile.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Administrative Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Principal's Name"
                  name="principalName"
                  value={profile.principalName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Affiliation"
                  name="affiliation"
                  value={profile.affiliation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Affiliation Number"
                  name="affiliationNumber"
                  value={profile.affiliationNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchoolProfileForm;
