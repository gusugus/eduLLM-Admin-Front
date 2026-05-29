import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="h6">eduLLM Admin</Typography>
      <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
    </Box>
  );
};

export default Header;