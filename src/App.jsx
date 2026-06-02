import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/common/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { redirectToLogin } from './utils/auth';

function AuthGate() {
  const { verifyAuth, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando aplicación...');
  const [noSession, setNoSession] = useState(false);

  const skipVerify = import.meta.env.VITE_SKIP_AUTH_VERIFY === 'true';
  const verifyCalled = useRef(false);

  useEffect(() => {
    if (verifyCalled.current) return;
    verifyCalled.current = true;

    const init = async () => {
      if (skipVerify) {
        setLoading(false);
        return;
      }

      setLoadingMessage('🔍 Verificando autenticación...');

      try {
        const data = await verifyAuth();

        if (data?.authenticated) {
          setLoadingMessage(`👋 Bienvenido, ${data.username}!`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          setNoSession(true);
        }
      } catch (error) {
        console.log('Error de conexión al verificar auth:', error.message);
        setNoSession(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [verifyAuth, skipVerify]);

  useEffect(() => {
    if (noSession) {
      const t = setTimeout(redirectToLogin, 2000);
      return () => clearTimeout(t);
    }
  }, [noSession]);

  if (skipVerify) {
    if (loading) {
    return <LoadingScreen message={loadingMessage} delay={300} />;
    }
    return (
      <Layout>
        <AppRoutes />
      </Layout>
    );
  }

  if (noSession) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h5" gutterBottom>No hay sesión activa</Typography>
          <Typography color="text.secondary">Redirigiendo al inicio de sesión...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthGate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
