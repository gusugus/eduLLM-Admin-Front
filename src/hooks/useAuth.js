import { useCallback } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { GATEWAY } from '../config';

export const useAuth = () => {
  const { user, setUser, logout } = useAuthStore();

  const verifyAuth = useCallback(async () => {
    const response = await axios.get(`${GATEWAY}/api/auth/verify`, { withCredentials: true });
    if (response.data?.authenticated) {
      setUser(response.data);
    } else {
      logout();
    }
    return response.data;
  }, [setUser, logout]);

  return { user, setUser, logout, verifyAuth, isAuthenticated: !!user };
};