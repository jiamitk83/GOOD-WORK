import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent
} from '@mui/material';
import {
  Payment,
  Receipt,
  AttachMoney,
  Assignment,
  Add,
  Edit,
  Delete,
  Print,
  CurrencyRupee,
  ReceiptLong,
  AccountBalance,
  ViewList,
  Save,
  Cancel
} from '@mui/icons-material';

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Mock data for fee structure
const mockFeeStructure = [
  { id: 1, class: '1st Standard', category: 'Tuition Fee', amount: 10000, frequency: 'Monthly', dueDay: 10 },
  { id: 2, class: '1st Standard', category: 'Development Fee', amount: 5000, frequency: 'Annual', dueDay: 15 },
  { id: 3, class: '2nd Standard', category: 'Tuition Fee', amount: 12000, frequency: 'Monthly', dueDay: 10 },
  { id: 4, class: '2nd Standard', category: 'Development Fee', amount: 6000, frequency: 'Annual', dueDay: 15 },
  { id: 5, class: '3rd Standard', category: 'Tuition Fee', amount: 14000, frequency: 'Monthly', dueDay: 10 },
  { id: 6, class: '3rd Standard', category: 'Development Fee', amount: 7000, frequency: 'Annual', dueDay: 15 },
];

// Mock data for student payments
const mockPayments = [
  { id: 1, studentId: 'STU001', studentName: 'Rahul Sharma', class: '1st Standard', amount: 10000, category: 'Tuition Fee', paymentDate: '2025-07-05', paymentMode: 'Online', status: 'Paid', receiptNo: 'RCP00123' },
  { id: 2, studentId: 'STU002', studentName: 'Priya Patel', class: '2nd Standard', amount: 12000, category: 'Tuition Fee', paymentDate: '2025-07-08', paymentMode: 'Cash', status: 'Paid', receiptNo: 'RCP00124' },
  { id: 3, studentId: 'STU003', studentName: 'Amit Kumar', class: '3rd Standard', amount: 14000, category: 'Tuition Fee', paymentDate: null, paymentMode: null, status: 'Pending', receiptNo: null },
  { id: 4, studentId: 'STU004', studentName: 'Sneha Gupta', class: '1st Standard', amount: 5000, category: 'Development Fee', paymentDate: '2025-04-10', paymentMode: 'Cheque', status: 'Paid', receiptNo: 'RCP00100' },
  { id: 5, studentId: 'STU005', studentName: 'Vikram Singh', class: '2nd Standard', amount: 6000, category: 'Development Fee', paymentDate: null, paymentMode: null, status: 'Pending', receiptNo: null },
];

// Mock data for fee categories
const feeCategories = ['Tuition Fee', 'Development Fee', 'Computer Fee', 'Library Fee', 'Examination Fee', 'Sports Fee', 'Transport Fee'];

// Mock data for classes
const classes = ['Nursery', 'KG', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'];

// Mock data for payment modes
const paymentModes = ['Cash', 'Cheque', 'Online', 'UPI', 'Bank Transfer'];

// Mock data for payment frequency
const frequencies = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual'];

interface FeesManagementProps {
  readOnly?: boolean;
}

const FeesManagement: React.FC<FeesManagementProps> = ({ readOnly = false }) => {
  const [tabValue, setTabValue] = useState(0);
  const [feeStructure, setFeeStructure] = useState(mockFeeStructure);
  const [payments, setPayments] = useState(mockPayments);
  const [editFeeItem, setEditFeeItem] = useState<any>(null);
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    studentName: '',
    class: '',
    amount: 0,
    category: '',
    paymentDate: '',
    paymentMode: '',
    status: 'Paid',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewFeeDialogOpen, setIsNewFeeDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [newFee, setNewFee] = useState({
    class: '',
    category: '',
    amount: 0,
    frequency: 'Monthly',
    dueDay: 10,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditFee = (fee: any) => {
    setEditFeeItem(fee);
  };

  const handleSaveEditedFee = () => {
    if (editFeeItem) {
      setFeeStructure(feeStructure.map(fee => 
        fee.id === editFeeItem.id ? editFeeItem : fee
      ));
      setEditFeeItem(null);
    }
  };

  const handleDeleteFee = (id: number) => {
    setFeeStructure(feeStructure.filter(fee => fee.id !== id));
  };

  const handleOpenNewFeeDialog = () => {
    setIsNewFeeDialogOpen(true);
  };

  const handleCloseNewFeeDialog = () => {
    setIsNewFeeDialogOpen(false);
  };

  const handleAddNewFee = () => {
    const newId = Math.max(...feeStructure.map(fee => fee.id)) + 1;
    const feeToAdd = {
      id: newId,
      ...newFee
    };
    
    setFeeStructure([...feeStructure, feeToAdd]);
    setNewFee({
      class: '',
      category: '',
      amount: 0,
      frequency: 'Monthly',
      dueDay: 10,
    });
    setIsNewFeeDialogOpen(false);
  };

  const handleNewFeeTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFee({
      ...newFee,
      [name]: name === 'amount' || name === 'dueDay' ? Number(value) : value,
    });
  };

  const handleNewFeeSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewFee({
      ...newFee,
      [name]: value,
    });
  };

  const handleOpenPaymentDialog = () => {
    setIsDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePaymentTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  const handlePaymentSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value,
    });
  };

  const handleAddPayment = () => {
    const newId = Math.max(...payments.map(payment => payment.id)) + 1;
    const newReceiptNo = `RCP${String(newId + 1000).slice(1)}`;
    
    const paymentToAdd = {
      id: newId,
      ...newPayment,
      status: 'Paid',
      receiptNo: newReceiptNo,
    };
    
    setPayments([...payments, paymentToAdd]);
    setNewPayment({
      studentId: '',
      studentName: '',
      class: '',
      amount: 0,
      category: '',
      paymentDate: '',
      paymentMode: '',
      status: 'Paid',
    });
    setIsDialogOpen(false);
  };

  const handleViewReceipt = (payment: any) => {
    setSelectedReceipt(payment);
    setIsReceiptDialogOpen(true);
  };

  const handleCloseReceiptDialog = () => {
    setIsReceiptDialogOpen(false);
  };

  const handlePrintReceipt = () => {
    alert('Printing receipt...');
    // In a real app, this would handle the print functionality
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        <Typography variant="h4" sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          Fees Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="fees management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<AttachMoney />} label="Fee Structure" />
            <Tab icon={<Receipt />} label="Payments" />
            <Tab icon={<Assignment />} label="Fee Reports" />
            <Tab icon={<AccountBalance />} label="Fee Statistics" />
          </Tabs>
        </Box>
        
        {/* Fee Structure Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Fee Structure</Typography>
            {!readOnly && (
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleOpenNewFeeDialog}
              >
                Add Fee
              </Button>
            )}
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell>Class</TableCell>
                  <TableCell>Fee Category</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Due Day</TableCell>
                  {!readOnly && <TableCell align="center">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {feeStructure.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      {editFeeItem && editFeeItem.id === fee.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editFeeItem.class}
                            onChange={(e) => setEditFeeItem({...editFeeItem, class: e.target.value})}
                          >
                            {classes.map((c) => (
                              <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        fee.class
                      )}
                    </TableCell>
                    <TableCell>
                      {editFeeItem && editFeeItem.id === fee.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editFeeItem.category}
                            onChange={(e) => setEditFeeItem({...editFeeItem, category: e.target.value})}
                          >
                            {feeCategories.map((category) => (
                              <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        fee.category
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editFeeItem && editFeeItem.id === fee.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editFeeItem.amount}
                          onChange={(e) => setEditFeeItem({...editFeeItem, amount: Number(e.target.value)})}
                          InputProps={{
                            startAdornment: <CurrencyRupee fontSize="small" />
                          }}
                        />
                      ) : (
                        `₹${fee.amount.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editFeeItem && editFeeItem.id === fee.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editFeeItem.frequency}
                            onChange={(e) => setEditFeeItem({...editFeeItem, frequency: e.target.value})}
                          >
                            {frequencies.map((freq) => (
                              <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        fee.frequency
                      )}
                    </TableCell>
                    <TableCell>
                      {editFeeItem && editFeeItem.id === fee.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editFeeItem.dueDay}
                          onChange={(e) => setEditFeeItem({...editFeeItem, dueDay: Number(e.target.value)})}
                          inputProps={{ min: 1, max: 31 }}
                        />
                      ) : (
                        `${fee.dueDay}${getDaySuffix(fee.dueDay)} of the month`
                      )}
                    </TableCell>
                    {!readOnly && (
                      <TableCell align="center">
                        {editFeeItem && editFeeItem.id === fee.id ? (
                          <>
                            <IconButton color="primary" onClick={handleSaveEditedFee}>
                              <Save />
                            </IconButton>
                            <IconButton color="error" onClick={() => setEditFeeItem(null)}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton color="primary" onClick={() => handleEditFee(fee)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteFee(fee.id)}>
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Payments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Fee Payments</Typography>
            {!readOnly && (
              <Button 
                variant="contained" 
                startIcon={<Payment />}
                onClick={handleOpenPaymentDialog}
              >
                Record Payment
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Search by Student Name/ID"
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select label="Class" value="">
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select label="Payment Status" value="">
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="outlined" fullWidth>
                Filter
              </Button>
            </Grid>
          </Grid>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Fee Category</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.studentId}</TableCell>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{payment.class}</TableCell>
                    <TableCell>{payment.category}</TableCell>
                    <TableCell align="right">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.paymentDate || 'Not Paid'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status} 
                        color={payment.status === 'Paid' ? 'success' : 'warning'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {payment.status === 'Paid' ? (
                        <IconButton color="primary" onClick={() => handleViewReceipt(payment)}>
                          <ReceiptLong />
                        </IconButton>
                      ) : (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          disabled={readOnly}
                        >
                          Record Payment
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Fee Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Fee Collection Reports
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Class-wise Fee Collection
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Chart will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button startIcon={<Print />} variant="outlined">
                    Print Report
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Fee Collection
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Chart will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button startIcon={<Print />} variant="outlined">
                    Print Report
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fee Collection Summary
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fee Category</TableCell>
                          <TableCell align="right">Total Expected (₹)</TableCell>
                          <TableCell align="right">Collected (₹)</TableCell>
                          <TableCell align="right">Pending (₹)</TableCell>
                          <TableCell align="right">Collection Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Tuition Fee</TableCell>
                          <TableCell align="right">₹36,000</TableCell>
                          <TableCell align="right">₹22,000</TableCell>
                          <TableCell align="right">₹14,000</TableCell>
                          <TableCell align="right">61%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Development Fee</TableCell>
                          <TableCell align="right">₹18,000</TableCell>
                          <TableCell align="right">₹11,000</TableCell>
                          <TableCell align="right">₹7,000</TableCell>
                          <TableCell align="right">61%</TableCell>
                        </TableRow>
                        <TableRow sx={{ fontWeight: 'bold' }}>
                          <TableCell><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>₹54,000</strong></TableCell>
                          <TableCell align="right"><strong>₹33,000</strong></TableCell>
                          <TableCell align="right"><strong>₹21,000</strong></TableCell>
                          <TableCell align="right"><strong>61%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button startIcon={<ViewList />} variant="outlined" sx={{ mr: 1 }}>
                    Detailed Report
                  </Button>
                  <Button startIcon={<Print />} variant="outlined">
                    Print Summary
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Fee Statistics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Fee Statistics and Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Total Fee Collected (Current Year)
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ₹33,000
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Pending Fee Amount
                  </Typography>
                  <Typography variant="h4" color="error">
                    ₹21,000
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Collection Rate
                  </Typography>
                  <Typography variant="h4" color={61 > 70 ? 'success' : 'warning'}>
                    61%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info">
                Detailed fee statistics and analytics will be added in the next update.
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Add New Fee Dialog */}
      <Dialog open={isNewFeeDialogOpen} onClose={handleCloseNewFeeDialog}>
        <DialogTitle>Add New Fee Structure</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    name="class"
                    value={newFee.class}
                    label="Class"
                    onChange={handleNewFeeSelectChange}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Fee Category</InputLabel>
                  <Select
                    name="category"
                    value={newFee.category}
                    label="Fee Category"
                    onChange={handleNewFeeSelectChange}
                  >
                    {feeCategories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  value={newFee.amount}
                  onChange={handleNewFeeTextChange}
                  InputProps={{
                    startAdornment: <CurrencyRupee fontSize="small" />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={newFee.frequency}
                    label="Frequency"
                    onChange={handleNewFeeSelectChange}
                  >
                    {frequencies.map((freq) => (
                      <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="dueDay"
                  label="Due Day of Month"
                  type="number"
                  fullWidth
                  value={newFee.dueDay}
                  onChange={handleNewFeeTextChange}
                  inputProps={{ min: 1, max: 31 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewFeeDialog}>Cancel</Button>
          <Button 
            onClick={handleAddNewFee}
            disabled={!newFee.class || !newFee.category || newFee.amount <= 0}
            variant="contained"
          >
            Add Fee
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Record Payment Dialog */}
      <Dialog open={isDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle>Record New Payment</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="studentId"
                  label="Student ID"
                  fullWidth
                  value={newPayment.studentId}
                  onChange={handlePaymentTextChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="studentName"
                  label="Student Name"
                  fullWidth
                  value={newPayment.studentName}
                  onChange={handlePaymentTextChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    name="class"
                    value={newPayment.class}
                    label="Class"
                    onChange={handlePaymentSelectChange}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fee Category</InputLabel>
                  <Select
                    name="category"
                    value={newPayment.category}
                    label="Fee Category"
                    onChange={handlePaymentSelectChange}
                  >
                    {feeCategories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  value={newPayment.amount}
                  onChange={handlePaymentTextChange}
                  InputProps={{
                    startAdornment: <CurrencyRupee fontSize="small" />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="paymentDate"
                  label="Payment Date"
                  type="date"
                  fullWidth
                  value={newPayment.paymentDate}
                  onChange={handlePaymentTextChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Mode</InputLabel>
                  <Select
                    name="paymentMode"
                    value={newPayment.paymentMode}
                    label="Payment Mode"
                    onChange={handlePaymentSelectChange}
                  >
                    {paymentModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button 
            onClick={handleAddPayment}
            disabled={!newPayment.studentId || !newPayment.studentName || !newPayment.class || !newPayment.category || newPayment.amount <= 0 || !newPayment.paymentDate || !newPayment.paymentMode}
            variant="contained"
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onClose={handleCloseReceiptDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Fee Receipt</Typography>
            <IconButton onClick={handlePrintReceipt}>
              <Print />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReceipt && (
            <Box sx={{ border: '1px dashed grey', p: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5">SCHOOL ERP SYSTEM</Typography>
                <Typography variant="body2">123 Education Street, Knowledge City</Typography>
                <Typography variant="body2">Tel: 123-456-7890</Typography>
                <Typography variant="h6" sx={{ mt: 2, textDecoration: 'underline' }}>FEE RECEIPT</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Receipt No:</strong> {selectedReceipt.receiptNo}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2"><strong>Date:</strong> {selectedReceipt.paymentDate}</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ my: 2 }}>
                <Typography><strong>Student ID:</strong> {selectedReceipt.studentId}</Typography>
                <Typography><strong>Name:</strong> {selectedReceipt.studentName}</Typography>
                <Typography><strong>Class:</strong> {selectedReceipt.class}</Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fee Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{selectedReceipt.category}</TableCell>
                      <TableCell align="right">₹{selectedReceipt.amount.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>₹{selectedReceipt.amount.toLocaleString()}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mb: 2 }}>
                <Typography><strong>Payment Mode:</strong> {selectedReceipt.paymentMode}</Typography>
                <Typography><strong>Amount in words:</strong> {convertToWords(selectedReceipt.amount)} Rupees Only</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Typography variant="body2">Receiver's Signature</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">Authorized Signature</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceiptDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Helper function to get the suffix for day numbers (1st, 2nd, 3rd, etc.)
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// Helper function to convert number to words (simple implementation)
function convertToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (amount === 0) return 'Zero';
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    else if (n < 20) return ones[n] + ' ';
    else if (n < 100) return tens[Math.floor(n / 10)] + ' ' + convertLessThanThousand(n % 10);
    else return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanThousand(n % 100);
  }
  
  let result = '';
  if (amount >= 100000) {
    result += convertLessThanThousand(Math.floor(amount / 100000)) + 'Lakh ';
    amount %= 100000;
  }
  
  if (amount >= 1000) {
    result += convertLessThanThousand(Math.floor(amount / 1000)) + 'Thousand ';
    amount %= 1000;
  }
  
  result += convertLessThanThousand(amount);
  return result.trim();
}

export default FeesManagement;
