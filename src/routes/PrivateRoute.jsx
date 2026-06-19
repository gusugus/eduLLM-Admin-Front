import React from 'react';
import useAuthStore from '../stores/authStore';
import { getLoginUrl } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }
  return children;
};

export default PrivateRoute;