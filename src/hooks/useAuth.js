import { useCallback } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

export const useAuth = () => {
  const { token, user, setUser, login, logout } = useAuthStore();

  const verifyAuth = useCallback(async () => {
    const response = await axios.get(`${GATEWAY}/api/auth/verify`, { withCredentials: true });
    if (response.data?.authenticated) {
      setUser(response.data);
    } else {
      logout();
    }
    return response.data;
  }, [setUser, logout]);

  return { token, user, setUser, login, logout, verifyAuth, isAuthenticated: !!user };
};