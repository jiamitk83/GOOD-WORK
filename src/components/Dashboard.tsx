import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  School, 
  Person, 
  MenuBook, 
  Assignment, 
  Grade, 
  Settings,
  ManageAccounts,
  Payment,
  Schedule,
  Quiz,
  Language,
  SupervisorAccount,
  CalendarMonth,
  EventNote,
  PeopleAlt,
  CheckCircle,
  Groups,
  LibraryBooks,
  Event
} from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

const Dashboard: React.FC = () => {
  const { user, checkPermission } = useAuth();
  
  // Current academic information
  const academicInfo = {
    year: '2025-2026',
    term: 'Fall Semester',
    currentWeek: 'Week 3 of 16',
    nextHoliday: 'Autumn Break (Oct 15-20)'
  };
  
  // Dynamically get total students, teachers, courses, and attendance rate from localStorage or fallback to sample data
  let totalStudents = 0;
  let totalTeachers = 0;
  let totalCourses = 0;
  let attendanceRate = '96%';
  try {
    // Students
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      totalStudents = JSON.parse(savedStudents).length;
    } else {
      totalStudents = 5;
    }
    // Teachers
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      totalTeachers = JSON.parse(savedTeachers).length;
    } else {
      totalTeachers = 3;
    }
    // Courses
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      totalCourses = JSON.parse(savedCourses).length;
    } else {
      totalCourses = 4;
    }
    // Attendance Rate (calculate if attendance data exists)
    const savedAttendance = localStorage.getItem('attendance');
    if (savedAttendance) {
      const attendanceRecords = JSON.parse(savedAttendance);
      let present = 0, total = 0;
      attendanceRecords.forEach((rec: any) => {
        if (rec.status === 'present') present++;
        total++;
      });
      if (total > 0) {
        attendanceRate = Math.round((present / total) * 100) + '%';
      }
    }
  } catch {
    totalStudents = 5;
    totalTeachers = 3;
    totalCourses = 4;
    attendanceRate = '96%';
  }

  // Sample quick stats data (all dynamic)
  const quickStats = [
    {
      title: 'Total Students',
      count: totalStudents,
      icon: <PeopleAlt color="primary" />,
      change: '+5% from last month',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Total Teachers',
      count: totalTeachers,
      icon: <Person color="primary" />,
      change: '+2 new this month',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Courses',
      count: totalCourses,
      icon: <LibraryBooks color="primary" />,
      change: 'Across all grades',
      bgColor: '#fff8e1'
    },
    {
      title: 'Attendance Rate',
      count: attendanceRate,
      icon: <CheckCircle color="primary" />,
      change: '+2% from last month',
      bgColor: '#f3e5f5'
    }
  ];

  // Sample announcements
  const announcements = [
    {
      title: 'School Annual Day',
      date: 'August 15, 2025',
      content: 'Annual day celebrations will be held in the school auditorium. All students must participate.',
      icon: <Event color="primary" />
    },
    {
      title: 'Parent-Teacher Meeting',
      date: 'August 20, 2025',
      content: 'PTM scheduled for all classes. Parents are requested to attend without fail.',
      icon: <Groups color="primary" />
    },
    {
      title: 'Mid-Term Exams',
      date: 'September 10-20, 2025',
      content: 'Mid-term examinations for all classes will begin soon. Timetable has been published.',
      icon: <Assignment color="primary" />
    }
  ];

  // Sample upcoming events
  const upcomingEvents = [
    {
      title: 'Science Exhibition',
      date: new Date('2025-08-12'),
      type: 'event'
    },
    {
      title: 'Mathematics Olympiad',
      date: new Date('2025-08-18'),
      type: 'competition'
    },
    {
      title: 'Sports Day',
      date: new Date('2025-08-25'),
      type: 'event'
    },
    {
      title: 'Mid-Term Exam Begins',
      date: new Date('2025-09-10'),
      type: 'exam'
    },
    {
      title: 'Teachers Day Celebration',
      date: new Date('2025-09-05'),
      type: 'event'
    }
  ];
  
  // Recent activities
  const recentActivities = [
    {
      action: 'New student enrolled',
      target: 'John Smith in Grade 10-A',
      time: '2 hours ago',
      icon: <PeopleAlt fontSize="small" color="primary" />
    },
    {
      action: 'Exam results published',
      target: 'Science Mid-Term for Grade 8',
      time: 'Yesterday',
      icon: <Assignment fontSize="small" color="secondary" />
    },
    {
      action: 'Fee payment received',
      target: 'Emma Wilson (Grade 7-B)',
      time: 'Yesterday',
      icon: <Payment fontSize="small" color="success" />
    },
    {
      action: 'New course material uploaded',
      target: 'Mathematics - Grade 9',
      time: '3 days ago',
      icon: <MenuBook fontSize="small" color="primary" />
    }
  ];
  
  // Organize cards into categories
  const cardCategories = [
    {
      title: 'Academics',
      cards: [
        {
          title: 'Students',
          description: 'Manage student records, enrollments, and information',
          icon: <School color="primary" sx={{ fontSize: 40 }} />,
          link: '/students',
          permission: 'view_students',
          color: '#e3f2fd'
        },
        {
          title: 'Teachers',
          description: 'Manage teacher profiles, assignments, and schedules',
          icon: <Person color="primary" sx={{ fontSize: 40 }} />,
          link: '/teachers',
          permission: 'view_teachers',
          color: '#e8f5e9'
        },
        {
          title: 'Courses',
          description: 'Manage course catalog, curriculum, and materials',
          icon: <MenuBook color="primary" sx={{ fontSize: 40 }} />,
          link: '/courses',
          permission: 'view_courses',
          color: '#fff8e1'
        }
      ]
    },
    {
      title: 'Administration',
      cards: [
        {
          title: 'Attendance',
          description: 'Track and manage student attendance records',
          icon: <Assignment color="secondary" sx={{ fontSize: 40 }} />,
          link: '/attendance',
          permission: 'view_attendance',
          color: '#fce4ec'
        },
        {
          title: 'Grades',
          description: 'Record and manage student grades and performance',
          icon: <Grade color="secondary" sx={{ fontSize: 40 }} />,
          link: '/grades',
          permission: 'view_grades',
          color: '#f3e5f5'
        },
        {
          title: 'Time Table',
          description: 'Manage class schedules and academic calendar',
          icon: <Schedule color="secondary" sx={{ fontSize: 40 }} />,
          link: '/timetable',
          permission: 'view_timetable',
          color: '#e1f5fe'
        },
        {
          title: 'Examinations',
          description: 'Manage exams, tests, and assessments',
          icon: <Quiz color="secondary" sx={{ fontSize: 40 }} />,
          link: '/examinations',
          permission: 'view_examinations',
          color: '#e0f2f1'
        },
        {
          title: 'Fees Management',
          description: 'Manage student fees, payments, and financial records',
          icon: <Payment color="secondary" sx={{ fontSize: 40 }} />,
          link: '/fees',
          permission: 'view_fees',
          color: '#f1f8e9'
        },
        {
          title: 'Parents',
          description: 'Manage parent information and communication',
          icon: <SupervisorAccount color="secondary" sx={{ fontSize: 40 }} />,
          link: '/parents',
          permission: 'view_parents',
          color: '#fffde7'
        }
      ]
    },
    {
      title: 'System',
      cards: [
        {
          title: 'User Management',
          description: 'Manage user accounts and access control',
          icon: <ManageAccounts color="info" sx={{ fontSize: 40 }} />,
          link: '/users',
          permission: 'manage_users',
          color: '#e8eaf6'
        },
        {
          title: 'Roles & Permissions',
          description: 'Configure user roles and access permissions',
          icon: <Settings color="info" sx={{ fontSize: 40 }} />,
          link: '/roles',
          permission: 'manage_roles',
          color: '#e0f7fa'
        },
        {
          title: 'School Setup',
          description: 'Configure school profile, academic years, and classes',
          icon: <Settings color="info" sx={{ fontSize: 40 }} />,
          link: '/school-setup',
          permission: 'manage_school_settings',
          color: '#f9fbe7'
        },
        {
          title: 'Simple Browser',
          description: 'Access web resources within the application',
          icon: <Language color="info" sx={{ fontSize: 40 }} />,
          link: '/browser',
          permission: 'view_dashboard',
          color: '#f5f5f5'
        }
      ]
    }
  ];

  // Filter cards based on user permissions
  const filteredCategories = cardCategories.map(category => ({
    ...category,
    cards: category.cards.filter(card => 
      !card.permission || checkPermission(card.permission) || user?.role === 'admin'
    )
  })).filter(category => category.cards.length > 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome and Academic Info Bar */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: 2,
          background: 'linear-gradient(to right, #ffffff, #f9f9f9)'
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2, 
                  width: 48, 
                  height: 48,
                  boxShadow: 1
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5">Welcome, {user?.name || 'User'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'} Account
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ mr: 4 }}>
                <Typography variant="body2" color="text.secondary">Academic Year</Typography>
                <Typography variant="body1" fontWeight="medium">{academicInfo.year}</Typography>
              </Box>
              <Box sx={{ mr: 4 }}>
                <Typography variant="body2" color="text.secondary">Current Term</Typography>
                <Typography variant="body1" fontWeight="medium">{academicInfo.term}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Week</Typography>
                <Typography variant="body1" fontWeight="medium">{academicInfo.currentWeek}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                boxShadow: 1,
                height: '100%',
                backgroundColor: stat.bgColor || 'white',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                  <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>{stat.count}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.change}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'white', boxShadow: 1 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Main Dashboard Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            School ERP Dashboard
          </Typography>
          
          {/* Categorized Cards */}
          {filteredCategories.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  pb: 1, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {category.title}
              </Typography>
              
              <Grid container spacing={3}>
                {category.cards.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        borderRadius: 2,
                        backgroundColor: card.color || 'white',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mb: 2,
                            mt: 1
                          }}
                        >
                          <Avatar
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              bgcolor: 'white',
                              boxShadow: 2
                            }}
                          >
                            {card.icon}
                          </Avatar>
                        </Box>
                        <Typography 
                          variant="h6" 
                          component="div" 
                          align="center"
                          sx={{ 
                            fontWeight: 'medium',
                            mb: 1
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          align="center"
                        >
                          {card.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pt: 0, pb: 2 }}>
                        <Button 
                          variant="contained"
                          size="small" 
                          component={Link} 
                          to={card.link}
                          color="primary"
                          sx={{ 
                            borderRadius: 4,
                            px: 3
                          }}
                        >
                          Open
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          
          {/* Recent Activities */}
          <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Activities
              </Typography>
              <Chip 
                label="New" 
                color="primary" 
                size="small" 
                sx={{ height: 20 }} 
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 1, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {activity.action}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {activity.target}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar with Announcements and Calendar */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Announcements
              </Typography>
              <Chip 
                label="New" 
                color="error" 
                size="small" 
                sx={{ height: 20 }} 
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {announcements.map((announcement, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {announcement.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {announcement.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" component="span">
                            {announcement.date}
                          </Typography>
                          <Typography variant="body2" component="p" sx={{ mt: 0.5 }}>
                            {announcement.content}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < announcements.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              boxShadow: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Events
              </Typography>
              <CalendarMonth color="primary" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {upcomingEvents.map((event, index) => (
                <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{ 
                        width: 30, 
                        height: 30, 
                        fontSize: '0.8rem',
                        bgcolor: 
                          event.type === 'exam' ? 'error.main' : 
                          event.type === 'competition' ? 'warning.main' : 'success.main'
                      }}
                    >
                      {event.date.getDate()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={event.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  />
                  <Chip 
                    label={event.type} 
                    size="small"
                    color={
                      event.type === 'exam' ? 'error' : 
                      event.type === 'competition' ? 'warning' : 'success'
                    }
                    sx={{ textTransform: 'capitalize', height: 24 }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                startIcon={<EventNote />}
                size="small"
                component={Link}
                to="/timetable"
                variant="outlined"
                sx={{ borderRadius: 4 }}
              >
                View Full Calendar
              </Button>
            </Box>
          </Paper>

          {/* Holiday Notice */}
          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: '#fff8e1'
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">Next Holiday</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{academicInfo.nextHoliday}</Typography>
            <Button 
              variant="text" 
              color="primary"
              size="small"
              component={Link}
              to="/timetable"
              sx={{ mt: 1 }}
            >
              View Academic Calendar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
