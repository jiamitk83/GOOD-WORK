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
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface Student {
  id: number;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  dateOfBirth: string;
  address: string;
  status: 'Active' | 'Inactive';
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      rollNumber: 'STU001',
      name: 'राहुल शर्मा',
      email: 'rahul@email.com',
      phone: '9876543210',
      class: '10th',
      section: 'A',
      dateOfBirth: '2008-05-15',
      address: 'दिल्ली, इंडिया',
      status: 'Active'
    },
    {
      id: 2,
      rollNumber: 'STU002',
      name: 'प्रिया गुप्ता',
      email: 'priya@email.com',
      phone: '9876543211',
      class: '10th',
      section: 'B',
      dateOfBirth: '2008-08-22',
      address: 'मुंबई, इंडिया',
      status: 'Active'
    },
    {
      id: 3,
      rollNumber: 'STU003',
      name: 'अमित कुमार',
      email: 'amit@email.com',
      phone: '9876543212',
      class: '9th',
      section: 'A',
      dateOfBirth: '2009-02-10',
      address: 'बैंगलोर, इंडिया',
      status: 'Inactive'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    class: '',
    section: '',
    dateOfBirth: '',
    address: '',
    status: 'Active'
  });

  const handleOpen = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({
        rollNumber: '',
        name: '',
        email: '',
        phone: '',
        class: '',
        section: '',
        dateOfBirth: '',
        address: '',
        status: 'Active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStudent(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...editingStudent, ...formData }
          : s
      ));
    } else {
      // Add new student
      const newStudent: Student = {
        id: Math.max(...students.map(s => s.id)) + 1,
        rollNumber: formData.rollNumber || '',
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        class: formData.class || '',
        section: formData.section || '',
        dateOfBirth: formData.dateOfBirth || '',
        address: formData.address || '',
        status: formData.status as 'Active' | 'Inactive' || 'Active'
      };
      setStudents([...students, newStudent]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'error';
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Students Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add New Student
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {students.filter(s => s.status === 'Active').length}
              </Typography>
              <Typography variant="body2">Active Students</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {students.filter(s => s.status === 'Inactive').length}
              </Typography>
              <Typography variant="body2">Inactive Students</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {students.length}
              </Typography>
              <Typography variant="body2">Total Students</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Class</strong></TableCell>
              <TableCell><strong>Section</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {student.name}
                  </Box>
                </TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.status} 
                    color={getStatusColor(student.status)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpen(student)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(student.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Student Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingStudent ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                value={formData.rollNumber || ''}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.class || ''}
                  label="Class"
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  <MenuItem value="6th">6th</MenuItem>
                  <MenuItem value="7th">7th</MenuItem>
                  <MenuItem value="8th">8th</MenuItem>
                  <MenuItem value="9th">9th</MenuItem>
                  <MenuItem value="10th">10th</MenuItem>
                  <MenuItem value="11th">11th</MenuItem>
                  <MenuItem value="12th">12th</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select
                  value={formData.section || ''}
                  label="Section"
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                </Select>
              </FormControl>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
