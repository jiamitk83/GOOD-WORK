import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  School,
  Person,
  MenuBook,
  Assignment,
  Grade,
  Dashboard as DashboardIcon,
  Quiz as ExamIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Different features based on user type
  const getAvailableFeatures = () => {
    const allFeatures = [
      {
        icon: <School color="primary" sx={{ fontSize: 40 }} />,
        title: 'Students',
        description: 'Manage student records',
        action: 'View Students',
        roles: ['admin', 'teacher'],
        path: '/students'
      },
      {
        icon: <Person color="primary" sx={{ fontSize: 40 }} />,
        title: 'Teachers',
        description: 'Manage teacher profiles',
        action: 'View Teachers',
        roles: ['admin'],
        path: '/teachers'
      },
      {
        icon: <MenuBook color="primary" sx={{ fontSize: 40 }} />,
        title: 'Courses',
        description: 'Manage course catalog',
        action: 'View Courses',
        roles: ['admin', 'teacher', 'student'],
        path: '/courses'
      },
      {
        icon: <ExamIcon color="primary" sx={{ fontSize: 40 }} />,
        title: 'Examinations',
        description: 'Manage exams and results',
        action: 'View Examinations',
        roles: ['admin', 'teacher'],
        path: '/examinations'
      },
      {
        icon: <MoneyIcon color="primary" sx={{ fontSize: 40 }} />,
        title: 'Fees Management',
        description: 'Manage student fees and payments',
        action: 'Manage Fees',
        roles: ['admin'],
        path: '/fees'
      },
      {
        icon: <ScheduleIcon color="primary" sx={{ fontSize: 40 }} />,
        title: 'Time Table',
        description: 'View and manage class schedules',
        action: 'View Time Table',
        roles: ['admin', 'teacher', 'student'],
        path: '/timetable'
      },
      {
        icon: <Assignment color="primary" sx={{ fontSize: 40 }} />,
        title: 'Attendance',
        description: 'Track attendance records',
        action: 'View Attendance',
        roles: ['admin', 'teacher', 'student'],
        path: '/attendance'
      },
      {
        icon: <Grade color="primary" sx={{ fontSize: 40 }} />,
        title: 'Grades',
        description: 'Manage student grades',
        action: 'View Grades',
        roles: ['admin', 'teacher', 'student'],
        path: '/grades'
      }
    ];

    return allFeatures.filter(feature => 
      feature.roles.includes(user?.userType || '')
    );
  };

  const getUserTypeColor = () => {
    switch (user?.userType) {
      case 'admin': return 'error';
      case 'teacher': return 'warning';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getUserTypeLabel = () => {
    switch (user?.userType) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" gutterBottom>
            School ERP Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.username}!
          </Typography>
          <Chip 
            label={getUserTypeLabel()}
            color={getUserTypeColor()}
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {getAvailableFeatures().map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user?.userType === 'student' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Student Portal:</strong> Access your courses, view attendance, and check grades.
          </Typography>
        </Box>
      )}

      {user?.userType === 'teacher' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.contrastText">
            <strong>Teacher Portal:</strong> Manage your classes, track student attendance, and record grades.
          </Typography>
        </Box>
      )}

      {user?.userType === 'admin' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography variant="body2" color="error.contrastText">
            <strong>Admin Panel:</strong> Full access to all system features and user management.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
