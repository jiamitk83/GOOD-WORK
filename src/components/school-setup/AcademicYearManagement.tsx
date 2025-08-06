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
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete, Event } from '@mui/icons-material';
import { useAuth } from '../../context/useAuth';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms: Term[];
}

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYearId: string;
}

// Sample academic years
const sampleAcademicYears: AcademicYear[] = [
  {
    id: '1',
    name: '2025-2026',
    startDate: '2025-06-01',
    endDate: '2026-04-30',
    isActive: true,
    terms: [
      {
        id: '1',
        name: 'Term 1',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        academicYearId: '1'
      },
      {
        id: '2',
        name: 'Term 2',
        startDate: '2025-09-01',
        endDate: '2025-12-15',
        academicYearId: '1'
      },
      {
        id: '3',
        name: 'Term 3',
        startDate: '2026-01-05',
        endDate: '2026-04-30',
        academicYearId: '1'
      }
    ]
  },
  {
    id: '2',
    name: '2024-2025',
    startDate: '2024-06-01',
    endDate: '2025-05-15',
    isActive: false,
    terms: [
      {
        id: '4',
        name: 'Term 1',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        academicYearId: '2'
      },
      {
        id: '5',
        name: 'Term 2',
        startDate: '2024-09-01',
        endDate: '2024-12-15',
        academicYearId: '2'
      },
      {
        id: '6',
        name: 'Term 3',
        startDate: '2025-01-05',
        endDate: '2025-05-15',
        academicYearId: '2'
      }
    ]
  }
];

const AcademicYearManagement: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(sampleAcademicYears);
  const [openYearDialog, setOpenYearDialog] = useState(false);
  const [openTermDialog, setOpenTermDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [expandedYear, setExpandedYear] = useState<string | null>('1'); // Default to the first year being expanded

  // Check permissions
  const canManageAcademicYears = user?.role === 'admin' || checkPermission('manage_school_settings');

  // Handlers for academic year
  const handleOpenYearDialog = (year?: AcademicYear) => {
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear(null);
    }
    setOpenYearDialog(true);
  };

  const handleCloseYearDialog = () => {
    setOpenYearDialog(false);
  };

  const handleSaveYear = () => {
    // In a real app, save year data here
    handleCloseYearDialog();
  };

  // Handlers for term
  const handleOpenTermDialog = (term?: Term, yearId?: string) => {
    if (term) {
      setSelectedTerm(term);
    } else {
      setSelectedTerm(null);
    }
    
    // If no year is selected yet, but yearId is provided, find and set that year
    if (!selectedYear && yearId) {
      const year = academicYears.find(y => y.id === yearId);
      if (year) {
        setSelectedYear(year);
      }
    }
    
    setOpenTermDialog(true);
  };

  const handleCloseTermDialog = () => {
    setOpenTermDialog(false);
  };

  const handleSaveTerm = () => {
    // In a real app, save term data here
    handleCloseTermDialog();
  };

  // Handle deletion
  const handleDeleteYear = (id: string) => {
    // In a real app, we would confirm deletion first
    setAcademicYears(academicYears.filter(year => year.id !== id));
  };

  const handleDeleteTerm = (termId: string, yearId: string) => {
    // In a real app, we would confirm deletion first
    setAcademicYears(academicYears.map(year => {
      if (year.id === yearId) {
        return {
          ...year,
          terms: year.terms.filter(term => term.id !== termId)
        };
      }
      return year;
    }));
  };

  // Handle toggle expansion
  const handleToggleExpand = (yearId: string) => {
    setExpandedYear(expandedYear === yearId ? null : yearId);
  };

  // Handle setting active year
  const handleSetActiveYear = (id: string) => {
    setAcademicYears(academicYears.map(year => ({
      ...year,
      isActive: year.id === id
    })));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!canManageAcademicYears) {
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
          Academic Year Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenYearDialog()}
        >
          Add Academic Year
        </Button>
      </Box>

      {academicYears.map((year) => (
        <Paper key={year.id} sx={{ mb: 3, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: year.isActive ? 'primary.main' : 'grey.100',
              color: year.isActive ? 'white' : 'text.primary',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleToggleExpand(year.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div">
                {year.name} {year.isActive && '(Current)'}
              </Typography>
              <Chip 
                label={`${formatDate(year.startDate)} - ${formatDate(year.endDate)}`}
                size="small"
                sx={{ ml: 2, backgroundColor: year.isActive ? 'rgba(255, 255, 255, 0.2)' : undefined }}
              />
            </Box>
            <Box>
              {!year.isActive && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetActiveYear(year.id);
                  }}
                  sx={{ mr: 1, backgroundColor: 'primary.main' }}
                >
                  Set as Current
                </Button>
              )}
              <IconButton 
                color="inherit" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenYearDialog(year);
                }}
              >
                <Edit />
              </IconButton>
              {!year.isActive && (
                <IconButton 
                  color="inherit" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteYear(year.id);
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>

          {expandedYear === year.id && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Terms
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => handleOpenTermDialog(undefined, year.id)}
                >
                  Add Term
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Term Name</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {year.terms.map((term) => {
                      // Calculate duration in weeks
                      const start = new Date(term.startDate);
                      const end = new Date(term.endDate);
                      const durationMs = end.getTime() - start.getTime();
                      const durationDays = durationMs / (1000 * 60 * 60 * 24);
                      const durationWeeks = Math.round(durationDays / 7);

                      return (
                        <TableRow key={term.id} hover>
                          <TableCell>{term.name}</TableCell>
                          <TableCell>{formatDate(term.startDate)}</TableCell>
                          <TableCell>{formatDate(term.endDate)}</TableCell>
                          <TableCell>{durationWeeks} weeks</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleOpenTermDialog(term)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteTerm(term.id, year.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      ))}

      {/* Add/Edit Academic Year Dialog */}
      <Dialog open={openYearDialog} onClose={handleCloseYearDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedYear ? 'Edit Academic Year' : 'Add New Academic Year'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Academic Year Name"
                variant="outlined"
                defaultValue={selectedYear?.name || ''}
                helperText="Example: 2025-2026"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                variant="outlined"
                defaultValue={selectedYear?.startDate || ''}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                variant="outlined"
                defaultValue={selectedYear?.endDate || ''}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {selectedYear && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={selectedYear.isActive} 
                      onChange={() => {
                        if (!selectedYear.isActive) {
                          handleSetActiveYear(selectedYear.id);
                        }
                      }}
                    />
                  }
                  label="Set as Current Academic Year"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseYearDialog}>Cancel</Button>
          <Button onClick={handleSaveYear} variant="contained" color="primary">
            {selectedYear ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Term Dialog */}
      <Dialog open={openTermDialog} onClose={handleCloseTermDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTerm ? 'Edit Term' : 'Add New Term'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Name"
                variant="outlined"
                defaultValue={selectedTerm?.name || ''}
                helperText="Example: Term 1, Semester 1, Quarter 1"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                variant="outlined"
                defaultValue={selectedTerm?.startDate || ''}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                variant="outlined"
                defaultValue={selectedTerm?.endDate || ''}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {!selectedTerm && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year</InputLabel>
                  <Select
                    label="Academic Year"
                    defaultValue={selectedYear?.id || ''}
                  >
                    {academicYears.map((year) => (
                      <MenuItem key={year.id} value={year.id}>{year.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTermDialog}>Cancel</Button>
          <Button onClick={handleSaveTerm} variant="contained" color="primary">
            {selectedTerm ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AcademicYearManagement;
