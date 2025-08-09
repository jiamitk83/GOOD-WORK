import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { Edit, Delete, Add, Search, FilterList, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  gender: string;
  dob: string;
  fatherName: string;
  motherName: string;
  address: string;
  contactNumber: string;
  email: string;
  admissionDate: string;
  status: 'active' | 'inactive';
}

// Sample student data
const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    rollNumber: 'STU001',
    class: '10',
    section: 'A',
    gender: 'Male',
    dob: '2008-05-10',
    fatherName: 'David Smith',
    motherName: 'Sarah Smith',
    address: '123 Main St, Anytown',
    contactNumber: '555-123-4567',
    email: 'john@example.com',
    admissionDate: '2020-04-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    rollNumber: 'STU002',
    class: '10',
    section: 'A',
    gender: 'Female',
    dob: '2008-07-22',
    fatherName: 'Michael Johnson',
    motherName: 'Lisa Johnson',
    address: '456 Oak Ave, Anytown',
    contactNumber: '555-987-6543',
    email: 'emma@example.com',
    admissionDate: '2020-04-18',
    status: 'active'
  },
  {
    id: '3',
    name: 'Rahul Sharma',
    rollNumber: 'STU003',
    class: '9',
    section: 'B',
    gender: 'Male',
    dob: '2009-03-15',
    fatherName: 'Raj Sharma',
    motherName: 'Priya Sharma',
    address: '789 Maple Dr, Anytown',
    contactNumber: '555-456-7890',
    email: 'rahul@example.com',
    admissionDate: '2021-04-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'Sophia Wang',
    rollNumber: 'STU004',
    class: '8',
    section: 'C',
    gender: 'Female',
    dob: '2010-11-05',
    fatherName: 'Li Wang',
    motherName: 'Min Wang',
    address: '101 Pine St, Anytown',
    contactNumber: '555-789-0123',
    email: 'sophia@example.com',
    admissionDate: '2022-04-05',
    status: 'active'
  },
  {
    id: '5',
    name: 'Mohammed Al-Farsi',
    rollNumber: 'STU005',
    class: '11',
    section: 'A',
    gender: 'Male',
    dob: '2007-09-18',
    fatherName: 'Ahmed Al-Farsi',
    motherName: 'Fatima Al-Farsi',
    address: '202 Cedar Lane, Anytown',
    contactNumber: '555-234-5678',
    email: 'mohammed@example.com',
    admissionDate: '2019-04-20',
    status: 'inactive'
  }
];

const classes = ['8', '9', '10', '11', '12'];
const sections = ['A', 'B', 'C', 'D'];

const Students: React.FC = () => {
  const { user, checkPermission } = useAuth();
  
  // Initialize students state with sample data only once
  const [students, setStudents] = useState<Student[]>(() => {
    // Check if there's saved data in localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      try {
        return JSON.parse(savedStudents);
      } catch (error) {
        console.error('Error parsing saved students:', error);
      }
    }
    // Return initial sample data if no saved data
    return sampleStudents;
  });
  
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Form state for dialog
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    gender: '',
    dob: '',
    fatherName: '',
    motherName: '',
    address: '',
    contactNumber: '',
    email: ''
  });

  // Save students to localStorage whenever students state changes
  React.useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Check permissions
  const canManageStudents = user?.role === 'admin' || checkPermission('manage_students');
  const canViewStudents = canManageStudents || checkPermission('view_students');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle dialog open/close
  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        name: student.name,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section,
        gender: student.gender,
        dob: student.dob,
        fatherName: student.fatherName,
        motherName: student.motherName,
        address: student.address,
        contactNumber: student.contactNumber,
        email: student.email
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        name: '',
        rollNumber: '',
        class: '',
        section: '',
        gender: '',
        dob: '',
        fatherName: '',
        motherName: '',
        address: '',
        contactNumber: '',
        email: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle student form submit
  const handleSaveStudent = () => {
    // Validate form
    if (!formData.name || !formData.rollNumber || !formData.class || !formData.section) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (selectedStudent) {
      // Update existing student
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? { ...student, ...formData }
          : student
      );
      setStudents(updatedStudents);
      alert('Student updated successfully!');
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setStudents([...students, newStudent]);
      alert('Student added successfully!');
    }
    
    handleCloseDialog();
  };

  // Handle student deletion
  const handleDeleteStudent = (id: string) => {
    // In a real app, we would confirm deletion first
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
      alert('Student deleted successfully!');
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply filters and sorting
  const filteredStudents = students
    .filter(student => 
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass ? student.class === filterClass : true) &&
      (filterSection ? student.section === filterSection : true)
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Get active and inactive students
  const activeStudents = filteredStudents.filter(student => student.status === 'active');
  const inactiveStudents = filteredStudents.filter(student => student.status === 'inactive');

  if (!canViewStudents) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to view this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageStudents && (
            <>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => {
                  if (window.confirm('Reset to original sample data? This will remove all changes.')) {
                    setStudents(sampleStudents);
                    localStorage.removeItem('students');
                    alert('Data reset to original sample data!');
                  }
                }}
              >
                Reset Data
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Add New Student
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search by Name or Roll Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Class</InputLabel>
              <Select
                value={filterClass}
                label="Filter by Class"
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Classes</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Section</InputLabel>
              <Select
                value={filterSection}
                label="Filter by Section"
                onChange={(e) => setFilterSection(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Sections</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section} value={section}>Section {section}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              fullWidth
              onClick={() => {
                setFilterClass('');
                setFilterSection('');
                setSearchTerm('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="student tabs">
          <Tab label={`Active Students (${activeStudents.length})`} />
          <Tab label={`Inactive Students (${inactiveStudents.length})`} />
          <Tab label="Student Details" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    <Typography variant="subtitle2" fontWeight="bold">Student Name</Typography>
                    {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('rollNumber')}>
                    <Typography variant="subtitle2" fontWeight="bold">Roll No.</Typography>
                    {sortField === 'rollNumber' && (sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('class')}>
                    <Typography variant="subtitle2" fontWeight="bold">Class</Typography>
                    {sortField === 'class' && (sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Section</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Gender</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Contact</Typography>
                </TableCell>
                {canManageStudents && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  {canManageStudents && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(student)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteStudent(student.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Contact</TableCell>
                {canManageStudents && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveStudents.map((student) => (
                <TableRow key={student.id} hover sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  {canManageStudents && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(student)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteStudent(student.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} md={6} key={student.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{student.name}</Typography>
                      <Chip 
                        label={student.status === 'active' ? 'Active' : 'Inactive'} 
                        color={student.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Roll Number:</Typography>
                      <Typography variant="body1">{student.rollNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Class & Section:</Typography>
                      <Typography variant="body1">{student.class}-{student.section}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
                      <Typography variant="body1">{student.dob}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Gender:</Typography>
                      <Typography variant="body1">{student.gender}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Parents:</Typography>
                      <Typography variant="body1">{student.fatherName} & {student.motherName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Contact:</Typography>
                      <Typography variant="body1">{student.contactNumber}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body1">{student.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Address:</Typography>
                      <Typography variant="body1">{student.address}</Typography>
                    </Grid>
                  </Grid>
                  
                  {canManageStudents && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(student)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student Name *"
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Roll Number *"
                variant="outlined"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class *</InputLabel>
                <Select
                  value={formData.class}
                  label="Class *"
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Section *</InputLabel>
                <Select
                  value={formData.section}
                  label="Section *"
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                >
                  {sections.map((section) => (
                    <MenuItem key={section} value={section}>Section {section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                variant="outlined"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                variant="outlined"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                variant="outlined"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveStudent} variant="contained" color="primary">
            {selectedStudent ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
