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
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const TimeTable: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('10th');
  const [selectedSection, setSelectedSection] = useState('A');

  // Time slots
  const timeSlots = [
    '09:00 - 09:45',
    '09:45 - 10:30',
    '10:30 - 11:15',
    '11:15 - 11:30', // Break
    '11:30 - 12:15',
    '12:15 - 01:00',
    '01:00 - 02:00', // Lunch Break
    '02:00 - 02:45',
    '02:45 - 03:30'
  ];

  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Sample timetable data
  const timetableData = {
    '10th-A': {
      Monday: ['Mathematics', 'Physics', 'Chemistry', 'Break', 'English', 'Hindi', 'Lunch', 'Computer Science', 'Physical Education'],
      Tuesday: ['Physics', 'Mathematics', 'Biology', 'Break', 'Chemistry', 'English', 'Lunch', 'History', 'Geography'],
      Wednesday: ['Chemistry', 'Biology', 'Mathematics', 'Break', 'Physics', 'Hindi', 'Lunch', 'English', 'Art'],
      Thursday: ['English', 'Chemistry', 'Physics', 'Break', 'Mathematics', 'Biology', 'Lunch', 'Computer Science', 'Music'],
      Friday: ['Mathematics', 'English', 'Hindi', 'Break', 'Physics', 'Chemistry', 'Lunch', 'Biology', 'Physical Education'],
      Saturday: ['Hindi', 'Mathematics', 'English', 'Break', 'Geography', 'History', 'Lunch', 'Art', 'Library']
    },
    '10th-B': {
      Monday: ['English', 'Mathematics', 'Physics', 'Break', 'Chemistry', 'Biology', 'Lunch', 'Hindi', 'Computer Science'],
      Tuesday: ['Mathematics', 'Physics', 'English', 'Break', 'Biology', 'Chemistry', 'Lunch', 'Geography', 'Physical Education'],
      Wednesday: ['Physics', 'Chemistry', 'Mathematics', 'Break', 'English', 'Hindi', 'Lunch', 'History', 'Art'],
      Thursday: ['Chemistry', 'Biology', 'Physics', 'Break', 'Mathematics', 'English', 'Lunch', 'Computer Science', 'Music'],
      Friday: ['Biology', 'English', 'Chemistry', 'Break', 'Physics', 'Mathematics', 'Lunch', 'Hindi', 'Physical Education'],
      Saturday: ['Mathematics', 'Hindi', 'English', 'Break', 'History', 'Geography', 'Lunch', 'Art', 'Library']
    },
    '9th-A': {
      Monday: ['Mathematics', 'Science', 'English', 'Break', 'Hindi', 'Social Science', 'Lunch', 'Computer Science', 'Physical Education'],
      Tuesday: ['Science', 'Mathematics', 'Hindi', 'Break', 'English', 'Social Science', 'Lunch', 'Art', 'Music'],
      Wednesday: ['English', 'Hindi', 'Mathematics', 'Break', 'Science', 'Social Science', 'Lunch', 'Computer Science', 'Physical Education'],
      Thursday: ['Hindi', 'English', 'Science', 'Break', 'Mathematics', 'Social Science', 'Lunch', 'Art', 'Library'],
      Friday: ['Mathematics', 'Science', 'Hindi', 'Break', 'English', 'Social Science', 'Lunch', 'Computer Science', 'Physical Education'],
      Saturday: ['Social Science', 'Mathematics', 'English', 'Break', 'Science', 'Hindi', 'Lunch', 'Art', 'Music']
    }
  };

  // Teacher assignments
  const teacherAssignments = {
    'Mathematics': 'डॉ. राजेश शर्मा',
    'Physics': 'प्रो. सुनीता वर्मा',
    'Chemistry': 'डॉ. अमित गुप्ता',
    'Biology': 'प्रो. प्रिया सिंह',
    'English': 'मिस रीता कुमार',
    'Hindi': 'डॉ. विकास तिवारी',
    'Computer Science': 'प्रो. राहुल अग्रवाल',
    'Physical Education': 'कोच संजय यादव',
    'History': 'डॉ. मीना शर्मा',
    'Geography': 'प्रो. अनिल कुमार',
    'Art': 'मिस सोनिया गुप्ता',
    'Music': 'उस्ताद रविशंकर',
    'Science': 'डॉ. नीता पटेल',
    'Social Science': 'प्रो. रमेश चंद्र',
    'Library': 'लाइब्रेरियन सुमित्रा देवी'
  };

  const getCurrentTimetable = () => {
    const key = `${selectedClass}-${selectedSection}`;
    return timetableData[key] || timetableData['10th-A'];
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return '#1976d2';
      case 'Physics': return '#7b1fa2';
      case 'Chemistry': return '#388e3c';
      case 'Biology': return '#f57c00';
      case 'English': return '#d32f2f';
      case 'Hindi': return '#303f9f';
      case 'Computer Science': return '#0097a7';
      case 'Physical Education': return '#689f38';
      case 'History': return '#5d4037';
      case 'Geography': return '#455a64';
      case 'Art': return '#e91e63';
      case 'Music': return '#8e24aa';
      case 'Science': return '#ff5722';
      case 'Social Science': return '#795548';
      case 'Break': return '#9e9e9e';
      case 'Lunch': return '#ff9800';
      case 'Library': return '#607d8b';
      default: return '#424242';
    }
  };

  const isBreakTime = (subject: string) => {
    return subject === 'Break' || subject === 'Lunch';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Time Table Management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              size="large"
            >
              Print Timetable
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
            >
              Create New Timetable
            </Button>
          </Box>
        </Box>

        {/* Class and Section Selection */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                label="Select Class"
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <MenuItem value="6th">6th Class</MenuItem>
                <MenuItem value="7th">7th Class</MenuItem>
                <MenuItem value="8th">8th Class</MenuItem>
                <MenuItem value="9th">9th Class</MenuItem>
                <MenuItem value="10th">10th Class</MenuItem>
                <MenuItem value="11th">11th Class</MenuItem>
                <MenuItem value="12th">12th Class</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Select Section</InputLabel>
              <Select
                value={selectedSection}
                label="Select Section"
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <MenuItem value="A">Section A</MenuItem>
                <MenuItem value="B">Section B</MenuItem>
                <MenuItem value="C">Section C</MenuItem>
                <MenuItem value="D">Section D</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Class: {selectedClass} - {selectedSection}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Academic Year: 2025-26
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Timetable Display */}
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              📅 Weekly Time Table - {selectedClass} {selectedSection}
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      bgcolor: 'grey.100', 
                      fontWeight: 'bold', 
                      fontSize: '16px',
                      minWidth: 120
                    }}
                  >
                    Time / Day
                  </TableCell>
                  {days.map((day) => (
                    <TableCell 
                      key={day} 
                      align="center"
                      sx={{ 
                        bgcolor: 'grey.100', 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        minWidth: 150
                      }}
                    >
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((timeSlot, timeIndex) => (
                  <TableRow key={timeSlot} hover>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        bgcolor: 'grey.50',
                        fontSize: '14px'
                      }}
                    >
                      {timeSlot}
                    </TableCell>
                    {days.map((day) => {
                      const subject = getCurrentTimetable()[day]?.[timeIndex] || 'Free Period';
                      const teacher = teacherAssignments[subject] || '';
                      const isBreak = isBreakTime(subject);
                      
                      return (
                        <TableCell 
                          key={`${day}-${timeIndex}`} 
                          align="center"
                          sx={{ 
                            p: 1,
                            bgcolor: isBreak ? 'grey.100' : 'white'
                          }}
                        >
                          <Card
                            sx={{
                              minHeight: 70,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              bgcolor: getSubjectColor(subject),
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: 3
                              }
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              textAlign="center"
                              sx={{ fontSize: '12px' }}
                            >
                              {subject}
                            </Typography>
                            {!isBreak && teacher && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: '10px', 
                                  opacity: 0.9,
                                  mt: 0.5 
                                }}
                                textAlign="center"
                              >
                                {teacher}
                              </Typography>
                            )}
                          </Card>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Subject Legend */}
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            📚 Subject Legend & Teachers
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(teacherAssignments).map(([subject, teacher]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={subject}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: getSubjectColor(subject),
                      mr: 2,
                      borderRadius: 1
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {teacher}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            ⚡ Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                sx={{ py: 2 }}
              >
                Edit Timetable
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                sx={{ py: 2 }}
              >
                Add New Period
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PrintIcon />}
                sx={{ py: 2 }}
              >
                Print Schedule
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                sx={{ py: 2 }}
              >
                Export to Excel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default TimeTable;
