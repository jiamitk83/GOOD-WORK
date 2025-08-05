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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  PersonAdd,
  Edit,
  Delete,
  School,
  Assignment,
  Message,
  Search,
  Add
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
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
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

// Mock data for parents
const mockParents = [
  {
    id: 'PAR001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '9876543210',
    address: '123 Main Street, Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    studentIds: ['STU001', 'STU005'],
    studentNames: ['Rohit Sharma', 'Priya Sharma'],
    studentClasses: ['8th Standard', '5th Standard'],
    status: 'Active',
    lastLogin: '2025-07-28'
  },
  {
    id: 'PAR002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '9876543211',
    address: '456 Park Avenue, Delhi, Delhi',
    occupation: 'Doctor',
    studentIds: ['STU002'],
    studentNames: ['Ravi Patel'],
    studentClasses: ['10th Standard'],
    status: 'Active',
    lastLogin: '2025-08-01'
  },
  {
    id: 'PAR003',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@example.com',
    phone: '9876543212',
    address: '789 Lake View, Bangalore, Karnataka',
    occupation: 'Business Owner',
    studentIds: ['STU003'],
    studentNames: ['Anjali Kumar'],
    studentClasses: ['7th Standard'],
    status: 'Inactive',
    lastLogin: '2025-06-15'
  },
  {
    id: 'PAR004',
    name: 'Anita Gupta',
    email: 'anita.gupta@example.com',
    phone: '9876543213',
    address: '567 Green Avenue, Chennai, Tamil Nadu',
    occupation: 'Teacher',
    studentIds: ['STU004', 'STU006'],
    studentNames: ['Rahul Gupta', 'Neha Gupta'],
    studentClasses: ['9th Standard', '3rd Standard'],
    status: 'Active',
    lastLogin: '2025-07-25'
  },
];

// Mock data for communication history
const mockCommunications = [
  {
    id: 1,
    parentId: 'PAR001',
    type: 'Email',
    subject: 'Fee Payment Reminder',
    content: 'This is a reminder that the fees for the current quarter are due by August 15, 2025.',
    sentDate: '2025-08-01',
    status: 'Delivered'
  },
  {
    id: 2,
    parentId: 'PAR001',
    type: 'SMS',
    subject: 'Parent-Teacher Meeting',
    content: 'Parent-Teacher meeting scheduled on August 10, 2025 at 3:00 PM. Your presence is requested.',
    sentDate: '2025-08-02',
    status: 'Delivered'
  },
  {
    id: 3,
    parentId: 'PAR002',
    type: 'Email',
    subject: 'Report Card',
    content: 'The quarterly report card for your child has been uploaded. Please check the portal.',
    sentDate: '2025-07-25',
    status: 'Delivered'
  },
  {
    id: 4,
    parentId: 'PAR003',
    type: 'SMS',
    subject: 'Attendance Alert',
    content: 'Your child was absent today. Please provide a reason for the absence.',
    sentDate: '2025-07-20',
    status: 'Delivered'
  },
];

// Mock student class options
const classes = ['Nursery', 'KG', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'];

interface ParentsManagementProps {
  readOnly?: boolean;
}

const ParentsManagement: React.FC<ParentsManagementProps> = ({ readOnly = false }) => {
  const [tabValue, setTabValue] = useState(0);
  const [parents, setParents] = useState(mockParents);
  const [communications, setCommunications] = useState(mockCommunications);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCommunicationDialogOpen, setIsCommunicationDialogOpen] = useState(false);
  const [editParent, setEditParent] = useState<any>(null);
  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    studentIds: [''],
    studentNames: [''],
    studentClasses: [''],
    status: 'Active'
  });
  const [newCommunication, setNewCommunication] = useState({
    parentIds: [] as string[],
    type: 'Email',
    subject: '',
    content: '',
    sendToAll: false
  });
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };
  
  const handleEditDialogOpen = (parent: any) => {
    setEditParent({...parent});
    setIsEditDialogOpen(true);
  };
  
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };
  
  const handleViewDialogOpen = (parent: any) => {
    setSelectedParent(parent);
    setIsViewDialogOpen(true);
  };
  
  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
  };
  
  const handleCommunicationDialogOpen = () => {
    setIsCommunicationDialogOpen(true);
  };
  
  const handleCommunicationDialogClose = () => {
    setIsCommunicationDialogOpen(false);
  };
  
  const handleAddStudent = () => {
    setNewParent({
      ...newParent,
      studentIds: [...newParent.studentIds, ''],
      studentNames: [...newParent.studentNames, ''],
      studentClasses: [...newParent.studentClasses, '']
    });
  };
  
  const handleRemoveStudent = (index: number) => {
    const newStudentIds = [...newParent.studentIds];
    const newStudentNames = [...newParent.studentNames];
    const newStudentClasses = [...newParent.studentClasses];
    
    newStudentIds.splice(index, 1);
    newStudentNames.splice(index, 1);
    newStudentClasses.splice(index, 1);
    
    setNewParent({
      ...newParent,
      studentIds: newStudentIds,
      studentNames: newStudentNames,
      studentClasses: newStudentClasses
    });
  };
  
  const handleEditAddStudent = () => {
    setEditParent({
      ...editParent,
      studentIds: [...editParent.studentIds, ''],
      studentNames: [...editParent.studentNames, ''],
      studentClasses: [...editParent.studentClasses, '']
    });
  };
  
  const handleEditRemoveStudent = (index: number) => {
    const newStudentIds = [...editParent.studentIds];
    const newStudentNames = [...editParent.studentNames];
    const newStudentClasses = [...editParent.studentClasses];
    
    newStudentIds.splice(index, 1);
    newStudentNames.splice(index, 1);
    newStudentClasses.splice(index, 1);
    
    setEditParent({
      ...editParent,
      studentIds: newStudentIds,
      studentNames: newStudentNames,
      studentClasses: newStudentClasses
    });
  };
  
  const handleNewParentChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setNewParent({
      ...newParent,
      [name]: value,
    });
  };
  
  const handleEditParentChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setEditParent({
      ...editParent,
      [name]: value,
    });
  };
  
  const handleStudentDetailChange = (index: number, field: 'studentIds' | 'studentNames' | 'studentClasses', value: string) => {
    const updatedArray = [...newParent[field]];
    updatedArray[index] = value;
    
    setNewParent({
      ...newParent,
      [field]: updatedArray
    });
  };
  
  const handleEditStudentDetailChange = (index: number, field: 'studentIds' | 'studentNames' | 'studentClasses', value: string) => {
    const updatedArray = [...editParent[field]];
    updatedArray[index] = value;
    
    setEditParent({
      ...editParent,
      [field]: updatedArray
    });
  };
  
  const handleAddParent = () => {
    const newId = `PAR${String(parents.length + 1).padStart(3, '0')}`;
    const parentToAdd = {
      ...newParent,
      id: newId,
      lastLogin: '-'
    };
    
    setParents([...parents, parentToAdd]);
    
    // Reset form
    setNewParent({
      name: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
      studentIds: [''],
      studentNames: [''],
      studentClasses: [''],
      status: 'Active'
    });
    
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateParent = () => {
    setParents(parents.map(parent => 
      parent.id === editParent.id ? editParent : parent
    ));
    
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteParent = (id: string) => {
    setParents(parents.filter(parent => parent.id !== id));
  };
  

  
  const handleSendCommunication = () => {
    const parentIds = newCommunication.sendToAll 
      ? parents.map(p => p.id) 
      : newCommunication.parentIds;
    
    const newCommunications = parentIds.map((parentId, index) => ({
      id: communications.length + index + 1,
      parentId,
      type: newCommunication.type,
      subject: newCommunication.subject,
      content: newCommunication.content,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Delivered'
    }));
    
    setCommunications([...communications, ...newCommunications]);
    
    setNewCommunication({
      parentIds: [],
      type: 'Email',
      subject: '',
      content: '',
      sendToAll: false
    });
    
    setIsCommunicationDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ minHeight: '80vh' }}>
        <Typography variant="h4" sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          Parents Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="parents management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Person />} label="Parents List" />
            <Tab icon={<School />} label="Student-Parent Association" />
            <Tab icon={<Message />} label="Communication" />
            <Tab icon={<Assignment />} label="Reports" />
          </Tabs>
        </Box>
        
        {/* Parents List Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Parents Directory</Typography>
            {!readOnly && (
              <Button 
                variant="contained" 
                startIcon={<PersonAdd />}
                onClick={handleAddDialogOpen}
              >
                Add Parent
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Search Parents"
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value="all">
                  <MenuItem value="all">All Parents</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.id}</TableCell>
                    <TableCell>{parent.name}</TableCell>
                    <TableCell>
                      {parent.phone}<br />
                      {parent.email}
                    </TableCell>
                    <TableCell>
                      {parent.studentNames.map((name, index) => (
                        <div key={index}>
                          {name} ({parent.studentClasses[index]})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={parent.status} 
                        color={parent.status === 'Active' ? 'success' : 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleViewDialogOpen(parent)}>
                        <Person />
                      </IconButton>
                      {!readOnly && (
                        <>
                          <IconButton color="info" onClick={() => handleEditDialogOpen(parent)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteParent(parent.id)}>
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Student-Parent Association Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Student-Parent Associations</Typography>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Search by Student Name/ID"
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select label="Class" value="all">
                  <MenuItem value="all">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Parent Name</TableCell>
                  <TableCell>Parent Contact</TableCell>
                  {!readOnly && <TableCell align="center">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {parents.flatMap((parent) => 
                  parent.studentIds.map((studentId, index) => (
                    <TableRow key={`${parent.id}-${studentId}`}>
                      <TableCell>{studentId}</TableCell>
                      <TableCell>{parent.studentNames[index]}</TableCell>
                      <TableCell>{parent.studentClasses[index]}</TableCell>
                      <TableCell>{parent.name}</TableCell>
                      <TableCell>
                        {parent.phone}<br />
                        {parent.email}
                      </TableCell>
                      {!readOnly && (
                        <TableCell align="center">
                          <IconButton color="info">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Communication Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Parent Communications</Typography>
            {!readOnly && (
              <Button 
                variant="contained" 
                startIcon={<Message />}
                onClick={handleCommunicationDialogOpen}
              >
                New Communication
              </Button>
            )}
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {communications.map((comm) => {
                  const parent = parents.find(p => p.id === comm.parentId);
                  return (
                    <TableRow key={comm.id}>
                      <TableCell>{comm.sentDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={comm.type} 
                          color={comm.type === 'Email' ? 'primary' : 'secondary'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{parent?.name}</TableCell>
                      <TableCell>{comm.subject}</TableCell>
                      <TableCell>
                        <Chip 
                          label={comm.status} 
                          color={comm.status === 'Delivered' ? 'success' : 'warning'} 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Parent Engagement Reports
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Parent Participation Statistics
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Chart will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Communication Response Rate
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Chart will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Parent Login Activity
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Parent ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Last Login</TableCell>
                          <TableCell>Login Frequency</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parents.map((parent) => (
                          <TableRow key={parent.id}>
                            <TableCell>{parent.id}</TableCell>
                            <TableCell>{parent.name}</TableCell>
                            <TableCell>{parent.lastLogin}</TableCell>
                            <TableCell>Medium</TableCell>
                            <TableCell>
                              <Chip 
                                label={parent.status} 
                                color={parent.status === 'Active' ? 'success' : 'default'} 
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Add Parent Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Parent</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  required
                  value={newParent.name}
                  onChange={handleNewParentChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  fullWidth
                  required
                  value={newParent.email}
                  onChange={handleNewParentChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  required
                  value={newParent.phone}
                  onChange={handleNewParentChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="occupation"
                  label="Occupation"
                  fullWidth
                  value={newParent.occupation}
                  onChange={handleNewParentChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={newParent.address}
                  onChange={handleNewParentChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Student Information
                </Typography>
              </Grid>
              
              {newParent.studentIds.map((studentId, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Student ID"
                      fullWidth
                      required
                      value={studentId}
                      onChange={(e) => handleStudentDetailChange(index, 'studentIds', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Student Name"
                      fullWidth
                      required
                      value={newParent.studentNames[index]}
                      onChange={(e) => handleStudentDetailChange(index, 'studentNames', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth required>
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={newParent.studentClasses[index]}
                        label="Class"
                        onChange={(e) => handleStudentDetailChange(index, 'studentClasses', e.target.value as string)}
                      >
                        {classes.map((cls) => (
                          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {index > 0 && (
                      <IconButton color="error" onClick={() => handleRemoveStudent(index)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Grid>
                </React.Fragment>
              ))}
              
              <Grid item xs={12}>
                <Button 
                  startIcon={<Add />} 
                  onClick={handleAddStudent}
                  variant="outlined"
                >
                  Add Another Student
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newParent.status === 'Active'}
                      onChange={(e) => setNewParent({...newParent, status: e.target.checked ? 'Active' : 'Inactive'})}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddParent}
            disabled={!newParent.name || !newParent.email || !newParent.phone || 
                      newParent.studentIds.some(id => !id) || 
                      newParent.studentNames.some(name => !name) || 
                      newParent.studentClasses.some(cls => !cls)}
            variant="contained"
          >
            Add Parent
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Parent Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Parent</DialogTitle>
        <DialogContent>
          {editParent && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    required
                    value={editParent.name}
                    onChange={handleEditParentChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    required
                    value={editParent.email}
                    onChange={handleEditParentChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    required
                    value={editParent.phone}
                    onChange={handleEditParentChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="occupation"
                    label="Occupation"
                    fullWidth
                    value={editParent.occupation}
                    onChange={handleEditParentChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    value={editParent.address}
                    onChange={handleEditParentChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Student Information
                  </Typography>
                </Grid>
                
                {editParent.studentIds.map((studentId: string, index: number) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Student ID"
                        fullWidth
                        required
                        value={studentId}
                        onChange={(e) => handleEditStudentDetailChange(index, 'studentIds', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Student Name"
                        fullWidth
                        required
                        value={editParent.studentNames[index]}
                        onChange={(e) => handleEditStudentDetailChange(index, 'studentNames', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth required>
                        <InputLabel>Class</InputLabel>
                        <Select
                          value={editParent.studentClasses[index]}
                          label="Class"
                          onChange={(e) => handleEditStudentDetailChange(index, 'studentClasses', e.target.value as string)}
                        >
                          {classes.map((cls) => (
                            <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {index > 0 && (
                        <IconButton color="error" onClick={() => handleEditRemoveStudent(index)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
                
                <Grid item xs={12}>
                  <Button 
                    startIcon={<Add />} 
                    onClick={handleEditAddStudent}
                    variant="outlined"
                  >
                    Add Another Student
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editParent.status === 'Active'}
                        onChange={(e) => setEditParent({...editParent, status: e.target.checked ? 'Active' : 'Inactive'})}
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            onClick={handleUpdateParent}
            variant="contained"
          >
            Update Parent
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View Parent Dialog */}
      <Dialog open={isViewDialogOpen} onClose={handleViewDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Parent Profile</Typography>
            {!readOnly && (
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                onClick={() => {
                  handleViewDialogClose();
                  handleEditDialogOpen(selectedParent);
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedParent && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                >
                  {selectedParent.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{selectedParent.name}</Typography>
                <Typography color="text.secondary">{selectedParent.occupation}</Typography>
                <Chip 
                  label={selectedParent.status} 
                  color={selectedParent.status === 'Active' ? 'success' : 'default'} 
                  sx={{ mt: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={selectedParent.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={selectedParent.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText primary="Address" secondary={selectedParent.address} />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Associated Students</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Class</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedParent.studentIds.map((id: string, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{id}</TableCell>
                          <TableCell>{selectedParent.studentNames[index]}</TableCell>
                          <TableCell>{selectedParent.studentClasses[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Recent Communications</Typography>
                <List>
                  {communications
                    .filter(comm => comm.parentId === selectedParent.id)
                    .slice(0, 3)
                    .map(comm => (
                      <ListItem key={comm.id}>
                        <ListItemIcon>
                          {comm.type === 'Email' ? <Email /> : <Message />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={comm.subject} 
                          secondary={`${comm.type} • ${comm.sentDate}`} 
                        />
                      </ListItem>
                    ))}
                  {communications.filter(comm => comm.parentId === selectedParent.id).length === 0 && (
                    <ListItem>
                      <ListItemText primary="No recent communications" />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* New Communication Dialog */}
      <Dialog open={isCommunicationDialogOpen} onClose={handleCommunicationDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>New Communication</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newCommunication.sendToAll}
                      onChange={(e) => {
                        setNewCommunication({
                          ...newCommunication,
                          sendToAll: e.target.checked,
                          parentIds: e.target.checked ? parents.map(p => p.id) : []
                        });
                      }}
                    />
                  }
                  label="Send to all parents"
                />
              </Grid>
              
              {!newCommunication.sendToAll && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Parents</InputLabel>
                    <Select
                      multiple
                      name="parentIds"
                      value={newCommunication.parentIds}
                      label="Select Parents"
                      onChange={(e) => {
                        setNewCommunication({
                          ...newCommunication,
                          parentIds: typeof e.target.value === 'string' 
                            ? [e.target.value] 
                            : e.target.value as string[]
                        });
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const parent = parents.find(p => p.id === value);
                            return (
                              <Chip key={value} label={parent?.name || value} />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {parents.map((parent) => (
                        <MenuItem key={parent.id} value={parent.id}>
                          {parent.name} ({parent.studentNames.join(', ')})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Communication Type</InputLabel>
                  <Select
                    name="type"
                    value={newCommunication.type}
                    label="Communication Type"
                    onChange={(e) => {
                      setNewCommunication({
                        ...newCommunication,
                        type: e.target.value as string
                      });
                    }}
                  >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                    <MenuItem value="Notification">App Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="subject"
                  label="Subject"
                  fullWidth
                  required
                  value={newCommunication.subject}
                  onChange={(e) => {
                    setNewCommunication({
                      ...newCommunication,
                      subject: e.target.value
                    });
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="content"
                  label="Message Content"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={newCommunication.content}
                  onChange={(e) => {
                    setNewCommunication({
                      ...newCommunication,
                      content: e.target.value
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCommunicationDialogClose}>Cancel</Button>
          <Button 
            onClick={handleSendCommunication}
            disabled={(newCommunication.parentIds.length === 0 && !newCommunication.sendToAll) || 
                      !newCommunication.subject || 
                      !newCommunication.content}
            variant="contained"
            startIcon={<Send />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const Send = () => <Message />;

export default ParentsManagement;
