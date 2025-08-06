import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  SelectChangeEvent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  Alert,
  Card,
  CardContent,
  Snackbar
} from '@mui/material';
import { 
  CalendarMonth, 
  Edit, 
  Save, 
  PersonAdd, 
  AssignmentTurnedIn, 
  Assignment, 
  AssignmentLate, 
  Today, 
  DateRange,
  Print,
  CloudDownload,
  Refresh
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
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
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
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

interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: 'present' | 'absent' | 'late' | 'leave' | '';
  remark: string;
}

interface AttendanceData {
  date: Date;
  class: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  students: Student[];
}

// Sample classes and sections
const classes = ['8', '9', '10', '11', '12'];
const sections = {
  '8': ['A', 'B', 'C'],
  '9': ['A', 'B', 'C', 'D'],
  '10': ['A', 'B', 'C'],
  '11': ['Science', 'Commerce', 'Arts'],
  '12': ['Science', 'Commerce', 'Arts']
};

// Sample students data
const generateStudents = (count: number): Student[] => {
  const students: Student[] = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `s${i}`,
      rollNo: `R${i.toString().padStart(3, '0')}`,
      name: `Student ${i}`,
      status: '',
      remark: ''
    });
  }
  return students;
};

// Sample attendance records
const sampleAttendanceRecords: AttendanceData[] = [
  {
    date: new Date(2023, 7, 5), // August 5, 2023
    class: '9',
    section: 'B',
    totalStudents: 40,
    present: 35,
    absent: 3,
    late: 1,
    leave: 1,
    students: generateStudents(40).map((student, index) => {
      if (index < 35) {
        return { ...student, status: 'present' };
      } else if (index < 38) {
        return { ...student, status: 'absent' };
      } else if (index < 39) {
        return { ...student, status: 'late', remark: 'Bus delay' };
      } else {
        return { ...student, status: 'leave', remark: 'Medical leave' };
      }
    })
  },
  {
    date: new Date(2023, 7, 4), // August 4, 2023
    class: '9',
    section: 'B',
    totalStudents: 40,
    present: 38,
    absent: 1,
    late: 1,
    leave: 0,
    students: generateStudents(40)
  },
  {
    date: new Date(2023, 7, 3), // August 3, 2023
    class: '10',
    section: 'A',
    totalStudents: 35,
    present: 32,
    absent: 2,
    late: 0,
    leave: 1,
    students: generateStudents(35)
  }
];

const Attendance: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceData[]>(sampleAttendanceRecords);
  const [students, setStudents] = useState<Student[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportStartDate, setReportStartDate] = useState<Date | null>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date | null>(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Check permissions
  const canTakeAttendance = user?.role === 'admin' || checkPermission('take_attendance');
  const canViewAttendance = user?.role === 'admin' || checkPermission('view_attendance');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle class change
  const handleClassChange = (event: SelectChangeEvent) => {
    const classValue = event.target.value;
    setSelectedClass(classValue);
    setSelectedSection('');
  };

  // Handle section change
  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
    
    // Generate students for the selected class and section
    if (selectedClass) {
      // In a real app, you would fetch students from an API
      setStudents(generateStudents(35));
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    // Check if attendance record exists for this date, class, and section
    if (date && selectedClass && selectedSection) {
      const existingRecord = attendanceRecords.find(
        record => 
          record.date.toDateString() === date.toDateString() &&
          record.class === selectedClass &&
          record.section === selectedSection
      );
      
      if (existingRecord) {
        setStudents(existingRecord.students);
        setEditMode(false);
      } else {
        // Generate fresh student list
        setStudents(generateStudents(35));
        setEditMode(true);
      }
    }
  };

  // Handle student status change
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  // Handle remark change
  const handleRemarkChange = (studentId: string, remark: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, remark } : student
      )
    );
  };

  // Save attendance
  const handleSaveAttendance = () => {
    if (!selectedDate || !selectedClass || !selectedSection) {
      setSnackbar({
        open: true,
        message: 'Please select date, class, and section',
        severity: 'error'
      });
      return;
    }

    // Count status
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const leaveCount = students.filter(s => s.status === 'leave').length;

    // Check if all students have a status
    const unmarkCount = students.filter(s => s.status === '').length;
    if (unmarkCount > 0) {
      setSnackbar({
        open: true,
        message: `${unmarkCount} students still unmarked. Please mark all students.`,
        severity: 'warning'
      });
      return;
    }

    // Create new attendance record
    const newRecord: AttendanceData = {
      date: selectedDate,
      class: selectedClass,
      section: selectedSection,
      totalStudents: students.length,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      leave: leaveCount,
      students: [...students]
    };

    // Check if record already exists
    const existingRecordIndex = attendanceRecords.findIndex(
      record => 
        record.date.toDateString() === selectedDate.toDateString() &&
        record.class === selectedClass &&
        record.section === selectedSection
    );

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = newRecord;
      setAttendanceRecords(updatedRecords);
    } else {
      // Add new record
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }

    setEditMode(false);
    setSnackbar({
      open: true,
      message: 'Attendance saved successfully',
      severity: 'success'
    });
  };

  // Handle calendar dialog
  const handleOpenCalendarDialog = () => {
    setOpenCalendarDialog(true);
  };

  const handleCloseCalendarDialog = () => {
    setOpenCalendarDialog(false);
  };

  // Handle report dialog
  const handleOpenReportDialog = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  // Generate report
  const handleGenerateReport = () => {
    // In a real app, you would generate a report here
    handleCloseReportDialog();
    setSnackbar({
      open: true,
      message: 'Report generated successfully',
      severity: 'success'
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get attendance summary
  const getAttendanceSummary = () => {
    if (!selectedDate || !selectedClass || !selectedSection) return null;

    const existingRecord = attendanceRecords.find(
      record => 
        record.date.toDateString() === selectedDate.toDateString() &&
        record.class === selectedClass &&
        record.section === selectedSection
    );

    if (!existingRecord) return null;

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {existingRecord.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present ({Math.round((existingRecord.present / existingRecord.totalStudents) * 100)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                  {existingRecord.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent ({Math.round((existingRecord.absent / existingRecord.totalStudents) * 100)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {existingRecord.late}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late ({Math.round((existingRecord.late / existingRecord.totalStudents) * 100)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {existingRecord.leave}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Leave ({Math.round((existingRecord.leave / existingRecord.totalStudents) * 100)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  if (!canViewAttendance) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access Attendance Management.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="attendance tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Today />} 
            label="Daily Attendance" 
            iconPosition="start"
          />
          <Tab 
            icon={<DateRange />} 
            label="Attendance Reports" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Attendance Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
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
            <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CalendarMonth />}
                onClick={handleOpenCalendarDialog}
                fullWidth
              >
                Calendar
              </Button>
              
              {selectedDate && selectedClass && selectedSection && !editMode && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  disabled={!canTakeAttendance}
                  fullWidth
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>

          {selectedDate && selectedClass && selectedSection && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {formatDate(selectedDate)} - Class {selectedClass} {selectedSection}
                </Typography>
                {editMode && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSaveAttendance}
                    disabled={!canTakeAttendance}
                  >
                    Save Attendance
                  </Button>
                )}
              </Box>
              
              {getAttendanceSummary()}
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  icon={<Assignment />}
                  label="Mark All Present"
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    if (editMode) {
                      setStudents(prevStudents =>
                        prevStudents.map(student => ({
                          ...student,
                          status: 'present'
                        }))
                      );
                    }
                  }}
                  disabled={!editMode}
                  clickable={editMode}
                />
                <Chip
                  icon={<AssignmentLate />}
                  label="Mark All Absent"
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    if (editMode) {
                      setStudents(prevStudents =>
                        prevStudents.map(student => ({
                          ...student,
                          status: 'absent'
                        }))
                      );
                    }
                  }}
                  disabled={!editMode}
                  clickable={editMode}
                />
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {editMode ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Present">
                                  <IconButton
                                    color={student.status === 'present' ? 'primary' : 'default'}
                                    onClick={() => handleStatusChange(student.id, 'present')}
                                  >
                                    <AssignmentTurnedIn />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Absent">
                                  <IconButton
                                    color={student.status === 'absent' ? 'error' : 'default'}
                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                  >
                                    <Assignment />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Late">
                                  <IconButton
                                    color={student.status === 'late' ? 'warning' : 'default'}
                                    onClick={() => handleStatusChange(student.id, 'late')}
                                  >
                                    <AssignmentLate />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="On Leave">
                                  <IconButton
                                    color={student.status === 'leave' ? 'info' : 'default'}
                                    onClick={() => handleStatusChange(student.id, 'leave')}
                                  >
                                    <PersonAdd />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Chip
                                label={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                color={
                                  student.status === 'present'
                                    ? 'primary'
                                    : student.status === 'absent'
                                    ? 'error'
                                    : student.status === 'late'
                                    ? 'warning'
                                    : 'info'
                                }
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {editMode ? (
                              <TextField
                                variant="outlined"
                                size="small"
                                value={student.remark}
                                onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                disabled={student.status !== 'late' && student.status !== 'leave'}
                                placeholder={
                                  student.status === 'late'
                                    ? 'Reason for being late'
                                    : student.status === 'leave'
                                    ? 'Reason for leave'
                                    : ''
                                }
                              />
                            ) : (
                              student.remark
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No students found. Please select a class and section.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Attendance Reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Print />}
                onClick={handleOpenReportDialog}
              >
                Generate Report
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownload />}
              >
                Export Data
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={handleClassChange}
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!selectedClass}>
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  label="Section"
                  onChange={handleSectionChange}
                >
                  <MenuItem value="">
                    <em>All Sections</em>
                  </MenuItem>
                  {selectedClass && sections[selectedClass as keyof typeof sections].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Refresh Data
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Recent Attendance Records
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>On Leave</TableCell>
                  <TableCell>Attendance %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords
                  .filter(record => 
                    (selectedClass ? record.class === selectedClass : true) &&
                    (selectedSection ? record.section === selectedSection : true)
                  )
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((record, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{record.date.toLocaleDateString()}</TableCell>
                      <TableCell>Class {record.class}</TableCell>
                      <TableCell>{record.section}</TableCell>
                      <TableCell>{record.totalStudents}</TableCell>
                      <TableCell>{record.present}</TableCell>
                      <TableCell>{record.absent}</TableCell>
                      <TableCell>{record.late}</TableCell>
                      <TableCell>{record.leave}</TableCell>
                      <TableCell>
                        {Math.round((record.present / record.totalStudents) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Calendar Dialog */}
      <Dialog
        open={openCalendarDialog}
        onClose={handleCloseCalendarDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Attendance Calendar</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
                handleCloseCalendarDialog();
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCalendarDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Attendance Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Generate attendance report for a specific date range and class/section.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={reportStartDate}
                  onChange={(newValue) => setReportStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={reportEndDate}
                  onChange={(newValue) => setReportEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={handleClassChange}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!selectedClass}>
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  label="Section"
                  onChange={handleSectionChange}
                >
                  <MenuItem value="">
                    <em>All Sections</em>
                  </MenuItem>
                  {selectedClass && sections[selectedClass as keyof typeof sections].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>Cancel</Button>
          <Button onClick={handleGenerateReport} variant="contained" color="primary">
            Generate Report
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

export default Attendance;
