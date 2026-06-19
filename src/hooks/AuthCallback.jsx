// frontend/src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Obtener el token de la URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      enqueueSnackbar('✅ Login exitoso!', { variant: 'success' });
      
      // Redirigir al dashboard (la cookie de sesión ya la estableció el Gateway)
      navigate('/dashboard');
    } else {
      enqueueSnackbar('❌ Error en la autenticación', { variant: 'error' });
      navigate('/login');
    }
  }, [location, navigate, enqueueSnackbar]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Procesando autenticación...</div>
    </div>
  );
}

export default AuthCallback;