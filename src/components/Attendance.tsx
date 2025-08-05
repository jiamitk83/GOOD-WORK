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
  Grid,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface Student {
  id: number;
  rollNumber: string;
  name: string;
  class: string;
  section: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

const Attendance: React.FC = () => {
  // localStorage से attendance data load करें
  const getInitialAttendance = (): AttendanceRecord[] => {
    const savedAttendance = localStorage.getItem('school-erp-attendance');
    if (savedAttendance) {
      return JSON.parse(savedAttendance);
    }
    return [];
  };

  // localStorage से students data load करें
  const getStudentsFromStorage = (): Student[] => {
    const savedStudents = localStorage.getItem('school-erp-students');
    if (savedStudents) {
      return JSON.parse(savedStudents).map((student: any) => ({
        id: student.id,
        rollNumber: student.rollNumber,
        name: student.name,
        class: student.class,
        section: student.section
      }));
    }
    return [];
  };

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(getInitialAttendance);
  const [students] = useState<Student[]>(getStudentsFromStorage);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceData, setAttendanceData] = useState<{[key: number]: {status: 'Present' | 'Absent' | 'Late', remarks: string}}>({});

  // localStorage में attendance को save करने का function
  const saveAttendanceToStorage = (updatedAttendance: AttendanceRecord[]) => {
    localStorage.setItem('school-erp-attendance', JSON.stringify(updatedAttendance));
    setAttendanceRecords(updatedAttendance);
  };

  // Filter students based on selected class and section
  const filteredStudents = students.filter(student => {
    return (
      (!selectedClass || student.class === selectedClass) &&
      (!selectedSection || student.section === selectedSection)
    );
  });

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class))];
  
  // Get unique sections
  const sections = [...new Set(students.map(s => s.section))];

  const handleOpen = () => {
    setOpen(true);
    // Initialize attendance data for all filtered students
    const initialData: {[key: number]: {status: 'Present' | 'Absent' | 'Late', remarks: string}} = {};
    filteredStudents.forEach(student => {
      // Check if attendance already exists for this date
      const existingRecord = attendanceRecords.find(
        record => record.studentId === student.id && record.date === selectedDate
      );
      initialData[student.id] = {
        status: existingRecord?.status || 'Present',
        remarks: existingRecord?.remarks || ''
      };
    });
    setAttendanceData(initialData);
  };

  const handleClose = () => {
    setOpen(false);
    setAttendanceData({});
  };

  const handleSubmit = () => {
    const newRecords: AttendanceRecord[] = [];
    
    filteredStudents.forEach(student => {
      const data = attendanceData[student.id];
      if (data) {
        // Remove existing record for this student and date
        const filteredRecords = attendanceRecords.filter(
          record => !(record.studentId === student.id && record.date === selectedDate)
        );
        
        // Add new record
        const newRecord: AttendanceRecord = {
          id: Date.now() + student.id, // Simple ID generation
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          class: student.class,
          section: student.section,
          date: selectedDate,
          status: data.status,
          remarks: data.remarks
        };
        
        newRecords.push(newRecord);
      }
    });

    // Combine existing records (excluding today's for selected students) with new records
    const otherRecords = attendanceRecords.filter(
      record => !(
        filteredStudents.some(s => s.id === record.studentId) && 
        record.date === selectedDate
      )
    );
    
    saveAttendanceToStorage([...otherRecords, ...newRecords]);
    handleClose();
  };

  const handleAttendanceChange = (studentId: number, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircleIcon />;
      case 'Absent': return <CancelIcon />;
      case 'Late': return <CalendarIcon />;
      default: return null;
    }
  };

  // Get today's attendance summary
  const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
  const presentCount = todayRecords.filter(r => r.status === 'Present').length;
  const absentCount = todayRecords.filter(r => r.status === 'Absent').length;
  const lateCount = todayRecords.filter(r => r.status === 'Late').length;

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Attendance Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            disabled={!selectedClass || !selectedSection}
          >
            Mark Attendance
          </Button>
        </Box>

        {/* Date and Class Selection */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes.map(cls => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={selectedSection}
                label="Section"
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <MenuItem value="">All Sections</MenuItem>
                {sections.map(section => (
                  <MenuItem key={section} value={section}>{section}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Attendance Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {presentCount}
                </Typography>
                <Typography variant="body2">Present Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {absentCount}
                </Typography>
                <Typography variant="body2">Absent Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {lateCount}
                </Typography>
                <Typography variant="body2">Late Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {todayRecords.length}
                </Typography>
                <Typography variant="body2">Total Marked</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Attendance Records Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Class</strong></TableCell>
              <TableCell><strong>Section</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Remarks</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords
              .filter(record => {
                return (
                  (!selectedClass || record.class === selectedClass) &&
                  (!selectedSection || record.section === selectedSection) &&
                  record.date === selectedDate
                );
              })
              .map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>{record.rollNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(record.status)}
                    <Box sx={{ ml: 1 }}>{record.studentName}</Box>
                  </Box>
                </TableCell>
                <TableCell>{record.class}</TableCell>
                <TableCell>{record.section}</TableCell>
                <TableCell>
                  <Chip 
                    label={record.status} 
                    color={getStatusColor(record.status)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{record.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mark Attendance Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Mark Attendance - {selectedClass} {selectedSection} - {new Date(selectedDate).toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {filteredStudents.map((student) => (
              <Box key={student.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {student.rollNumber} - {student.name}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Attendance Status</InputLabel>
                      <Select
                        value={attendanceData[student.id]?.status || 'Present'}
                        label="Attendance Status"
                        onChange={(e) => handleAttendanceChange(student.id, e.target.value as 'Present' | 'Absent' | 'Late')}
                      >
                        <MenuItem value="Present">Present</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                        <MenuItem value="Late">Late</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Remarks (Optional)"
                      value={attendanceData[student.id]?.remarks || ''}
                      onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                      placeholder="Any additional notes..."
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save Attendance
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Attendance;
