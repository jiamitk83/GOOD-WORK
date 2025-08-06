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
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab
} from '@mui/material';
import { Edit, Delete, Add, Search, FilterList, BookmarkBorder } from '@mui/icons-material';
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
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
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

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  class: string;
  subject: string;
  teacher: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
}

// Sample course data
const sampleCourses: Course[] = [
  {
    id: '1',
    code: 'PHY-12',
    title: 'Physics for Senior Secondary',
    description: 'Comprehensive study of mechanics, thermodynamics, electromagnetism, and modern physics for class 12 students.',
    credits: 5,
    class: '12',
    subject: 'Physics',
    teacher: 'Dr. Robert Miller',
    status: 'active',
    imageUrl: 'https://source.unsplash.com/random/800x600/?physics'
  },
  {
    id: '2',
    code: 'MATH-11',
    title: 'Advanced Mathematics',
    description: 'Study of calculus, trigonometry, algebra, and statistics for class 11 students.',
    credits: 5,
    class: '11',
    subject: 'Mathematics',
    teacher: 'Mrs. Lisa Wang',
    status: 'active',
    imageUrl: 'https://source.unsplash.com/random/800x600/?mathematics'
  },
  {
    id: '3',
    code: 'ENG-10',
    title: 'English Language and Literature',
    description: 'Study of English grammar, composition, and literature for class 10 students.',
    credits: 4,
    class: '10',
    subject: 'English',
    teacher: 'Ms. Sarah Johnson',
    status: 'active',
    imageUrl: 'https://source.unsplash.com/random/800x600/?books'
  },
  {
    id: '4',
    code: 'CHEM-12',
    title: 'Chemistry for Senior Secondary',
    description: 'Study of organic, inorganic, and physical chemistry for class 12 students.',
    credits: 5,
    class: '12',
    subject: 'Chemistry',
    teacher: 'Prof. Amit Sharma',
    status: 'active',
    imageUrl: 'https://source.unsplash.com/random/800x600/?chemistry'
  },
  {
    id: '5',
    code: 'HIST-9',
    title: 'History: Modern World',
    description: 'Study of world history from the 18th century to the present day for class 9 students.',
    credits: 3,
    class: '9',
    subject: 'History',
    teacher: 'Mr. James Wilson',
    status: 'inactive',
    imageUrl: 'https://source.unsplash.com/random/800x600/?history'
  }
];

const classes = ['8', '9', '10', '11', '12'];
const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];

const Courses: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Check permissions
  const canManageCourses = user?.role === 'admin' || checkPermission('manage_courses');
  const canViewCourses = canManageCourses || checkPermission('view_courses');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle dialog open/close
  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
    } else {
      setSelectedCourse(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle course form submit
  const handleSaveCourse = () => {
    // In a real app, we would save the course data
    // and then update the state

    // For demo purposes, just close the dialog
    handleCloseDialog();
  };

  // Handle course deletion
  const handleDeleteCourse = (id: string) => {
    // In a real app, we would confirm deletion first
    setCourses(courses.filter(course => course.id !== id));
  };

  // Apply filters
  const filteredCourses = courses
    .filter(course => 
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass ? course.class === filterClass : true) &&
      (filterSubject ? course.subject === filterSubject : true)
    );

  // Get active and inactive courses
  const activeCourses = filteredCourses.filter(course => course.status === 'active');
  const inactiveCourses = filteredCourses.filter(course => course.status === 'inactive');

  if (!canViewCourses) {
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
          Course Management
        </Typography>
        {canManageCourses && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add New Course
          </Button>
        )}
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search by Title or Code"
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
              <InputLabel>Filter by Subject</InputLabel>
              <Select
                value={filterSubject}
                label="Filter by Subject"
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Subjects</em>
                </MenuItem>
                {subjects.map((subject) => (
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
                setFilterClass('');
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
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="course tabs">
          <Tab label={`Active Courses (${activeCourses.length})`} />
          <Tab label={`Inactive Courses (${inactiveCourses.length})`} />
          <Tab label="Course Cards" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Credits</TableCell>
                {canManageCourses && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeCourses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.class}</TableCell>
                  <TableCell>{course.subject}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  {canManageCourses && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(course)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCourse(course.id)}>
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
                <TableCell>Course Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Credits</TableCell>
                {canManageCourses && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveCourses.map((course) => (
                <TableRow key={course.id} hover sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.class}</TableCell>
                  <TableCell>{course.subject}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  {canManageCourses && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(course)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCourse(course.id)}>
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
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: course.status === 'inactive' ? 0.7 : 1
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={course.imageUrl || `https://source.unsplash.com/random/800x600/?${course.subject.toLowerCase()}`}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Chip 
                      label={course.code} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Chip 
                      label={`Class ${course.class}`} 
                      size="small" 
                      sx={{ mr: 0.5 }} 
                    />
                    <Chip 
                      label={course.subject} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teacher:</strong> {course.teacher}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Credits:</strong> {course.credits}
                  </Typography>
                  {course.status === 'inactive' && (
                    <Chip 
                      label="Inactive" 
                      size="small" 
                      color="default"
                      sx={{ mt: 1 }} 
                    />
                  )}
                </CardContent>
                {canManageCourses && (
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(course)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<Delete />}
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Add/Edit Course Dialog (simplified) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is a placeholder form. In a real application, this would be a complete form to add or edit course details.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Title"
                variant="outlined"
                defaultValue={selectedCourse?.title || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Code"
                variant="outlined"
                defaultValue={selectedCourse?.code || ''}
                margin="normal"
              />
            </Grid>
            {/* Additional form fields would go here */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCourse} variant="contained" color="primary">
            {selectedCourse ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courses;
