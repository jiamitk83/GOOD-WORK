import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Avatar,
  Chip,
  IconButton,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  School,
  People,
  MenuBook,
  Settings,
  ExpandLess,
  ExpandMore,
  Person,
  SupervisorAccount,
  Assignment,
  Schedule,
  Payment,
  Grade,
  Quiz,
  Notifications,
  ManageAccounts,
  Refresh,
  Download,
  CloudUpload
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Sidebar menu items
const menuItems = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    link: '/dashboard',
    permission: 'view_dashboard'
  },
  {
    title: 'User Approvals',
    icon: <ManageAccounts />,
    link: '/admin/user-approvals',
    permission: 'manage_users',
    description: 'Approve or reject user registrations'
  },
  {
    title: 'School Setup',
    icon: <School />,
    link: '/school-setup',
    permission: 'manage_school_settings',
    subItems: [
      { title: 'School Profile', link: '/school-setup' },
      { title: 'Academic Years', link: '/school-setup' },
      { title: 'Classes & Sections', link: '/school-setup' },
      { title: 'Subjects', link: '/school-setup' }
    ]
  },
  {
    title: 'Students',
    icon: <Person />,
    link: '/students',
    permission: 'view_students'
  },
  {
    title: 'Teachers',
    icon: <People />,
    link: '/teachers',
    permission: 'view_teachers'
  },
  {
    title: 'Parents',
    icon: <SupervisorAccount />,
    link: '/parents',
    permission: 'view_parents'
  },
  {
    title: 'Courses',
    icon: <MenuBook />,
    link: '/courses',
    permission: 'view_courses'
  },
  {
    title: 'Time Table',
    icon: <Schedule />,
    link: '/timetable',
    permission: 'view_timetable'
  },
  {
    title: 'Attendance',
    icon: <Assignment />,
    link: '/attendance',
    permission: 'view_attendance'
  },
  {
    title: 'Grades',
    icon: <Grade />,
    link: '/grades',
    permission: 'view_grades'
  },
  {
    title: 'Examinations',
    icon: <Quiz />,
    link: '/examinations',
    permission: 'view_examinations'
  },
  {
    title: 'Fees Management',
    icon: <Payment />,
    link: '/fees',
    permission: 'view_fees'
  },
  {
    title: 'Users & Roles',
    icon: <ManageAccounts />,
    permission: 'manage_users',
    subItems: [
      { title: 'User Management', link: '/users' },
      { title: 'Roles & Permissions', link: '/roles' }
    ]
  },
  {
    title: 'System Settings',
    icon: <Settings />,
    permission: 'manage_settings',
    subItems: [
      { title: 'General Settings', link: '/settings' },
      { title: 'Notifications', link: '/notifications' },
      { title: 'Backup & Restore', link: '/backup' }
    ]
  }
];

// Dashboard card stats
const statsCards = [
  { title: 'Total Students', count: 1245, icon: <Person />, color: '#4caf50' },
  { title: 'Total Teachers', count: 85, icon: <People />, color: '#2196f3' },
  { title: 'Total Courses', count: 42, icon: <MenuBook />, color: '#ff9800' },
  { title: 'Active Users', count: 1384, icon: <ManageAccounts />, color: '#9c27b0' }
];

// Recent notifications
const recentNotifications = [
  { id: 1, message: 'New student registration request pending', time: '5 minutes ago', type: 'info' },
  { id: 2, message: 'System backup completed successfully', time: '1 hour ago', type: 'success' },
  { id: 3, message: 'Teacher salary payment due in 2 days', time: '3 hours ago', type: 'warning' },
  { id: 4, message: 'Server maintenance scheduled for tonight', time: '5 hours ago', type: 'error' }
];

const AdminPanel: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Toggle submenu
  const handleToggle = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || checkPermission(item.permission) || isAdmin
  );

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          You do not have permission to access the Admin Panel. This area is restricted to administrators only.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar Menu */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" noWrap>
                  {user?.name || 'Admin User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List component="nav" sx={{ width: '100%' }}>
              {filteredMenuItems.map((item) => (
                <React.Fragment key={item.title}>
                  <ListItemButton
                    component={item.subItems ? 'div' : Link}
                    to={item.subItems ? undefined : item.link}
                    onClick={() => item.subItems && handleToggle(item.title)}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.subItems && (openItems[item.title] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                  
                  {item.subItems && (
                    <Collapse in={openItems[item.title] || false} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem) => (
                          <ListItemButton
                            key={subItem.title}
                            component={Link}
                            to={subItem.link}
                            sx={{ pl: 4 }}
                          >
                            <ListItemText primary={subItem.title} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Welcome Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to the School ERP Admin Panel. Here you can manage all aspects of the school management system.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
              >
                Refresh Data
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Generate Reports
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
              >
                Backup System
              </Button>
            </Box>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {statsCards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.title}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar sx={{ bgcolor: card.color }}>
                        {card.icon}
                      </Avatar>
                      <Typography variant="h4">
                        {card.count}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* System Status */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  CPU Usage
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={45} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                />
                <Typography variant="body2" align="right">
                  45%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Memory Usage
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={62} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                />
                <Typography variant="body2" align="right">
                  62%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Disk Space
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={28} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                />
                <Typography variant="body2" align="right">
                  28%
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Chip label="All Systems Operational" color="success" size="small" />
              <Typography variant="caption" color="text.secondary">
                Last updated: August 7, 2025 - 10:45 AM
              </Typography>
            </Box>
          </Paper>

          {/* Recent Notifications */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Notifications
              </Typography>
              <IconButton size="small">
                <Notifications />
              </IconButton>
            </Box>
            <List>
              {recentNotifications.map((notification) => (
                <ListItem 
                  key={notification.id}
                  secondaryAction={
                    <Chip 
                      label={notification.type} 
                      size="small"
                      color={
                        notification.type === 'success' ? 'success' :
                        notification.type === 'error' ? 'error' :
                        notification.type === 'warning' ? 'warning' : 'info'
                      }
                    />
                  }
                  divider
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button color="primary">
                View All Notifications
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;
