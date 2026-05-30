import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
        username,
        password
      }, { withCredentials: true });

      enqueueSnackbar(`✅ Bienvenido ${response.data.username}!`, { variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Credenciales inválidas';
      enqueueSnackbar(`❌ ${errorMsg}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8' }}>EduLLM - Acceso</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '16px'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
