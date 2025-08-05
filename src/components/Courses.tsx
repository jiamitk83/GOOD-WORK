import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Class as ClassIcon
} from '@mui/icons-material';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  teacher: string;
  class: string;
  subject: string;
  duration: string;
  credits: number;
  schedule: string;
  status: 'Active' | 'Inactive';
}

const Courses: React.FC = () => {
  // localStorage से data load करें या default data use करें
  const getInitialCourses = (): Course[] => {
    const savedCourses = localStorage.getItem('school-erp-courses');
    if (savedCourses) {
      return JSON.parse(savedCourses);
    }
    return [
      {
        id: 1,
        courseCode: 'MATH10A',
        courseName: 'गणित - कक्षा 10',
        description: 'बीजगणित, ज्यामिति और त्रिकोणमिति के मूल सिद्धांत',
        teacher: 'डॉ. अनिता शर्मा',
        class: '10th',
        subject: 'गणित',
        duration: '1 वर्ष',
        credits: 6,
        schedule: 'सोम, बुध, शुक्र - 9:00 AM',
        status: 'Active'
      },
      {
        id: 2,
        courseCode: 'PHY10A',
        courseName: 'भौतिक विज्ञान - कक्षा 10',
        description: 'प्रकाश, विद्युत और गति के नियम',
        teacher: 'राजेश कुमार',
        class: '10th',
        subject: 'भौतिक विज्ञान',
        duration: '1 वर्ष',
        credits: 6,
        schedule: 'मंगल, गुरु, शनि - 10:00 AM',
        status: 'Active'
      },
    {
      id: 3,
      courseCode: 'ENG9A',
      courseName: 'अंग्रेजी साहित्य - कक्षा 9',
      description: 'अंग्रेजी व्याकरण और साहित्य की समझ',
      teacher: 'सुनीता वर्मा',
      class: '9th',
      subject: 'अंग्रेजी',
      duration: '1 वर्ष',
      credits: 4,
      schedule: 'सोम, मंगल, बुध - 11:00 AM',
      status: 'Inactive'
    },
    {
      id: 4,
      courseCode: 'SCI8A',
      courseName: 'विज्ञान - कक्षा 8',
      description: 'जीव विज्ञान, भौतिक और रसायन के मूल सिद्धांत',
      teacher: 'राजेश कुमार',
      class: '8th',
      subject: 'विज्ञान',
      duration: '1 वर्ष',
      credits: 5,
      schedule: 'सोम, गुरु - 2:00 PM',
      status: 'Active'
    }
    ];
  };

  const [courses, setCourses] = useState<Course[]>(getInitialCourses);

  // localStorage में courses को save करने का function
  const saveCoursesToStorage = (updatedCourses: Course[]) => {
    localStorage.setItem('school-erp-courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    courseCode: '',
    courseName: '',
    description: '',
    teacher: '',
    class: '',
    subject: '',
    duration: '',
    credits: 0,
    schedule: '',
    status: 'Active'
  });

  const handleOpen = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        courseCode: '',
        courseName: '',
        description: '',
        teacher: '',
        class: '',
        subject: '',
        duration: '',
        credits: 0,
        schedule: '',
        status: 'Active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (editingCourse) {
      const updatedCourses = courses.map(c => 
        c.id === editingCourse.id 
          ? { ...editingCourse, ...formData }
          : c
      );
      saveCoursesToStorage(updatedCourses);
    } else {
      const newCourse: Course = {
        id: Math.max(...courses.map(c => c.id)) + 1,
        courseCode: formData.courseCode || '',
        courseName: formData.courseName || '',
        description: formData.description || '',
        teacher: formData.teacher || '',
        class: formData.class || '',
        subject: formData.subject || '',
        duration: formData.duration || '',
        credits: formData.credits || 0,
        schedule: formData.schedule || '',
        status: formData.status as 'Active' | 'Inactive' || 'Active'
      };
      saveCoursesToStorage([...courses, newCourse]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    saveCoursesToStorage(updatedCourses);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: any } = {
      'गणित': 'primary',
      'भौतिक विज्ञान': 'secondary',
      'अंग्रेजी': 'info',
      'विज्ञान': 'warning',
      'हिंदी': 'error'
    };
    return colors[subject] || 'default';
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BookIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Courses Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add New Course
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {courses.filter(c => c.status === 'Active').length}
                </Typography>
                <Typography variant="body2">Active Courses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {courses.filter(c => c.status === 'Inactive').length}
                </Typography>
                <Typography variant="body2">Inactive Courses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {courses.length}
                </Typography>
                <Typography variant="body2">Total Courses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {[...new Set(courses.map(c => c.teacher))].length}
                </Typography>
                <Typography variant="body2">Teachers</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {course.courseName}
                    </Typography>
                    <Chip 
                      label={course.courseCode} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                  <Chip 
                    label={course.status} 
                    color={getStatusColor(course.status)} 
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{course.teacher}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ClassIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Class {course.class}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{course.schedule}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={course.subject} 
                    size="small" 
                    color={getSubjectColor(course.subject)}
                  />
                  <Chip 
                    label={`${course.credits} Credits`} 
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    label={course.duration} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpen(course)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(course.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Course Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                value={formData.courseCode || ''}
                onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={formData.courseName || ''}
                onChange={(e) => setFormData({...formData, courseName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={formData.teacher || ''}
                  label="Teacher"
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                >
                  <MenuItem value="डॉ. अनिता शर्मा">डॉ. अनिता शर्मा</MenuItem>
                  <MenuItem value="राजेश कुमार">राजेश कुमार</MenuItem>
                  <MenuItem value="सुनीता वर्मा">सुनीता वर्मा</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subject || ''}
                  label="Subject"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <MenuItem value="गणित">गणित</MenuItem>
                  <MenuItem value="भौतिक विज्ञान">भौतिक विज्ञान</MenuItem>
                  <MenuItem value="रसायन विज्ञान">रसायन विज्ञान</MenuItem>
                  <MenuItem value="जीव विज्ञान">जीव विज्ञान</MenuItem>
                  <MenuItem value="अंग्रेजी">अंग्रेजी</MenuItem>
                  <MenuItem value="हिंदी">हिंदी</MenuItem>
                  <MenuItem value="सामाजिक विज्ञान">सामाजिक विज्ञान</MenuItem>
                  <MenuItem value="विज्ञान">विज्ञान</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={formData.credits || ''}
                onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Schedule"
                value={formData.schedule || ''}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCourse ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courses;

