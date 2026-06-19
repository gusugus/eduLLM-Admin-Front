// src/utils/auth.js
export const getLoginUrl = () => {
  return import.meta.env.VITE_LOGIN_URL || `${import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085'}/login`;
};

export const redirectToLogin = () => {
  window.location.href = getLoginUrl();
};