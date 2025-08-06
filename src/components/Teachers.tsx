import React, { useState } from 'react';
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
import { Edit, Delete, Add, Search, FilterList, Phone, Email } from '@mui/icons-material';
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
      id={`teacher-tabpanel-${index}`}
      aria-labelledby={`teacher-tab-${index}`}
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

interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  gender: string;
  dateOfJoining: string;
  qualification: string;
  specialization: string;
  contactNumber: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  subjects: string[];
  classes: string[];
}

// Sample teacher data
const sampleTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Robert Miller',
    employeeId: 'TCH001',
    gender: 'Male',
    dateOfJoining: '2018-07-15',
    qualification: 'Ph.D. in Physics',
    specialization: 'Quantum Mechanics',
    contactNumber: '555-123-4567',
    email: 'robert.miller@example.com',
    address: '123 Main St, Anytown',
    status: 'active',
    subjects: ['Physics', 'Mathematics'],
    classes: ['11', '12']
  },
  {
    id: '2',
    name: 'Ms. Sarah Johnson',
    employeeId: 'TCH002',
    gender: 'Female',
    dateOfJoining: '2019-04-20',
    qualification: 'M.A. in English Literature',
    specialization: 'Modern Literature',
    contactNumber: '555-987-6543',
    email: 'sarah.johnson@example.com',
    address: '456 Oak Ave, Anytown',
    status: 'active',
    subjects: ['English', 'Literature'],
    classes: ['9', '10', '11']
  },
  {
    id: '3',
    name: 'Prof. Amit Sharma',
    employeeId: 'TCH003',
    gender: 'Male',
    dateOfJoining: '2017-06-10',
    qualification: 'M.Sc. in Chemistry',
    specialization: 'Organic Chemistry',
    contactNumber: '555-456-7890',
    email: 'amit.sharma@example.com',
    address: '789 Maple Dr, Anytown',
    status: 'active',
    subjects: ['Chemistry', 'Environmental Science'],
    classes: ['10', '11', '12']
  },
  {
    id: '4',
    name: 'Mrs. Lisa Wang',
    employeeId: 'TCH004',
    gender: 'Female',
    dateOfJoining: '2020-08-15',
    qualification: 'M.Ed. in Mathematics',
    specialization: 'Calculus',
    contactNumber: '555-789-0123',
    email: 'lisa.wang@example.com',
    address: '101 Pine St, Anytown',
    status: 'active',
    subjects: ['Mathematics', 'Statistics'],
    classes: ['9', '10']
  },
  {
    id: '5',
    name: 'Mr. James Wilson',
    employeeId: 'TCH005',
    gender: 'Male',
    dateOfJoining: '2016-05-20',
    qualification: 'B.Ed. in History',
    specialization: 'World History',
    contactNumber: '555-234-5678',
    email: 'james.wilson@example.com',
    address: '202 Cedar Lane, Anytown',
    status: 'inactive',
    subjects: ['History', 'Social Studies'],
    classes: ['8', '9']
  }
];

const Teachers: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Check permissions
  const canManageTeachers = user?.role === 'admin' || checkPermission('manage_teachers');
  const canViewTeachers = canManageTeachers || checkPermission('view_teachers');

  // Get all unique subjects
  const allSubjects = Array.from(
    new Set(teachers.flatMap(teacher => teacher.subjects))
  ).sort();

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle dialog open/close
  const handleOpenDialog = (teacher?: Teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher);
    } else {
      setSelectedTeacher(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle teacher form submit
  const handleSaveTeacher = () => {
    // In a real app, we would save the teacher data
    // and then update the state

    // For demo purposes, just close the dialog
    handleCloseDialog();
  };

  // Handle teacher deletion
  const handleDeleteTeacher = (id: string) => {
    // In a real app, we would confirm deletion first
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  // Apply filters
  const filteredTeachers = teachers
    .filter(teacher => 
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterSubject ? teacher.subjects.includes(filterSubject) : true)
    );

  // Get active and inactive teachers
  const activeTeachers = filteredTeachers.filter(teacher => teacher.status === 'active');
  const inactiveTeachers = filteredTeachers.filter(teacher => teacher.status === 'inactive');

  if (!canViewTeachers) {
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
          Teacher Management
        </Typography>
        {canManageTeachers && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add New Teacher
          </Button>
        )}
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search by Name or Employee ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Subject</InputLabel>
              <Select
                value={filterSubject}
                label="Filter by Subject"
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Subjects</em>
                </MenuItem>
                {allSubjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
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
                setFilterSubject('');
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
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="teacher tabs">
          <Tab label={`Active Teachers (${activeTeachers.length})`} />
          <Tab label={`Inactive Teachers (${inactiveTeachers.length})`} />
          <Tab label="Teacher Details" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Contact</TableCell>
                {canManageTeachers && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeTeachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.employeeId}</TableCell>
                  <TableCell>{teacher.qualification}</TableCell>
                  <TableCell>
                    {teacher.subjects.map((subject, index) => (
                      <Chip 
                        key={index} 
                        label={subject} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {teacher.classes.map((cls, index) => (
                      <Chip 
                        key={index} 
                        label={`Class ${cls}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Phone fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Email fontSize="small" />
                    </IconButton>
                  </TableCell>
                  {canManageTeachers && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(teacher)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTeacher(teacher.id)}>
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
                <TableCell>Name</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Contact</TableCell>
                {canManageTeachers && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveTeachers.map((teacher) => (
                <TableRow key={teacher.id} hover sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.employeeId}</TableCell>
                  <TableCell>{teacher.qualification}</TableCell>
                  <TableCell>
                    {teacher.subjects.map((subject, index) => (
                      <Chip 
                        key={index} 
                        label={subject} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {teacher.classes.map((cls, index) => (
                      <Chip 
                        key={index} 
                        label={`Class ${cls}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Phone fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Email fontSize="small" />
                    </IconButton>
                  </TableCell>
                  {canManageTeachers && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(teacher)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTeacher(teacher.id)}>
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
          {filteredTeachers.map((teacher) => (
            <Grid item xs={12} md={6} key={teacher.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {teacher.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{teacher.name}</Typography>
                      <Chip 
                        label={teacher.status === 'active' ? 'Active' : 'Inactive'} 
                        color={teacher.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Employee ID:</Typography>
                      <Typography variant="body1">{teacher.employeeId}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Date of Joining:</Typography>
                      <Typography variant="body1">{teacher.dateOfJoining}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Qualification:</Typography>
                      <Typography variant="body1">{teacher.qualification}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Specialization:</Typography>
                      <Typography variant="body1">{teacher.specialization}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Subjects:</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {teacher.subjects.map((subject, index) => (
                          <Chip 
                            key={index} 
                            label={subject} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Classes:</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {teacher.classes.map((cls, index) => (
                          <Chip 
                            key={index} 
                            label={`Class ${cls}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Contact:</Typography>
                      <Typography variant="body1">{teacher.contactNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body1">{teacher.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Address:</Typography>
                      <Typography variant="body1">{teacher.address}</Typography>
                    </Grid>
                  </Grid>
                  
                  {canManageTeachers && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(teacher)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={() => handleDeleteTeacher(teacher.id)}
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

      {/* Add/Edit Teacher Dialog (simplified) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is a placeholder form. In a real application, this would be a complete form to add or edit teacher details.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teacher Name"
                variant="outlined"
                defaultValue={selectedTeacher?.name || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                variant="outlined"
                defaultValue={selectedTeacher?.employeeId || ''}
                margin="normal"
              />
            </Grid>
            {/* Additional form fields would go here */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTeacher} variant="contained" color="primary">
            {selectedTeacher ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teachers;
