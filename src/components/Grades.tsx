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
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  AssignmentTurnedIn,
  Edit,
  Add,
  Save,
  Download,
  Print,
  Refresh,
  BarChart,
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
      id={`grades-tabpanel-${index}`}
      aria-labelledby={`grades-tab-${index}`}
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

// Types
interface Exam {
  id: string;
  name: string;
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  classes: string[];
}

interface GradeCategory {
  id: string;
  name: string;
  weightage: number;
  passingPercentage: number;
}

interface StudentGrade {
  id: string;
  rollNo: string;
  name: string;
  scores: {
    [key: string]: number;
  };
  total: number;
  percentage: number;
  grade: string;
  remark: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  fullMarks: number;
  passingMarks: number;
}

// Sample data
const exams: Exam[] = [
  {
    id: '1',
    name: 'First Term Examination',
    term: 'Term 1',
    academicYear: '2023-2024',
    startDate: '2023-08-15',
    endDate: '2023-08-25',
    isPublished: true,
    classes: ['8', '9', '10', '11', '12']
  },
  {
    id: '2',
    name: 'Half Yearly Examination',
    term: 'Term 2',
    academicYear: '2023-2024',
    startDate: '2023-11-10',
    endDate: '2023-11-20',
    isPublished: true,
    classes: ['8', '9', '10', '11', '12']
  },
  {
    id: '3',
    name: 'Annual Examination',
    term: 'Term 3',
    academicYear: '2023-2024',
    startDate: '2024-03-05',
    endDate: '2024-03-15',
    isPublished: false,
    classes: ['8', '9', '10', '11', '12']
  }
];

const subjects: Subject[] = [
  {
    id: '1',
    code: 'MATH',
    name: 'Mathematics',
    fullMarks: 100,
    passingMarks: 35
  },
  {
    id: '2',
    code: 'PHY',
    name: 'Physics',
    fullMarks: 100,
    passingMarks: 35
  },
  {
    id: '3',
    code: 'CHEM',
    name: 'Chemistry',
    fullMarks: 100,
    passingMarks: 35
  },
  {
    id: '4',
    code: 'BIO',
    name: 'Biology',
    fullMarks: 100,
    passingMarks: 35
  },
  {
    id: '5',
    code: 'ENG',
    name: 'English',
    fullMarks: 100,
    passingMarks: 35
  }
];

const gradeCategories: GradeCategory[] = [
  { id: '1', name: 'A+', weightage: 90, passingPercentage: 90 },
  { id: '2', name: 'A', weightage: 80, passingPercentage: 80 },
  { id: '3', name: 'B+', weightage: 70, passingPercentage: 70 },
  { id: '4', name: 'B', weightage: 60, passingPercentage: 60 },
  { id: '5', name: 'C+', weightage: 50, passingPercentage: 50 },
  { id: '6', name: 'C', weightage: 40, passingPercentage: 40 },
  { id: '7', name: 'D', weightage: 33, passingPercentage: 33 },
  { id: '8', name: 'F', weightage: 0, passingPercentage: 0 }
];

// Generate student data
const generateStudents = (count: number): StudentGrade[] => {
  const students: StudentGrade[] = [];
  
  for (let i = 1; i <= count; i++) {
    const scores: {[key: string]: number} = {};
    
    subjects.forEach(subject => {
      // Generate a random score between 20 and 100
      scores[subject.id] = Math.floor(Math.random() * 80) + 20;
    });
    
    // Calculate total and percentage
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentage = Math.round((total / (subjects.length * 100)) * 100);
    
    // Determine grade
    let grade = 'F';
    for (const category of gradeCategories) {
      if (percentage >= category.passingPercentage) {
        grade = category.name;
        break;
      }
    }
    
    // Generate remark
    let remark = '';
    if (percentage >= 80) {
      remark = 'Excellent performance';
    } else if (percentage >= 60) {
      remark = 'Good performance';
    } else if (percentage >= 40) {
      remark = 'Satisfactory';
    } else if (percentage >= 33) {
      remark = 'Needs improvement';
    } else {
      remark = 'Failed';
    }
    
    students.push({
      id: `s${i}`,
      rollNo: `R${i.toString().padStart(3, '0')}`,
      name: `Student ${i}`,
      scores,
      total,
      percentage,
      grade,
      remark
    });
  }
  
  return students;
};

// Sample students data
const studentGrades = generateStudents(20);

const classes = ['8', '9', '10', '11', '12'];
const sections = {
  '8': ['A', 'B', 'C'],
  '9': ['A', 'B', 'C', 'D'],
  '10': ['A', 'B', 'C'],
  '11': ['Science', 'Commerce', 'Arts'],
  '12': ['Science', 'Commerce', 'Arts']
};

const academicYears = ['2023-2024', '2022-2023', '2021-2022'];

const Grades: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGradeSettingsDialog, setOpenGradeSettingsDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Check permissions
  const canManageGrades = user?.role === 'admin' || checkPermission('manage_grades');
  const canViewGrades = user?.role === 'admin' || checkPermission('view_grades');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle selection changes
  const handleExamChange = (event: SelectChangeEvent<string>) => {
    setSelectedExam(event.target.value);
  };

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const classValue = event.target.value;
    setSelectedClass(classValue);
    setSelectedSection('');
  };

  const handleSectionChange = (event: SelectChangeEvent<string>) => {
    setSelectedSection(event.target.value);
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedSubject(event.target.value);
  };

  const handleAcademicYearChange = (event: SelectChangeEvent<string>) => {
    setAcademicYear(event.target.value);
  };

  // Handle dialog actions
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenGradeSettingsDialog = () => {
    setOpenGradeSettingsDialog(true);
  };

  const handleCloseGradeSettingsDialog = () => {
    setOpenGradeSettingsDialog(false);
  };

  // Handle marks editing
  const handleMarksChange = (studentId: string, subjectId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const newScores = { ...student.scores, [subjectId]: numValue };
          const total = Object.values(newScores).reduce((sum, score) => sum + score, 0);
          const percentage = Math.round((total / (subjects.length * 100)) * 100);
          
          // Determine grade
          let grade = 'F';
          for (const category of gradeCategories) {
            if (percentage >= category.passingPercentage) {
              grade = category.name;
              break;
            }
          }
          
          // Generate remark
          let remark = '';
          if (percentage >= 80) {
            remark = 'Excellent performance';
          } else if (percentage >= 60) {
            remark = 'Good performance';
          } else if (percentage >= 40) {
            remark = 'Satisfactory';
          } else if (percentage >= 33) {
            remark = 'Needs improvement';
          } else {
            remark = 'Failed';
          }
          
          return {
            ...student,
            scores: newScores,
            total,
            percentage,
            grade,
            remark
          };
        }
        return student;
      })
    );
  };

  // Handle saving grades
  const handleSaveGrades = () => {
    // In a real app, we would save grades to the database
    setEditMode(false);
    setSnackbar({
      open: true,
      message: 'Grades saved successfully',
      severity: 'success'
    });
  };

  // Handle fetching grades
  const handleFetchGrades = () => {
    if (!selectedExam || !selectedClass || !selectedSection) {
      setSnackbar({
        open: true,
        message: 'Please select exam, class, and section',
        severity: 'error'
      });
      return;
    }
    
    // In a real app, we would fetch grades from an API
    setStudents(studentGrades);
  };

  // Handle creating a new exam
  const handleCreateExam = () => {
    // In a real app, we would create a new exam
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: 'Exam created successfully',
      severity: 'success'
    });
  };

  // Handle publishing results
  const handlePublishResults = () => {
    // In a real app, we would publish results to the students/parents
    setSnackbar({
      open: true,
      message: 'Results published successfully',
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

  // Check if student passed all subjects
  const hasPassedAllSubjects = (student: StudentGrade): boolean => {
    return Object.entries(student.scores).every(([subjectId, score]) => {
      const subject = subjects.find(s => s.id === subjectId);
      return subject && score >= subject.passingMarks;
    });
  };

  // Get pass/fail status
  const getPassFailStatus = (student: StudentGrade): JSX.Element => {
    const passed = hasPassedAllSubjects(student);
    return (
      <Chip
        label={passed ? 'PASS' : 'FAIL'}
        color={passed ? 'success' : 'error'}
        size="small"
      />
    );
  };

  // Get grade chip
  const getGradeChip = (grade: string): JSX.Element => {
    let color: 'success' | 'primary' | 'warning' | 'error' | 'default' = 'default';
    
    if (grade === 'A+' || grade === 'A') {
      color = 'success';
    } else if (grade === 'B+' || grade === 'B') {
      color = 'primary';
    } else if (grade === 'C+' || grade === 'C') {
      color = 'warning';
    } else if (grade === 'D' || grade === 'F') {
      color = 'error';
    }
    
    return (
      <Chip
        label={grade}
        color={color}
        size="small"
      />
    );
  };

  if (!canViewGrades) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access Grades Management.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Grades Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="grades tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<AssignmentTurnedIn />} 
            label="Grades Entry" 
            iconPosition="start"
          />
          <Tab 
            icon={<BarChart />} 
            label="Reports & Analysis" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Exam Grades</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                disabled={!canManageGrades}
              >
                New Exam
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Settings />}
                onClick={handleOpenGradeSettingsDialog}
                disabled={!canManageGrades}
              >
                Grade Settings
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={academicYear}
                  label="Academic Year"
                  onChange={handleAcademicYearChange}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Exam</InputLabel>
                <Select
                  value={selectedExam}
                  label="Exam"
                  onChange={handleExamChange}
                >
                  <MenuItem value="">
                    <em>Select Exam</em>
                  </MenuItem>
                  {exams
                    .filter(exam => exam.academicYear === academicYear)
                    .map((exam) => (
                      <MenuItem key={exam.id} value={exam.id}>{exam.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: '100%' }}
                onClick={handleFetchGrades}
              >
                Fetch Grades
              </Button>
            </Grid>
          </Grid>

          {students.length > 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={selectedSubject}
                    label="Subject"
                    onChange={handleSubjectChange}
                  >
                    <MenuItem value="">
                      <em>All Subjects</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!editMode && canManageGrades && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Grades
                    </Button>
                  )}
                  {editMode && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSaveGrades}
                    >
                      Save Grades
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
                </Box>
              </Box>

              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Name</TableCell>
                      {selectedSubject ? (
                        <TableCell align="center">{subjects.find(s => s.id === selectedSubject)?.name}</TableCell>
                      ) : (
                        subjects.map((subject) => (
                          <TableCell key={subject.id} align="center">{subject.name}</TableCell>
                        ))
                      )}
                      <TableCell align="center">Total</TableCell>
                      <TableCell align="center">Percentage</TableCell>
                      <TableCell align="center">Grade</TableCell>
                      <TableCell align="center">Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        {selectedSubject ? (
                          <TableCell align="center">
                            {editMode ? (
                              <TextField
                                type="number"
                                variant="outlined"
                                size="small"
                                value={student.scores[selectedSubject] || 0}
                                onChange={(e) => handleMarksChange(student.id, selectedSubject, e.target.value)}
                                inputProps={{ min: 0, max: 100 }}
                                sx={{ width: 80 }}
                              />
                            ) : (
                              student.scores[selectedSubject] || 0
                            )}
                          </TableCell>
                        ) : (
                          subjects.map((subject) => (
                            <TableCell key={subject.id} align="center">
                              {editMode ? (
                                <TextField
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  value={student.scores[subject.id] || 0}
                                  onChange={(e) => handleMarksChange(student.id, subject.id, e.target.value)}
                                  inputProps={{ min: 0, max: 100 }}
                                  sx={{ width: 80 }}
                                />
                              ) : (
                                <Box sx={{
                                  color: (student.scores[subject.id] || 0) < subject.passingMarks ? 'error.main' : 'inherit'
                                }}>
                                  {student.scores[subject.id] || 0}
                                </Box>
                              )}
                            </TableCell>
                          ))
                        )}
                        <TableCell align="center">{student.total}</TableCell>
                        <TableCell align="center">{student.percentage}%</TableCell>
                        <TableCell align="center">{getGradeChip(student.grade)}</TableCell>
                        <TableCell align="center">{getPassFailStatus(student)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePublishResults}
                  disabled={!canManageGrades}
                >
                  Publish Results
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Performance Reports</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Print />}
              >
                Print Reports
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Download />}
              >
                Export Data
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={academicYear}
                  label="Academic Year"
                  onChange={handleAcademicYearChange}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Exam</InputLabel>
                <Select
                  value={selectedExam}
                  label="Exam"
                  onChange={handleExamChange}
                >
                  <MenuItem value="">
                    <em>All Exams</em>
                  </MenuItem>
                  {exams
                    .filter(exam => exam.academicYear === academicYear)
                    .map((exam) => (
                      <MenuItem key={exam.id} value={exam.id}>{exam.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={2}>
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

          <Typography variant="h6" gutterBottom>
            Class Performance Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    93%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Pass Percentage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students with A+ Grade
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    72%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Percentage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Subject-wise Performance
          </Typography>

          <TableContainer sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Highest Score</TableCell>
                  <TableCell align="center">Average Score</TableCell>
                  <TableCell align="center">Pass Percentage</TableCell>
                  <TableCell align="center">Grade Distribution</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell align="center">
                      {Math.max(...students.map(s => s.scores[subject.id] || 0))}
                    </TableCell>
                    <TableCell align="center">
                      {Math.round(students.reduce((sum, s) => sum + (s.scores[subject.id] || 0), 0) / students.length)}
                    </TableCell>
                    <TableCell align="center">
                      {Math.round((students.filter(s => (s.scores[subject.id] || 0) >= subject.passingMarks).length / students.length) * 100)}%
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="A+, A: 5 students">
                          <Chip label="A" size="small" color="success" />
                        </Tooltip>
                        <Tooltip title="B+, B: 8 students">
                          <Chip label="B" size="small" color="primary" />
                        </Tooltip>
                        <Tooltip title="C+, C: 5 students">
                          <Chip label="C" size="small" color="warning" />
                        </Tooltip>
                        <Tooltip title="D: 2 students">
                          <Chip label="D" size="small" color="default" />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Top 5 Students
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Total Marks</TableCell>
                  <TableCell align="center">Percentage</TableCell>
                  <TableCell align="center">Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students
                  .sort((a, b) => b.percentage - a.percentage)
                  .slice(0, 5)
                  .map((student, index) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">{student.total}</TableCell>
                      <TableCell align="center">{student.percentage}%</TableCell>
                      <TableCell align="center">{getGradeChip(student.grade)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* New Exam Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Examination</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Name"
                variant="outlined"
                placeholder="e.g., First Term Examination"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select
                  label="Term"
                  defaultValue=""
                >
                  <MenuItem value="Term 1">Term 1</MenuItem>
                  <MenuItem value="Term 2">Term 2</MenuItem>
                  <MenuItem value="Term 3">Term 3</MenuItem>
                  <MenuItem value="Final">Final</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  defaultValue={academicYear}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Classes</InputLabel>
                <Select
                  multiple
                  label="Classes"
                  defaultValue={[]}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={`Class ${value}`} />
                      ))}
                    </Box>
                  )}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateExam} variant="contained" color="primary">
            Create Exam
          </Button>
        </DialogActions>
      </Dialog>

      {/* Grade Settings Dialog */}
      <Dialog
        open={openGradeSettingsDialog}
        onClose={handleCloseGradeSettingsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Grade Settings</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
            Configure Grade Categories
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Min Percentage</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gradeCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <TextField
                        defaultValue={category.name}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        defaultValue={category.passingPercentage}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: '%',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        defaultValue={
                          category.name === 'A+' ? 'Outstanding' :
                          category.name === 'A' ? 'Excellent' :
                          category.name === 'B+' ? 'Very Good' :
                          category.name === 'B' ? 'Good' :
                          category.name === 'C+' ? 'Above Average' :
                          category.name === 'C' ? 'Average' :
                          category.name === 'D' ? 'Pass' :
                          'Fail'
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradeSettingsDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save Settings
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

export default Grades;
