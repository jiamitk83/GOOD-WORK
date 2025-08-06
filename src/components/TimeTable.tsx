import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Chip,
  Divider,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Print,
  Schedule,
  RotateLeft,
  Download,
  Settings
} from '@mui/icons-material';
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
      id={`timetable-tabpanel-${index}`}
      aria-labelledby={`timetable-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Define the time slots for the timetable
const timeSlots = [
  { id: '1', start: '08:00', end: '08:45', label: 'Period 1 (8:00 - 8:45)' },
  { id: '2', start: '08:45', end: '09:30', label: 'Period 2 (8:45 - 9:30)' },
  { id: '3', start: '09:30', end: '10:15', label: 'Period 3 (9:30 - 10:15)' },
  { id: '4', start: '10:15', end: '10:30', label: 'Break (10:15 - 10:30)' },
  { id: '5', start: '10:30', end: '11:15', label: 'Period 4 (10:30 - 11:15)' },
  { id: '6', start: '11:15', end: '12:00', label: 'Period 5 (11:15 - 12:00)' },
  { id: '7', start: '12:00', end: '12:45', label: 'Period 6 (12:00 - 12:45)' },
  { id: '8', start: '12:45', end: '13:30', label: 'Lunch (12:45 - 1:30)' },
  { id: '9', start: '13:30', end: '14:15', label: 'Period 7 (1:30 - 2:15)' },
  { id: '10', start: '14:15', end: '15:00', label: 'Period 8 (2:15 - 3:00)' }
];

// Define days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Define classes and sections
const classes = ['8', '9', '10', '11', '12'];
const sections = {
  '8': ['A', 'B', 'C'],
  '9': ['A', 'B', 'C', 'D'],
  '10': ['A', 'B', 'C'],
  '11': ['Science', 'Commerce', 'Arts'],
  '12': ['Science', 'Commerce', 'Arts']
};

// Define subjects
const subjects = [
  { id: '1', name: 'Mathematics', code: 'MATH', color: '#4caf50' },
  { id: '2', name: 'Physics', code: 'PHY', color: '#2196f3' },
  { id: '3', name: 'Chemistry', code: 'CHEM', color: '#f44336' },
  { id: '4', name: 'Biology', code: 'BIO', color: '#9c27b0' },
  { id: '5', name: 'English', code: 'ENG', color: '#ff9800' },
  { id: '6', name: 'Hindi', code: 'HIN', color: '#795548' },
  { id: '7', name: 'Social Studies', code: 'SOC', color: '#607d8b' },
  { id: '8', name: 'Computer Science', code: 'CS', color: '#00bcd4' },
  { id: '9', name: 'Physical Education', code: 'PE', color: '#8bc34a' },
  { id: '10', name: 'Art', code: 'ART', color: '#ff5722' }
];

// Define teachers
const teachers = [
  { id: '1', name: 'Mr. Sharma', subjects: ['1', '2'], initials: 'MS' },
  { id: '2', name: 'Mrs. Gupta', subjects: ['3', '4'], initials: 'MG' },
  { id: '3', name: 'Mr. Singh', subjects: ['5', '6'], initials: 'SS' },
  { id: '4', name: 'Dr. Patel', subjects: ['7', '8'], initials: 'DP' },
  { id: '5', name: 'Mrs. Khan', subjects: ['9', '10'], initials: 'MK' }
];

// Define timetable slots
interface TimetableSlot {
  id: string;
  timeSlotId: string;
  day: string;
  subjectId: string;
  teacherId: string;
  room: string;
}

// Generate a sample timetable for a class and section
const generateSampleTimetable = (_classId: string, _sectionId: string): TimetableSlot[] => {
  const timetable: TimetableSlot[] = [];
  let counter = 1;

  // Loop through each day and time slot
  daysOfWeek.forEach(day => {
    timeSlots.forEach(timeSlot => {
      // Skip breaks and lunch periods
      if (timeSlot.id === '4' || timeSlot.id === '8') return;

      // Assign a random subject and teacher
      const subjectIndex = Math.floor(Math.random() * subjects.length);
      const teacherIndex = Math.floor(Math.random() * teachers.length);

      timetable.push({
        id: `${counter++}`,
        timeSlotId: timeSlot.id,
        day,
        subjectId: subjects[subjectIndex].id,
        teacherId: teachers[teacherIndex].id,
        room: `R${Math.floor(Math.random() * 20) + 101}`
      });
    });
  });

  return timetable;
};

// Create sample timetables
const sampleTimetables: Record<string, Record<string, TimetableSlot[]>> = {};
classes.forEach(cls => {
  sampleTimetables[cls] = {};
  sections[cls as keyof typeof sections].forEach(section => {
    sampleTimetables[cls][section] = generateSampleTimetable(cls, section);
  });
});

const TimeTable: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [openSlotDialog, setOpenSlotDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [loading, setLoading] = useState(false);

  // Check permissions
  const canManageTimetable = user?.role === 'admin' || checkPermission('manage_timetable');
  const canViewTimetable = user?.role === 'admin' || checkPermission('view_timetable');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle selection changes
  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const classValue = event.target.value as string;
    setSelectedClass(classValue);
    setSelectedSection('');
    setTimetableData([]);
  };

  const handleSectionChange = (event: SelectChangeEvent<string>) => {
    const sectionValue = event.target.value as string;
    setSelectedSection(sectionValue);
    
    // Fetch timetable data for the selected class and section
    if (selectedClass && sectionValue) {
      // In a real app, we would fetch from an API
      setTimetableData(sampleTimetables[selectedClass][sectionValue]);
    } else {
      setTimetableData([]);
    }
  };

  const handleTeacherChange = (event: SelectChangeEvent<string>) => {
    const teacherValue = event.target.value as string;
    setSelectedTeacher(teacherValue);
    
    // Fetch timetable data for the selected teacher
    if (teacherValue) {
      // In a real app, we would fetch from an API
      // For now, we'll just show an empty timetable
      setTimetableData([]);
    }
  };

  // Handle slot dialog
  const handleOpenSlotDialog = (day: string, timeSlotId: string, slot?: TimetableSlot) => {
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlotId);
    
    if (slot) {
      setSelectedSlot(slot);
    } else {
      setSelectedSlot(null);
    }
    
    setOpenSlotDialog(true);
  };

  const handleCloseSlotDialog = () => {
    setOpenSlotDialog(false);
  };

  const handleSaveSlot = () => {
    // In a real app, we would save to an API
    handleCloseSlotDialog();
    setSnackbar({
      open: true,
      message: selectedSlot ? 'Timetable slot updated successfully' : 'Timetable slot added successfully',
      severity: 'success'
    });
  };

  // Handle save timetable
  const handleSaveTimetable = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEditMode(false);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Timetable saved successfully',
        severity: 'success'
      });
    }, 1000);
  };

  // Check for conflicts in timetable
  const checkConflicts = (_teacherId: string, _day: string, _timeSlotId: string): boolean => {
    // In a real app, this would check across all class timetables
    return Math.random() > 0.8; // Simulate conflicts
  };

  // Get conflict status for a slot
  const getConflictStatus = (slot: TimetableSlot): boolean => {
    return checkConflicts(slot.teacherId, slot.day, slot.timeSlotId);
  };

  // Get a slot for a specific day and time slot
  const getSlot = (day: string, timeSlotId: string): TimetableSlot | undefined => {
    return timetableData.find(slot => slot.day === day && slot.timeSlotId === timeSlotId);
  };

  // Get subject details by ID
  const getSubject = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId);
  };

  // Get teacher details by ID
  const getTeacher = (teacherId: string) => {
    return teachers.find(teacher => teacher.id === teacherId);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Render timetable slot
  const renderSlot = (day: string, timeSlotId: string) => {
    const slot = getSlot(day, timeSlotId);
    
    // Skip rendering for break and lunch periods
    if (timeSlotId === '4' || timeSlotId === '8') {
      return (
        <TableCell
          align="center"
          sx={{
            bgcolor: 'grey.100',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            p: 2,
            border: '2px solid #e0e0e0',
            borderRadius: 1
          }}
        >
          <Box sx={{ 
            bgcolor: timeSlotId === '4' ? 'info.light' : 'warning.light',
            color: 'white',
            p: 1,
            borderRadius: 1,
            fontWeight: 'bold'
          }}>
            {timeSlotId === '4' ? '☕ BREAK' : '🍽️ LUNCH'}
          </Box>
        </TableCell>
      );
    }
    
    if (!slot) {
      return (
        <TableCell 
          align="center" 
          sx={{ 
            p: 2,
            border: '1px solid #e0e0e0',
            minHeight: 80,
            backgroundColor: editMode ? 'action.hover' : 'inherit',
            '&:hover': {
              backgroundColor: editMode ? 'action.selected' : 'inherit',
              cursor: editMode ? 'pointer' : 'default'
            }
          }}
          onClick={() => editMode && handleOpenSlotDialog(day, timeSlotId)}
        >
          {editMode && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 1
            }}>
              <Add fontSize="small" color="primary" />
              <Typography variant="caption" color="text.secondary">
                Add Class
              </Typography>
            </Box>
          )}
        </TableCell>
      );
    }
    
    const subject = getSubject(slot.subjectId);
    const teacher = getTeacher(slot.teacherId);
    const hasConflict = getConflictStatus(slot);
    
    return (
      <TableCell
        align="center"
        onClick={() => editMode && handleOpenSlotDialog(day, timeSlotId, slot)}
        sx={{
          cursor: editMode ? 'pointer' : 'default',
          p: 1,
          border: hasConflict ? '2px solid #f44336' : '1px solid #e0e0e0',
          position: 'relative',
          backgroundColor: hasConflict ? 'error.light' : 'inherit',
          '&:hover': {
            bgcolor: editMode ? 'action.hover' : 'inherit',
            transform: editMode ? 'scale(1.02)' : 'none',
            transition: 'all 0.2s ease-in-out',
            boxShadow: editMode ? 2 : 'none'
          }
        }}
      >
        <Box
          sx={{
            bgcolor: subject?.color || '#9e9e9e',
            p: 1.5,
            borderRadius: 1,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            minHeight: 60,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 1
          }}
        >
          {hasConflict && (
            <Box sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              bgcolor: 'error.main',
              color: 'white',
              borderRadius: '50%',
              width: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem'
            }}>
              !
            </Box>
          )}
          
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {subject?.code || 'N/A'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {subject?.name || 'No Subject'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 0.5, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ 
            display: 'block', 
            fontWeight: 'medium',
            color: 'text.primary'
          }}>
            {teacher?.initials || 'N/A'}
          </Typography>
          <Typography variant="caption" sx={{ 
            display: 'block',
            color: 'text.secondary',
            fontSize: '0.7rem'
          }}>
            {slot.room}
          </Typography>
        </Box>
        
        {editMode && (
          <IconButton
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSlotDialog(day, timeSlotId, slot);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    );
  };

  if (!canViewTimetable) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access Timetable Management.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Timetable Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="timetable tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Schedule />} 
            label="Class Timetable" 
            iconPosition="start"
          />
          <Tab 
            icon={<Schedule />} 
            label="Teacher Timetable" 
            iconPosition="start"
          />
          <Tab 
            icon={<Settings />} 
            label="Timetable Settings" 
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={handleClassChange}
                >
                  <MenuItem value="">
                    <em>Select Class</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth disabled={!selectedClass}>
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  label="Section"
                  onChange={handleSectionChange}
                >
                  <MenuItem value="">
                    <em>Select Section</em>
                  </MenuItem>
                  {selectedClass && sections[selectedClass as keyof typeof sections].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {selectedClass && selectedSection && (
                <>
                  {!editMode && canManageTimetable && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Timetable
                    </Button>
                  )}
                  {editMode && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSaveTimetable}
                      disabled={loading}
                      sx={{ minWidth: 140 }}
                    >
                      {loading ? 'Saving...' : 'Save Timetable'}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                  >
                    Print
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {selectedClass && selectedSection ? (
          <>
            {/* Timetable Statistics */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {timetableData.filter(slot => slot.timeSlotId !== '4' && slot.timeSlotId !== '8').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Classes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {new Set(timetableData.map(slot => slot.subjectId)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subjects
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {new Set(timetableData.map(slot => slot.teacherId)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teachers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {timetableData.filter(slot => getConflictStatus(slot)).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Conflicts
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ overflow: 'auto' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        minWidth: 120
                      }}
                    >
                      🕐 Time / Day
                    </TableCell>
                    {daysOfWeek.map((day) => (
                      <TableCell 
                        key={day} 
                        align="center" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'white',
                          fontSize: '0.9rem',
                          minWidth: 140
                        }}
                      >
                        📅 {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeSlots.map((timeSlot) => (
                    <TableRow key={timeSlot.id} hover sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                      height: 90
                    }}>
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap', 
                        fontWeight: 'bold',
                        bgcolor: timeSlot.id === '4' || timeSlot.id === '8' ? 'grey.100' : 'inherit',
                        borderRight: '2px solid #e0e0e0',
                        textAlign: 'center',
                        p: 2
                      }}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {timeSlot.id === '4' ? '☕ Break' : 
                             timeSlot.id === '8' ? '🍽️ Lunch' : 
                             `Period ${timeSlot.id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {timeSlot.start} - {timeSlot.end}
                          </Typography>
                        </Box>
                      </TableCell>
                      {daysOfWeek.map((day) => (
                        <React.Fragment key={`${day}-${timeSlot.id}`}>
                          {renderSlot(day, timeSlot.id)}
                        </React.Fragment>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a class and section to view the timetable.
            </Typography>
          </Paper>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={selectedTeacher}
                  label="Teacher"
                  onChange={handleTeacherChange}
                >
                  <MenuItem value="">
                    <em>Select Teacher</em>
                  </MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {selectedTeacher && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                  >
                    Print
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {selectedTeacher ? (
          <Paper sx={{ overflow: 'auto' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time / Day</TableCell>
                    {daysOfWeek.map((day) => (
                      <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Teacher timetable view would be implemented here */}
                  {timeSlots.map((timeSlot) => (
                    <TableRow key={timeSlot.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                        {timeSlot.label}
                      </TableCell>
                      {daysOfWeek.map((day) => (
                        <TableCell key={`${day}-${timeSlot.id}`} align="center">
                          {/* This would be populated with the teacher's schedule */}
                          {timeSlot.id === '4' || timeSlot.id === '8' ? (
                            <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                              {timeSlot.id === '4' ? 'BREAK' : 'LUNCH'}
                            </Box>
                          ) : Math.random() > 0.5 ? (
                            <Box sx={{ p: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Class {classes[Math.floor(Math.random() * classes.length)]}-
                                {sections['9'][Math.floor(Math.random() * sections['9'].length)]}
                              </Typography>
                              <Chip
                                label={subjects[Math.floor(Math.random() * subjects.length)].name}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                Room: R{Math.floor(Math.random() * 20) + 101}
                              </Typography>
                            </Box>
                          ) : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a teacher to view their timetable.
            </Typography>
          </Paper>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Timetable Settings</Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={!canManageTimetable}
            >
              Save Settings
            </Button>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Time Slots
          </Typography>
          
          <TableContainer sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Slot Name</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow key={slot.id} hover>
                    <TableCell>Period {slot.id}</TableCell>
                    <TableCell>{slot.start}</TableCell>
                    <TableCell>{slot.end}</TableCell>
                    <TableCell>
                      <Chip
                        label={slot.id === '4' || slot.id === '8' ? 'Break' : 'Class'}
                        color={slot.id === '4' || slot.id === '8' ? 'default' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small" disabled={!canManageTimetable}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" size="small" disabled={!canManageTimetable}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Working Days
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              size="small"
              disabled={!canManageTimetable}
            >
              Add Day
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {daysOfWeek.map((day) => (
              <Chip
                key={day}
                label={day}
                onDelete={canManageTimetable ? () => {} : undefined}
                color="primary"
              />
            ))}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Timetable Generation
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RotateLeft />}
              disabled={!canManageTimetable}
            >
              Generate Timetable
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Automatically generate timetables based on available teachers, subjects, and classrooms.
            This will create a draft timetable that you can then edit manually as needed.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value=""
                  label="Class"
                  disabled={!canManageTimetable}
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Working Days</InputLabel>
                <Select
                  value="6"
                  label="Working Days"
                  disabled={!canManageTimetable}
                >
                  <MenuItem value="5">5 Days (Mon-Fri)</MenuItem>
                  <MenuItem value="6">6 Days (Mon-Sat)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>
      
      {/* Edit Slot Dialog */}
      <Dialog open={openSlotDialog} onClose={handleCloseSlotDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSlot ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Day"
                value={selectedDay}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Slot"
                value={timeSlots.find(slot => slot.id === selectedTimeSlot)?.label || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  label="Subject"
                  defaultValue={selectedSlot?.subjectId || ''}
                >
                  <MenuItem value="">
                    <em>Select Subject</em>
                  </MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  label="Teacher"
                  defaultValue={selectedSlot?.teacherId || ''}
                >
                  <MenuItem value="">
                    <em>Select Teacher</em>
                  </MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room"
                defaultValue={selectedSlot?.room || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSlotDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveSlot}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeTable;
