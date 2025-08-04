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
  Delete as DeleteIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const FeesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Fee Structure Data
  const feeStructures = [
    { id: 1, className: '10th', feeType: 'Tuition Fee', amount: 15000, dueDate: '2025-09-10', status: 'Active' },
    { id: 2, className: '10th', feeType: 'Transport Fee', amount: 3000, dueDate: '2025-09-10', status: 'Active' },
    { id: 3, className: '9th', feeType: 'Tuition Fee', amount: 12000, dueDate: '2025-09-10', status: 'Active' },
    { id: 4, className: '11th', feeType: 'Tuition Fee', amount: 18000, dueDate: '2025-09-10', status: 'Active' }
  ];

  // Student Fees Data
  const studentFeesData = [
    { 
      id: 1, 
      studentName: 'राहुल शर्मा', 
      rollNo: 'STU001', 
      className: '10th', 
      section: 'A',
      totalAmount: 18000, 
      paidAmount: 18000, 
      pendingAmount: 0, 
      status: 'Paid',
      lastPayment: '2025-08-01'
    },
    { 
      id: 2, 
      studentName: 'प्रिया गुप्ता', 
      rollNo: 'STU002', 
      className: '10th', 
      section: 'B',
      totalAmount: 18000, 
      paidAmount: 10000, 
      pendingAmount: 8000, 
      status: 'Partial',
      lastPayment: '2025-07-15'
    },
    { 
      id: 3, 
      studentName: 'अमित कुमार', 
      rollNo: 'STU003', 
      className: '9th', 
      section: 'A',
      totalAmount: 12000, 
      paidAmount: 0, 
      pendingAmount: 12000, 
      status: 'Overdue',
      lastPayment: null
    },
    { 
      id: 4, 
      studentName: 'सुनीता वर्मा', 
      rollNo: 'STU004', 
      className: '11th', 
      section: 'C',
      totalAmount: 18000, 
      paidAmount: 9000, 
      pendingAmount: 9000, 
      status: 'Partial',
      lastPayment: '2025-07-20'
    }
  ];

  // Payment History Data
  const paymentHistory = [
    { 
      id: 1, 
      receiptNo: 'FEE001', 
      studentName: 'राहुल शर्मा', 
      rollNo: 'STU001',
      amount: 18000, 
      paymentDate: '2025-08-01', 
      paymentMethod: 'Online UPI', 
      status: 'Completed'
    },
    { 
      id: 2, 
      receiptNo: 'FEE002', 
      studentName: 'प्रिया गुप्ता', 
      rollNo: 'STU002',
      amount: 10000, 
      paymentDate: '2025-07-15', 
      paymentMethod: 'Bank Transfer', 
      status: 'Completed'
    },
    { 
      id: 3, 
      receiptNo: 'FEE003', 
      studentName: 'सुनीता वर्मा', 
      rollNo: 'STU004',
      amount: 9000, 
      paymentDate: '2025-07-20', 
      paymentMethod: 'Cash', 
      status: 'Completed'
    }
  ];

  // Calculate totals
  const totalCollected = studentFeesData.reduce((sum, student) => sum + student.paidAmount, 0);
  const totalPending = studentFeesData.reduce((sum, student) => sum + student.pendingAmount, 0);
  const overdueCount = studentFeesData.filter(student => student.status === 'Overdue').length;
  const paidCount = studentFeesData.filter(student => student.status === 'Paid').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Partial': return 'warning';
      case 'Overdue': return 'error';
      case 'Active': return 'primary';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Online UPI': return 'success';
      case 'Bank Transfer': return 'info';
      case 'Cash': return 'warning';
      case 'Cheque': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Fees Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{ px: 3, py: 1.5 }}
          >
            Add New Fee Structure
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                  ₹{totalCollected.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Total Collected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                  ₹{totalPending.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Total Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                  {overdueCount}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Overdue Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                  {paidCount}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Paid Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Fee Structure" 
              icon={<MoneyIcon />} 
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab 
              label="Student Fees" 
              icon={<ReceiptIcon />} 
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab 
              label="Payment History" 
              icon={<PaymentIcon />} 
              iconPosition="start"
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {/* Fee Structure Tab */}
        {activeTab === 0 && (
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                📋 Fee Structure Configuration
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Class</strong></TableCell>
                    <TableCell><strong>Fee Type</strong></TableCell>
                    <TableCell><strong>Amount (₹)</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeStructures.map((fee) => (
                    <TableRow key={fee.id} hover>
                      <TableCell>
                        <Chip 
                          label={fee.className} 
                          color="primary" 
                          variant="outlined" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {fee.feeType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          ₹{fee.amount.toLocaleString('en-IN')}
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

        {/* Student Fees Tab */}
        {activeTab === 1 && (
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                👥 Student Fee Management
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Student Details</strong></TableCell>
                    <TableCell><strong>Class/Section</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Paid Amount</strong></TableCell>
                    <TableCell><strong>Pending Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentFeesData.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              width: 40, 
                              height: 40, 
                              backgroundColor: 'primary.main',
                              fontSize: '18px'
                            }}
                          >
                            {student.studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {student.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Roll No: {student.rollNo}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {student.className} - {student.section}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          ₹{student.totalAmount.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="success.main" fontWeight="bold">
                          ₹{student.paidAmount.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="error.main" fontWeight="bold">
                          ₹{student.pendingAmount.toLocaleString('en-IN')}
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
                            sx={{ mr: 1 }}
                          >
                            {student.status === 'Overdue' ? 'Pay Now' : 'Pay'}
                          </Button>
                        )}
                        <IconButton color="info" size="small">
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

        {/* Payment History Tab */}
        {activeTab === 2 && (
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                💳 Payment Transaction History
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Receipt No.</strong></TableCell>
                    <TableCell><strong>Student Details</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Payment Date</strong></TableCell>
                    <TableCell><strong>Payment Method</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                          {payment.receiptNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {payment.studentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.rollNo}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          ₹{payment.amount.toLocaleString('en-IN')}
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
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color={getStatusColor(payment.status)} 
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
      </Box>
    </Container>
  );
};

export default FeesModule;
