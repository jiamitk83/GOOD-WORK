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
  Chip,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const FeesManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Sample data
  const feeStructures = [
    { id: 1, class: '10th', feeType: 'Tuition Fee', amount: 15000, dueDate: '2025-09-10', status: 'Active' },
    { id: 2, class: '10th', feeType: 'Transport Fee', amount: 3000, dueDate: '2025-09-10', status: 'Active' },
    { id: 3, class: '9th', feeType: 'Tuition Fee', amount: 12000, dueDate: '2025-09-10', status: 'Active' }
  ];

  const studentFees = [
    { 
      id: 1, studentName: 'राहुल शर्मा', rollNumber: 'STU001', class: '10th', section: 'A',
      totalAmount: 15000, paidAmount: 15000, pendingAmount: 0, status: 'Paid'
    },
    { 
      id: 2, studentName: 'प्रिया गुप्ता', rollNumber: 'STU002', class: '10th', section: 'B',
      totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, status: 'Partial'
    },
    { 
      id: 3, studentName: 'अमित कुमार', rollNumber: 'STU003', class: '9th', section: 'A',
      totalAmount: 12000, paidAmount: 0, pendingAmount: 12000, status: 'Overdue'
    }
  ];

  const payments = [
    { 
      id: 1, receiptNo: 'REC001', studentName: 'राहुल शर्मा', rollNumber: 'STU001',
      amount: 15000, paymentDate: '2025-08-01', method: 'Online', status: 'Success'
    },
    { 
      id: 2, receiptNo: 'REC002', studentName: 'प्रिया गुप्ता', rollNumber: 'STU002',
      amount: 10000, paymentDate: '2025-07-15', method: 'Bank Transfer', status: 'Success'
    }
  ];

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

  const totalCollected = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = studentFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Fees Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
          >
            Add Fee Structure
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalCollected.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Collected</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalPending.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Overdue').length}
                </Typography>
                <Typography variant="body2">Overdue Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Paid').length}
                </Typography>
                <Typography variant="body2">Paid Students</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label="Fee Structure" 
              icon={<MoneyIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Student Fees" 
              icon={<ReceiptIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Payment History" 
              icon={<PaymentIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Class</strong></TableCell>
                    <TableCell><strong>Fee Type</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
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
                          color={getStatusColor(fee.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" size="small">
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

        {tabValue === 1 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Class/Section</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Paid Amount</strong></TableCell>
                    <TableCell><strong>Pending Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentFees.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {student.studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{student.studentName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.rollNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{student.class}-{student.section}</TableCell>
                      <TableCell>₹{student.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography color="success.main" fontWeight="bold">
                          ₹{student.paidAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="error.main" fontWeight="bold">
                          ₹{student.pendingAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.status} 
                          color={getStatusColor(student.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {student.status !== 'Paid' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PaymentIcon />}
                            color={student.status === 'Overdue' ? 'error' : 'primary'}
                          >
                            {student.status === 'Overdue' ? 'Pay Now' : 'Pay'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Receipt No.</strong></TableCell>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Payment Date</strong></TableCell>
                    <TableCell><strong>Method</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {payment.receiptNo}
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
                          label={payment.method} 
                          color="info" 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color="success" 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default FeesManagement;

const FeesManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Sample data
  const feeStructures = [
    { id: 1, class: '10th', feeType: 'Tuition Fee', amount: 15000, dueDate: '2025-09-10', status: 'Active' },
    { id: 2, class: '10th', feeType: 'Transport Fee', amount: 3000, dueDate: '2025-09-10', status: 'Active' },
    { id: 3, class: '9th', feeType: 'Tuition Fee', amount: 12000, dueDate: '2025-09-10', status: 'Active' }
  ];

  const studentFees = [
    { 
      id: 1, studentName: 'राहुल शर्मा', rollNumber: 'STU001', class: '10th', section: 'A',
      totalAmount: 15000, paidAmount: 15000, pendingAmount: 0, status: 'Paid'
    },
    { 
      id: 2, studentName: 'प्रिया गुप्ता', rollNumber: 'STU002', class: '10th', section: 'B',
      totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, status: 'Partial'
    },
    { 
      id: 3, studentName: 'अमित कुमार', rollNumber: 'STU003', class: '9th', section: 'A',
      totalAmount: 12000, paidAmount: 0, pendingAmount: 12000, status: 'Overdue'
    }
  ];

  const payments = [
    { 
      id: 1, receiptNo: 'REC001', studentName: 'राहुल शर्मा', rollNumber: 'STU001',
      amount: 15000, paymentDate: '2025-08-01', method: 'Online', status: 'Success'
    },
    { 
      id: 2, receiptNo: 'REC002', studentName: 'प्रिया गुप्ता', rollNumber: 'STU002',
      amount: 10000, paymentDate: '2025-07-15', method: 'Bank Transfer', status: 'Success'
    }
  ];

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

  const totalCollected = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = studentFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Fees Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
          >
            Add Fee Structure
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalCollected.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Collected</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalPending.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Overdue').length}
                </Typography>
                <Typography variant="body2">Overdue Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {studentFees.filter(f => f.status === 'Paid').length}
                </Typography>
                <Typography variant="body2">Paid Students</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label="Fee Structure" 
              icon={<MoneyIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Student Fees" 
              icon={<ReceiptIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Payment History" 
              icon={<PaymentIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Class</strong></TableCell>
                    <TableCell><strong>Fee Type</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
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
                          color={getStatusColor(fee.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<EditIcon />} sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Class/Section</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Paid Amount</strong></TableCell>
                    <TableCell><strong>Pending Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentFees.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {student.studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{student.studentName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.rollNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{student.class}-{student.section}</TableCell>
                      <TableCell>₹{student.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography color="success.main" fontWeight="bold">
                          ₹{student.paidAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="error.main" fontWeight="bold">
                          ₹{student.pendingAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.status} 
                          color={getStatusColor(student.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {student.status !== 'Paid' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PaymentIcon />}
                            color={student.status === 'Overdue' ? 'error' : 'primary'}
                          >
                            {student.status === 'Overdue' ? 'Pay Now' : 'Pay'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell><strong>Receipt No.</strong></TableCell>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Payment Date</strong></TableCell>
                    <TableCell><strong>Method</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {payment.receiptNo}
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
                          label={payment.method} 
                          color="info" 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color="success" 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default FeesManagement;

export default FeesManagement;

const FeesManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Fees Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Fee Structure
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">₹45,000</Typography>
                <Typography variant="body2">Total Collected</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">₹20,000</Typography>
                <Typography variant="body2">Total Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">1</Typography>
                <Typography variant="body2">Overdue Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">2</Typography>
                <Typography variant="body2">Paid Students</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Fee Structure" 
            icon={<MoneyIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Student Fees" 
            icon={<ReceiptIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Payment History" 
            icon={<PaymentIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Fee Structure Tab */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Fee Type</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Chip label="10th" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>Tuition Fee</TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹15,000
                  </Typography>
                </TableCell>
                <TableCell>2025-09-10</TableCell>
                <TableCell>
                  <Chip label="Active" color="success" size="small" />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Chip label="10th" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>Transport Fee</TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹3,000
                  </Typography>
                </TableCell>
                <TableCell>2025-09-10</TableCell>
                <TableCell>
                  <Chip label="Active" color="success" size="small" />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Student Fees Tab */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student Name</strong></TableCell>
                <TableCell><strong>Roll Number</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Total Amount</strong></TableCell>
                <TableCell><strong>Paid Amount</strong></TableCell>
                <TableCell><strong>Pending Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>राहुल शर्मा</TableCell>
                <TableCell>STU001</TableCell>
                <TableCell>10th-A</TableCell>
                <TableCell>₹15,000</TableCell>
                <TableCell style={{ color: 'green', fontWeight: 'bold' }}>₹15,000</TableCell>
                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>₹0</TableCell>
                <TableCell>
                  <Chip label="Paid" color="success" size="small" />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>प्रिया गुप्ता</TableCell>
                <TableCell>STU002</TableCell>
                <TableCell>10th-B</TableCell>
                <TableCell>₹15,000</TableCell>
                <TableCell style={{ color: 'green', fontWeight: 'bold' }}>₹10,000</TableCell>
                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>₹5,000</TableCell>
                <TableCell>
                  <Chip label="Partial" color="info" size="small" />
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" startIcon={<PaymentIcon />}>
                    Pay
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>अमित कुमार</TableCell>
                <TableCell>STU003</TableCell>
                <TableCell>9th-A</TableCell>
                <TableCell>₹12,000</TableCell>
                <TableCell style={{ color: 'green', fontWeight: 'bold' }}>₹0</TableCell>
                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>₹12,000</TableCell>
                <TableCell>
                  <Chip label="Overdue" color="error" size="small" />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="error" size="small" startIcon={<PaymentIcon />}>
                    Pay Now
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment History Tab */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Receipt No.</strong></TableCell>
                <TableCell><strong>Student Name</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Payment Date</strong></TableCell>
                <TableCell><strong>Payment Method</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><strong>REC001</strong></TableCell>
                <TableCell>राहुल शर्मा (STU001)</TableCell>
                <TableCell style={{ color: 'green', fontWeight: 'bold' }}>₹15,000</TableCell>
                <TableCell>2025-08-01</TableCell>
                <TableCell>
                  <Chip label="Online" color="success" size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label="Success" color="success" size="small" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>REC002</strong></TableCell>
                <TableCell>प्रिया गुप्ता (STU002)</TableCell>
                <TableCell style={{ color: 'green', fontWeight: 'bold' }}>₹10,000</TableCell>
                <TableCell>2025-07-15</TableCell>
                <TableCell>
                  <Chip label="Bank Transfer" color="info" size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label="Success" color="success" size="small" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default FeesManagement;

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

const FeesManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([
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
  ]);

  const [studentFees, setStudentFees] = useState<StudentFee[]>([
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
  ]);

  const [payments, setPayments] = useState<Payment[]>([
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
  ]);

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
      setFeeStructures(feeStructures.map(f => 
        f.id === editingFee.id 
          ? { ...editingFee, ...formData }
          : f
      ));
    } else {
      const newFee: FeeStructure = {
        id: Math.max(...feeStructures.map(f => f.id)) + 1,
        class: formData.class || '',
        feeType: formData.feeType as any || 'Tuition',
        amount: formData.amount || 0,
        dueDate: formData.dueDate || '',
        status: formData.status as 'Active' | 'Inactive' || 'Active'
      };
      setFeeStructures([...feeStructures, newFee]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setFeeStructures(feeStructures.filter(f => f.id !== id));
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

      setPayments([...payments, newPayment]);

      // Update student fee status
      setStudentFees(studentFees.map(sf => 
        sf.id === selectedStudentForPayment.id 
          ? {
              ...sf,
              paidAmount: sf.paidAmount + paymentData.amount,
              pendingAmount: sf.pendingAmount - paymentData.amount,
              status: (sf.pendingAmount - paymentData.amount) === 0 ? 'Paid' : 'Partial',
              lastPaymentDate: new Date().toISOString().split('T')[0]
            }
          : sf
      ));
    }
    setPaymentOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      case 'Partial': return 'info';
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
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4">
              Fees Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Fee Structure
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  ₹{totalPaidAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Collected</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  ₹{totalPendingAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {studentFees.filter(f => f.status === 'Overdue').length}
                </Typography>
                <Typography variant="body2">Overdue Students</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">
                  {studentFees.filter(f => f.status === 'Paid').length}
                </Typography>
                <Typography variant="body2">Paid Students</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Fee Structure" 
            icon={<MoneyIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Student Fees" 
            icon={<ReceiptIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Payment History" 
            icon={<PaymentIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Fee Structure Tab */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Fee Type</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeStructures.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <Chip label={fee.class} color="primary" variant="outlined" />
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
      )}

      {/* Student Fees Tab */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Class/Section</strong></TableCell>
                <TableCell><strong>Fee Type</strong></TableCell>
                <TableCell><strong>Total Amount</strong></TableCell>
                <TableCell><strong>Paid Amount</strong></TableCell>
                <TableCell><strong>Pending Amount</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentFees.map((studentFee) => (
                <TableRow key={studentFee.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
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
                      color={getStatusColor(studentFee.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {studentFee.status !== 'Paid' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayment(studentFee)}
                        sx={{ mr: 1 }}
                      >
                        Pay
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
      )}

      {/* Payment History Tab */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Receipt No.</strong></TableCell>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Payment Date</strong></TableCell>
                <TableCell><strong>Payment Method</strong></TableCell>
                <TableCell><strong>Fee Type</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
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
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      ₹{payment.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.paymentMethod} 
                      color={getPaymentMethodColor(payment.paymentMethod)} 
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
      )}

      {/* Add/Edit Fee Structure Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={formData.feeType || 'Tuition'}
                  label="Fee Type"
                  onChange={(e) => setFormData({...formData, feeType: e.target.value as any})}
                >
                  <MenuItem value="Tuition">Tuition Fee</MenuItem>
                  <MenuItem value="Transport">Transport Fee</MenuItem>
                  <MenuItem value="Library">Library Fee</MenuItem>
                  <MenuItem value="Sports">Sports Fee</MenuItem>
                  <MenuItem value="Annual">Annual Fee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'Active'}
                  label="Status"
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Record Payment - {selectedStudentForPayment?.studentName}
        </DialogTitle>
        <DialogContent>
          {selectedStudentForPayment && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Pending Amount:</strong> ₹{selectedStudentForPayment.pendingAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Fee Type:</strong> {selectedStudentForPayment.feeType}
                </Typography>
              </Alert>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment Amount (₹)"
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})}
                    inputProps={{ max: selectedStudentForPayment.pendingAmount }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentData.paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value as any})}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Online">Online Payment</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Receipt Number"
                    value={paymentData.receiptNumber}
                    onChange={(e) => setPaymentData({...paymentData, receiptNumber: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentOpen(false)}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained" startIcon={<PaymentIcon />}>
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeesManagement;
