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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, FilterList, Book, Assignment, School } from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';

interface Subject {
  id: string;
  code: string;
  name: string;
  type: string;
  classes: string[];
  description: string;
  status: 'active' | 'inactive';
}

// Sample subjects data
const sampleSubjects: Subject[] = [
  {
    id: '1',
    code: 'PHY',
    name: 'Physics',
    type: 'Core',
    classes: ['11', '12'],
    description: 'Study of matter, energy, and the interaction between them.',
    status: 'active'
  },
  {
    id: '2',
    code: 'CHEM',
    name: 'Chemistry',
    type: 'Core',
    classes: ['11', '12'],
    description: 'Study of composition, structure, properties, and change of matter.',
    status: 'active'
  },
  {
    id: '3',
    code: 'MATH',
    name: 'Mathematics',
    type: 'Core',
    classes: ['8', '9', '10', '11', '12'],
    description: 'Study of numbers, quantities, and shapes.',
    status: 'active'
  },
  {
    id: '4',
    code: 'ENG',
    name: 'English',
    type: 'Core',
    classes: ['8', '9', '10', '11', '12'],
    description: 'Study of language, literature, and composition.',
    status: 'active'
  },
  {
    id: '5',
    code: 'HIST',
    name: 'History',
    type: 'Core',
    classes: ['8', '9', '10'],
    description: 'Study of past events.',
    status: 'active'
  },
  {
    id: '6',
    code: 'GEO',
    name: 'Geography',
    type: 'Core',
    classes: ['8', '9', '10'],
    description: 'Study of places and the relationships between people and their environments.',
    status: 'active'
  },
  {
    id: '7',
    code: 'CS',
    name: 'Computer Science',
    type: 'Elective',
    classes: ['11', '12'],
    description: 'Study of computers and computational systems.',
    status: 'active'
  },
  {
    id: '8',
    code: 'ART',
    name: 'Art',
    type: 'Elective',
    classes: ['8', '9', '10', '11', '12'],
    description: 'Study of visual arts.',
    status: 'inactive'
  }
];

const classes = ['8', '9', '10', '11', '12'];
const subjectTypes = ['Core', 'Elective', 'Additional'];

const SubjectManagement: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>(sampleSubjects);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Check permissions
  const canManageSubjects = user?.role === 'admin' || checkPermission('manage_school_settings');

  // Handle dialog open/close
  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setSelectedSubject(subject);
    } else {
      setSelectedSubject(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveSubject = () => {
    // In a real app, save subject data here
    handleCloseDialog();
  };

  // Handle deletion
  const handleDeleteSubject = (id: string) => {
    // In a real app, we would confirm deletion first
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Filter subjects based on selected filters
  const filteredSubjects = subjects.filter(subject => 
    (filterType ? subject.type === filterType : true) &&
    (filterClass ? subject.classes.includes(filterClass) : true)
  );

  // Get active and inactive subjects
  const activeSubjects = filteredSubjects.filter(subject => subject.status === 'active');
  const inactiveSubjects = filteredSubjects.filter(subject => subject.status === 'inactive');

  if (!canManageSubjects) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Subject Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Subject
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {subjectTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Class</InputLabel>
              <Select
                value={filterClass}
                label="Filter by Class"
                onChange={(e) => setFilterClass(e.target.value as string)}
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
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setFilterType('');
                setFilterClass('');
              }}
              sx={{ mr: 1 }}
            >
              Clear Filters
            </Button>
            <Button
              variant="outlined"
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            >
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Subjects */}
      <Typography variant="h6" gutterBottom>
        Active Subjects ({activeSubjects.length})
      </Typography>

      {viewMode === 'table' ? (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Subject Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeSubjects.map((subject) => (
                <TableRow key={subject.id} hover>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={subject.type} 
                      color={subject.type === 'Core' ? 'primary' : 'default'}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {subject.classes.map((cls, index) => (
                      <Chip
                        key={index}
                        label={`Class ${cls}`}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={subject.description}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {subject.description}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(subject)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {activeSubjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {subject.name}
                    </Typography>
                    <Chip 
                      label={subject.code} 
                      color="primary" 
                      size="small" 
                    />
                  </Box>
                  <Chip 
                    label={subject.type} 
                    color={subject.type === 'Core' ? 'primary' : 'default'}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {subject.description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Classes:
                  </Typography>
                  <Box>
                    {subject.classes.map((cls, index) => (
                      <Chip
                        key={index}
                        label={`Class ${cls}`}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => handleOpenDialog(subject)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<Delete />}
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Inactive Subjects */}
      {inactiveSubjects.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Inactive Subjects ({inactiveSubjects.length})
          </Typography>
          
          {viewMode === 'table' ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Subject Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Classes</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inactiveSubjects.map((subject) => (
                    <TableRow key={subject.id} hover sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={subject.type} 
                          color={subject.type === 'Core' ? 'primary' : 'default'}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {subject.classes.map((cls, index) => (
                          <Chip
                            key={index}
                            label={`Class ${cls}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={subject.description}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {subject.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenDialog(subject)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={3}>
              {inactiveSubjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.id}>
                  <Card sx={{ opacity: 0.7 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {subject.name}
                        </Typography>
                        <Chip 
                          label={subject.code} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={subject.type} 
                          color={subject.type === 'Core' ? 'primary' : 'default'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label="Inactive" 
                          size="small" 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {subject.description}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Classes:
                      </Typography>
                      <Box>
                        {subject.classes.map((cls, index) => (
                          <Chip
                            key={index}
                            label={`Class ${cls}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(subject)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Add/Edit Subject Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject Name"
                variant="outlined"
                defaultValue={selectedSubject?.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject Code"
                variant="outlined"
                defaultValue={selectedSubject?.code || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject Type</InputLabel>
                <Select
                  label="Subject Type"
                  defaultValue={selectedSubject?.type || 'Core'}
                >
                  {subjectTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedSubject?.status || 'active'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Classes</InputLabel>
                <Select
                  multiple
                  label="Classes"
                  defaultValue={selectedSubject?.classes || []}
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
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                defaultValue={selectedSubject?.description || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSubject} variant="contained" color="primary">
            {selectedSubject ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubjectManagement;
