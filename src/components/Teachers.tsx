import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

interface Teacher {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  salary: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'डॉ. अनिता शर्मा',
      email: 'anita@school.com',
      phone: '9876543210',
      subject: 'गणित',
      qualification: 'M.Sc Mathematics',
      experience: '10 years',
      salary: '₹50,000',
      joiningDate: '2020-01-15',
      status: 'Active'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'राजेश कुमार',
      email: 'rajesh@school.com',
      phone: '9876543211',
      subject: 'भौतिक विज्ञान',
      qualification: 'M.Sc Physics',
      experience: '8 years',
      salary: '₹45,000',
      joiningDate: '2021-03-20',
      status: 'Active'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'सुनीता वर्मा',
      email: 'sunita@school.com',
      phone: '9876543212',
      subject: 'अंग्रेजी',
      qualification: 'M.A English',
      experience: '12 years',
      salary: '₹48,000',
      joiningDate: '2019-07-10',
      status: 'Inactive'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: '',
    salary: '',
    joiningDate: '',
    status: 'Active'
  });

  const handleOpen = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData(teacher);
    } else {
      setEditingTeacher(null);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        experience: '',
        salary: '',
        joiningDate: '',
        status: 'Active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTeacher(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (editingTeacher) {
      setTeachers(teachers.map(t => 
        t.id === editingTeacher.id 
          ? { ...editingTeacher, ...formData }
          : t
      ));
    } else {
      const newTeacher: Teacher = {
        id: Math.max(...teachers.map(t => t.id)) + 1,
        employeeId: formData.employeeId || '',
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        subject: formData.subject || '',
        qualification: formData.qualification || '',
        experience: formData.experience || '',
        salary: formData.salary || '',
        joiningDate: formData.joiningDate || '',
        status: formData.status as 'Active' | 'Inactive' || 'Active'
      };
      setTeachers([...teachers, newTeacher]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Teachers Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add New Teacher
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {teachers.filter(t => t.status === 'Active').length}
              </Typography>
              <Typography variant="body2">Active Teachers</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {teachers.filter(t => t.status === 'Inactive').length}
              </Typography>
              <Typography variant="body2">Inactive Teachers</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {teachers.length}
              </Typography>
              <Typography variant="body2">Total Teachers</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Employee ID</strong></TableCell>
              <TableCell><strong>Teacher</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Qualification</strong></TableCell>
              <TableCell><strong>Experience</strong></TableCell>
              <TableCell><strong>Salary</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.employeeId}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(teacher.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{teacher.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {teacher.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {teacher.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={teacher.subject} variant="outlined" color="info" />
                </TableCell>
                <TableCell>{teacher.qualification}</TableCell>
                <TableCell>{teacher.experience}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    {teacher.salary}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={teacher.status} 
                    color={getStatusColor(teacher.status)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpen(teacher)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Teacher Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subject || ''}
                  label="Subject"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <MenuItem value="गणित">गणित (Mathematics)</MenuItem>
                  <MenuItem value="भौतिक विज्ञान">भौतिक विज्ञान (Physics)</MenuItem>
                  <MenuItem value="रसायन विज्ञान">रसायन विज्ञान (Chemistry)</MenuItem>
                  <MenuItem value="जीव विज्ञान">जीव विज्ञान (Biology)</MenuItem>
                  <MenuItem value="अंग्रेजी">अंग्रेजी (English)</MenuItem>
                  <MenuItem value="हिंदी">हिंदी (Hindi)</MenuItem>
                  <MenuItem value="सामाजिक विज्ञान">सामाजिक विज्ञान (Social Science)</MenuItem>
                  <MenuItem value="कंप्यूटर साइंस">कंप्यूटर साइंस</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={formData.qualification || ''}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Experience"
                value={formData.experience || ''}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Salary"
                value={formData.salary || ''}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'Active'}
                  label="Status"
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                value={formData.joiningDate || ''}
                onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTeacher ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teachers;
