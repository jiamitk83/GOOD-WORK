import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const FeesManagement: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fees Management Module
        </Typography>
        <Typography variant="body1">
          This is the Fees Management page. If you can see this text, the component is working!
        </Typography>
      </Box>
    </Container>
  );
};

export default FeesManagement;
