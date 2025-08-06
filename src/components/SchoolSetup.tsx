import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider
} from '@mui/material';
import { 
  School, 
  CalendarMonth, 
  Class, 
  Book 
} from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

// Import the school setup components
import SchoolProfileForm from './school-setup/SchoolProfileForm';
import AcademicYearManagement from './school-setup/AcademicYearManagement';
import ClassSectionManagement from './school-setup/ClassSectionManagement';
import SubjectManagement from './school-setup/SubjectManagement';

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
      id={`school-setup-tabpanel-${index}`}
      aria-labelledby={`school-setup-tab-${index}`}
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

const SchoolSetup: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Check if user has permission to access school setup
  const canAccessSchoolSetup = user?.role === 'admin' || checkPermission('manage_school_settings');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!canAccessSchoolSetup) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error">
          You do not have permission to access School Setup.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        School Setup
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure your school profile, academic years, classes, sections, and subjects.
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="school setup tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<School />} 
            label="School Profile" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<CalendarMonth />} 
            label="Academic Years" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Class />} 
            label="Classes & Sections" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Book />} 
            label="Subjects" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        </Tabs>

        <Divider />

        <TabPanel value={tabValue} index={0}>
          <SchoolProfileForm />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <AcademicYearManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ClassSectionManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <SubjectManagement />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SchoolSetup;
