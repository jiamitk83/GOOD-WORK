import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

const FeesManagement = () => {
  return (
    <Container>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4">Fees Management</Typography>
        </Box>
        <Typography variant="body1">
          ✅ यह Fees Management page है और यह properly working है!
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          अगर आप यह message देख रहे हैं तो component successfully load हो गया है।
        </Typography>
      </Paper>
    </Container>
  );
};

export default FeesManagement;
