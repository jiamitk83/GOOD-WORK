import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
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
  Button,
  Checkbox,
  Container,
  Divider,
  SelectChangeEvent,
  Alert
} from '@mui/material';
// Student interface
interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  isPresent: boolean;
  reason?: string;
}

interface AttendanceProps {
  readOnly?: boolean;
}

// Constants for static text
const TITLE = "Attendance Management";
const READ_ONLY_MESSAGE = "You are in view-only mode. As a student or teacher, you can only view attendance records but cannot mark or edit attendance.";
const SAVE_SUCCESS_MESSAGE = "Attendance saved successfully!";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Save, Print, CalendarMonth } from '@mui/icons-material';

  // Classes options - moved outside component for better performance
const CLASSES = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];

// Initial mock student data
const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'John Smith', admissionNumber: 'ADM001', isPresent: true },
  { id: '2', name: 'Sarah Johnson', admissionNumber: 'ADM002', isPresent: true },
  { id: '3', name: 'Michael Brown', admissionNumber: 'ADM003', isPresent: false, reason: 'Medical Leave' },
  { id: '4', name: 'Emily Davis', admissionNumber: 'ADM004', isPresent: true },
  { id: '5', name: 'Robert Wilson', admissionNumber: 'ADM005', isPresent: true },
  { id: '6', name: 'Jennifer Lee', admissionNumber: 'ADM006', isPresent: false, reason: 'Family Function' },
  { id: '7', name: 'David Miller', admissionNumber: 'ADM007', isPresent: true },
  { id: '8', name: 'Jessica Taylor', admissionNumber: 'ADM008', isPresent: true },
  { id: '9', name: 'James Anderson', admissionNumber: 'ADM009', isPresent: true },
  { id: '10', name: 'Lisa Thomas', admissionNumber: 'ADM010', isPresent: false, reason: 'Sick' },
];

const Attendance: React.FC<AttendanceProps> = ({ readOnly = false }) => {
  // State for class and date
  const [selectedClass, setSelectedClass] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Handle class change - memoized with useCallback for better performance
  const handleClassChange = useCallback((event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  }, []);

  // Handle date change - memoized with useCallback for better performance
  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  // Handle attendance change - memoized with useCallback for better performance
  const handleAttendanceChange = useCallback((studentId: string, isPresent: boolean) => {
    if (readOnly) return;
    
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId ? { ...student, isPresent } : student
      )
    );
  }, [readOnly]);

  // Handle form submission - memoized with useCallback for better performance
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting attendance for class:', selectedClass, 'on date:', selectedDate);
    console.log('Student attendance:', students);
    alert(SAVE_SUCCESS_MESSAGE);
  }, [selectedClass, selectedDate, students]);

  // Reset date to today - memoized with useCallback
  const resetToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          {TITLE}
        </Typography>
        
        {readOnly && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {READ_ONLY_MESSAGE}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Display class selection and date picker controls */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={readOnly}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={handleClassChange}
                >
                  {CLASSES.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                      {cls}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      disabled: readOnly
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              {!readOnly && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalendarMonth />}
                  onClick={() => resetToToday()}
                >
                  Today
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Attendance Table Header */}
          <Typography variant="h6" gutterBottom>
            Student Attendance for {selectedClass || 'Selected Class'} on {selectedDate?.toLocaleDateString() || 'Selected Date'}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Attendance Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="medium" aria-label="attendance table">
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell>Admission No.</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell align="center">Present</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.admissionNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={student.isPresent}
                        onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                        color="primary"
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      {!student.isPresent && student.reason ? (
                        <Typography variant="body2" color="text.secondary">
                          {student.reason}
                        </Typography>
                      ) : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              aria-label="Print attendance report"
            >
              Print
            </Button>
            
            {!readOnly && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                aria-label="Save attendance"
              >
                Save Attendance
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Attendance;
