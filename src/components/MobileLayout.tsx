import React from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  SwipeableDrawer
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Person,
  MenuBook,
  SupervisorAccount,
  Assignment,
  Schedule,
  Assessment,
  AccountBalance,
  Settings,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = 'School ERP' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Students', icon: <Person />, path: '/students' },
    { text: 'Teachers', icon: <MenuBook />, path: '/teachers' },
    { text: 'Staff', icon: <SupervisorAccount />, path: '/staff' },
    { text: 'Courses', icon: <School />, path: '/courses' },
    { text: 'Attendance', icon: <Assignment />, path: '/attendance' },
    { text: 'Timetable', icon: <Schedule />, path: '/timetable' },
    { text: 'Grades', icon: <Assessment />, path: '/grades' },
    { text: 'Fees', icon: <AccountBalance />, path: '/fees' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      {/* User Profile Section */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {user?.role?.toUpperCase() || 'USER'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      {/* Logout */}
      <List sx={{ px: 1, py: 1 }}>
        <ListItem
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Mobile App Bar */}
        <AppBar position="fixed" elevation={1}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          ModalProps={{
            keepMounted: true // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280
            }
          }}
        >
          {drawer}
        </SwipeableDrawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // Account for AppBar height
            px: 1,
            pb: 2,
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default'
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  // Desktop Layout (existing design)
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {children}
    </Container>
  );
};

export default MobileLayout;
