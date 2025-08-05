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
  Container,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

interface FeeStructure {
  id: number;
  class: string;
  feeType: 'Tuition' | 'Transport' | 'Library' | 'Sports' | 'Annual';
  amount: number;
  dueDate: string;
  status: 'Active' | 'Inactive';
}

interface StudentFee {
  id: number;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
  lastPaymentDate?: string;
}

interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque';
  receiptNumber: string;
  feeType: string;
  status: 'Success' | 'Pending' | 'Failed';
}

// Function to get initial fee structures from localStorage
const getInitialFeeStructures = (): FeeStructure[] => {
  try {
    const savedFeeStructures = localStorage.getItem('school-erp-fee-structures');
    if (savedFeeStructures) {
      return JSON.parse(savedFeeStructures);
    }
  } catch (error) {
    console.error('Error loading fee structures from localStorage:', error);
  }
  
  // Default fee structures if localStorage is empty or error
  return [
    {
      id: 1,
      class: '10th',
      feeType: 'Tuition',
      amount: 15000,
      dueDate: '2025-09-10',
      status: 'Active'
    },
    {
      id: 2,
      class: '10th',
      feeType: 'Transport',
      amount: 3000,
      dueDate: '2025-09-10',
      status: 'Active'
    },
    {
      id: 3,
      class: '9th',
      feeType: 'Tuition',
      amount: 12000,
      dueDate: '2025-09-10',
      status: 'Active'
    },
    {
      id: 4,
      class: '10th',
      feeType: 'Annual',
      amount: 5000,
      dueDate: '2025-08-30',
      status: 'Active'
    }
  ];
};

// Function to save fee structures to localStorage
const saveFeeStructuresToStorage = (feeStructuresList: FeeStructure[]) => {
  try {
    localStorage.setItem('school-erp-fee-structures', JSON.stringify(feeStructuresList));
  } catch (error) {
    console.error('Error saving fee structures to localStorage:', error);
  }
};

// Function to get initial student fees from localStorage
const getInitialStudentFees = (): StudentFee[] => {
  try {
    const savedStudentFees = localStorage.getItem('school-erp-student-fees');
    if (savedStudentFees) {
      return JSON.parse(savedStudentFees);
    }
  } catch (error) {
    console.error('Error loading student fees from localStorage:', error);
  }
  
  // Default student fees if localStorage is empty or error
  return [
    {
      id: 1,
      studentName: 'राहुल शर्मा',
      rollNumber: 'STU001',
      class: '10th',
      section: 'A',
      feeType: 'Tuition Fee',
      totalAmount: 15000,
      paidAmount: 15000,
      pendingAmount: 0,
      dueDate: '2025-09-10',
      status: 'Paid',
      lastPaymentDate: '2025-08-01'
    },
    {
      id: 2,
      studentName: 'प्रिया गुप्ता',
      rollNumber: 'STU002',
      class: '10th',
      section: 'B',
      feeType: 'Tuition Fee',
      totalAmount: 15000,
      paidAmount: 10000,
      pendingAmount: 5000,
      dueDate: '2025-09-10',
      status: 'Partial',
      lastPaymentDate: '2025-07-15'
    },
    {
      id: 3,
      studentName: 'अमित कुमार',
      rollNumber: 'STU003',
      class: '9th',
      section: 'A',
      feeType: 'Tuition Fee',
      totalAmount: 12000,
      paidAmount: 0,
      pendingAmount: 12000,
      dueDate: '2025-08-10',
      status: 'Overdue'
    },
    {
      id: 4,
      studentName: 'सुनीता वर्मा',
      rollNumber: 'STU004',
      class: '10th',
      section: 'A',
      feeType: 'Transport Fee',
      totalAmount: 3000,
      paidAmount: 0,
      pendingAmount: 3000,
      dueDate: '2025-09-15',
      status: 'Pending'
    }
  ];
};

// Function to save student fees to localStorage
const saveStudentFeesToStorage = (studentFeesList: StudentFee[]) => {
  try {
    localStorage.setItem('school-erp-student-fees', JSON.stringify(studentFeesList));
  } catch (error) {
    console.error('Error saving student fees to localStorage:', error);
  }
};

// Function to get initial payments from localStorage
const getInitialPayments = (): Payment[] => {
  try {
    const savedPayments = localStorage.getItem('school-erp-payments');
    if (savedPayments) {
      return JSON.parse(savedPayments);
    }
  } catch (error) {
    console.error('Error loading payments from localStorage:', error);
  }
  
  // Default payments if localStorage is empty or error
  return [
    {
      id: 1,
      studentId: 1,
      studentName: 'राहुल शर्मा',
      rollNumber: 'STU001',
      amount: 15000,
      paymentDate: '2025-08-01',
      paymentMethod: 'Online',
      receiptNumber: 'REC001',
      feeType: 'Tuition Fee',
      status: 'Success'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'प्रिया गुप्ता',
      rollNumber: 'STU002',
      amount: 10000,
      paymentDate: '2025-07-15',
      paymentMethod: 'Bank Transfer',
      receiptNumber: 'REC002',
      feeType: 'Tuition Fee',
      status: 'Success'
    }
  ];
};

// Function to save payments to localStorage
const savePaymentsToStorage = (paymentsList: Payment[]) => {
  try {
    localStorage.setItem('school-erp-payments', JSON.stringify(paymentsList));
  } catch (error) {
    console.error('Error saving payments to localStorage:', error);
  }
};

const FeesManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(getInitialFeeStructures());
  const [studentFees, setStudentFees] = useState<StudentFee[]>(getInitialStudentFees());
  const [payments, setPayments] = useState<Payment[]>(getInitialPayments());

  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<StudentFee | null>(null);
  
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    class: '',
    feeType: 'Tuition',
    amount: 0,
    dueDate: '',
    status: 'Active'
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'Cash' as 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque',
    receiptNumber: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (fee?: FeeStructure) => {
    if (fee) {
      setEditingFee(fee);
      setFormData(fee);
    } else {
      setEditingFee(null);
      setFormData({
        class: '',
        feeType: 'Tuition',
        amount: 0,
        dueDate: '',
        status: 'Active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFee(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (editingFee) {
      const updatedFeeStructures = feeStructures.map(f => 
        f.id === editingFee.id 
          ? { ...editingFee, ...formData }
          : f
      );
      setFeeStructures(updatedFeeStructures);
      saveFeeStructuresToStorage(updatedFeeStructures);
    } else {
      const newFee: FeeStructure = {
        id: Math.max(...feeStructures.map(f => f.id)) + 1,
        class: formData.class || '',
        feeType: formData.feeType as any || 'Tuition',
        amount: formData.amount || 0,
        dueDate: formData.dueDate || '',
        status: formData.status as 'Active' | 'Inactive' || 'Active'
      };
      const updatedFeeStructures = [...feeStructures, newFee];
      setFeeStructures(updatedFeeStructures);
      saveFeeStructuresToStorage(updatedFeeStructures);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    const updatedFeeStructures = feeStructures.filter(f => f.id !== id);
    setFeeStructures(updatedFeeStructures);
    saveFeeStructuresToStorage(updatedFeeStructures);
  };

  const handlePayment = (studentFee: StudentFee) => {
    setSelectedStudentForPayment(studentFee);
    setPaymentData({
      amount: studentFee.pendingAmount,
      paymentMethod: 'Cash',
      receiptNumber: `REC${String(payments.length + 1).padStart(3, '0')}`
    });
    setPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (selectedStudentForPayment) {
      const newPayment: Payment = {
        id: Math.max(...payments.map(p => p.id)) + 1,
        studentId: selectedStudentForPayment.id,
        studentName: selectedStudentForPayment.studentName,
        rollNumber: selectedStudentForPayment.rollNumber,
        amount: paymentData.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentData.paymentMethod,
        receiptNumber: paymentData.receiptNumber,
        feeType: selectedStudentForPayment.feeType,
        status: 'Success'
      };

      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      savePaymentsToStorage(updatedPayments);

      // Update student fee status
      const updatedStudentFees = studentFees.map(sf => 
        sf.id === selectedStudentForPayment.id 
          ? {
              ...sf,
              paidAmount: sf.paidAmount + paymentData.amount,
              pendingAmount: sf.pendingAmount - paymentData.amount,
              status: (sf.pendingAmount - paymentData.amount) === 0 ? 'Paid' : 'Partial',
              lastPaymentDate: new Date().toISOString().split('T')[0]
            }
          : sf
      );
      setStudentFees(updatedStudentFees);
      saveStudentFeesToStorage(updatedStudentFees);
    }
    setPaymentOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      case 'Partial': return 'info';
      case 'Active': return 'success';
      default: return 'default';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Online': return 'success';
      case 'Bank Transfer': return 'info';
      case 'Cash': return 'warning';
      case 'Cheque': return 'secondary';
      default: return 'default';
    }
  };

  const totalPendingAmount = studentFees.reduce((total, fee) => total + fee.pendingAmount, 0);
  const totalPaidAmount = studentFees.reduce((total, fee) => total + fee.paidAmount, 0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              फीस प्रबंधन (Fees Management)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            फीस संरचना जोड़ें
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalPaidAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2">कुल संग्रहीत</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalPendingAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2">कुल बकाया</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Overdue').length}
                </Typography>
                <Typography variant="body2">देरी से छात्र</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Paid').length}
                </Typography>
                <Typography variant="body2">भुगतान किए गए छात्र</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label="फीस संरचना" 
              icon={<MoneyIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="छात्र फीस" 
              icon={<ReceiptIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="भुगतान इतिहास" 
              icon={<PaymentIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Fee Structure Tab */}
        {tabValue === 0 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>कक्षा</strong></TableCell>
                    <TableCell><strong>फीस प्रकार</strong></TableCell>
                    <TableCell><strong>राशि</strong></TableCell>
                    <TableCell><strong>नियत तारीख</strong></TableCell>
                    <TableCell><strong>स्थिति</strong></TableCell>
                    <TableCell><strong>क्रियाएं</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeStructures.map((fee) => (
                    <TableRow key={fee.id} hover>
                      <TableCell>
                        <Chip label={fee.class} color="primary" variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>{fee.feeType}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ₹{fee.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{fee.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={fee.status} 
                          color={fee.status === 'Active' ? 'success' : 'error'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpen(fee)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(fee.id)}
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
          </Paper>
        )}

        {/* Student Fees Tab */}
        {tabValue === 1 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>छात्र</strong></TableCell>
                    <TableCell><strong>कक्षा/अनुभाग</strong></TableCell>
                    <TableCell><strong>फीस प्रकार</strong></TableCell>
                    <TableCell><strong>कुल राशि</strong></TableCell>
                    <TableCell><strong>भुगतान की गई राशि</strong></TableCell>
                    <TableCell><strong>बकाया राशि</strong></TableCell>
                    <TableCell><strong>नियत तारीख</strong></TableCell>
                    <TableCell><strong>स्थिति</strong></TableCell>
                    <TableCell><strong>क्रियाएं</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentFees.map((studentFee) => (
                    <TableRow key={studentFee.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {studentFee.studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{studentFee.studentName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {studentFee.rollNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{studentFee.class} - {studentFee.section}</TableCell>
                      <TableCell>{studentFee.feeType}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          ₹{studentFee.totalAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          ₹{studentFee.paidAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          ₹{studentFee.pendingAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{studentFee.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={studentFee.status} 
                          color={getStatusColor(studentFee.status) as any} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {studentFee.status !== 'Paid' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PaymentIcon />}
                            color={studentFee.status === 'Overdue' ? 'error' : 'primary'}
                            onClick={() => handlePayment(studentFee)}
                            sx={{ mr: 1 }}
                          >
                            {studentFee.status === 'Overdue' ? 'अभी भुगतान करें' : 'भुगतान करें'}
                          </Button>
                        )}
                        <IconButton color="primary" size="small">
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Payment History Tab */}
        {tabValue === 2 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>रसीद संख्या</strong></TableCell>
                    <TableCell><strong>छात्र</strong></TableCell>
                    <TableCell><strong>राशि</strong></TableCell>
                    <TableCell><strong>भुगतान तिथि</strong></TableCell>
                    <TableCell><strong>भुगतान विधि</strong></TableCell>
                    <TableCell><strong>फीस प्रकार</strong></TableCell>
                    <TableCell><strong>स्थिति</strong></TableCell>
                    <TableCell><strong>क्रियाएं</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {payment.receiptNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body1">{payment.studentName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.rollNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography color="success.main" fontWeight="bold">
                          ₹{payment.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.paymentMethod} 
                          color={getPaymentMethodColor(payment.paymentMethod) as any} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{payment.feeType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color={payment.status === 'Success' ? 'success' : 'error'} 
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
          </Paper>
        )}

        {/* Add/Edit Fee Structure Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingFee ? 'फीस संरचना संपादित करें' : 'फीस संरचना जोड़ें'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="कक्षा"
                  value={formData.class || ''}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>फीस प्रकार</InputLabel>
                  <Select
                    value={formData.feeType || 'Tuition'}
                    onChange={(e) => setFormData({...formData, feeType: e.target.value as any})}
                    label="फीस प्रकार"
                  >
                    <MenuItem value="Tuition">शिक्षण शुल्क</MenuItem>
                    <MenuItem value="Transport">परिवहन शुल्क</MenuItem>
                    <MenuItem value="Library">पुस्तकालय शुल्क</MenuItem>
                    <MenuItem value="Sports">खेल शुल्क</MenuItem>
                    <MenuItem value="Annual">वार्षिक शुल्क</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="राशि (₹)"
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="नियत तारीख"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>स्थिति</InputLabel>
                  <Select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    label="स्थिति"
                  >
                    <MenuItem value="Active">सक्रिय</MenuItem>
                    <MenuItem value="Inactive">निष्क्रिय</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>रद्द करें</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingFee ? 'अपडेट करें' : 'जोड़ें'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            भुगतान दर्ज करें - {selectedStudentForPayment?.studentName}
          </DialogTitle>
          <DialogContent>
            {selectedStudentForPayment && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  बकाया राशि: ₹{selectedStudentForPayment.pendingAmount.toLocaleString()}
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="भुगतान राशि (₹)"
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})}
                      inputProps={{ max: selectedStudentForPayment.pendingAmount }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>भुगतान विधि</InputLabel>
                      <Select
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value as any})}
                        label="भुगतान विधि"
                      >
                        <MenuItem value="Cash">नकद</MenuItem>
                        <MenuItem value="Bank Transfer">बैंक ट्रांसफर</MenuItem>
                        <MenuItem value="Online">ऑनलाइन</MenuItem>
                        <MenuItem value="Cheque">चेक</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="रसीद संख्या"
                      value={paymentData.receiptNumber}
                      onChange={(e) => setPaymentData({...paymentData, receiptNumber: e.target.value})}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentOpen(false)}>रद्द करें</Button>
            <Button onClick={handlePaymentSubmit} variant="contained">
              भुगतान दर्ज करें
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default FeesManagement;
