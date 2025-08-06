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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Print,
  Download,
  Assignment,
  Schedule,
  AddCircleOutline,
  FilterList,
  Search,
  Visibility,
  Timer,
  CheckCircle,
  DoDisturbOn,
  HourglassEmpty
} from '@mui/icons-material';
import { useAuth } from '../context/useAuth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
      id={`exam-tabpanel-${index}`}
      aria-labelledby={`exam-tab-${index}`}
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
  examType: string;
  academicYear: string;
  startDate: Date;
  endDate: Date;
  classes: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
}

interface ExamSchedule {
  id: string;
  examId: string;
  date: Date;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  venue: string;
  invigilator: string;
}

// Sample data
const examTypes = ['Term 1', 'Term 2', 'Term 3', 'Mid-Term', 'Final', 'Unit Test'];
const academicYears = ['2024-2025', '2025-2026'];
const classes = ['8', '9', '10', '11', '12'];
const sections = {
  '8': ['A', 'B', 'C'],
  '9': ['A', 'B', 'C', 'D'],
  '10': ['A', 'B', 'C'],
  '11': ['Science', 'Commerce', 'Arts'],
  '12': ['Science', 'Commerce', 'Arts']
};

const subjects = [
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'Physics', code: 'PHY' },
  { id: '3', name: 'Chemistry', code: 'CHEM' },
  { id: '4', name: 'Biology', code: 'BIO' },
  { id: '5', name: 'English', code: 'ENG' },
  { id: '6', name: 'Hindi', code: 'HIN' },
  { id: '7', name: 'Social Studies', code: 'SOC' },
  { id: '8', name: 'Computer Science', code: 'CS' }
];

// Sample exams
const sampleExams: Exam[] = [
  {
    id: '1',
    name: 'Mid-Term Examination',
    examType: 'Mid-Term',
    academicYear: '2025-2026',
    startDate: new Date('2025-09-15'),
    endDate: new Date('2025-09-25'),
    classes: ['8', '9', '10', '11', '12'],
    status: 'scheduled',
    description: 'Mid-term examination for all classes'
  },
  {
    id: '2',
    name: 'First Term Assessment',
    examType: 'Term 1',
    academicYear: '2025-2026',
    startDate: new Date('2025-08-10'),
    endDate: new Date('2025-08-20'),
    classes: ['8', '9', '10'],
    status: 'ongoing',
    description: 'First term assessment for junior classes'
  },
  {
    id: '3',
    name: 'Unit Test - July',
    examType: 'Unit Test',
    academicYear: '2025-2026',
    startDate: new Date('2025-07-05'),
    endDate: new Date('2025-07-10'),
    classes: ['11', '12'],
    status: 'completed',
    description: 'Monthly unit test for senior classes'
  },
  {
    id: '4',
    name: 'Summer Vacation Assignment',
    examType: 'Unit Test',
    academicYear: '2024-2025',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-05'),
    classes: ['8', '9', '10', '11', '12'],
    status: 'completed',
    description: 'Assessment of vacation assignments'
  }
];

// Sample exam schedules
const generateExamSchedules = (): ExamSchedule[] => {
  const schedules: ExamSchedule[] = [];
  let id = 1;

  sampleExams.forEach(exam => {
    if (exam.status === 'cancelled') return;

    exam.classes.forEach(classId => {
      const classSections = sections[classId as keyof typeof sections];
      
      subjects.slice(0, 5).forEach((subject, subjectIndex) => {
        const examDate = new Date(exam.startDate);
        examDate.setDate(examDate.getDate() + subjectIndex);

        classSections.forEach(section => {
          schedules.push({
            id: id.toString(),
            examId: exam.id,
            date: new Date(examDate),
            startTime: '09:00',
            endTime: '12:00',
            classId,
            className: `Class ${classId}`,
            section,
            subjectId: subject.id,
            subjectName: subject.name,
            venue: `Room ${101 + parseInt(classId, 10)}`,
            invigilator: `Teacher ${(id % 10) + 1}`
          });
          id++;
        });
      });
    });
  });

  return schedules;
};

const sampleExamSchedules = generateExamSchedules();

const Examinations: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [exams, setExams] = useState<Exam[]>(sampleExams);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>(sampleExamSchedules);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null);
  const [openExamDialog, setOpenExamDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Check permissions
  const canManageExams = user?.role === 'admin' || checkPermission('manage_examinations');
  const canViewExams = user?.role === 'admin' || checkPermission('view_examinations');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter exams by academic year
  const filteredExams = exams.filter(exam => 
    exam.academicYear === academicYear && 
    (searchTerm === '' || exam.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter exam schedules
  const filteredSchedules = examSchedules.filter(schedule => {
    const exam = exams.find(e => e.id === schedule.examId);
    return (
      exam?.academicYear === academicYear &&
      (selectedExamId === '' || schedule.examId === selectedExamId) &&
      (selectedClass === '' || schedule.classId === selectedClass) &&
      (selectedSection === '' || schedule.section === selectedSection)
    );
  });

  // Exam dialog handlers
  const handleOpenExamDialog = (exam?: Exam) => {
    if (exam) {
      setSelectedExam(exam);
    } else {
      setSelectedExam(null);
    }
    setOpenExamDialog(true);
  };

  const handleCloseExamDialog = () => {
    setOpenExamDialog(false);
  };

  // Schedule dialog handlers
  const handleOpenScheduleDialog = (schedule?: ExamSchedule) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      // Set related fields to match the selected schedule
      setSelectedExamId(schedule.examId);
      setSelectedClass(schedule.classId);
      setSelectedSection(schedule.section);
    } else {
      setSelectedSchedule(null);
    }
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setSelectedSchedule(null);
  };

  // Handle delete exam
  const handleDeleteExam = (examId: string) => {
    const updatedExams = exams.filter(exam => exam.id !== examId);
    setExams(updatedExams);
    
    // Also remove related schedules
    const updatedSchedules = examSchedules.filter(schedule => schedule.examId !== examId);
    setExamSchedules(updatedSchedules);
    
    setSnackbar({
      open: true,
      message: 'Exam deleted successfully',
      severity: 'success'
    });
  };

  // Handle save exam
  const handleSaveExam = () => {
    if (!selectedExam) {
      // Create a new exam
      const newExam: Exam = {
        id: (exams.length + 1).toString(),
        name: 'New Exam', // In a real app, you would get this from the form
        examType: 'Mid-Term',
        academicYear,
        startDate: new Date(),
        endDate: new Date(),
        classes: [],
        status: 'scheduled',
        description: ''
      };
      
      setExams([...exams, newExam]);
    } else {
      // Update existing exam
      const updatedExams = exams.map(exam => 
        exam.id === selectedExam.id ? { ...selectedExam } : exam
      );
      setExams(updatedExams);
    }
    
    setOpenExamDialog(false);
    setSnackbar({
      open: true,
      message: selectedExam ? 'Exam updated successfully' : 'Exam created successfully',
      severity: 'success'
    });
  };

  // Handle save schedule
  const handleSaveSchedule = () => {
    if (!selectedSchedule) {
      // Create new schedule
      const newSchedule: ExamSchedule = {
        id: (examSchedules.length + 1).toString(),
        examId: selectedExamId || exams[0].id,
        date: new Date(),
        startTime: '09:00',
        endTime: '12:00',
        classId: selectedClass || '8',
        className: `Class ${selectedClass || '8'}`,
        section: selectedSection || 'A',
        subjectId: '1',
        subjectName: 'Mathematics',
        venue: 'Room 101',
        invigilator: 'Teacher 1'
      };
      
      setExamSchedules([...examSchedules, newSchedule]);
    } else {
      // Update existing schedule
      const updatedSchedules = examSchedules.map(schedule => 
        schedule.id === selectedSchedule.id 
          ? {
              ...schedule,
              examId: selectedExamId || schedule.examId,
              classId: selectedClass || schedule.classId,
              className: `Class ${selectedClass || schedule.classId}`,
              section: selectedSection || schedule.section
            }
          : schedule
      );
      
      setExamSchedules(updatedSchedules);
    }
    
    setOpenScheduleDialog(false);
    setSelectedSchedule(null);
    setSnackbar({
      open: true,
      message: selectedSchedule ? 'Exam schedule updated successfully' : 'Exam schedule saved successfully',
      severity: 'success'
    });
  };

  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId: string) => {
    const updatedSchedules = examSchedules.filter(schedule => schedule.id !== scheduleId);
    setExamSchedules(updatedSchedules);
    
    setSnackbar({
      open: true,
      message: 'Exam schedule deleted successfully',
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status chip
  const getStatusChip = (status: string) => {
    let color: 'success' | 'error' | 'warning' | 'default' | 'primary' | 'secondary' | 'info' = 'default';
    let icon = <HourglassEmpty />;
    
    switch(status) {
      case 'scheduled':
        color = 'info';
        icon = <Schedule />;
        break;
      case 'ongoing':
        color = 'warning';
        icon = <Timer />;
        break;
      case 'completed':
        color = 'success';
        icon = <CheckCircle />;
        break;
      case 'cancelled':
        color = 'error';
        icon = <DoDisturbOn />;
        break;
    }
    
    return (
      <Chip
        icon={icon}
        label={status.toUpperCase()}
        color={color}
        size="small"
      />
    );
  };

  if (!canViewExams) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access Examination Management.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Examination Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="examination tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Assignment />} 
            label="Exams" 
            iconPosition="start"
          />
          <Tab 
            icon={<Schedule />} 
            label="Exam Schedule" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={academicYear}
                  label="Academic Year"
                  onChange={(e: SelectChangeEvent) => setAcademicYear(e.target.value)}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Search Exams"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenExamDialog()}
                disabled={!canManageExams}
              >
                Add Exam
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Exam Status Summary */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {filteredExams.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Exams
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {filteredExams.filter(exam => exam.status === 'scheduled').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {filteredExams.filter(exam => exam.status === 'ongoing').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ongoing
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {filteredExams.filter(exam => exam.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {filteredExams.map((exam) => (
            <Grid item xs={12} md={6} key={exam.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{exam.name}</Typography>
                    {getStatusChip(exam.status)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {exam.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Exam Type
                      </Typography>
                      <Typography variant="body2">{exam.examType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Academic Year
                      </Typography>
                      <Typography variant="body2">{exam.academicYear}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Start Date
                      </Typography>
                      <Typography variant="body2">{formatDate(exam.startDate)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        End Date
                      </Typography>
                      <Typography variant="body2">{formatDate(exam.endDate)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Classes
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {exam.classes.map((cls) => (
                          <Chip
                            key={cls}
                            label={`Class ${cls}`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setTabValue(1);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View Schedule
                  </Button>
                  {canManageExams && (
                    <>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenExamDialog(exam)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
          
          {filteredExams.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No exams found for the selected academic year.
                </Typography>
                {canManageExams && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpenExamDialog()}
                    sx={{ mt: 2 }}
                  >
                    Add Exam
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={academicYear}
                  label="Academic Year"
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Exam</InputLabel>
                <Select
                  value={selectedExamId}
                  label="Exam"
                  onChange={(e: SelectChangeEvent) => setSelectedExamId(e.target.value)}
                >
                  <MenuItem value="">All Exams</MenuItem>
                  {exams
                    .filter(exam => exam.academicYear === academicYear)
                    .map((exam) => (
                      <MenuItem key={exam.id} value={exam.id}>{exam.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={(e: SelectChangeEvent) => {
                    setSelectedClass(e.target.value);
                    setSelectedSection('');
                  }}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small" disabled={!selectedClass}>
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  label="Section"
                  onChange={(e: SelectChangeEvent) => setSelectedSection(e.target.value)}
                >
                  <MenuItem value="">All Sections</MenuItem>
                  {selectedClass && sections[selectedClass as keyof typeof sections].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FilterList />}
                onClick={() => {
                  setSelectedExamId('');
                  setSelectedClass('');
                  setSelectedSection('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Exam Schedule
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {canManageExams && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutline />}
                onClick={() => handleOpenScheduleDialog()}
              >
                Add Schedule
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Print />}
            >
              Print Schedule
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export
            </Button>
          </Box>
        </Box>

        {filteredSchedules.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Exam</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Invigilator</TableCell>
                  {canManageExams && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSchedules.map((schedule) => {
                  const exam = exams.find(e => e.id === schedule.examId);
                  
                  return (
                    <TableRow key={schedule.id} hover>
                      <TableCell>{formatDate(schedule.date)}</TableCell>
                      <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                      <TableCell>
                        <Tooltip title={exam?.name || ''}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {exam?.name}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{`Class ${schedule.classId}`}</TableCell>
                      <TableCell>{schedule.section}</TableCell>
                      <TableCell>{schedule.subjectName}</TableCell>
                      <TableCell>{schedule.venue}</TableCell>
                      <TableCell>{schedule.invigilator}</TableCell>
                      {canManageExams && (
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenScheduleDialog(schedule)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No exam schedules found for the selected filters.
            </Typography>
            {canManageExams && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenScheduleDialog()}
                sx={{ mt: 2 }}
              >
                Add Schedule
              </Button>
            )}
          </Paper>
        )}
      </TabPanel>

      {/* Add/Edit Exam Dialog */}
      <Dialog open={openExamDialog} onClose={handleCloseExamDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedExam ? 'Edit Examination' : 'Add New Examination'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Name"
                variant="outlined"
                defaultValue={selectedExam?.name || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Exam Type</InputLabel>
                <Select
                  label="Exam Type"
                  defaultValue={selectedExam?.examType || ''}
                >
                  {examTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  defaultValue={selectedExam?.academicYear || academicYear}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={selectedExam?.startDate || null}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={selectedExam?.endDate || null}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Classes</InputLabel>
                <Select
                  multiple
                  label="Classes"
                  defaultValue={selectedExam?.classes || []}
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedExam?.status || 'scheduled'}
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                defaultValue={selectedExam?.description || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExamDialog}>Cancel</Button>
          <Button onClick={handleSaveExam} variant="contained" color="primary">
            {selectedExam ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Exam Schedule Dialog */}
      <Dialog open={openScheduleDialog} onClose={handleCloseScheduleDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSchedule ? 'Edit Exam Schedule' : 'Add Exam Schedule'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Exam</InputLabel>
                <Select
                  label="Exam"
                  defaultValue=""
                >
                  {exams
                    .filter(exam => exam.academicYear === academicYear && exam.status !== 'cancelled')
                    .map((exam) => (
                      <MenuItem key={exam.id} value={exam.id}>{exam.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={new Date()}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                defaultValue="09:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                defaultValue="12:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  label="Class"
                  defaultValue=""
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!selectedClass}>
                <InputLabel>Section</InputLabel>
                <Select
                  label="Section"
                  defaultValue=""
                >
                  {selectedClass && sections[selectedClass as keyof typeof sections].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  label="Subject"
                  defaultValue=""
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Venue"
                variant="outlined"
                placeholder="e.g., Room 101"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Invigilator"
                variant="outlined"
                placeholder="Name of the invigilator"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained" color="primary">
            {selectedSchedule ? 'Update Schedule' : 'Add Schedule'}
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

export default Examinations;
