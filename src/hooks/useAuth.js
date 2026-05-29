import useAuthStore from '../stores/authStore';

export const useAuth = () => {
  const { token, user, login, logout } = useAuthStore();
  return { token, user, login, logout, isAuthenticated: !!token };
};