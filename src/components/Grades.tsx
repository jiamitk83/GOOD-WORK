import React, { useState } from 'react';
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
  TextField,
  Container,
  Divider,
  SelectChangeEvent,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Save, Print, Assessment, Calculate, ShowChart } from '@mui/icons-material';

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
      id={`grades-tabpanel-${index}`}
      aria-labelledby={`grades-tab-${index}`}
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

// Student grades interface
interface StudentGrade {
  id: string;
  name: string;
  admissionNumber: string;
  subjects: {
    [key: string]: {
      midterm?: number;
      finalExam?: number;
      assignments?: number;
      practicals?: number;
      total?: number;
      grade?: string;
    };
  };
}

interface GradesProps {
  readOnly?: boolean;
}

const Grades: React.FC<GradesProps> = ({ readOnly = false }) => {
  // State for class and subject
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Mock student data with grades
  const [students, setStudents] = useState<StudentGrade[]>([
    { 
      id: '1', 
      name: 'John Smith', 
      admissionNumber: 'ADM001', 
      subjects: {
        'Mathematics': { midterm: 85, finalExam: 78, assignments: 90, practicals: 0, total: 82, grade: 'A' },
        'Science': { midterm: 75, finalExam: 80, assignments: 85, practicals: 88, total: 81, grade: 'A' },
        'English': { midterm: 70, finalExam: 75, assignments: 82, practicals: 0, total: 75, grade: 'B' },
      }
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      admissionNumber: 'ADM002', 
      subjects: {
        'Mathematics': { midterm: 92, finalExam: 95, assignments: 88, practicals: 0, total: 92, grade: 'A+' },
        'Science': { midterm: 88, finalExam: 85, assignments: 90, practicals: 92, total: 88, grade: 'A' },
        'English': { midterm: 85, finalExam: 90, assignments: 87, practicals: 0, total: 88, grade: 'A' },
      } 
    },
    { 
      id: '3', 
      name: 'Michael Brown', 
      admissionNumber: 'ADM003', 
      subjects: {
        'Mathematics': { midterm: 65, finalExam: 70, assignments: 75, practicals: 0, total: 70, grade: 'B-' },
        'Science': { midterm: 70, finalExam: 68, assignments: 72, practicals: 75, total: 71, grade: 'B-' },
        'English': { midterm: 72, finalExam: 68, assignments: 75, practicals: 0, total: 71, grade: 'B-' },
      } 
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      admissionNumber: 'ADM004', 
      subjects: {
        'Mathematics': { midterm: 78, finalExam: 82, assignments: 80, practicals: 0, total: 80, grade: 'B+' },
        'Science': { midterm: 80, finalExam: 85, assignments: 78, practicals: 82, total: 82, grade: 'A-' },
        'English': { midterm: 88, finalExam: 85, assignments: 90, practicals: 0, total: 87, grade: 'A' },
      } 
    },
    { 
      id: '5', 
      name: 'Robert Wilson', 
      admissionNumber: 'ADM005', 
      subjects: {
        'Mathematics': { midterm: 72, finalExam: 68, assignments: 75, practicals: 0, total: 71, grade: 'B-' },
        'Science': { midterm: 68, finalExam: 72, assignments: 70, practicals: 75, total: 71, grade: 'B-' },
        'English': { midterm: 65, finalExam: 70, assignments: 68, practicals: 0, total: 68, grade: 'C+' },
      } 
    },
  ]);
  
  // Classes options
  const classes = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];
  
  // Subject options
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];

  // Handle class change
  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  // Handle subject change
  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSelectedSubject(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle grade change
  const handleGradeChange = (studentId: string, field: string, value: string) => {
    if (readOnly) return;
    
    const numValue = value === '' ? undefined : Number(value);
    if (numValue !== undefined && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      return; // Validate input is a number between 0-100
    }

    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedSubjects = { ...student.subjects };
        if (!updatedSubjects[selectedSubject]) {
          updatedSubjects[selectedSubject] = {};
        }
        
        updatedSubjects[selectedSubject] = {
          ...updatedSubjects[selectedSubject],
          [field]: numValue
        };
        
        // Calculate total
        const subjectGrades = updatedSubjects[selectedSubject];
        const midterm = subjectGrades.midterm || 0;
        const finalExam = subjectGrades.finalExam || 0;
        const assignments = subjectGrades.assignments || 0;
        const practicals = subjectGrades.practicals || 0;
        
        // Weight: Midterm 30%, Final 40%, Assignments 20%, Practicals 10%
        let total;
        if (selectedSubject === 'Science') {
          total = (midterm * 0.25) + (finalExam * 0.4) + (assignments * 0.15) + (practicals * 0.2);
        } else {
          total = (midterm * 0.3) + (finalExam * 0.5) + (assignments * 0.2);
        }
        
        // Assign letter grade
        let grade;
        if (total >= 90) grade = 'A+';
        else if (total >= 85) grade = 'A';
        else if (total >= 80) grade = 'A-';
        else if (total >= 75) grade = 'B+';
        else if (total >= 70) grade = 'B';
        else if (total >= 65) grade = 'B-';
        else if (total >= 60) grade = 'C+';
        else if (total >= 55) grade = 'C';
        else if (total >= 50) grade = 'C-';
        else if (total >= 40) grade = 'D';
        else grade = 'F';
        
        updatedSubjects[selectedSubject].total = Math.round(total);
        updatedSubjects[selectedSubject].grade = grade;
        
        return { ...student, subjects: updatedSubjects };
      }
      return student;
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting grades for class:', selectedClass, 'subject:', selectedSubject);
    console.log('Student grades:', students);
    alert('Grades saved successfully!');
  };

  // Get grade data for a student and subject
  const getGradeData = (student: StudentGrade) => {
    if (!selectedSubject || !student.subjects[selectedSubject]) {
      return { midterm: undefined, finalExam: undefined, assignments: undefined, practicals: undefined, total: undefined, grade: undefined };
    }
    return student.subjects[selectedSubject];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Grade Management
        </Typography>
        
        {readOnly && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are in view-only mode. As a student or teacher, you can only view grades but cannot modify them.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={handleClassChange}
                  disabled={readOnly}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                      {cls}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Subject"
                  onChange={handleSubjectChange}
                  disabled={readOnly}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="grade management tabs">
              <Tab icon={<Assessment />} label="ASSESSMENT" />
              <Tab icon={<Calculate />} label="RESULTS" />
              <Tab icon={<ShowChart />} label="STATISTICS" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              {selectedSubject || 'Subject'} Grades for {selectedClass || 'Class'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {selectedSubject && (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                      <TableCell>Admission No.</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell align="center">Midterm (30%)</TableCell>
                      <TableCell align="center">Final Exam (40%)</TableCell>
                      <TableCell align="center">Assignments (20%)</TableCell>
                      {selectedSubject === 'Science' && (
                        <TableCell align="center">Practicals (10%)</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const gradeData = getGradeData(student);
                      return (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={gradeData.midterm === undefined ? '' : gradeData.midterm}
                              onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                              InputProps={{
                                readOnly: readOnly,
                                inputProps: { min: 0, max: 100 }
                              }}
                              disabled={readOnly}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={gradeData.finalExam === undefined ? '' : gradeData.finalExam}
                              onChange={(e) => handleGradeChange(student.id, 'finalExam', e.target.value)}
                              InputProps={{
                                readOnly: readOnly,
                                inputProps: { min: 0, max: 100 }
                              }}
                              disabled={readOnly}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={gradeData.assignments === undefined ? '' : gradeData.assignments}
                              onChange={(e) => handleGradeChange(student.id, 'assignments', e.target.value)}
                              InputProps={{
                                readOnly: readOnly,
                                inputProps: { min: 0, max: 100 }
                              }}
                              disabled={readOnly}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          {selectedSubject === 'Science' && (
                            <TableCell align="center">
                              <TextField
                                type="number"
                                variant="outlined"
                                size="small"
                                value={gradeData.practicals === undefined ? '' : gradeData.practicals}
                                onChange={(e) => handleGradeChange(student.id, 'practicals', e.target.value)}
                                InputProps={{
                                  readOnly: readOnly,
                                  inputProps: { min: 0, max: 100 }
                                }}
                                disabled={readOnly}
                                sx={{ width: '80px' }}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Results Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {selectedSubject && (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                      <TableCell>Admission No.</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell align="center">Total Marks</TableCell>
                      <TableCell align="center">Grade</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const gradeData = getGradeData(student);
                      const passStatus = (gradeData.total || 0) >= 40;
                      
                      let remarks = '';
                      if (gradeData.total !== undefined) {
                        if (gradeData.total >= 90) remarks = 'Outstanding';
                        else if (gradeData.total >= 80) remarks = 'Excellent';
                        else if (gradeData.total >= 70) remarks = 'Very Good';
                        else if (gradeData.total >= 60) remarks = 'Good';
                        else if (gradeData.total >= 50) remarks = 'Satisfactory';
                        else if (gradeData.total >= 40) remarks = 'Pass';
                        else remarks = 'Needs Improvement';
                      }
                      
                      return (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                            {gradeData.total !== undefined ? `${gradeData.total}%` : '-'}
                          </TableCell>
                          <TableCell align="center" sx={{ 
                            fontWeight: 'bold',
                            color: passStatus ? (gradeData.total || 0) >= 70 ? 'success.main' : 'text.primary' : 'error.main'
                          }}>
                            {gradeData.grade || '-'}
                          </TableCell>
                          <TableCell>{remarks}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Class Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {selectedSubject && (
              <Box sx={{ p: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Class Average:</Typography>
                      <Typography variant="h5" color="primary">
                        {students.some(s => s.subjects[selectedSubject]?.total !== undefined) ? 
                          `${Math.round(students.reduce((sum, student) => 
                            sum + (student.subjects[selectedSubject]?.total || 0), 0) / 
                            students.filter(s => s.subjects[selectedSubject]?.total !== undefined).length)}%` : 
                          'No data'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Highest Score:</Typography>
                      <Typography variant="h5" color="success.main">
                        {students.some(s => s.subjects[selectedSubject]?.total !== undefined) ?
                          `${Math.max(...students.map(s => s.subjects[selectedSubject]?.total || 0))}%` :
                          'No data'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">Lowest Score:</Typography>
                      <Typography variant="h5" color="error.main">
                        {students.some(s => s.subjects[selectedSubject]?.total !== undefined) ?
                          `${Math.min(...students.filter(s => s.subjects[selectedSubject]?.total !== undefined)
                            .map(s => s.subjects[selectedSubject]?.total || 0))}%` :
                          'No data'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                  Grade Distribution:
                </Typography>
                
                <Grid container spacing={2}>
                  {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(grade => {
                    const count = students.filter(s => s.subjects[selectedSubject]?.grade === grade).length;
                    const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                    
                    return (
                      <Grid item xs={12} key={grade}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ width: '30px' }}>{grade}</Typography>
                          <Box sx={{ 
                            flexGrow: 1, 
                            bgcolor: 'background.default',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '24px',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              bgcolor: grade.startsWith('A') ? 'success.main' : 
                                     grade.startsWith('B') ? 'info.main' : 
                                     grade.startsWith('C') ? 'warning.main' : 
                                     'error.main'
                            }} />
                          </Box>
                          <Typography variant="body2" sx={{ ml: 2, width: '30px' }}>{count}</Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </TabPanel>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
            >
              Print
            </Button>
            
            {!readOnly && tabValue === 0 && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                disabled={!selectedClass || !selectedSubject}
              >
                Save Grades
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Grades;
