import React, { useState } from 'react';
import { Typography, Avatar, Box, IconButton, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    const loginUrl = import.meta.env.VITE_LOGIN_URL || `${import.meta.env.VITE_API_URL}login`;
    window.location.href = loginUrl;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="h6">eduLLM Admin</Typography>
      <Box>
        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
          <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Salir
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
