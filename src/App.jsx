import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/common/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import LoginForm from './components/auth/LoginForm';
import { useAuth } from './hooks/useAuth';

function AuthGate() {
  const { verifyAuth, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando aplicación...');

  useEffect(() => {
    const init = async () => {
      setLoadingMessage('🔍 Verificando autenticación...');

      try {
        const data = await verifyAuth();

        if (data?.authenticated) {
          setLoadingMessage(`👋 Bienvenido, ${data.username}!`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          enqueueSnackbar('No hay sesión activa', { variant: 'warning' });
        }
      } catch (error) {
        console.log('Error de conexión al verificar auth:', error.message);
        enqueueSnackbar('No hay sesión activa', { variant: 'warning' });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [verifyAuth, enqueueSnackbar]);

  if (loading) {
    return <LoadingScreen message={loadingMessage} delay={300} />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
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
