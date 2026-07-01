import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { getLoginUrl } from '../utils/auth';
import { GATEWAY } from '../config';

const ForbiddenPage = () => {
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    logout();
    axios.post(`${GATEWAY}/api/auth/logout`, null, { withCredentials: true }).catch(() => {});
  }, [logout]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ py: 8 }}>
        <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No tienes permiso para acceder a esta página
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Tu cuenta no tiene los permisos necesarios para acceder al panel de administración. Serás redirigido al inicio de sesión.
        </Typography>
        <Button
          variant="contained"
          href={getLoginUrl()}
        >
          Ir al inicio de sesión
        </Button>
      </Box>
    </Container>
  );
};

export default ForbiddenPage;
