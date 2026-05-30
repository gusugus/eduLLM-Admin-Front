import axios from 'axios';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

const api = axios.create({
  baseURL: `${GATEWAY}/api/admin`,
  withCredentials: true
});

// Interceptor para manejar errores 401 (no autenticado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si la sesión expiró
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;