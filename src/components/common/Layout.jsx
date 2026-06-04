import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Header />
        </Toolbar>
      </AppBar>

      {/* Drawer / Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#0f172a',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            },
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }} />
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          pt: { xs: '56px', sm: '60px' },
        }}
      >
        <div className="p-6 max-w-screen-xl mx-auto">
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default Layout;
