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
  Tab,
  Tabs,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as ExamIcon,
  EventNote as ScheduleIcon,
  Assessment as ResultIcon,
  Print as PrintIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface Exam {
  id: number;
  examName: string;
  examType: 'Unit Test' | 'Mid Term' | 'Final' | 'Annual';
  subject: string;
  class: string;
  section: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  passingMarks: number;
  teacher: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
}

interface ExamResult {
  id: number;
  examId: number;
  studentName: string;
  rollNumber: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent';
}

const Examinations: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      examName: 'Unit Test 1 - Mathematics',
      examType: 'Unit Test',
      subject: 'गणित',
      class: '10th',
      section: 'A',
      date: '2025-08-15',
      time: '10:00 AM',
      duration: '2 घंटे',
      totalMarks: 100,
      passingMarks: 35,
      teacher: 'डॉ. अनिता शर्मा',
      status: 'Scheduled'
    },
    {
      id: 2,
      examName: 'Mid Term - Physics',
      examType: 'Mid Term',
      subject: 'भौतिक विज्ञान',
      class: '10th',
      section: 'B',
      date: '2025-08-20',
      time: '02:00 PM',
      duration: '3 घंटे',
      totalMarks: 100,
      passingMarks: 35,
      teacher: 'राजेश कुमार',
      status: 'Completed'
    },
    {
      id: 3,
      examName: 'Final Exam - English',
      examType: 'Final',
      subject: 'अंग्रेजी',
      class: '9th',
      section: 'A',
      date: '2025-08-25',
      time: '09:00 AM',
      duration: '3 घंटे',
      totalMarks: 100,
      passingMarks: 33,
      teacher: 'सुनीता वर्मा',
      status: 'Ongoing'
    }
  ]);

  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: 1,
      examId: 2,
      studentName: 'राहुल शर्मा',
      rollNumber: 'STU001',
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85,
      grade: 'A',
      status: 'Pass'
    },
    {
      id: 2,
      examId: 2,
      studentName: 'प्रिया गुप्ता',
      rollNumber: 'STU002',
      marksObtained: 78,
      totalMarks: 100,
      percentage: 78,
      grade: 'B+',
      status: 'Pass'
    },
    {
      id: 3,
      examId: 2,
      studentName: 'अमित कुमार',
      rollNumber: 'STU003',
      marksObtained: 92,
      totalMarks: 100,
      percentage: 92,
      grade: 'A+',
      status: 'Pass'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExamForResults, setSelectedExamForResults] = useState<Exam | null>(null);
  
  const [formData, setFormData] = useState<Partial<Exam>>({
    examName: '',
    examType: 'Unit Test',
    subject: '',
    class: '',
    section: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: 100,
    passingMarks: 35,
    teacher: '',
    status: 'Scheduled'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      setFormData(exam);
    } else {
      setEditingExam(null);
      setFormData({
        examName: '',
        examType: 'Unit Test',
        subject: '',
        class: '',
        section: '',
        date: '',
        time: '',
        duration: '',
        totalMarks: 100,
        passingMarks: 35,
        teacher: '',
        status: 'Scheduled'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExam(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (editingExam) {
      setExams(exams.map(e => 
        e.id === editingExam.id 
          ? { ...editingExam, ...formData }
          : e
      ));
    } else {
      const newExam: Exam = {
        id: Math.max(...exams.map(e => e.id)) + 1,
        examName: formData.examName || '',
        examType: formData.examType as 'Unit Test' | 'Mid Term' | 'Final' | 'Annual' || 'Unit Test',
        subject: formData.subject || '',
        class: formData.class || '',
        section: formData.section || '',
        date: formData.date || '',
        time: formData.time || '',
        duration: formData.duration || '',
        totalMarks: formData.totalMarks || 100,
        passingMarks: formData.passingMarks || 35,
        teacher: formData.teacher || '',
        status: formData.status as 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled' || 'Scheduled'
      };
      setExams([...exams, newExam]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const handleViewResults = (exam: Exam) => {
    setSelectedExamForResults(exam);
    setResultOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'info';
      case 'Ongoing': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'success';
      case 'B+': case 'B': return 'info';
      case 'C+': case 'C': return 'warning';
      case 'D': case 'F': return 'error';
      default: return 'default';
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'Pass': return 'success';
      case 'Fail': return 'error';
      case 'Absent': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ExamIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Examinations Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Schedule New Exam
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {exams.filter(e => e.status === 'Scheduled').length}
                </Typography>
                <Typography variant="body2">Scheduled</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {exams.filter(e => e.status === 'Ongoing').length}
                </Typography>
                <Typography variant="body2">Ongoing</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {exams.filter(e => e.status === 'Completed').length}
                </Typography>
                <Typography variant="body2">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {exams.length}
                </Typography>
                <Typography variant="body2">Total Exams</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Exam Schedule" 
            icon={<ScheduleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Exam Results" 
            icon={<ResultIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Exam Schedule Tab */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Exam Name</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Class/Section</strong></TableCell>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
                <TableCell><strong>Marks</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {exam.examName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Teacher: {exam.teacher}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={exam.examType} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.class} - {exam.section}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{exam.date}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        Total: {exam.totalMarks}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pass: {exam.passingMarks}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={exam.status} 
                      color={getStatusColor(exam.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpen(exam)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="success" 
                      onClick={() => handleViewResults(exam)}
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(exam.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Exam Results Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Exam Results
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Roll Number</strong></TableCell>
                  <TableCell><strong>Marks Obtained</strong></TableCell>
                  <TableCell><strong>Total Marks</strong></TableCell>
                  <TableCell><strong>Percentage</strong></TableCell>
                  <TableCell><strong>Grade</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {result.studentName.charAt(0)}
                        </Avatar>
                        {result.studentName}
                      </Box>
                    </TableCell>
                    <TableCell>{result.rollNumber}</TableCell>
                    <TableCell>{result.marksObtained}</TableCell>
                    <TableCell>{result.totalMarks}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {result.percentage}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={result.grade} 
                        color={getGradeColor(result.grade)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={result.status} 
                        color={getResultStatusColor(result.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Add/Edit Exam Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Name"
                value={formData.examName || ''}
                onChange={(e) => setFormData({...formData, examName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Exam Type</InputLabel>
                <Select
                  value={formData.examType || 'Unit Test'}
                  label="Exam Type"
                  onChange={(e) => setFormData({...formData, examType: e.target.value as any})}
                >
                  <MenuItem value="Unit Test">Unit Test</MenuItem>
                  <MenuItem value="Mid Term">Mid Term</MenuItem>
                  <MenuItem value="Final">Final Exam</MenuItem>
                  <MenuItem value="Annual">Annual Exam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subject || ''}
                  label="Subject"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <MenuItem value="गणित">गणित</MenuItem>
                  <MenuItem value="भौतिक विज्ञान">भौतिक विज्ञान</MenuItem>
                  <MenuItem value="रसायन विज्ञान">रसायन विज्ञान</MenuItem>
                  <MenuItem value="जीव विज्ञान">जीव विज्ञान</MenuItem>
                  <MenuItem value="अंग्रेजी">अंग्रेजी</MenuItem>
                  <MenuItem value="हिंदी">हिंदी</MenuItem>
                  <MenuItem value="सामाजिक विज्ञान">सामाजिक विज्ञान</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.class || ''}
                  label="Class"
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  <MenuItem value="6th">6th</MenuItem>
                  <MenuItem value="7th">7th</MenuItem>
                  <MenuItem value="8th">8th</MenuItem>
                  <MenuItem value="9th">9th</MenuItem>
                  <MenuItem value="10th">10th</MenuItem>
                  <MenuItem value="11th">11th</MenuItem>
                  <MenuItem value="12th">12th</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select
                  value={formData.section || ''}
                  label="Section"
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Exam Date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Exam Time"
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g. 2 घंटे"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={formData.totalMarks || ''}
                onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Passing Marks"
                type="number"
                value={formData.passingMarks || ''}
                onChange={(e) => setFormData({...formData, passingMarks: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={formData.teacher || ''}
                  label="Teacher"
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                >
                  <MenuItem value="डॉ. अनिता शर्मा">डॉ. अनिता शर्मा</MenuItem>
                  <MenuItem value="राजेश कुमार">राजेश कुमार</MenuItem>
                  <MenuItem value="सुनीता वर्मा">सुनीता वर्मा</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'Scheduled'}
                  label="Status"
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExam ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exam Results Dialog */}
      <Dialog open={resultOpen} onClose={() => setResultOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Exam Results: {selectedExamForResults?.examName}
        </DialogTitle>
        <DialogContent>
          {selectedExamForResults && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Subject:</strong> {selectedExamForResults.subject}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Class:</strong> {selectedExamForResults.class} - {selectedExamForResults.section}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Date:</strong> {selectedExamForResults.date}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Marks:</strong> {selectedExamForResults.totalMarks}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>Student Results:</Typography>
              {examResults
                .filter(result => result.examId === selectedExamForResults.id)
                .map((result) => (
                  <Card key={result.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }}>
                              {result.studentName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">
                                {result.studentName}
                              </Typography>
                              <Typography variant="caption">
                                {result.rollNumber}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2">
                            <strong>{result.marksObtained}/{result.totalMarks}</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2">
                            <strong>{result.percentage}%</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Chip 
                            label={result.grade} 
                            color={getGradeColor(result.grade)} 
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Chip 
                            label={result.status} 
                            color={getResultStatusColor(result.status)} 
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            Print Results
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Examinations;
