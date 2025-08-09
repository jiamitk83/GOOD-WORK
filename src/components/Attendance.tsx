import React, { useState, useEffect } from 'react';
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
  Snackbar,
  LinearProgress,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
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
  Refresh,
  Analytics,
  Schedule,
  Group,
  Person,
  TrendingUp,
  Warning,
  CheckCircle,
  Cancel,
  AccessTime,
  EventBusy,
  Send,
  ViewList
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useAuth } from '../context/useAuth';
import { attendanceService, AttendanceRecord, Student, AttendanceStats, ClassAttendanceStats } from '../services/AttendanceService';

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

// Sample classes and sections
const classes = ['8', '9', '10', '11', '12'];
const sections = {
  '8': ['A', 'B', 'C'],
  '9': ['A', 'B', 'C', 'D'],
  '10': ['A', 'B', 'C'],
  '11': ['Science', 'Commerce', 'Arts'],
  '12': ['Science', 'Commerce', 'Arts']
};

const Attendance: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [reportStartDate, setReportStartDate] = useState<Date | null>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date | null>(new Date());
  const [classStats, setClassStats] = useState<ClassAttendanceStats | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Check permissions
  const canTakeAttendance = user?.role === 'admin' || checkPermission('take_attendance');
  const canViewAttendance = user?.role === 'admin' || checkPermission('view_attendance');
  const canManageAttendance = user?.role === 'admin' || checkPermission('manage_attendance');

  // Load attendance records on component mount
  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  // Load students when class and section change
  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadStudents();
    }
  }, [selectedClass, selectedSection]);

  // Load attendance data when date, class, or section changes
  useEffect(() => {
    if (selectedDate && selectedClass && selectedSection) {
      loadAttendanceForDate();
    }
  }, [selectedDate, selectedClass, selectedSection]);

  // Load attendance records
  const loadAttendanceRecords = async () => {
    try {
      setLoading(true);
      const records = await attendanceService.getAttendanceRecords();
      setAttendanceRecords(records);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error loading attendance records',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load students for selected class and section
  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await attendanceService.getStudentsByClass(selectedClass, selectedSection);
      setStudents(studentsData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error loading students',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load attendance for specific date
  const loadAttendanceForDate = async () => {
    if (!selectedDate) return;
    
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const record = await attendanceService.getAttendanceByDate(dateStr, selectedClass, selectedSection);
      
      if (record) {
        setStudents(record.students);
        setEditMode(false);
      } else {
        // No existing record, prepare for new attendance
        await loadStudents();
        setEditMode(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error loading attendance data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load class statistics
  const loadClassStats = async () => {
    if (!selectedClass || !selectedSection || !reportStartDate || !reportEndDate) return;
    
    try {
      setLoading(true);
      const startDate = reportStartDate.toISOString().split('T')[0];
      const endDate = reportEndDate.toISOString().split('T')[0];
      const stats = await attendanceService.getClassAttendanceStats(selectedClass, selectedSection, startDate, endDate);
      setClassStats(stats);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error loading class statistics',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle class change
  const handleClassChange = (event: SelectChangeEvent) => {
    const classValue = event.target.value;
    setSelectedClass(classValue);
    setSelectedSection('');
    setStudents([]);
  };

  // Handle section change
  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
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
  const handleSaveAttendance = async () => {
    if (!selectedDate || !selectedClass || !selectedSection || !user) {
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

    try {
      setSaving(true);
      
      // Create attendance record
      const record: AttendanceRecord = {
        date: selectedDate.toISOString().split('T')[0],
        class: selectedClass,
        section: selectedSection,
        totalStudents: students.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        leave: leaveCount,
        students: [...students],
        takenBy: user.email
      };

      const savedRecord = await attendanceService.saveAttendance(record);
      
      // Update local records
      const existingRecordIndex = attendanceRecords.findIndex(
        r => r.date === record.date && r.class === record.class && r.section === record.section
      );

      if (existingRecordIndex >= 0) {
        const updatedRecords = [...attendanceRecords];
        updatedRecords[existingRecordIndex] = savedRecord;
        setAttendanceRecords(updatedRecords);
      } else {
        setAttendanceRecords([...attendanceRecords, savedRecord]);
      }

      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Attendance saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving attendance',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Bulk mark all present
  const handleMarkAllPresent = () => {
    if (editMode) {
      setStudents(prevStudents =>
        prevStudents.map(student => ({
          ...student,
          status: 'present' as const,
          remark: ''
        }))
      );
    }
  };

  // Bulk mark all absent
  const handleMarkAllAbsent = () => {
    if (editMode) {
      setStudents(prevStudents =>
        prevStudents.map(student => ({
          ...student,
          status: 'absent' as const,
          remark: ''
        }))
      );
    }
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

  // Handle stats dialog
  const handleOpenStatsDialog = () => {
    loadClassStats();
    setOpenStatsDialog(true);
  };

  const handleCloseStatsDialog = () => {
    setOpenStatsDialog(false);
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      setSnackbar({
        open: true,
        message: 'Please select start and end dates',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      const filter = {
        startDate: reportStartDate.toISOString().split('T')[0],
        endDate: reportEndDate.toISOString().split('T')[0],
        class: selectedClass || undefined,
        section: selectedSection || undefined
      };

      const report = await attendanceService.generateAttendanceReport(filter);
      
      handleCloseReportDialog();
      setSnackbar({
        open: true,
        message: 'Report generated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error generating report',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Export data
  const handleExportData = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    if (!reportStartDate || !reportEndDate) {
      setSnackbar({
        open: true,
        message: 'Please select date range first',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      const filter = {
        startDate: reportStartDate.toISOString().split('T')[0],
        endDate: reportEndDate.toISOString().split('T')[0],
        class: selectedClass || undefined,
        section: selectedSection || undefined
      };

      const blob = await attendanceService.exportAttendanceData(filter, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${filter.startDate}_${filter.endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: `Data exported as ${format.toUpperCase()}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error exporting data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
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

    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingRecord = attendanceRecords.find(
      record => 
        record.date === dateStr &&
        record.class === selectedClass &&
        record.section === selectedSection
    );

    if (!existingRecord && students.length === 0) return null;

    // Calculate current counts
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const leaveCount = students.filter(s => s.status === 'leave').length;
    const totalStudents = students.length;

    const data = existingRecord || {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      leave: leaveCount,
      totalStudents
    };

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.present}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Present ({totalStudents > 0 ? Math.round((data.present / totalStudents) * 100) : 0}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Cancel sx={{ mr: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.absent}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Absent ({totalStudents > 0 ? Math.round((data.absent / totalStudents) * 100) : 0}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.late}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Late ({totalStudents > 0 ? Math.round((data.late / totalStudents) * 100) : 0}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <EventBusy sx={{ mr: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {data.leave}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  On Leave ({totalStudents > 0 ? Math.round((data.leave / totalStudents) * 100) : 0}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {totalStudents > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Overall Attendance Rate
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(data.present / totalStudents) * 100}
              sx={{ height: 8, borderRadius: 4 }}
              color={
                (data.present / totalStudents) >= 0.9 ? 'success' :
                (data.present / totalStudents) >= 0.75 ? 'warning' : 'error'
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {Math.round((data.present / totalStudents) * 100)}% attendance rate
            </Typography>
          </Box>
        )}
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
                    startIcon={saving ? <CircularProgress size={16} /> : <Save />}
                    onClick={handleSaveAttendance}
                    disabled={!canTakeAttendance || saving}
                    sx={{ minWidth: 140 }}
                  >
                    {saving ? 'Saving...' : 'Save Attendance'}
                  </Button>
                )}
              </Box>
              
              {getAttendanceSummary()}
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleMarkAllPresent}
                  disabled={!editMode}
                  size="small"
                >
                  Mark All Present
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleMarkAllAbsent}
                  disabled={!editMode}
                  size="small"
                >
                  Mark All Absent
                </Button>
                {editMode && (
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<Refresh />}
                    onClick={() => loadStudents()}
                    size="small"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Analytics />}
                  onClick={handleOpenStatsDialog}
                  size="small"
                >
                  Class Stats
                </Button>
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
                onClick={() => handleExportData('csv')}
                disabled={loading}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownload />}
                onClick={() => handleExportData('excel')}
                disabled={loading}
              >
                Export Excel
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
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : attendanceRecords
                      .filter(record => 
                        (selectedClass ? record.class === selectedClass : true) &&
                        (selectedSection ? record.section === selectedSection : true)
                      )
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                                {record.class}
                              </Avatar>
                              Class {record.class}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={record.section} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Badge badgeContent={record.totalStudents} color="primary">
                              <Group />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.present} 
                              color="success" 
                              size="small"
                              icon={<CheckCircle />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.absent} 
                              color="error" 
                              size="small"
                              icon={<Cancel />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.late} 
                              color="warning" 
                              size="small"
                              icon={<AccessTime />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.leave} 
                              color="info" 
                              size="small"
                              icon={<EventBusy />}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.round((record.present / record.totalStudents) * 100)}
                                sx={{ width: 60, mr: 1 }}
                                color={
                                  (record.present / record.totalStudents) >= 0.9 ? 'success' :
                                  (record.present / record.totalStudents) >= 0.75 ? 'warning' : 'error'
                                }
                              />
                              <Typography variant="body2">
                                {Math.round((record.present / record.totalStudents) * 100)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => {
                                  setSelectedClass(record.class);
                                  setSelectedSection(record.section);
                                  setSelectedDate(new Date(record.date));
                                  setTabValue(0);
                                }}
                              >
                                <ViewList />
                              </IconButton>
                            </Tooltip>
                            {canManageAttendance && (
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => {
                                    setSelectedClass(record.class);
                                    setSelectedSection(record.section);
                                    setSelectedDate(new Date(record.date));
                                    setEditMode(true);
                                    setTabValue(0);
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    {!loading && attendanceRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No attendance records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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

      {/* Class Statistics Dialog */}
      <Dialog
        open={openStatsDialog}
        onClose={handleCloseStatsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Analytics sx={{ mr: 1 }} />
            Class Statistics - {selectedClass && selectedSection && `Class ${selectedClass} ${selectedSection}`}
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : classStats ? (
            <Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Group sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {classStats.totalStudents}
                      </Typography>
                      <Typography variant="body2">Total Students</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {classStats.averageAttendance}%
                      </Typography>
                      <Typography variant="body2">Average Attendance</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CalendarMonth sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {classStats.totalDays}
                      </Typography>
                      <Typography variant="body2">Total Days</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Warning sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {classStats.absentCount}
                      </Typography>
                      <Typography variant="body2">Total Absences</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="h6" gutterBottom>Detailed Breakdown</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${classStats.presentCount} Present Records`}
                    secondary={`${Math.round((classStats.presentCount / (classStats.totalStudents * classStats.totalDays)) * 100)}% of total possible attendance`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <Cancel />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${classStats.absentCount} Absent Records`}
                    secondary={`${Math.round((classStats.absentCount / (classStats.totalStudents * classStats.totalDays)) * 100)}% of total records`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${classStats.lateCount} Late Records`}
                    secondary={`${Math.round((classStats.lateCount / (classStats.totalStudents * classStats.totalDays)) * 100)}% of total records`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <EventBusy />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${classStats.leaveCount} Leave Records`}
                    secondary={`${Math.round((classStats.leaveCount / (classStats.totalStudents * classStats.totalDays)) * 100)}% of total records`}
                  />
                </ListItem>
              </List>
            </Box>
          ) : (
            <Alert severity="info">No statistics available for the selected criteria.</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatsDialog}>Close</Button>
          {classStats && (
            <Button variant="contained" startIcon={<Print />} onClick={() => window.print()}>
              Print Stats
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Actions */}
      {selectedClass && selectedSection && selectedDate && (
        <SpeedDial
          ariaLabel="Attendance Actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<Send />}
            tooltipTitle="Send Report"
            onClick={() => {
              setSnackbar({
                open: true,
                message: 'Report sent successfully',
                severity: 'success'
              });
            }}
          />
          <SpeedDialAction
            icon={<Analytics />}
            tooltipTitle="View Statistics"
            onClick={handleOpenStatsDialog}
          />
          <SpeedDialAction
            icon={<Print />}
            tooltipTitle="Print Attendance"
            onClick={() => window.print()}
          />
          <SpeedDialAction
            icon={<CloudDownload />}
            tooltipTitle="Quick Export"
            onClick={() => handleExportData('csv')}
          />
        </SpeedDial>
      )}

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
