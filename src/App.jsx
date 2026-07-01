import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import Layout from './components/common/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import ForbiddenPage from './pages/ForbiddenPage';
import { useAuth } from './hooks/useAuth';
import { redirectToLogin } from './utils/auth';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));

function AuthGate() {
  const { verifyAuth, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [noSession, setNoSession] = useState(false);
  const [forbidden, setForbidden] = useState(false);

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

      try {
        const data = await verifyAuth();

        if (data?.authenticated) {
          if (data.rol !== 'ROLE_ADMINISTRADOR') {
            setForbidden(true);
            navigate('/forbidden', { replace: true });
            return;
          }
          enqueueSnackbar(`Bienvenido, ${data.username}!`, { variant: 'success' });
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
  }, [verifyAuth, skipVerify, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (noSession) {
      const t = setTimeout(redirectToLogin, 2000);
      return () => clearTimeout(t);
    }
  }, [noSession]);

  if (forbidden) return null;
  if (loading) return <LoadingScreen />;
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
  if (!isAuthenticated) return null;

  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASENAME || ''}>
      <Routes>
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/*" element={<AuthGate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
