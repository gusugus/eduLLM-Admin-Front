import { useCallback } from 'react';
import useAuthStore from '../stores/authStore';
import axios from 'axios';

export const useAuth = () => {
  const { token, user, setUser, login, logout } = useAuthStore();

  const verifyAuth = useCallback(async () => {
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';
    const response = await axios.get(`${GATEWAY_URL}/api/auth/verify`, {
      withCredentials: true
    });
    if (response.data?.authenticated) {
      setUser(response.data);
    }
    return response.data;
  }, [setUser]);

  return { token, user, setUser, login, logout, verifyAuth, isAuthenticated: !!user };
};