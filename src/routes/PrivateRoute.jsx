import React from 'react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    const loginUrl = import.meta.env.VITE_LOGIN_URL || `${import.meta.env.VITE_API_URL}login`;
    window.location.href = loginUrl;
    return null;
  }
  return children;
};

export default PrivateRoute;