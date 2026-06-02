// src/utils/auth.js
export const decodeToken = (token) => {
  try {
    // El token JWT tiene 3 partes: header.payload.signature
    const payload = token.split('.')[1];
    // atob decodifica base64
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  // Asegúrate de que el campo 'rol' existe en tu token
  return decoded?.rol || decoded?.role || null;
};

export const getUserId = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.idUsuario || decoded?.userId || null;
};

export const getUserName = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.sub || decoded?.username || null;
};

export const isTokenValid = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getLoginUrl = () => {
  return import.meta.env.VITE_LOGIN_URL || `${import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085'}/login`;
};

export const redirectToLogin = () => {
  window.location.href = getLoginUrl();
};