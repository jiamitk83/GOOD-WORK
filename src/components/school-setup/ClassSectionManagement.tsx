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
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';

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
      id={`class-section-tabpanel-${index}`}
      aria-labelledby={`class-section-tab-${index}`}
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

interface ClassData {
  id: string;
  name: string;
  academicYear: string;
  sections: string[];
  status: 'active' | 'inactive';
}

// Sample classes data
const sampleClasses: ClassData[] = [
  {
    id: '1',
    name: 'Class 8',
    academicYear: '2025-2026',
    sections: ['A', 'B', 'C'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Class 9',
    academicYear: '2025-2026',
    sections: ['A', 'B', 'C', 'D'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Class 10',
    academicYear: '2025-2026',
    sections: ['A', 'B', 'C'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Class 11',
    academicYear: '2025-2026',
    sections: ['Science', 'Commerce', 'Arts'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Class 12',
    academicYear: '2025-2026',
    sections: ['Science', 'Commerce', 'Arts'],
    status: 'active'
  },
  {
    id: '6',
    name: 'Class 7',
    academicYear: '2024-2025',
    sections: ['A', 'B'],
    status: 'inactive'
  }
];

interface SectionData {
  id: string;
  name: string;
  classId: string;
  className: string;
  capacity: number;
  students: number;
  classTeacher: string;
  status: 'active' | 'inactive';
}

// Sample sections data
const sampleSections: SectionData[] = [
  {
    id: '1',
    name: 'A',
    classId: '1',
    className: 'Class 8',
    capacity: 40,
    students: 35,
    classTeacher: 'Mrs. Lisa Wang',
    status: 'active'
  },
  {
    id: '2',
    name: 'B',
    classId: '1',
    className: 'Class 8',
    capacity: 40,
    students: 38,
    classTeacher: 'Mr. James Wilson',
    status: 'active'
  },
  {
    id: '3',
    name: 'C',
    classId: '1',
    className: 'Class 8',
    capacity: 40,
    students: 32,
    classTeacher: 'Ms. Sarah Johnson',
    status: 'active'
  },
  {
    id: '4',
    name: 'A',
    classId: '2',
    className: 'Class 9',
    capacity: 40,
    students: 40,
    classTeacher: 'Dr. Robert Miller',
    status: 'active'
  },
  {
    id: '5',
    name: 'B',
    classId: '2',
    className: 'Class 9',
    capacity: 40,
    students: 37,
    classTeacher: 'Prof. Amit Sharma',
    status: 'active'
  }
];

const academicYears = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

const ClassSectionManagement: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>(sampleClasses);
  const [sections, setSections] = useState<SectionData[]>(sampleSections);
  const [tabValue, setTabValue] = useState(0);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [filterYear, setFilterYear] = useState('2025-2026');

  // Check permissions
  const canManageClassSections = user?.role === 'admin' || checkPermission('manage_school_settings');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter data by academic year
  const filteredClasses = classes.filter(cls => cls.academicYear === filterYear);
  const activeClasses = filteredClasses.filter(cls => cls.status === 'active');
  const inactiveClasses = filteredClasses.filter(cls => cls.status === 'inactive');

  // Class dialog handlers
  const handleOpenClassDialog = (cls?: ClassData) => {
    if (cls) {
      setSelectedClass(cls);
    } else {
      setSelectedClass(null);
    }
    setOpenClassDialog(true);
  };

  const handleCloseClassDialog = () => {
    setOpenClassDialog(false);
  };

  const handleSaveClass = () => {
    // In a real app, save class data here
    handleCloseClassDialog();
  };

  // Section dialog handlers
  const handleOpenSectionDialog = (section?: SectionData) => {
    if (section) {
      setSelectedSection(section);
    } else {
      setSelectedSection(null);
    }
    setOpenSectionDialog(true);
  };

  const handleCloseSectionDialog = () => {
    setOpenSectionDialog(false);
  };

  const handleSaveSection = () => {
    // In a real app, save section data here
    handleCloseSectionDialog();
  };

  // Handle deletion
  const handleDeleteClass = (id: string) => {
    // In a real app, we would confirm deletion first
    setClasses(classes.filter(cls => cls.id !== id));
  };

  const handleDeleteSection = (id: string) => {
    // In a real app, we would confirm deletion first
    setSections(sections.filter(section => section.id !== id));
  };

  if (!canManageClassSections) {
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
      <Typography variant="h5" gutterBottom>
        Class & Section Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={filterYear}
                label="Academic Year"
                onChange={(e) => setFilterYear(e.target.value)}
              >
                {academicYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenClassDialog()}
              sx={{ mr: 1 }}
            >
              Add Class
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={() => handleOpenSectionDialog()}
            >
              Add Section
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="class-section tabs">
          <Tab label="Classes" />
          <Tab label="Sections" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Active Classes ({activeClasses.length})
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Sections</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeClasses.map((cls) => (
                <TableRow key={cls.id} hover>
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>{cls.academicYear}</TableCell>
                  <TableCell>
                    {cls.sections.map((section, index) => (
                      <Chip
                        key={index}
                        label={section}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenClassDialog(cls)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClass(cls.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {inactiveClasses.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Inactive Classes ({inactiveClasses.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Sections</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inactiveClasses.map((cls) => (
                    <TableRow key={cls.id} hover sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{cls.academicYear}</TableCell>
                      <TableCell>
                        {cls.sections.map((section, index) => (
                          <Chip
                            key={index}
                            label={section}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenClassDialog(cls)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClass(cls.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Section</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Class Teacher</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections
                .filter(section => {
                  const classItem = classes.find(cls => cls.id === section.classId);
                  return classItem && classItem.academicYear === filterYear;
                })
                .map((section) => (
                  <TableRow key={section.id} hover sx={{ bgcolor: section.status === 'inactive' ? 'rgba(0, 0, 0, 0.05)' : 'inherit' }}>
                    <TableCell>{section.name}</TableCell>
                    <TableCell>{section.className}</TableCell>
                    <TableCell>{section.capacity}</TableCell>
                    <TableCell>{section.students}</TableCell>
                    <TableCell>{section.classTeacher}</TableCell>
                    <TableCell>
                      <Chip
                        label={section.status === 'active' ? 'Active' : 'Inactive'}
                        color={section.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenSectionDialog(section)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteSection(section.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Add/Edit Class Dialog */}
      <Dialog open={openClassDialog} onClose={handleCloseClassDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Name"
                variant="outlined"
                defaultValue={selectedClass?.name || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  defaultValue={selectedClass?.academicYear || filterYear}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedClass?.status || 'active'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClassDialog}>Cancel</Button>
          <Button onClick={handleSaveClass} variant="contained" color="primary">
            {selectedClass ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Section Dialog */}
      <Dialog open={openSectionDialog} onClose={handleCloseSectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section Name"
                variant="outlined"
                defaultValue={selectedSection?.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  label="Class"
                  defaultValue={selectedSection?.classId || ''}
                >
                  {activeClasses.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                variant="outlined"
                defaultValue={selectedSection?.capacity || 40}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedSection?.status || 'active'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Teacher"
                variant="outlined"
                defaultValue={selectedSection?.classTeacher || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionDialog}>Cancel</Button>
          <Button onClick={handleSaveSection} variant="contained" color="primary">
            {selectedSection ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClassSectionManagement;
