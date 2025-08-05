import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Grid,
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
  MenuItem,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  status?: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
}

interface ExamResult {
  id: string;
  examId: string;
  studentName: string;
  rollNumber: string;
  marksObtained: number;
  grade: string;
  status: 'Pass' | 'Fail';
}

// Function to get initial exams from localStorage
const getInitialExams = (): Exam[] => {
  try {
    const savedExams = localStorage.getItem('school-erp-exams');
    if (savedExams) {
      return JSON.parse(savedExams);
    }
  } catch (error) {
    console.error('Error loading exams from localStorage:', error);
  }
  
  // Default exams if localStorage is empty or error
  return [
    {
      id: '1',
      name: 'Unit Test 1',
      subject: 'Mathematics',
      date: '2024-01-15',
      duration: 120,
      totalMarks: 100,
      passingMarks: 40,
      status: 'Scheduled',
    },
    {
      id: '2',
      name: 'Mid Term Exam',
      subject: 'English',
      date: '2024-01-20',
      duration: 180,
      totalMarks: 100,
      passingMarks: 35,
      status: 'Scheduled',
    },
    {
      id: '3',
      name: 'Final Exam',
      subject: 'Science',
      date: '2024-02-10',
      duration: 240,
      totalMarks: 100,
      passingMarks: 40,
      status: 'Scheduled',
    },
  ];
};

// Function to save exams to localStorage
const saveExamsToStorage = (examsList: Exam[]) => {
  try {
    localStorage.setItem('school-erp-exams', JSON.stringify(examsList));
  } catch (error) {
    console.error('Error saving exams to localStorage:', error);
  }
};

// Function to get initial exam results from localStorage
const getInitialExamResults = (): ExamResult[] => {
  try {
    const savedResults = localStorage.getItem('school-erp-exam-results');
    if (savedResults) {
      return JSON.parse(savedResults);
    }
  } catch (error) {
    console.error('Error loading exam results from localStorage:', error);
  }
  
  // Default exam results if localStorage is empty or error
  return [
    {
      id: '1',
      examId: '1',
      studentName: 'राहुल शर्मा',
      rollNumber: 'S001',
      marksObtained: 85,
      grade: 'A',
      status: 'Pass',
    },
    {
      id: '2',
      examId: '1',
      studentName: 'प्रिया गुप्ता',
      rollNumber: 'S002',
      marksObtained: 92,
      grade: 'A+',
      status: 'Pass',
    }
  ];
};

// Function to save exam results to localStorage
const saveExamResultsToStorage = (resultsList: ExamResult[]) => {
  try {
    localStorage.setItem('school-erp-exam-results', JSON.stringify(resultsList));
  } catch (error) {
    console.error('Error saving exam results to localStorage:', error);
  }
};

const Examinations: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [exams, setExams] = useState<Exam[]>(getInitialExams());
  const [examResults, setExamResults] = useState<ExamResult[]>(getInitialExamResults());
  
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExamForResults, setSelectedExamForResults] = useState<Exam | null>(null);

  const [formData, setFormData] = useState<Partial<Exam>>({
    name: '',
    subject: '',
    date: '',
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    status: 'Scheduled',
  });

  const handleInputChange = (field: keyof Exam, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingExam) {
      // Update existing exam
      const updatedExams = exams.map(e => 
        e.id === editingExam.id ? { ...e, ...formData } : e
      );
      setExams(updatedExams);
      saveExamsToStorage(updatedExams);
    } else {
      // Add new exam
      const newExam: Exam = {
        id: Date.now().toString(),
        name: formData.name || '',
        subject: formData.subject || '',
        date: formData.date || '',
        duration: formData.duration || 120,
        totalMarks: formData.totalMarks || 100,
        passingMarks: formData.passingMarks || 40,
        status: formData.status || 'Scheduled',
      };
      const updatedExams = [...exams, newExam];
      setExams(updatedExams);
      saveExamsToStorage(updatedExams);
    }
    handleClose();
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData(exam);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedExams = exams.filter(e => e.id !== id);
    setExams(updatedExams);
    saveExamsToStorage(updatedExams);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExam(null);
    setFormData({
      name: '',
      subject: '',
      date: '',
      duration: 120,
      totalMarks: 100,
      passingMarks: 40,
      status: 'Scheduled',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Ongoing': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography'];
  const statuses = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        परीक्षा प्रबंधन (Examinations)
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="परीक्षा सूची (Exams List)" />
        <Tab label="परीक्षा परिणाम (Results)" />
        <Tab label="आंकड़े (Statistics)" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              कुल परीक्षाएं: {exams.length}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              नई परीक्षा जोड़ें
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>परीक्षा का नाम</TableCell>
                  <TableCell>विषय</TableCell>
                  <TableCell>दिनांक</TableCell>
                  <TableCell>अवधि (मिनट)</TableCell>
                  <TableCell>पूर्णांक</TableCell>
                  <TableCell>उत्तीर्णांक</TableCell>
                  <TableCell>स्थिति</TableCell>
                  <TableCell>क्रियाएं</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>{exam.subject}</TableCell>
                    <TableCell>{new Date(exam.date).toLocaleDateString('hi-IN')}</TableCell>
                    <TableCell>{exam.duration}</TableCell>
                    <TableCell>{exam.totalMarks}</TableCell>
                    <TableCell>{exam.passingMarks}</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.status}
                        color={getStatusColor(exam.status || 'Scheduled') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(exam)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(exam.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            परीक्षा परिणाम
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>छात्र का नाम</TableCell>
                  <TableCell>रोल नंबर</TableCell>
                  <TableCell>प्राप्त अंक</TableCell>
                  <TableCell>श्रेणी</TableCell>
                  <TableCell>स्थिति</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell>{result.rollNumber}</TableCell>
                    <TableCell>{result.marksObtained}</TableCell>
                    <TableCell>{result.grade}</TableCell>
                    <TableCell>
                      <Chip
                        label={result.status}
                        color={result.status === 'Pass' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            परीक्षा आंकड़े
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h4">
                        {exams.filter(e => e.status === 'Scheduled').length}
                      </Typography>
                      <Typography color="textSecondary">
                        निर्धारित परीक्षाएं
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssessmentIcon sx={{ mr: 2, color: 'warning.main' }} />
                    <Box>
                      <Typography variant="h4">
                        {exams.filter(e => e.status === 'Ongoing').length}
                      </Typography>
                      <Typography color="textSecondary">
                        चालू परीक्षाएं
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                    <Box>
                      <Typography variant="h4">
                        {exams.filter(e => e.status === 'Completed').length}
                      </Typography>
                      <Typography color="textSecondary">
                        पूर्ण परीक्षाएं
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                    <Box>
                      <Typography variant="h4">
                        {exams.filter(e => e.status === 'Cancelled').length}
                      </Typography>
                      <Typography color="textSecondary">
                        रद्द परीक्षाएं
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Add/Edit Exam Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingExam ? 'परीक्षा संपादित करें' : 'नई परीक्षा जोड़ें'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="परीक्षा का नाम"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="विषय"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="दिनांक"
                InputLabelProps={{ shrink: true }}
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="अवधि (मिनट)"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="पूर्णांक"
                value={formData.totalMarks || ''}
                onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="उत्तीर्णांक"
                value={formData.passingMarks || ''}
                onChange={(e) => handleInputChange('passingMarks', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="स्थिति"
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>रद्द करें</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExam ? 'अपडेट करें' : 'जोड़ें'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Examinations;
