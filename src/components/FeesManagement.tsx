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
  Chip,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit, 
  Search, 
  Done, 
  Warning, 
  ErrorOutline, 
  Print, 
  Download, 
  MenuBook, 
  ReceiptLong, 
  MonetizationOn, 
  BarChart, 
  Receipt, 
  Payments, 
  History
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/useAuth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
      id={`fees-tabpanel-${index}`}
      aria-labelledby={`fees-tab-${index}`}
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
interface FeeStructure {
  id: string;
  name: string;
  academicYear: string;
  classId: string;
  className: string;
  total: number;
  installments: number;
  isActive: boolean;
  components: FeeComponent[];
}

interface FeeComponent {
  id: string;
  name: string;
  amount: number;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  dueDate?: Date;
}

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  section: string;
}

interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  section: string;
  receiptNumber: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'online';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  academicYear: string;
  feeType: string;
  description: string;
}

interface DuesFeeStatus {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  section: string;
  totalFees: number;
  totalPaid: number;
  totalDue: number;
  nextDueDate: Date;
  status: 'paid' | 'partially-paid' | 'overdue';
}

// Sample data
const academicYears = ['2024-2025', '2025-2026'];
const classes = ['8', '9', '10', '11', '12'];

// Sample fee structures
const sampleFeeStructures: FeeStructure[] = [
  {
    id: '1',
    name: 'Regular Fee - Class 8',
    academicYear: '2025-2026',
    classId: '8',
    className: 'Class 8',
    total: 45000,
    installments: 4,
    isActive: true,
    components: [
      { id: '1', name: 'Tuition Fee', amount: 30000, frequency: 'yearly' },
      { id: '2', name: 'Development Fee', amount: 5000, frequency: 'yearly' },
      { id: '3', name: 'Laboratory Fee', amount: 3000, frequency: 'yearly' },
      { id: '4', name: 'Library Fee', amount: 2000, frequency: 'yearly' },
      { id: '5', name: 'Computer Fee', amount: 3000, frequency: 'yearly' },
      { id: '6', name: 'Sports Fee', amount: 2000, frequency: 'yearly' }
    ]
  },
  {
    id: '2',
    name: 'Regular Fee - Class 9',
    academicYear: '2025-2026',
    classId: '9',
    className: 'Class 9',
    total: 48000,
    installments: 4,
    isActive: true,
    components: [
      { id: '7', name: 'Tuition Fee', amount: 32000, frequency: 'yearly' },
      { id: '8', name: 'Development Fee', amount: 6000, frequency: 'yearly' },
      { id: '9', name: 'Laboratory Fee', amount: 3000, frequency: 'yearly' },
      { id: '10', name: 'Library Fee', amount: 2000, frequency: 'yearly' },
      { id: '11', name: 'Computer Fee', amount: 3000, frequency: 'yearly' },
      { id: '12', name: 'Sports Fee', amount: 2000, frequency: 'yearly' }
    ]
  },
  {
    id: '3',
    name: 'Regular Fee - Class 10',
    academicYear: '2025-2026',
    classId: '10',
    className: 'Class 10',
    total: 52000,
    installments: 4,
    isActive: true,
    components: [
      { id: '13', name: 'Tuition Fee', amount: 35000, frequency: 'yearly' },
      { id: '14', name: 'Development Fee', amount: 6000, frequency: 'yearly' },
      { id: '15', name: 'Laboratory Fee', amount: 4000, frequency: 'yearly' },
      { id: '16', name: 'Library Fee', amount: 2000, frequency: 'yearly' },
      { id: '17', name: 'Computer Fee', amount: 3000, frequency: 'yearly' },
      { id: '18', name: 'Sports Fee', amount: 2000, frequency: 'yearly' }
    ]
  },
  {
    id: '4',
    name: 'Science Stream - Class 11',
    academicYear: '2025-2026',
    classId: '11',
    className: 'Class 11 (Science)',
    total: 60000,
    installments: 4,
    isActive: true,
    components: [
      { id: '19', name: 'Tuition Fee', amount: 40000, frequency: 'yearly' },
      { id: '20', name: 'Development Fee', amount: 8000, frequency: 'yearly' },
      { id: '21', name: 'Laboratory Fee', amount: 5000, frequency: 'yearly' },
      { id: '22', name: 'Library Fee', amount: 2000, frequency: 'yearly' },
      { id: '23', name: 'Computer Fee', amount: 3000, frequency: 'yearly' },
      { id: '24', name: 'Sports Fee', amount: 2000, frequency: 'yearly' }
    ]
  }
];

// Sample students
const sampleStudents: Student[] = [
  { id: '1', name: 'Alex Johnson', admissionNumber: 'ADM2025001', class: '8', section: 'A' },
  { id: '2', name: 'Sarah Williams', admissionNumber: 'ADM2025002', class: '8', section: 'A' },
  { id: '3', name: 'Michael Brown', admissionNumber: 'ADM2025003', class: '9', section: 'B' },
  { id: '4', name: 'Emma Davis', admissionNumber: 'ADM2025004', class: '10', section: 'A' },
  { id: '5', name: 'James Wilson', admissionNumber: 'ADM2025005', class: '11', section: 'Science' },
  { id: '6', name: 'Olivia Martinez', admissionNumber: 'ADM2025006', class: '12', section: 'Commerce' }
];

// Sample fee payments
const sampleFeePayments: FeePayment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Alex Johnson',
    admissionNumber: 'ADM2025001',
    className: 'Class 8',
    section: 'A',
    receiptNumber: 'REC2025001',
    amount: 11250,
    paymentDate: new Date('2025-04-15'),
    paymentMethod: 'online',
    status: 'paid',
    academicYear: '2025-2026',
    feeType: 'Tuition Fee - Q1',
    description: 'First quarter tuition fee payment'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Alex Johnson',
    admissionNumber: 'ADM2025001',
    className: 'Class 8',
    section: 'A',
    receiptNumber: 'REC2025045',
    amount: 11250,
    paymentDate: new Date('2025-07-10'),
    paymentMethod: 'cash',
    status: 'paid',
    academicYear: '2025-2026',
    feeType: 'Tuition Fee - Q2',
    description: 'Second quarter tuition fee payment'
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Sarah Williams',
    admissionNumber: 'ADM2025002',
    className: 'Class 8',
    section: 'A',
    receiptNumber: 'REC2025002',
    amount: 11250,
    paymentDate: new Date('2025-04-12'),
    paymentMethod: 'bank-transfer',
    status: 'paid',
    academicYear: '2025-2026',
    feeType: 'Tuition Fee - Q1',
    description: 'First quarter tuition fee payment'
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'Michael Brown',
    admissionNumber: 'ADM2025003',
    className: 'Class 9',
    section: 'B',
    receiptNumber: 'REC2025003',
    amount: 12000,
    paymentDate: new Date('2025-04-20'),
    paymentMethod: 'cheque',
    status: 'paid',
    academicYear: '2025-2026',
    feeType: 'Tuition Fee - Q1',
    description: 'First quarter tuition fee payment'
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'James Wilson',
    admissionNumber: 'ADM2025005',
    className: 'Class 11',
    section: 'Science',
    receiptNumber: 'REC2025005',
    amount: 15000,
    paymentDate: new Date('2025-04-05'),
    paymentMethod: 'online',
    status: 'paid',
    academicYear: '2025-2026',
    feeType: 'Tuition Fee - Q1',
    description: 'First quarter tuition fee payment'
  }
];

// Generate fee status data
const generateFeeStatus = (): DuesFeeStatus[] => {
  return sampleStudents.map(student => {
    const feeStructure = sampleFeeStructures.find(
      fs => fs.className.includes(student.class)
    );
    
    const totalFees = feeStructure?.total || 0;
    
    const studentPayments = sampleFeePayments.filter(
      payment => payment.studentId === student.id && payment.status === 'paid'
    );
    
    const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDue = totalFees - totalPaid;
    
    // Determine next due date based on current date
    const currentDate = new Date('2025-08-07'); // Using the current date from context
    let nextDueDate: Date;
    
    if (currentDate < new Date('2025-07-15')) {
      nextDueDate = new Date('2025-07-15');
    } else if (currentDate < new Date('2025-10-15')) {
      nextDueDate = new Date('2025-10-15');
    } else if (currentDate < new Date('2026-01-15')) {
      nextDueDate = new Date('2026-01-15');
    } else {
      nextDueDate = new Date('2026-04-15');
    }
    
    // Determine status
    let status: 'paid' | 'partially-paid' | 'overdue';
    if (totalDue <= 0) {
      status = 'paid';
    } else if (currentDate > nextDueDate) {
      status = 'overdue';
    } else {
      status = 'partially-paid';
    }
    
    return {
      studentId: student.id,
      studentName: student.name,
      admissionNumber: student.admissionNumber,
      className: `Class ${student.class}`,
      section: student.section,
      totalFees,
      totalPaid,
      totalDue,
      nextDueDate,
      status
    };
  });
};

const sampleFeeStatus = generateFeeStatus();

const FeesManagement: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [feeStructures] = useState<FeeStructure[]>(sampleFeeStructures);
  const [feePayments] = useState<FeePayment[]>(sampleFeePayments);
  const [feeStatus] = useState<DuesFeeStatus[]>(sampleFeeStatus);
  const [openStructureDialog, setOpenStructureDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Check permissions
  const canManageFees = user?.role === 'admin' || checkPermission('manage_fees');
  const canCollectFees = user?.role === 'admin' || checkPermission('collect_fees');
  const canViewFees = user?.role === 'admin' || checkPermission('view_fees');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter fee structures
  const filteredFeeStructures = feeStructures.filter(structure => 
    structure.academicYear === academicYear &&
    (selectedClass === '' || structure.classId === selectedClass) &&
    (searchTerm === '' || 
      structure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.className.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter fee status
  const filteredFeeStatus = feeStatus.filter(status => 
    (selectedClass === '' || status.className.includes(selectedClass)) &&
    (searchTerm === '' || 
      status.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter fee payments
  const filteredFeePayments = feePayments.filter(payment => 
    payment.academicYear === academicYear &&
    (selectedClass === '' || payment.className.includes(selectedClass)) &&
    (searchTerm === '' || 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fee structure dialog handlers
  const handleOpenStructureDialog = (structure?: FeeStructure) => {
    if (structure) {
      setSelectedStructure(structure);
    } else {
      setSelectedStructure(null);
    }
    setOpenStructureDialog(true);
  };

  const handleCloseStructureDialog = () => {
    setOpenStructureDialog(false);
  };

  const handleSaveStructure = () => {
    // In a real app, save fee structure data to the database
    setOpenStructureDialog(false);
    setSnackbar({
      open: true,
      message: selectedStructure ? 'Fee structure updated successfully' : 'Fee structure created successfully',
      severity: 'success'
    });
  };

  // Payment dialog handlers
  const handleOpenPaymentDialog = (student?: Student) => {
    if (student) {
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleSavePayment = () => {
    // In a real app, save payment data to the database
    setOpenPaymentDialog(false);
    setSnackbar({
      open: true,
      message: 'Payment recorded successfully',
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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return format(date, 'MMM dd, yyyy');
  };

  // Get status chip
  const getStatusChip = (status: string) => {
    let color: 'success' | 'error' | 'warning' | 'info' = 'info';
    let icon = <Receipt />;
    
    switch(status) {
      case 'paid':
        color = 'success';
        icon = <Done />;
        break;
      case 'partially-paid':
        color = 'warning';
        icon = <Warning />;
        break;
      case 'overdue':
        color = 'error';
        icon = <ErrorOutline />;
        break;
      case 'pending':
        color = 'info';
        icon = <Receipt />;
        break;
    }
    
    return (
      <Chip
        icon={icon}
        label={status.replace('-', ' ').toUpperCase()}
        color={color}
        size="small"
      />
    );
  };

  // Calculate total amount collected
  const totalCollected = filteredFeePayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate pending dues
  const totalDues = filteredFeeStatus.reduce((sum, status) => sum + status.totalDue, 0);

  if (!canViewFees) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access Fee Management.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="fee management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<MenuBook />} 
            label="Fee Structure" 
            iconPosition="start"
          />
          <Tab 
            icon={<ReceiptLong />} 
            label="Fee Collection" 
            iconPosition="start"
          />
          <Tab 
            icon={<MonetizationOn />} 
            label="Fee Dues" 
            iconPosition="start"
          />
          <Tab 
            icon={<BarChart />} 
            label="Reports" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Fee Structure Tab */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
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
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {canManageFees && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => handleOpenStructureDialog()}
                >
                  Add Fee Structure
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Structure Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Installments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeeStructures.map((structure) => (
                <TableRow key={structure.id} hover>
                  <TableCell>{structure.name}</TableCell>
                  <TableCell>{structure.className}</TableCell>
                  <TableCell>{structure.academicYear}</TableCell>
                  <TableCell>{formatCurrency(structure.total)}</TableCell>
                  <TableCell>{structure.installments}</TableCell>
                  <TableCell>
                    <Chip
                      label={structure.isActive ? 'Active' : 'Inactive'}
                      color={structure.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => handleOpenStructureDialog(structure)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    {canManageFees && (
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredFeeStructures.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No fee structures found for the selected criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Fee Collection Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Collected
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">
                    {formatCurrency(totalCollected)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Dues
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning color="warning" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h4">
                    {formatCurrency(totalDues)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {canCollectFees && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Payments />}
                    onClick={() => handleOpenPaymentDialog()}
                    sx={{ width: '100%', py: 1 }}
                  >
                    Collect New Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
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
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Student/Receipt"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receipt No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Fee Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeePayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>{payment.receiptNumber}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>
                    <Tooltip title={`Admission No: ${payment.admissionNumber}`}>
                      <span>{payment.studentName}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{`${payment.className} ${payment.section}`}</TableCell>
                  <TableCell>{payment.feeType}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentMethod.replace('-', ' ').toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {getStatusChip(payment.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Print Receipt">
                      <IconButton size="small" color="primary">
                        <Print />
                      </IconButton>
                    </Tooltip>
                    {canManageFees && (
                      <Tooltip title="View/Edit">
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredFeePayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No payment records found for the selected criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Fee Dues Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Search Student"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Admission No.</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Total Fees</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Next Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeeStatus.map((status) => (
                <TableRow key={status.studentId} hover>
                  <TableCell>{status.studentName}</TableCell>
                  <TableCell>{status.admissionNumber}</TableCell>
                  <TableCell>{`${status.className} ${status.section}`}</TableCell>
                  <TableCell>{formatCurrency(status.totalFees)}</TableCell>
                  <TableCell>{formatCurrency(status.totalPaid)}</TableCell>
                  <TableCell>{formatCurrency(status.totalDue)}</TableCell>
                  <TableCell>{formatDate(status.nextDueDate)}</TableCell>
                  <TableCell>
                    {getStatusChip(status.status)}
                  </TableCell>
                  <TableCell align="right">
                    {canCollectFees && (
                      <Tooltip title="Collect Payment">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenPaymentDialog(
                            sampleStudents.find(student => student.id === status.studentId) || undefined
                          )}
                        >
                          <Payments />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Payment History">
                      <IconButton size="small" color="primary">
                        <History />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFeeStatus.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No student fee records found for the selected criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fee Collection Summary
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Fee collection chart will be displayed here
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText primary="Total Collection" />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(totalCollected)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Total Pending" />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(totalDues)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Collection Rate" />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" fontWeight="bold">
                        {totalCollected + totalDues > 0 
                          ? `${Math.round((totalCollected / (totalCollected + totalDues)) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Collection by Payment Method
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Payment method distribution chart will be displayed here
                  </Typography>
                </Box>
                <List>
                  {['cash', 'cheque', 'bank-transfer', 'online'].map(method => {
                    const methodTotal = feePayments
                      .filter(payment => 
                        payment.academicYear === academicYear && 
                        payment.paymentMethod === method &&
                        payment.status === 'paid'
                      )
                      .reduce((sum, payment) => sum + payment.amount, 0);
                    
                    return (
                      <React.Fragment key={method}>
                        <ListItem>
                          <ListItemText primary={method.replace('-', ' ').toUpperCase()} />
                          <ListItemSecondaryAction>
                            <Typography variant="body1" fontWeight="bold">
                              {formatCurrency(methodTotal)}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Class-wise Collection Report
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Print />}
                  >
                    Print Report
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Class</TableCell>
                        <TableCell align="right">Total Fees</TableCell>
                        <TableCell align="right">Collected</TableCell>
                        <TableCell align="right">Pending</TableCell>
                        <TableCell align="right">Collection %</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.map(cls => {
                        // Calculate class totals
                        const classStudents = feeStatus.filter(status => 
                          status.className === `Class ${cls}`
                        );
                        
                        const totalFees = classStudents.reduce(
                          (sum, status) => sum + status.totalFees, 0
                        );
                        
                        const totalPaid = classStudents.reduce(
                          (sum, status) => sum + status.totalPaid, 0
                        );
                        
                        const totalDue = classStudents.reduce(
                          (sum, status) => sum + status.totalDue, 0
                        );
                        
                        const collectionRate = totalFees > 0 
                          ? Math.round((totalPaid / totalFees) * 100) 
                          : 0;
                        
                        return (
                          <TableRow key={cls} hover>
                            <TableCell>Class {cls}</TableCell>
                            <TableCell align="right">{formatCurrency(totalFees)}</TableCell>
                            <TableCell align="right">{formatCurrency(totalPaid)}</TableCell>
                            <TableCell align="right">{formatCurrency(totalDue)}</TableCell>
                            <TableCell align="right">{collectionRate}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add/Edit Fee Structure Dialog */}
      <Dialog open={openStructureDialog} onClose={handleCloseStructureDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStructure ? 'Edit Fee Structure' : 'Add New Fee Structure'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Structure Name"
                variant="outlined"
                defaultValue={selectedStructure?.name || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  defaultValue={selectedStructure?.academicYear || academicYear}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  label="Class"
                  defaultValue={selectedStructure?.classId || ''}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount"
                type="number"
                variant="outlined"
                defaultValue={selectedStructure?.total || 0}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Installments"
                type="number"
                variant="outlined"
                defaultValue={selectedStructure?.installments || 4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedStructure?.isActive ? "true" : "false"}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fee Components
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedStructure?.components.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            defaultValue={component.name}
                            variant="standard"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            defaultValue={component.amount}
                            variant="standard"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small" variant="standard">
                            <Select
                              defaultValue={component.frequency}
                            >
                              <MenuItem value="one-time">One Time</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="quarterly">Quarterly</MenuItem>
                              <MenuItem value="half-yearly">Half Yearly</MenuItem>
                              <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!selectedStructure && (
                      <TableRow>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="e.g., Tuition Fee"
                            variant="standard"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            placeholder="0"
                            variant="standard"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small" variant="standard">
                            <Select
                              defaultValue="yearly"
                            >
                              <MenuItem value="one-time">One Time</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="quarterly">Quarterly</MenuItem>
                              <MenuItem value="half-yearly">Half Yearly</MenuItem>
                              <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                startIcon={<Add />}
                sx={{ mt: 2 }}
              >
                Add Component
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStructureDialog}>Cancel</Button>
          <Button onClick={handleSaveStructure} variant="contained" color="primary">
            {selectedStructure ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="md" fullWidth>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={sampleStudents}
                getOptionLabel={(option) => `${option.name} (${option.admissionNumber})`}
                defaultValue={selectedStudent}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Student"
                    variant="outlined"
                    placeholder="Search by name or admission number"
                  />
                )}
              />
            </Grid>
            
            {selectedStudent && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    variant="outlined"
                    value={`Class ${selectedStudent.class} ${selectedStudent.section}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fee Type</InputLabel>
                    <Select
                      label="Fee Type"
                      defaultValue=""
                    >
                      <MenuItem value="tuition-q1">Tuition Fee - Q1</MenuItem>
                      <MenuItem value="tuition-q2">Tuition Fee - Q2</MenuItem>
                      <MenuItem value="tuition-q3">Tuition Fee - Q3</MenuItem>
                      <MenuItem value="tuition-q4">Tuition Fee - Q4</MenuItem>
                      <MenuItem value="development">Development Fee</MenuItem>
                      <MenuItem value="exam">Examination Fee</MenuItem>
                      <MenuItem value="other">Other Fees</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Payment Date"
                  defaultValue={new Date()}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Method"
                  defaultValue="cash"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
                  <MenuItem value="online">Online Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Receipt Number"
                variant="outlined"
                defaultValue={`REC${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description/Notes"
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePayment} 
            variant="contained" 
            color="primary"
            disabled={!selectedStudent}
          >
            Record Payment
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

export default FeesManagement;
