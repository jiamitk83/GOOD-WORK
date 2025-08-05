import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  Print,
  SaveAlt,
  AccessTime
} from '@mui/icons-material';

// Time slots for schedule
const timeSlots = [
  '8:00 AM - 8:45 AM',
  '8:50 AM - 9:35 AM',
  '9:40 AM - 10:25 AM',
  '10:30 AM - 11:15 AM',
  '11:20 AM - 12:05 PM',
  '12:10 PM - 12:55 PM',
  '1:30 PM - 2:15 PM',
  '2:20 PM - 3:05 PM',
  '3:10 PM - 3:55 PM'
];

// Weekdays
const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Class levels
const classes = ['Nursery', 'KG', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'];

// Subjects
const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Studies',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
  'Environmental Science',
  'Physics',
  'Chemistry',
  'Biology'
];

// Mock teachers data
const teachers = [
  { id: 1, name: 'Mr. Sharma', subject: 'Mathematics' },
  { id: 2, name: 'Mrs. Gupta', subject: 'Science' },
  { id: 3, name: 'Mr. Verma', subject: 'English' },
  { id: 4, name: 'Mrs. Singh', subject: 'Hindi' },
  { id: 5, name: 'Mr. Kumar', subject: 'Social Studies' },
  { id: 6, name: 'Mrs. Patel', subject: 'Computer Science' },
  { id: 7, name: 'Mr. Rao', subject: 'Physical Education' },
  { id: 8, name: 'Mrs. Joshi', subject: 'Art' },
  { id: 9, name: 'Mr. Saxena', subject: 'Music' }
];

// Mock schedule data
const initialSchedule: Record<string, Record<string, Array<{
  subject: string;
  teacher: string;
  room?: string;
}>>> = {};

// Initialize empty schedule for all classes
classes.forEach(cls => {
  initialSchedule[cls] = {};
  weekdays.forEach(day => {
    initialSchedule[cls][day] = Array(timeSlots.length).fill(null).map(() => ({
      subject: '',
      teacher: '',
      room: ''
    }));
  });
});

// Fill some sample data for 5th Standard
initialSchedule['5th Standard']['Monday'][0] = { subject: 'Mathematics', teacher: 'Mr. Sharma', room: '101' };
initialSchedule['5th Standard']['Monday'][1] = { subject: 'Science', teacher: 'Mrs. Gupta', room: '102' };
initialSchedule['5th Standard']['Monday'][2] = { subject: 'English', teacher: 'Mr. Verma', room: '103' };
initialSchedule['5th Standard']['Tuesday'][0] = { subject: 'Hindi', teacher: 'Mrs. Singh', room: '104' };
initialSchedule['5th Standard']['Tuesday'][1] = { subject: 'Social Studies', teacher: 'Mr. Kumar', room: '105' };
initialSchedule['5th Standard']['Wednesday'][3] = { subject: 'Computer Science', teacher: 'Mrs. Patel', room: '201' };

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface TimeTableProps {
  readOnly?: boolean;
}

const TimeTable: React.FC<TimeTableProps> = ({ readOnly = false }) => {
  const [tabValue, setTabValue] = useState(0);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedClass, setSelectedClass] = useState('5th Standard');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    day: string;
    period: number;
    subject: string;
    teacher: string;
    room: string;
  }>({
    day: '',
    period: 0,
    subject: '',
    teacher: '',
    room: ''
  });
  
  // For teacher view
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [conflictAlert, setConflictAlert] = useState<string | null>(null);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setSelectedClass(event.target.value);
  };
  
  const handleTeacherChange = (event: SelectChangeEvent<string>) => {
    setSelectedTeacher(event.target.value);
  };
  
  const handleEditCell = (day: string, period: number) => {
    const currentSchedule = schedule[selectedClass][day][period];
    setCurrentEdit({
      day,
      period,
      subject: currentSchedule.subject || '',
      teacher: currentSchedule.teacher || '',
      room: currentSchedule.room || ''
    });
    setEditDialogOpen(true);
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentEdit({
      ...currentEdit,
      [name]: value
    });
  };
  
  const handleSaveSchedule = () => {
    // Check for teacher conflicts
    const hasConflict = checkTeacherConflict(
      currentEdit.day,
      currentEdit.period,
      currentEdit.teacher
    );
    
    if (hasConflict) {
      setConflictAlert(`Teacher ${currentEdit.teacher} already has a class at this time.`);
      return;
    }
    
    const newSchedule = { ...schedule };
    newSchedule[selectedClass][currentEdit.day][currentEdit.period] = {
      subject: currentEdit.subject,
      teacher: currentEdit.teacher,
      room: currentEdit.room
    };
    
    setSchedule(newSchedule);
    setEditDialogOpen(false);
    setConflictAlert(null);
  };
  
  const checkTeacherConflict = (day: string, period: number, teacher: string): boolean => {
    if (!teacher) return false;
    
    // Check all classes for this teacher at the same day and period
    for (const cls of classes) {
      if (cls !== selectedClass && 
          schedule[cls][day][period] && 
          schedule[cls][day][period].teacher === teacher) {
        return true;
      }
    }
    
    return false;
  };
  
  const getTeacherSchedule = () => {
    if (!selectedTeacher) return [];
    
    const teacherClasses: Array<{
      day: string;
      period: number;
      time: string;
      class: string;
      subject: string;
      room: string;
    }> = [];
    
    // Check all classes and periods for this teacher
    for (const cls of classes) {
      for (const day of weekdays) {
        for (let period = 0; period < timeSlots.length; period++) {
          const slot = schedule[cls][day][period];
          if (slot && slot.teacher === selectedTeacher) {
            teacherClasses.push({
              day,
              period,
              time: timeSlots[period],
              class: cls,
              subject: slot.subject,
              room: slot.room || ''
            });
          }
        }
      }
    }
    
    // Sort by day and period
    return teacherClasses.sort((a, b) => {
      const dayDiff = weekdays.indexOf(a.day) - weekdays.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.period - b.period;
    });
  };
  
  const handleClearPeriod = (day: string, period: number) => {
    const newSchedule = { ...schedule };
    newSchedule[selectedClass][day][period] = {
      subject: '',
      teacher: '',
      room: ''
    };
    setSchedule(newSchedule);
  };
  
  const renderCellContent = (day: string, period: number) => {
    const slot = schedule[selectedClass][day][period];
    
    if (!slot || (!slot.subject && !slot.teacher)) {
      return (
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'text.secondary',
          fontStyle: 'italic'
        }}>
          {!readOnly && (
            <IconButton 
              size="small"
              onClick={() => handleEditCell(day, period)}
              sx={{ p: 0.5 }}
            >
              <Add fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    }
    
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {slot.subject}
        </Typography>
        {slot.teacher && (
          <Typography variant="caption" display="block">
            {slot.teacher}
          </Typography>
        )}
        {slot.room && (
          <Typography variant="caption" color="text.secondary" display="block">
            Room: {slot.room}
          </Typography>
        )}
        {!readOnly && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <IconButton 
              size="small" 
              onClick={() => handleEditCell(day, period)}
              sx={{ p: 0.5 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleClearPeriod(day, period)}
              sx={{ p: 0.5 }}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        <Typography variant="h4" sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          Time Table Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="timetable tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Schedule />} label="Class Schedule" />
            <Tab icon={<AccessTime />} label="Teacher Schedule" />
          </Tabs>
        </Box>
        
        {/* Class Schedule Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="class-select-label">Select Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  value={selectedClass}
                  label="Select Class"
                  onChange={handleClassChange}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!readOnly && (
                <Button 
                  variant="outlined" 
                  startIcon={<SaveAlt />}
                  sx={{ mr: 1 }}
                >
                  Save Changes
                </Button>
              )}
              <Button 
                variant="outlined" 
                startIcon={<Print />}
              >
                Print Schedule
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom>
            Class Schedule for {selectedClass}
          </Typography>
          
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell>Time</TableCell>
                  {weekdays.map((day) => (
                    <TableCell key={day} align="center">{day}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((time, timeIndex) => (
                  <TableRow key={time} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ mr: 1 }} />
                        {time}
                      </Box>
                    </TableCell>
                    {weekdays.map((day) => (
                      <TableCell 
                        key={`${day}-${timeIndex}`} 
                        align="center"
                        sx={{ 
                          border: 1, 
                          borderColor: 'divider',
                          p: 1,
                          minHeight: '100px',
                          '&:hover': {
                            bgcolor: !readOnly ? 'action.hover' : 'inherit'
                          }
                        }}
                      >
                        {renderCellContent(day, timeIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Teacher Schedule Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
                <Select
                  labelId="teacher-select-label"
                  value={selectedTeacher}
                  label="Select Teacher"
                  onChange={handleTeacherChange}
                >
                  <MenuItem value="">
                    <em>Select a teacher</em>
                  </MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.name}>
                      {teacher.name} ({teacher.subject})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<Print />}
                disabled={!selectedTeacher}
              >
                Print Teacher Schedule
              </Button>
            </Grid>
          </Grid>
          
          {selectedTeacher ? (
            <>
              <Typography variant="h6" gutterBottom>
                Schedule for {selectedTeacher}
              </Typography>
              
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Room</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getTeacherSchedule().map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.day}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.class}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.room}</TableCell>
                      </TableRow>
                    ))}
                    {getTeacherSchedule().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No classes scheduled for this teacher
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Typography variant="h6" color="text.secondary">
                Please select a teacher to view their schedule
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>
          Edit Schedule - {currentEdit.day} Period {currentEdit.period + 1}
        </DialogTitle>
        <DialogContent>
          {conflictAlert && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {conflictAlert}
            </Alert>
          )}
          
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="subject-select-label">Subject</InputLabel>
                  <Select
                    labelId="subject-select-label"
                    name="subject"
                    value={currentEdit.subject}
                    label="Subject"
                    onChange={handleEditChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="teacher-edit-select-label">Teacher</InputLabel>
                  <Select
                    labelId="teacher-edit-select-label"
                    name="teacher"
                    value={currentEdit.teacher}
                    label="Teacher"
                    onChange={handleEditChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.name}>
                        {teacher.name} ({teacher.subject})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="room"
                  label="Room Number"
                  fullWidth
                  value={currentEdit.room}
                  onChange={handleEditChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveSchedule}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimeTable;